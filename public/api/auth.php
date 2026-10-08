<?php
/**
 * Tabeeb Pedia - Enterprise-Grade Admin Authentication & 2FA API
 * Multi-Factor Authentication (Email OTP & Google Authenticator RFC 6238 TOTP)
 * 30-Day Trusted Devices, Secret Admin URL & Self-Service Password Recovery
 */

date_default_timezone_set('Asia/Karachi');

// 1. Persistent Secret Key (Never regenerate per request)
if (!defined('AUTH_SECRET_KEY')) {
    define('AUTH_SECRET_KEY', 'tabeeb_pedia_secure_persistent_secret_key_2026_x87f63d9a1e4b8c2');
}

// 2. CORS & Response Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token, X-Device-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Optional Rate Limiter
if (file_exists(__DIR__ . '/rate_limiter.php')) {
    require_once __DIR__ . '/rate_limiter.php';
}

// 4. Database Connection & Auto-Migration
$pdo = null;
if (file_exists(__DIR__ . '/db.php')) {
    try {
        require_once __DIR__ . '/db.php';
        // $pdo is expected from db.php
        if (isset($pdo) && $pdo instanceof PDO) {
            // Auto-create required tables if not exist
            $pdo->exec("CREATE TABLE IF NOT EXISTS admin_2fa_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                temp_token VARCHAR(64) NOT NULL UNIQUE,
                code_hash VARCHAR(128) NOT NULL,
                type ENUM('email_otp', 'totp') NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (temp_token),
                INDEX (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            $pdo->exec("CREATE TABLE IF NOT EXISTS admin_trusted_devices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                device_token VARCHAR(64) NOT NULL UNIQUE,
                ip_address VARCHAR(45) NULL,
                user_agent VARCHAR(255) NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (device_token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            $pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(191) NOT NULL,
                code_hash VARCHAR(128) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (email),
                INDEX (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        }
    } catch (Exception $e) {
        // Fall back gracefully to file-based storage if database connection fails
        $pdo = null;
    }
}

// 5. Settings File Path & Helper Functions
$settingsFile = __DIR__ . '/../data/settings.json';
$tokensFallbackFile = __DIR__ . '/../data/admin_2fa_tokens.json';
$devicesFallbackFile = __DIR__ . '/../data/admin_trusted_devices.json';
$resetsFallbackFile = __DIR__ . '/../data/password_resets.json';

function get_tabeeb_settings() {
    global $settingsFile;
    $defaults = [
        'adminUsername' => 'sherazi313',
        'adminPassword' => '5903911a',
        'adminPasswordHash' => password_hash('5903911a', PASSWORD_BCRYPT),
        'adminSecretSlug' => 'tabeeb-7860',
        'twoFactorType' => 'disabled', // 'disabled' | 'email_otp' | 'totp'
        'totpSecret' => '',
        'adminEmails' => ['sherazi313@gmail.com', 'nukta313@gmail.com'],
        'adminRecoveryEmails' => 'sherazi313@gmail.com, nukta313@gmail.com'
    ];

    if (file_exists($settingsFile)) {
        $content = @file_get_contents($settingsFile);
        if ($content) {
            $parsed = json_decode($content, true);
            if (is_array($parsed)) {
                $defaults = array_merge($defaults, $parsed);
                // Ensure adminEmails is normalized
                if (!empty($defaults['adminRecoveryEmails']) && empty($defaults['adminEmails'])) {
                    $parts = preg_split('/[\s,;]+/', strval($defaults['adminRecoveryEmails']));
                    $defaults['adminEmails'] = array_values(array_filter($parts, function($e) {
                        return filter_var($e, FILTER_VALIDATE_EMAIL);
                    }));
                }
            }
        }
    }
    return $defaults;
}

function save_tabeeb_settings($newSettings) {
    global $settingsFile;
    $current = get_tabeeb_settings();
    $merged = array_merge($current, $newSettings);
    $dataDir = dirname($settingsFile);
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }
    @file_put_contents($settingsFile, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    return $merged;
}

// Deterministic & secure admin token signature
function generate_admin_token($username) {
    return hash('sha256', $username . ':tabeeb_secret_salt_2026:' . AUTH_SECRET_KEY);
}

// Fallback JSON-based table storage helpers (when MySQL is not reachable)
function load_fallback_json($filePath) {
    if (file_exists($filePath)) {
        $c = @file_get_contents($filePath);
        if ($c) {
            $decoded = json_decode($c, true);
            if (is_array($decoded)) return $decoded;
        }
    }
    return [];
}

function save_fallback_json($filePath, $data) {
    $dir = dirname($filePath);
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

// 6. Base32 Decoding & RFC 6238 TOTP Verification
function base32_decode_totp($b32) {
    $b32 = strtoupper(preg_replace('/[^A-Z2-7]/', '', $b32));
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $binary = '';
    $buffer = 0;
    $bufferSize = 0;
    for ($i = 0; $i < strlen($b32); $i++) {
        $val = strpos($alphabet, $b32[$i]);
        if ($val === false) continue;
        $buffer = ($buffer << 5) | $val;
        $bufferSize += 5;
        if ($bufferSize >= 8) {
            $bufferSize -= 8;
            $binary .= chr(($buffer >> $bufferSize) & 0xFF);
        }
    }
    return $binary;
}

function verify_totp_code($secret, $code, $discrepancy = 1) {
    $code = trim(strval($code));
    if (strlen($code) !== 6 || !ctype_digit($code)) return false;
    $key = base32_decode_totp($secret);
    if (empty($key)) return false;

    $currentTimeSlice = floor(time() / 30);
    for ($i = -$discrepancy; $i <= $discrepancy; $i++) {
        $slice = $currentTimeSlice + $i;
        $timeBytes = pack('N*', ($slice >> 32) & 0xFFFFFFFF, $slice & 0xFFFFFFFF);
        $hmac = hash_hmac('sha1', $timeBytes, $key, true);
        $offset = ord($hmac[19]) & 0x0f;
        $hashPart = substr($hmac, $offset, 4);
        $value = unpack('N', $hashPart)[1] & 0x7FFFFFFF;
        $calculatedCode = str_pad($value % 1000000, 6, '0', STR_PAD_LEFT);
        if (hash_equals($calculatedCode, $code)) {
            return true;
        }
    }
    return false;
}

function generate_base32_secret($length = 16) {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $secret = '';
    for ($i = 0; $i < $length; $i++) {
        $secret .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $secret;
}

// 7. Urdu HTML Email Sender
function send_auth_email($recipients, $subject, $heading, $bodyUrdu, $code = null, $expiresMin = 10) {
    if (!is_array($recipients)) {
        $recipients = preg_split('/[\s,;]+/', strval($recipients));
    }
    $cleanList = [];
    foreach ($recipients as $em) {
        $em = trim($em);
        if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
            $cleanList[] = $em;
        }
    }
    if (empty($cleanList)) return false;

    $currentTime = date('d M Y, h:i A');

    $codeHtml = '';
    if (!empty($code)) {
        $codeHtml = "
        <div style='background: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;'>
          <span style='font-size: 13px; color: #64748b; font-weight: bold; display: block; margin-bottom: 8px;'>سیکیورٹی تصدیقی کوڈ (Verification Code):</span>
          <span style='font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #1e3a8a; direction: ltr; display: inline-block;'>{$code}</span>
          <span style='display: block; font-size: 12px; color: #dc2626; margin-top: 10px; font-weight: bold;'>⚠️ یہ کوڈ {$expiresMin} منٹ کے لیے مؤثر ہے۔</span>
        </div>";
    }

    $html = "
    <!DOCTYPE html>
    <html dir='rtl' lang='ur'>
    <head>
    <meta charset='utf-8'>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 30px 20px; text-align: center; }
      .content { padding: 30px 25px; line-height: 1.8; text-align: right; }
      .footer { background: #f8fafc; color: #64748b; font-size: 12px; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0; }
    </style>
    </head>
    <body>
    <div class='container'>
      <div class='header'>
        <h2 style='margin:0; font-size: 24px; font-weight: bold;'>طبیب پیڈیا - سیکیورٹی پورٹل</h2>
        <p style='margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;'>TabeebPedia.com Security Notification</p>
      </div>
      <div class='content'>
        <h3 style='color: #1e3a8a; margin-top: 0; font-size: 18px;'>{$heading}</h3>
        <p style='font-size: 14px; color: #334155;'>{$bodyUrdu}</p>
        {$codeHtml}
        <div style='background: #f8fafc; border-radius: 12px; padding: 12px 16px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b; margin-top: 20px;'>
          🛡️ <strong>سیکیورٹی انتباہ:</strong> یہ کوڈ کبھی بھی کسی کے ساتھ شیئر نہ کریں۔ اگر آپ نے یہ درخواست نہیں کی تو فوری طور پر ایڈمن پاس ورڈ تبدیل کریں۔
        </div>
      </div>
      <div class='footer'>
        <p style='margin: 0;'>وقتِ ترسیل: {$currentTime} (پاکستان معیاری وقت)</p>
        <p style='margin: 4px 0 0 0;'>© تمام جملہ حقوق محفوظ ہیں - طبیب پیڈیا ایڈمن پروٹیکشن</p>
      </div>
    </div>
    </body>
    </html>";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Tabeeb Pedia Security <no-reply@tabeebpedia.com>\r\n";

    $success = true;
    foreach ($cleanList as $recipient) {
        if (!@mail($recipient, "=?UTF-8?B?" . base64_encode($subject) . "?=", $html, $headers)) {
            $success = false;
        }
    }
    return $success;
}

// 8. Auth Verification Helper for Protected Endpoints
function verify_admin_request() {
    $settings = get_tabeeb_settings();
    $validToken = generate_admin_token($settings['adminUsername']);
    
    // Check Authorization Header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        if (hash_equals($validToken, $matches[1])) return true;
    }

    // Check X-Admin-Token
    $xToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if ($xToken && hash_equals($validToken, $xToken)) return true;

    // Check legacy auth signature if present
    $legacySig = hash('sha256', ($settings['adminUsername'] ?? 'sherazi313') . ':' . ($settings['adminPassword'] ?? '5903911a') . ':tabeeb_secret_salt_2026');
    if ($xToken && hash_equals($legacySig, $xToken)) return true;
    if (isset($matches[1]) && hash_equals($legacySig, $matches[1])) return true;

    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'غیر مجاز رسائی (Unauthorized): ایڈمن سیکیورٹی ٹوکن درکار ہے۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 9. Input Extraction
$action = $_GET['action'] ?? '';
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];
if (empty($action) && !empty($inputData['action'])) {
    $action = $inputData['action'];
}

// ----------------------------------------------------
// ACTION: LOGIN
// ----------------------------------------------------
if ($action === 'login') {
    if (function_exists('checkRateLimit')) {
        checkRateLimit('admin_auth_login', 5, 600, 900);
    }

    $username = trim($inputData['username'] ?? '');
    $password = trim($inputData['password'] ?? '');
    $deviceToken = trim($_SERVER['HTTP_X_DEVICE_TOKEN'] ?? ($inputData['device_token'] ?? ($inputData['hp_2fa_device_token'] ?? '')));

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'یوزر نیم اور پاس ورڈ درج کرنا لازمی ہے۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $settings = get_tabeeb_settings();
    $validUser = strtolower($settings['adminUsername']);
    $enteredUser = strtolower($username);

    // Also match against admin emails
    $adminEmails = is_array($settings['adminEmails']) ? array_map('strtolower', $settings['adminEmails']) : [];
    $userMatched = ($enteredUser === $validUser) || in_array($enteredUser, $adminEmails);

    // Verify Password: check BCRYPT hash or fallback plain password
    $passMatched = false;
    if (!empty($settings['adminPasswordHash']) && password_verify($password, $settings['adminPasswordHash'])) {
        $passMatched = true;
    } elseif (!empty($settings['adminPassword']) && hash_equals($settings['adminPassword'], $password)) {
        $passMatched = true;
        // Upgrade to BCRYPT hash automatically
        $settings['adminPasswordHash'] = password_hash($password, PASSWORD_BCRYPT);
        save_tabeeb_settings(['adminPasswordHash' => $settings['adminPasswordHash']]);
    }

    if (!$userMatched || !$passMatched) {
        if (function_exists('recordFailedAttempt')) {
            recordFailedAttempt('admin_auth_login', 5, 600, 900);
        }
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'یوزر نیم یا پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Credentials are valid, reset rate limit
    if (function_exists('resetRateLimit')) {
        resetRateLimit('admin_auth_login');
    }

    // Check 30-Day Trusted Device Token
    $isDeviceTrusted = false;
    if (!empty($deviceToken)) {
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT id FROM admin_trusted_devices WHERE device_token = ? AND expires_at > NOW() LIMIT 1");
            $stmt->execute([$deviceToken]);
            if ($stmt->fetch()) {
                $isDeviceTrusted = true;
            }
        } else {
            $devices = load_fallback_json($devicesFallbackFile);
            $now = time();
            foreach ($devices as $d) {
                if ($d['device_token'] === $deviceToken && strtotime($d['expires_at']) > $now) {
                    $isDeviceTrusted = true;
                    break;
                }
            }
        }
    }

    $twoFactorType = $settings['twoFactorType'] ?? 'disabled';

    // If device is trusted OR 2FA is disabled -> Login immediately
    if ($isDeviceTrusted || $twoFactorType === 'disabled') {
        $adminToken = generate_admin_token($settings['adminUsername']);
        echo json_encode([
            'status' => 'success',
            'token' => $adminToken,
            'username' => $settings['adminUsername'],
            'twoFactorType' => $twoFactorType,
            'trusted_device' => $isDeviceTrusted,
            'message' => 'لاگ ان کامیاب!'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2FA is Required: Generate temp_token
    $tempToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes

    if ($twoFactorType === 'email_otp') {
        $otpCode = strval(random_int(100000, 999999));
        $codeHash = hash_hmac('sha256', $otpCode, AUTH_SECRET_KEY);

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO admin_2fa_tokens (temp_token, code_hash, type, expires_at) VALUES (?, ?, 'email_otp', ?)");
            $stmt->execute([$tempToken, $codeHash, $expiresAt]);
        } else {
            $tokens = load_fallback_json($tokensFallbackFile);
            $tokens[] = [
                'temp_token' => $tempToken,
                'code_hash' => $codeHash,
                'type' => 'email_otp',
                'expires_at' => $expiresAt
            ];
            save_fallback_json($tokensFallbackFile, $tokens);
        }

        // Send OTP email
        $recipients = $settings['adminEmails'] ?: ['sherazi313@gmail.com', 'nukta313@gmail.com'];
        send_auth_email(
            $recipients,
            "طبیب پیڈیا لاگ ان OTP تصدیقی کوڈ: {$otpCode}",
            "ایڈمن لاگ ان کی تصدیق",
            "آپ کے ایڈمن اکاؤنٹ میں لاگ ان کی درخواست کی گئی ہے۔ لاگ ان مکمل کرنے کے لیے درج ذیل 6 ہندسوں کا ون ٹائم پاسورڈ (OTP) درج کریں:",
            $otpCode,
            10
        );

        echo json_encode([
            'status' => '2fa_required',
            'requires_2fa' => true,
            'twoFactorType' => 'email_otp',
            'temp_token' => $tempToken,
            'message' => 'آپ کی رجسٹرڈ ایڈمن ای میل پر 6 ہندسوں کا تصدیقی کوڈ بھیج دیا گیا ہے۔'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($twoFactorType === 'totp') {
        $codeHash = hash_hmac('sha256', 'totp_mode', AUTH_SECRET_KEY);

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO admin_2fa_tokens (temp_token, code_hash, type, expires_at) VALUES (?, ?, 'totp', ?)");
            $stmt->execute([$tempToken, $codeHash, $expiresAt]);
        } else {
            $tokens = load_fallback_json($tokensFallbackFile);
            $tokens[] = [
                'temp_token' => $tempToken,
                'code_hash' => $codeHash,
                'type' => 'totp',
                'expires_at' => $expiresAt
            ];
            save_fallback_json($tokensFallbackFile, $tokens);
        }

        echo json_encode([
            'status' => '2fa_required',
            'requires_2fa' => true,
            'twoFactorType' => 'totp',
            'temp_token' => $tempToken,
            'message' => 'براہ کرم گوگل اتھینٹیکیٹر ایپ سے 6 ہندسوں کا کوڈ درج کریں۔'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// ----------------------------------------------------
// ACTION: VERIFY 2FA
// ----------------------------------------------------
if ($action === 'verify_2fa') {
    $tempToken = trim($inputData['temp_token'] ?? '');
    $code = trim($inputData['code'] ?? '');
    $rememberDevice = !empty($inputData['remember_device']);

    if (empty($tempToken) || empty($code)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'تصدیقی ٹوکن اور 6 ہندسوں کا کوڈ درج کریں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $tokenRecord = null;
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM admin_2fa_tokens WHERE temp_token = ? AND expires_at > NOW() LIMIT 1");
        $stmt->execute([$tempToken]);
        $tokenRecord = $stmt->fetch();
    } else {
        $tokens = load_fallback_json($tokensFallbackFile);
        $now = time();
        foreach ($tokens as $t) {
            if ($t['temp_token'] === $tempToken && strtotime($t['expires_at']) > $now) {
                $tokenRecord = $t;
                break;
            }
        }
    }

    if (!$tokenRecord) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'تصدیقی ٹوکن ختم ہو چکا ہے، دوبارہ لاگ ان کریں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $settings = get_tabeeb_settings();
    $isValid = false;

    if ($tokenRecord['type'] === 'email_otp') {
        $enteredHash = hash_hmac('sha256', $code, AUTH_SECRET_KEY);
        if (hash_equals($tokenRecord['code_hash'], $enteredHash)) {
            $isValid = true;
        }
    } elseif ($tokenRecord['type'] === 'totp') {
        $totpSecret = $settings['totpSecret'] ?? '';
        if (!empty($totpSecret) && verify_totp_code($totpSecret, $code, 1)) {
            $isValid = true;
        }
    }

    if (!$isValid) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'درج کردہ کوڈ غلط ہے یا اس کی میعاد ختم ہو چکی ہے۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Delete verified temp token
    if ($pdo) {
        $stmt = $pdo->prepare("DELETE FROM admin_2fa_tokens WHERE temp_token = ?");
        $stmt->execute([$tempToken]);
    } else {
        $tokens = load_fallback_json($tokensFallbackFile);
        $tokens = array_values(array_filter($tokens, function($t) use ($tempToken) {
            return $t['temp_token'] !== $tempToken;
        }));
        save_fallback_json($tokensFallbackFile, $tokens);
    }

    // Remember Device (30 Days)
    $newDeviceToken = null;
    if ($rememberDevice) {
        $newDeviceToken = bin2hex(random_bytes(32));
        $deviceExpires = date('Y-m-d H:i:s', time() + (30 * 86400));
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO admin_trusted_devices (device_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?)");
            $stmt->execute([$newDeviceToken, $ip, $ua, $deviceExpires]);
        } else {
            $devices = load_fallback_json($devicesFallbackFile);
            $devices[] = [
                'device_token' => $newDeviceToken,
                'ip_address' => $ip,
                'user_agent' => $ua,
                'expires_at' => $deviceExpires
            ];
            save_fallback_json($devicesFallbackFile, $devices);
        }
    }

    $adminToken = generate_admin_token($settings['adminUsername']);

    echo json_encode([
        'status' => 'success',
        'token' => $adminToken,
        'device_token' => $newDeviceToken,
        'username' => $settings['adminUsername'],
        'message' => '2FA تصدیق کامیاب! خوش آمدید۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: GET 2FA SETUP (TOTP QR & Secret)
// ----------------------------------------------------
if ($action === 'get_2fa_setup') {
    verify_admin_request();

    $settings = get_tabeeb_settings();
    $totpSecret = $settings['totpSecret'] ?? '';
    if (empty($totpSecret)) {
        $totpSecret = generate_base32_secret(16);
        save_tabeeb_settings(['totpSecret' => $totpSecret]);
    }

    $adminUser = $settings['adminUsername'] ?? 'admin';
    $otpAuthUrl = "otpauth://totp/TabeebPedia:" . urlencode($adminUser) . "?secret=" . $totpSecret . "&issuer=TabeebPedia&period=30&digits=6";
    $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" . urlencode($otpAuthUrl);

    echo json_encode([
        'status' => 'success',
        'totpSecret' => $totpSecret,
        'otpAuthUrl' => $otpAuthUrl,
        'qr_url' => $qrUrl,
        'adminUsername' => $settings['adminUsername'],
        'adminSecretSlug' => $settings['adminSecretSlug'] ?? 'tabeeb-7860',
        'twoFactorType' => $settings['twoFactorType'] ?? 'disabled',
        'adminEmails' => $settings['adminEmails'] ?? ['sherazi313@gmail.com', 'nukta313@gmail.com']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: CHANGE CREDENTIALS & SECURITY SETTINGS
// ----------------------------------------------------
if ($action === 'change_credentials') {
    verify_admin_request();

    $updates = [];
    if (!empty($inputData['username'])) {
        $updates['adminUsername'] = trim($inputData['username']);
    }
    if (!empty($inputData['newPassword'])) {
        $updates['adminPassword'] = trim($inputData['newPassword']);
        $updates['adminPasswordHash'] = password_hash(trim($inputData['newPassword']), PASSWORD_BCRYPT);
    }
    if (!empty($inputData['adminSecretSlug'])) {
        // Sanitize slug: alphanumeric + dashes only
        $cleanSlug = preg_replace('/[^a-zA-Z0-9_-]/', '', trim($inputData['adminSecretSlug']));
        if (!empty($cleanSlug)) {
            $updates['adminSecretSlug'] = $cleanSlug;
        }
    }
    if (isset($inputData['twoFactorType']) && in_array($inputData['twoFactorType'], ['disabled', 'email_otp', 'totp'])) {
        $updates['twoFactorType'] = $inputData['twoFactorType'];
    }
    if (!empty($inputData['totpSecret'])) {
        $cleanTotp = strtoupper(preg_replace('/[^A-Z2-7]/', '', trim($inputData['totpSecret'])));
        if (strlen($cleanTotp) >= 16) {
            $updates['totpSecret'] = $cleanTotp;
        }
    }
    if (!empty($inputData['adminEmails'])) {
        $raw = is_array($inputData['adminEmails']) ? $inputData['adminEmails'] : preg_split('/[\s,;]+/', strval($inputData['adminEmails']));
        $cleanList = [];
        foreach ($raw as $e) {
            $e = trim($e);
            if (filter_var($e, FILTER_VALIDATE_EMAIL)) $cleanList[] = $e;
        }
        if (!empty($cleanList)) {
            $updates['adminEmails'] = $cleanList;
            $updates['adminRecoveryEmails'] = implode(', ', $cleanList);
        }
    }

    $saved = save_tabeeb_settings($updates);

    echo json_encode([
        'status' => 'success',
        'message' => 'ایڈمن سیکیورٹی سیٹنگز کامیابی سے محفوظ ہو گئیں۔',
        'adminUsername' => $saved['adminUsername'],
        'adminSecretSlug' => $saved['adminSecretSlug'],
        'twoFactorType' => $saved['twoFactorType']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: REVOKE ALL TRUSTED DEVICES
// ----------------------------------------------------
if ($action === 'revoke_devices') {
    verify_admin_request();

    if ($pdo) {
        $pdo->exec("TRUNCATE TABLE admin_trusted_devices");
    } else {
        save_fallback_json($devicesFallbackFile, []);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'تمام ڈیوائسز کی تصدیق منسوخ کر دی گئی ہے۔ آئندہ لاگ ان پر 2FA لازمی ہوگا۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: FORGOT PASSWORD (EMAIL CODE)
// ----------------------------------------------------
if ($action === 'forgot_password') {
    if (function_exists('checkRateLimit')) {
        checkRateLimit('admin_auth_forgot', 3, 900, 1800);
    }

    $email = trim($inputData['email'] ?? '');
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'درست ای میل ایڈریس درج کریں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $settings = get_tabeeb_settings();
    $adminEmails = is_array($settings['adminEmails']) ? array_map('strtolower', $settings['adminEmails']) : [];

    // Verify email belongs to admin
    if (!in_array(strtolower($email), $adminEmails)) {
        if (function_exists('recordFailedAttempt')) {
            recordFailedAttempt('admin_auth_forgot', 3, 900, 1800);
        }
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'یہ ای میل ایڈریس ایڈمن ریکارڈ میں موجود نہیں ہے۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $resetCode = strval(random_int(100000, 999999));
    $codeHash = hash_hmac('sha256', $resetCode, AUTH_SECRET_KEY);
    $expiresAt = date('Y-m-d H:i:s', time() + 900); // 15 mins

    if ($pdo) {
        $stmt = $pdo->prepare("INSERT INTO password_resets (email, code_hash, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $codeHash, $expiresAt]);
    } else {
        $resets = load_fallback_json($resetsFallbackFile);
        $resets[] = [
            'email' => $email,
            'code_hash' => $codeHash,
            'expires_at' => $expiresAt
        ];
        save_fallback_json($resetsFallbackFile, $resets);
    }

    send_auth_email(
        [$email],
        "طبیب پیڈیا ایڈمن پاس ورڈ ری سیٹ کوڈ: {$resetCode}",
        "پاس ورڈ ری سیٹ کی درخواست",
        "آپ کے ایڈمن اکاؤنٹ کے پاس ورڈ ری سیٹ کے لیے تصدیقی کوڈ درج ذیل ہے:",
        $resetCode,
        15
    );

    echo json_encode([
        'status' => 'success',
        'message' => '6 ہندسوں کا پاس ورڈ ری سیٹ کوڈ آپ کی ای میل پر بھیج دیا گیا ہے۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: RESET PASSWORD
// ----------------------------------------------------
if ($action === 'reset_password') {
    $email = trim($inputData['email'] ?? '');
    $code = trim($inputData['code'] ?? '');
    $newPassword = trim($inputData['new_password'] ?? '');

    if (empty($email) || empty($code) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'تمام فیلڈز پُر کرنا لازمی ہیں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'نیا پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $resetRecord = null;
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE email = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1");
        $stmt->execute([$email]);
        $resetRecord = $stmt->fetch();
    } else {
        $resets = load_fallback_json($resetsFallbackFile);
        $now = time();
        for ($i = count($resets) - 1; $i >= 0; $i--) {
            if ($resets[$i]['email'] === $email && strtotime($resets[$i]['expires_at']) > $now) {
                $resetRecord = $resets[$i];
                break;
            }
        }
    }

    if (!$resetRecord) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ری سیٹ کوڈ کی میعاد ختم ہو چکی ہے، دوبارہ درخواست کریں۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $enteredHash = hash_hmac('sha256', $code, AUTH_SECRET_KEY);
    if (!hash_equals($resetRecord['code_hash'], $enteredHash)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'درج کردہ ری سیٹ کوڈ غلط ہے۔'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Code is valid! Update admin password
    save_tabeeb_settings([
        'adminPassword' => $newPassword,
        'adminPasswordHash' => password_hash($newPassword, PASSWORD_BCRYPT)
    ]);

    // Clean up reset records for this email
    if ($pdo) {
        $stmt = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
        $stmt->execute([$email]);
    } else {
        $resets = load_fallback_json($resetsFallbackFile);
        $resets = array_values(array_filter($resets, function($r) use ($email) {
            return $r['email'] !== $email;
        }));
        save_fallback_json($resetsFallbackFile, $resets);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا۔ اب آپ نئے پاس ورڈ سے لاگ ان کر سکتے ہیں۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------
// ACTION: LOGOUT
// ----------------------------------------------------
if ($action === 'logout') {
    echo json_encode([
        'status' => 'success',
        'message' => 'کامیابی سے لاگ آؤٹ ہو گیا۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Default fallback
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'درخواست کی نوعیت (action) نامعلوم ہے۔'], JSON_UNESCAPED_UNICODE);
?>
