<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['endpoint'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing endpoint']);
    exit;
}

$endpoint = trim($data['endpoint']);
$p256dh = isset($data['p256dh']) ? trim($data['p256dh']) : (isset($data['keys']['p256dh']) ? trim($data['keys']['p256dh']) : null);
$auth = isset($data['auth']) ? trim($data['auth']) : (isset($data['keys']['auth']) ? trim($data['keys']['auth']) : null);
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 500) : null;
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? null);
if ($ipAddress && strpos($ipAddress, ',') !== false) {
    $ipAddress = trim(explode(',', $ipAddress)[0]);
}

// Locate / create data directory for SQLite database
function get_push_db_path() {
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
    return rtrim($targetDir, '/\\') . '/push_subscribers.sqlite';
}

try {
    $dbPath = get_push_db_path();
    $db = new PDO("sqlite:" . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Create table if not exists
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

    // Insert or update on conflict
    $stmt = $db->prepare("INSERT INTO push_subscribers (endpoint, p256dh, auth, user_agent, ip_address, created_at, updated_at)
        VALUES (:endpoint, :p256dh, :auth, :user_agent, :ip_address, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(endpoint) DO UPDATE SET
            p256dh = excluded.p256dh,
            auth = excluded.auth,
            user_agent = excluded.user_agent,
            ip_address = excluded.ip_address,
            updated_at = CURRENT_TIMESTAMP;");

    $stmt->execute([
        ':endpoint' => $endpoint,
        ':p256dh' => $p256dh,
        ':auth' => $auth,
        ':user_agent' => $userAgent,
        ':ip_address' => $ipAddress
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database operation failed',
        'details' => $e->getMessage()
    ]);
}
