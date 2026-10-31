<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Token");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../admin/notification_engine.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stats = get_onesignal_live_stats();
    $stats['local_subscribers'] = get_local_subscribers_count();
    $stats['success'] = true;
    echo json_encode($stats);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/../admin/notification_engine.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$title = $data['title'] ?? '';
$message = $data['message'] ?? '';
$url = $data['url'] ?? '';
$imageUrl = $data['image_url'] ?? ($data['featuredImage'] ?? '');

$res = send_onesignal_notification($title, $message, $url, $imageUrl);

if ($res['success']) {
    echo json_encode($res);
} else {
    http_response_code(400);
    echo json_encode($res);
}
