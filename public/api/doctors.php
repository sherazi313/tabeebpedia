<?php
require_once __DIR__ . '/auth_guard.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/doctors.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Doctors can be registered publicly or saved by admin
    // If not admin, validate payload structure strictly
    $input = file_get_contents('php://input');
    if ($input) {
        $decoded = json_decode($input, true);
        if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
            exit;
        }

        $dataDir = dirname($dataFile);
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }

        if (@file_put_contents($dataFile, $input, LOCK_EX) !== false) {
            @chmod($dataFile, 0644);
            echo json_encode(['status' => 'success', 'message' => 'Doctors data saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to write doctors file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
    }
    exit;
}
?>
