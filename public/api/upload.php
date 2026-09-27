<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

    $ext = 'jpg';
    if (preg_match('/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/', $base64Data, $matches)) {
        $ext = ($matches[1] === 'jpeg') ? 'jpg' : $matches[1];
        $binary = base64_decode($matches[2]);
    } else {
        $binary = base64_decode($base64Data);
    }

    $rawFilename = isset($data['filename']) ? pathinfo($data['filename'], PATHINFO_FILENAME) : 'img';
    $cleanName = substr(preg_replace('/[^a-zA-Z0-9_-]/', '_', $rawFilename), 0, 30);
    $fileName = time() . '_' . ($cleanName ?: 'img') . '.' . $ext;

    $uploadDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $targetFile = $uploadDir . '/' . $fileName;
    if (file_put_contents($targetFile, $binary) !== false) {
        echo json_encode([
            'status' => 'success',
            'url' => '/uploads/' . $fileName
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save file']);
    }
    exit;
}
?>
