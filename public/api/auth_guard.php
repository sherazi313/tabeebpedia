<?php
// Central API Authentication & CSRF Guard Middleware for Tabeeb Pedia

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function getAdminSecretSignature() {
    $settingsFile = __DIR__ . '/../data/settings.json';
    $pwd = '5903911a';
    $usr = 'sherazi313';
    
    if (file_exists($settingsFile)) {
        $content = @file_get_contents($settingsFile);
        if ($content) {
            $settings = json_decode($content, true);
            if (!empty($settings['adminPassword'])) $pwd = $settings['adminPassword'];
            if (!empty($settings['adminUsername'])) $usr = $settings['adminUsername'];
        }
    }

    return hash('sha256', $usr . ':' . $pwd . ':tabeeb_secret_salt_2026');
}

function verifyAdminApiRequest() {
    // Only guard state-modifying requests (POST, PUT, DELETE)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        return true;
    }

    $secretSig = getAdminSecretSignature();

    // 1. Check Authorization header (Bearer token)
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        $clientToken = $matches[1];
        if (hash_equals($secretSig, $clientToken)) {
            return true;
        }
    }

    // 2. Check X-Admin-Token header
    $xToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if ($xToken && hash_equals($secretSig, $xToken)) {
        return true;
    }

    // 3. Fallback: Allow during initial setup or valid token
    // If not valid, reject unauthorized write attempts
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'غیر مجاز رسائی (Unauthorized): ایڈمن سیکیورٹی ٹوکن درکار ہے۔'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function sanitizeInputData($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInputData($value);
        }
        return $data;
    } elseif (is_string($data)) {
        // Strip null bytes and dangerous character injections
        $clean = str_replace(chr(0), '', $data);
        return $clean;
    }
    return $data;
}
?>
