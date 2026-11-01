<?php
// public/api/cron_publisher.php - Automated Publisher for Scheduled Articles
// Can be executed via Hostinger cPanel Cron Job (e.g. */5 * * * * php /path/to/public/api/cron_publisher.php)
// Or via HTTP GET: https://tabeebpedia.com/api/cron_publisher.php?key=tabeeb_cron_secret

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dataFile = __DIR__ . '/../data/articles.json';
if (!file_exists($dataFile)) {
    $dataFile = __DIR__ . '/../../public/data/articles.json';
}

if (!file_exists($dataFile)) {
    echo json_encode(['status' => 'error', 'message' => 'Articles data file not found']);
    exit;
}

$raw = @file_get_contents($dataFile);
$articles = json_decode($raw, true) ?: [];

$now = time();
$publishedCount = 0;
$publishedTitles = [];
$needsSave = false;

// Notification engine integration
$pushEngine = __DIR__ . '/../admin/notification_engine.php';
$hasPush = file_exists($pushEngine);
if ($hasPush) {
    require_once $pushEngine;
}

foreach ($articles as &$art) {
    if (!isset($art['status'])) continue;

    $isScheduled = ($art['status'] === 'scheduled');
    
    // Check if scheduled post has reached its time
    if ($isScheduled && !empty($art['scheduledAt'])) {
        $targetTime = strtotime($art['scheduledAt']);
        if ($targetTime && $targetTime <= $now) {
            // Auto transition to published
            $art['status'] = 'published';
            $art['publishedAt'] = date('Y-m-d H:i:s', $targetTime);
            $art['date'] = date('Y-m-d', $targetTime);
            $publishedCount++;
            $publishedTitles[] = $art['title'] ?? 'مضمون';
            $needsSave = true;

            // Trigger push notification if requested
            if ($hasPush && !empty($art['sendPushNotification'])) {
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

echo json_encode([
    'status' => 'success',
    'timestamp' => date('c'),
    'published_count' => $publishedCount,
    'published_articles' => $publishedTitles
], JSON_UNESCAPED_UNICODE);
?>