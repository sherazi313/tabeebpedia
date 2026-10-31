<?php
// admin/notification_engine.php - Core Notification Engine for Tabeeb Pedia

// Helper: Get SQLite PDO Connection
function get_notification_db() {
    $candidates = [
        __DIR__ . '/../data',
        __DIR__ . '/../../public/data',
        __DIR__ . '/../../data',
        dirname(__DIR__) . '/data'
    ];
    $targetDir = null;
    foreach ($candidates as $dir) {
        if (is_dir($dir)) {
            $targetDir = $dir;
            break;
        }
    }
    if (!$targetDir) {
        $targetDir = __DIR__ . '/../data';
        @mkdir($targetDir, 0755, true);
    }
    $dbPath = rtrim($targetDir, '/\\') . '/push_subscribers.sqlite';
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Ensure push_subscribers table exists
    $db->exec("CREATE TABLE IF NOT EXISTS push_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT DEFAULT NULL,
        auth TEXT DEFAULT NULL,
        user_agent TEXT DEFAULT NULL,
        ip_address TEXT DEFAULT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );");

    // Ensure settings table exists in SQLite
    $db->exec("CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    );");

    return $db;
}

/**
 * 1. get_notification_config()
 * Retrieves onesignal_app_id and onesignal_api_key from settings table / settings.json
 */
function get_notification_config() {
    $defaultAppId = '20fdd339-ff26-47c5-85c4-67c57aaf7089';
    $defaultApiKey = base64_decode('b3NfdjJfYXBwX2VkNjVnb3A3ZXpkNGxib2VtN2N4dmwzcXJmbzVzMzJjd2R3ZWRzZTJ2cGk1eXlua2VvNGJwamFlNWFrZmQ0dGFzenVxM2xudmpneW90ZXBzd3FpZHkzaG9kN3VpaTdoamNtZjZkNGk=');

    $appId = '';
    $apiKey = '';

    // First try SQLite settings table
    try {
        $db = get_notification_db();
        $stmt = $db->query("SELECT key, value FROM settings WHERE key IN ('onesignal_app_id', 'onesignal_api_key')");
        while ($row = $stmt->fetch()) {
            if ($row['key'] === 'onesignal_app_id' && !empty($row['value'])) {
                $appId = trim($row['value']);
            }
            if ($row['key'] === 'onesignal_api_key' && !empty($row['value'])) {
                $apiKey = trim($row['value']);
            }
        }
    } catch (Exception $e) {
        // Fallback silently
    }

    // Second check settings.json if not found
    if (empty($appId) || empty($apiKey)) {
        $jsonCandidates = [
            __DIR__ . '/../data/settings.json',
            __DIR__ . '/../../public/data/settings.json',
            __DIR__ . '/../../data/settings.json',
            dirname(__DIR__) . '/data/settings.json'
        ];
        foreach ($jsonCandidates as $jf) {
            if (file_exists($jf)) {
                $json = json_decode(@file_get_contents($jf), true);
                if ($json && is_array($json)) {
                    if (empty($appId) && !empty($json['onesignal_app_id'])) {
                        $appId = trim($json['onesignal_app_id']);
                    }
                    if (empty($apiKey) && !empty($json['onesignal_api_key'])) {
                        $apiKey = trim($json['onesignal_api_key']);
                    }
                }
                break;
            }
        }
    }

    // Default fallbacks provided by user
    if (empty($appId)) {
        $appId = $defaultAppId;
    }
    if (empty($apiKey)) {
        $apiKey = $defaultApiKey;
    }

    return [
        'onesignal_app_id' => $appId,
        'onesignal_api_key' => $apiKey
    ];
}

/**
 * Helper: Save notification configuration to settings
 */
function save_notification_config($appId, $apiKey) {
    $appId = trim($appId);
    $apiKey = trim($apiKey);

    // Save to SQLite settings table
    try {
        $db = get_notification_db();
        $stmt = $db->prepare("INSERT INTO settings (key, value) VALUES (:k, :v) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
        $stmt->execute([':k' => 'onesignal_app_id', ':v' => $appId]);
        $stmt->execute([':k' => 'onesignal_api_key', ':v' => $apiKey]);
    } catch (Exception $e) {}

    // Save to settings.json
    $jsonCandidates = [
        __DIR__ . '/../data/settings.json',
        __DIR__ . '/../../public/data/settings.json',
        dirname(__DIR__) . '/data/settings.json'
    ];
    foreach ($jsonCandidates as $jf) {
        if (file_exists($jf)) {
            $json = json_decode(@file_get_contents($jf), true) ?: [];
            $json['onesignal_app_id'] = $appId;
            $json['onesignal_api_key'] = $apiKey;
            @file_put_contents($jf, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }
    return true;
}

/**
 * 2. get_onesignal_live_stats()
 * Fetches active subscribers and total devices from OneSignal live API
 */
function get_onesignal_live_stats() {
    $config = get_notification_config();
    $appId = $config['onesignal_app_id'];
    $apiKey = $config['onesignal_api_key'];

    if (empty($appId) || empty($apiKey)) {
        return [
            'connected' => false,
            'active_subscribers' => 0,
            'total_devices' => 0,
            'message' => 'API Credentials not configured'
        ];
    }

    $url = "https://onesignal.com/api/v1/apps/" . urlencode($appId);

    $authHeader = (strpos($apiKey, 'os_v2_') === 0) ? "Key " . $apiKey : "Basic " . $apiKey;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json; charset=utf-8",
        "Authorization: " . $authHeader
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError || $httpCode >= 400 || !$response) {
        // Try fallback to 'Bearer ' or alternative auth format if v2 key returned 401
        if ($httpCode === 401 && strpos($authHeader, 'Key ') === 0) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Content-Type: application/json; charset=utf-8",
                "Authorization: Basic " . $apiKey
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
        }
    }

    $data = json_decode($response, true);

    if ($httpCode === 200 && is_array($data)) {
        $subscribers = $data['messageable_players'] ?? ($data['active_users'] ?? ($data['subscribers'] ?? 0));
        $totalDevices = $data['total_players'] ?? ($data['total_users'] ?? $subscribers);
        return [
            'connected' => true,
            'active_subscribers' => intval($subscribers),
            'total_devices' => intval($totalDevices),
            'app_name' => $data['name'] ?? 'Tabeeb Pedia',
            'raw' => $data
        ];
    }

    return [
        'connected' => false,
        'active_subscribers' => 0,
        'total_devices' => 0,
        'http_code' => $httpCode,
        'error' => $data['errors'][0] ?? ($curlError ?: 'Connection failed')
    ];
}

/**
 * 3. get_local_subscribers_count()
 * Fetches subscriber count from local push_subscribers SQLite table
 */
function get_local_subscribers_count() {
    try {
        $db = get_notification_db();
        $stmt = $db->query("SELECT COUNT(*) AS total FROM push_subscribers");
        $row = $stmt->fetch();
        return intval($row['total'] ?? 0);
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * 4. send_onesignal_notification($title, $message, $url, $image_url)
 * Sends notification with included_segments strictly 'Subscribed Users'
 */
function send_onesignal_notification($title, $message, $url = '', $image_url = '') {
    $config = get_notification_config();
    $appId = $config['onesignal_app_id'];
    $apiKey = $config['onesignal_api_key'];

    if (empty($appId) || empty($apiKey)) {
        return [
            'success' => false,
            'error' => 'OneSignal App ID یا REST API Key ترتیب نہیں دی گئی ہے۔'
        ];
    }

    $title = trim($title);
    $message = trim($message);
    if (empty($title) || empty($message)) {
        return [
            'success' => false,
            'error' => 'عنوان (Title) اور پیغام (Message) خالی نہیں ہو سکتے۔'
        ];
    }

    // Ensure full URL with domain
    $domain = 'https://tabeebpedia.com';
    $url = trim($url);
    if (empty($url)) {
        $url = $domain . '/';
    } elseif (!preg_match('#^https?://#i', $url)) {
        $url = $domain . '/' . ltrim($url, '/');
    }

    // Ensure full Image URL with domain if given
    $image_url = trim($image_url);
    if (!empty($image_url) && !preg_match('#^https?://#i', $image_url) && !preg_match('#^data:#i', $image_url)) {
        $image_url = $domain . '/' . ltrim($image_url, '/');
    }

    // Construct OneSignal payload (targets both Total Subscriptions and Subscribed Users)
    $fields = [
        'app_id' => $appId,
        'included_segments' => ['Total Subscriptions', 'Subscribed Users'],
        'headings' => [
            'en' => $title,
            'ur' => $title
        ],
        'contents' => [
            'en' => $message,
            'ur' => $message
        ],
        'url' => $url,
        'web_url' => $url,
    ];

    if (!empty($image_url)) {
        $fields['chrome_web_image'] = $image_url;
        $fields['big_picture'] = $image_url;
        $fields['chrome_web_icon'] = 'https://tabeebpedia.com/logo1.png';
        $fields['firefox_icon'] = 'https://tabeebpedia.com/logo1.png';
    } else {
        $fields['chrome_web_icon'] = 'https://tabeebpedia.com/logo1.png';
        $fields['firefox_icon'] = 'https://tabeebpedia.com/logo1.png';
    }

    $authHeader = (strpos($apiKey, 'os_v2_') === 0) ? "Key " . $apiKey : "Basic " . $apiKey;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json; charset=utf-8",
        "Authorization: " . $authHeader
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return [
            'success' => false,
            'error' => 'cURL Error: ' . $curlError
        ];
    }

    $resData = json_decode($response, true);

    if ($httpCode === 200 && (!isset($resData['errors']) || empty($resData['errors']))) {
        return [
            'success' => true,
            'id' => $resData['id'] ?? null,
            'recipients' => $resData['recipients'] ?? 0,
            'response' => $resData
        ];
    } else {
        $errMsg = 'OneSignal Error';
        if (isset($resData['errors'])) {
            $rawErr = is_array($resData['errors']) ? implode(', ', $resData['errors']) : $resData['errors'];
            if (stripos($rawErr, 'All included players are not subscribed') !== false) {
                $errMsg = 'ابھی تک کسی صارف نے نوٹیفکیشن کی اجازت (Allow / Subscribe) نہیں دی۔ برائے مہربانی پہلے ویب سائٹ (tabeebpedia.com) کھول کر نیچے دائیں کونے والی گھنٹی (🔔) پر کلک کریں اور "Allow" دبائیں تاکہ آپ کا براؤزر رجسٹر ہو سکے۔';
            } else {
                $errMsg = $rawErr;
            }
        }
        return [
            'success' => false,
            'http_code' => $httpCode,
            'error' => $errMsg,
            'response' => $resData
        ];
    }
}
