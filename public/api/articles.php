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

$dataFile = __DIR__ . '/../data/articles.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $articles = [];
    if (file_exists($dataFile)) {
        $raw = @file_get_contents($dataFile);
        $articles = json_decode($raw, true) ?: [];
    }

    $now = time();
    $needsSave = false;
    $pushEngine = __DIR__ . '/../admin/notification_engine.php';
    $hasPush = file_exists($pushEngine);

    // Virtual Cron: Check any scheduled post whose time has arrived
    foreach ($articles as &$art) {
        if (!isset($art['status'])) continue;
        if ($art['status'] === 'scheduled' && !empty($art['scheduledAt'])) {
            $targetTime = strtotime($art['scheduledAt']);
            if ($targetTime && $targetTime <= $now) {
                $art['status'] = 'published';
                $art['publishedAt'] = date('Y-m-d H:i:s', $targetTime);
                $art['date'] = date('Y-m-d', $targetTime);
                $needsSave = true;

                if ($hasPush && !empty($art['sendPushNotification'])) {
                    require_once $pushEngine;
                    $targetUrl = 'https://tabeebpedia.com/blog/' . ($art['slug'] ?? '');
                    @send_onesignal_notification(
                        "طبیب پیڈیا: " . ($art['title'] ?? ''),
                        $art['excerpt'] ?? "طبیب پیڈیا پر نیا طبی مضمون شائع ہو گیا ہے، ابھی مطالعہ کریں۔",
                        $targetUrl,
                        $art['featuredImage'] ?? ''
                    );
                }
            }
        }
    }
    unset($art);

    if ($needsSave) {
        @file_put_contents($dataFile, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    // Check if requester is logged in as Admin
    $isAdmin = checkIsAdminApiRequest();
    if ($isAdmin) {
        echo json_encode($articles, JSON_UNESCAPED_UNICODE);
    } else {
        // Filter out drafts, private, and future scheduled posts for public visitors
        $publicArticles = array_values(array_filter($articles, function($a) use ($now) {
            if (!is_array($a)) return false;
            $status = $a['status'] ?? 'published';
            if ($status === 'draft' || $status === 'private' || $status === 'trash') {
                return false;
            }
            if ($status === 'scheduled') {
                if (empty($a['scheduledAt'])) return false;
                $t = strtotime($a['scheduledAt']);
                return ($t && $t <= $now);
            }
            if ($status === 'published' || $status === 'publish') {
                if (!empty($a['scheduledAt'])) {
                    $t = strtotime($a['scheduledAt']);
                    if ($t && $t > $now) return false;
                }
                return true;
            }
            return false;
        }));
        echo json_encode($publicArticles, JSON_UNESCAPED_UNICODE);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyAdminApiRequest();

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

        // Automatic Historical Backup: create a safety backup before overwriting
        $backupDir = $dataDir . '/backups';
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
        }
        if (file_exists($dataFile) && filesize($dataFile) > 100) {
            @copy($dataFile, $dataFile . '.bak');
            @copy($dataFile, $backupDir . '/articles_' . date('Y-m-d') . '.json');
        }

        if (@file_put_contents($dataFile, $input, LOCK_EX) !== false) {
            @chmod($dataFile, 0644);

            // Auto Push Notification Trigger on Publish
            $pushEngine = __DIR__ . '/../admin/notification_engine.php';
            if (file_exists($pushEngine)) {
                require_once $pushEngine;
                if (is_array($decoded)) {
                    foreach ($decoded as $art) {
                        if (!empty($art['triggerPush']) && ($art['status'] ?? '') === 'published') {
                            $artTitle = $art['title'] ?? 'نیا طبی مضمون';
                            $artExcerpt = $art['excerpt'] ?? 'طبیب پیڈیا پر نیا مضمون شائع ہو گیا ہے، ابھی مطالعہ کریں۔';
                            $artUrl = 'https://tabeebpedia.com/blog/' . ($art['slug'] ?? '');
                            $artImage = $art['featuredImage'] ?? '';
                            @send_onesignal_notification("طبیب پیڈیا: " . $artTitle, $artExcerpt, $artUrl, $artImage);
                            break;
                        }
                    }
                }
            }

            echo json_encode(['status' => 'success', 'message' => 'Articles saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to write articles file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
    }
    exit;
}
?>
