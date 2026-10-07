<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

date_default_timezone_set('Asia/Karachi');
require_once __DIR__ . '/rate_limiter.php';

// Rate limit: max 3 requests in 15 minutes, 30 min lockout
checkRateLimit('forgot_password', 3, 900, 1800);

// Default recipient email addresses
$recipients = ['sherazi313@gmail.com', 'nukta313@gmail.com'];

// Read settings or default credentials
$settingsFile = __DIR__ . '/../data/settings.json';
$username = 'sherazi313';
$password = '5903911a';

if (file_exists($settingsFile)) {
    $content = @file_get_contents($settingsFile);
    if ($content) {
        $settings = json_decode($content, true);
        if (isset($settings['adminUsername']) && !empty($settings['adminUsername'])) {
            $username = $settings['adminUsername'];
        }
        if (isset($settings['adminPassword']) && !empty($settings['adminPassword'])) {
            $password = $settings['adminPassword'];
        }
        // Load custom recovery emails if configured in settings
        if (!empty($settings['adminRecoveryEmails'])) {
            $rawEmails = is_array($settings['adminRecoveryEmails']) 
                ? $settings['adminRecoveryEmails'] 
                : preg_split('/[\s,;]+/', strval($settings['adminRecoveryEmails']));
            $cleanList = [];
            foreach ($rawEmails as $em) {
                $em = trim($em);
                if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
                    $cleanList[] = $em;
                }
            }
            if (count($cleanList) > 0) {
                $recipients = $cleanList;
            }
        }
    }
}

// Allow frontend to pass current configured credentials if synced
$input = json_decode(file_get_contents('php://input'), true);
if ($input && is_array($input)) {
    if (!empty($input['username'])) $username = $input['username'];
    if (!empty($input['password'])) $password = $input['password'];
    if (!empty($input['recoveryEmails'])) {
        $rawEmails = is_array($input['recoveryEmails']) 
            ? $input['recoveryEmails'] 
            : preg_split('/[\s,;]+/', strval($input['recoveryEmails']));
        $cleanList = [];
        foreach ($rawEmails as $em) {
            $em = trim($em);
            if (filter_var($em, FILTER_VALIDATE_EMAIL)) {
                $cleanList[] = $em;
            }
        }
        if (count($cleanList) > 0) {
            $recipients = $cleanList;
        }
    }
}

$subject = "طبیب پیڈیا ایڈمن لاگ ان معلومات - Admin Credentials Recovery";
$currentTime = date('d M Y, h:i A');

$htmlMessage = "
<!DOCTYPE html>
<html dir='rtl' lang='ur'>
<head>
<meta charset='utf-8'>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #1d4ed8, #4338ca); color: #ffffff; padding: 25px; text-align: center; }
  .content { padding: 30px 25px; line-height: 1.8; text-align: right; }
  .card { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 20px 0; }
  .val { font-family: monospace; font-size: 18px; font-weight: bold; color: #1d4ed8; direction: ltr; }
  .btn { display: inline-block; background: #1d4ed8; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 15px; }
  .footer { background: #f8fafc; color: #64748b; font-size: 12px; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class='container'>
  <div class='header'>
    <h2 style='margin:0; font-size:22px;'>طبیب پیڈیا - ایڈمن پینل لاگ ان ریکوری</h2>
    <p style='margin:5px 0 0 0; font-size:13px; opacity:0.9;'>TabeebPedia.com Admin Credentials</p>
  </div>
  <div class='content'>
    <p>محترم ایڈمنسٹریٹر صاحب،</p>
    <p>آپ کی درخواست پر ایڈمن پورٹل کی لاگ ان تفصیلات نیچے فراہم کی جا رہی ہیں:</p>
    
    <div class='card'>
      <div style='margin-bottom: 12px;'>
        <span style='font-weight:bold; color:#475569;'>یوزر نیم (Username):</span>
        <div class='val' style='margin-top:4px;'>{$username}</div>
      </div>
      <div>
        <span style='font-weight:bold; color:#475569;'>پاسورڈ (Password):</span>
        <div class='val' style='margin-top:4px; color:#dc2626;'>{$password}</div>
      </div>
    </div>

    <p style='margin: 15px 0 5px 0; font-size:13px; color:#64748b;'>
      درخواست کا وقت: {$currentTime}
    </p>

    <div style='text-align: center; margin-top: 25px;'>
      <a href='https://tabeebpedia.com/admin' class='btn'>ایڈمن پورٹل لاگ ان کریں</a>
    </div>
  </div>
  <div class='footer'>
    یہ ایک خودکار تصدیقی ای میل ہے جو طبیب پیڈیا ایڈمن کنٹرول سسٹم سے بھیجی گئی ہے۔
  </div>
</div>
</body>
</html>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Tabeeb Pedia <no-reply@tabeebpedia.com>\r\n";
$headers .= "Reply-To: no-reply@tabeebpedia.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sentCount = 0;
foreach ($recipients as $toEmail) {
    if (@mail($toEmail, $subject, $htmlMessage, $headers)) {
        $sentCount++;
    }
}

recordFailedAttempt('forgot_password', 3, 900, 1800);

echo json_encode([
    'status' => 'success',
    'recipientsCount' => count($recipients),
    'message' => 'ایڈمن لاگ ان کی تفصیلات کامیابی کے ساتھ رجسٹرڈ ریکوری ای میلز پر ارسال کر دی گئی ہیں۔',
    'timestamp' => $currentTime
], JSON_UNESCAPED_UNICODE);

exit;
?>
