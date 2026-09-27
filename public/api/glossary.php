<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../data/glossary.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if ($input) {
        $dir = dirname($dataFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $saved = file_put_contents($dataFile, $input);
        if ($saved !== false) {
            echo json_encode(['success' => true, 'message' => 'Glossary saved successfully', 'bytes' => $saved]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to save glossary']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No data provided']);
    }
    exit;
}

if (file_exists($dataFile)) {
    echo file_get_contents($dataFile);
} else {
    echo json_encode([]);
}
