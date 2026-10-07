<?php
require_once __DIR__ . '/auth_guard.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Enforce admin authentication for file uploads
verifyAdminApiRequest();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
        exit;
    }

    $data = json_decode($input, true);
    $base64Data = isset($data['image']) ? $data['image'] : (isset($data['data']) ? $data['data'] : null);

    if (!$base64Data) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No image data provided']);
        exit;
    }

    // 1. Parse MIME and binary
    $mimeExt = 'jpg';
    if (preg_match('/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/', $base64Data, $matches)) {
        $rawMime = strtolower($matches[1]);
        $mimeExt = ($rawMime === 'jpeg') ? 'jpg' : $rawMime;
        $binary = base64_decode($matches[2], true);
    } else {
        $binary = base64_decode($base64Data, true);
    }

    if ($binary === false || strlen($binary) === 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid base64 image data']);
        exit;
    }

    // 2. Size Limit: 5MB
    if (strlen($binary) > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'فائل کا سائز 5MB سے زیادہ نہیں ہونا چاہیے۔']);
        exit;
    }

    // 3. Strict Extension Allowlist
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    $finalExt = in_array($mimeExt, $allowedExts) ? $mimeExt : 'jpg';

    // 4. Binary Image Validation (MIME & Header Verification)
    $imageInfo = @getimagesizefromstring($binary);
    if ($imageInfo === false) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'سیکیورٹی الرٹ: فراہم کردہ فائل ایک غیر مستند یا خراب تصویر ہے۔']);
        exit;
    }

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($imageInfo['mime'], $allowedMimes)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'صرف تصویری فائلیں (JPG, PNG, WebP, GIF) اپلوڈ کی جا سکتی ہیں۔']);
        exit;
    }

    // 5. Cryptographically Secure Sanitized Filename
    $rawFilename = isset($data['filename']) ? pathinfo($data['filename'], PATHINFO_FILENAME) : 'img';
    $cleanName = substr(preg_replace('/[^a-zA-Z0-9_-]/', '_', $rawFilename), 0, 25);
    $randomHash = bin2hex(random_bytes(6));
    $fileName = time() . '_' . ($cleanName ?: 'img') . '_' . $randomHash . '.' . $finalExt;

    $uploadDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }

    $targetFile = $uploadDir . '/' . $fileName;
    if (@file_put_contents($targetFile, $binary, LOCK_EX) !== false) {
        @chmod($targetFile, 0644);
        echo json_encode([
            'status' => 'success',
            'url' => '/uploads/' . $fileName
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save image file']);
    }
    exit;
}
?>
