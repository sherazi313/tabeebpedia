<?php
require_once __DIR__ . '/rate_limiter.php';
require_once __DIR__ . '/auth_guard.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Check Rate Limiter (Max 5 failed attempts in 10 minutes)
    checkRateLimit('admin_login', 5, 600, 900);

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'یوزر نیم اور پاس ورڈ درج کرنا لازمی ہے۔']);
        exit;
    }

    // Read stored settings credentials
    $settingsFile = __DIR__ . '/../data/settings.json';
    $validUser = 'sherazi313';
    $validPass = '5903911a';

    if (file_exists($settingsFile)) {
        $content = @file_get_contents($settingsFile);
        if ($content) {
            $settings = json_decode($content, true);
            if (!empty($settings['adminUsername'])) $validUser = $settings['adminUsername'];
            if (!empty($settings['adminPassword'])) $validPass = $settings['adminPassword'];
        }
    }

    // Secure timing-safe string comparison
    $userMatches = hash_equals($validUser, $username);
    $passMatches = hash_equals($validPass, $password);

    if ($userMatches && $passMatches) {
        // Reset rate limiter upon successful login
        resetRateLimit('admin_login');

        // Generate admin secret auth token
        $authToken = getAdminSecretSignature();

        echo json_encode([
            'status' => 'success',
            'message' => 'ایڈمن لاگ ان کامیاب!',
            'token' => $authToken,
            'username' => $validUser,
            'authenticatedAt' => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        // Record failed attempt in rate limiter
        recordFailedAttempt('admin_login', 5, 600, 900);

        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'یوزر نیم یا پاسورڈ غلط ہے۔ دوبارہ کوشش کریں۔'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
?>
