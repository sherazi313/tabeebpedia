<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

date_default_timezone_set('Asia/Karachi');
$dataFile = __DIR__ . '/../data/analytics.json';
$dataDir = dirname($dataFile);

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

function getInitialAnalyticsStructure() {
    return [
        'totalViews' => 0,
        'uniqueVisitors' => [], // map of visitorId => firstSeen
        'daily' => [], // 'YYYY-MM-DD' => ['views' => int, 'visitors' => [visitorId => 1]]
        'pages' => [], // 'path' => ['views' => int, 'title' => string]
        'devices' => ['mobile' => 0, 'desktop' => 0, 'tablet' => 0],
        'browsers' => [],
        'activeHeartbeats' => [], // [visitorId => timestamp]
        'recentVisits' => [] // array of last 30 visits
    ];
}

function loadAnalyticsData($dataFile) {
    if (file_exists($dataFile)) {
        $content = @file_get_contents($dataFile);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) {
                return array_merge(getInitialAnalyticsStructure(), $data);
            }
        }
    }
    return getInitialAnalyticsStructure();
}

function saveAnalyticsData($dataFile, $data) {
    $fp = fopen($dataFile, 'c+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            ftruncate($fp, 0);
            fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE));
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
        return true;
    }
    return false;
}

function computeSummary($data) {
    $today = date('Y-m-d');
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $currentMonth = date('Y-m');
    $currentYear = date('Y');
    $now = time();
    $activeCutoff = $now - 300; // 5 minutes

    // 1. Today stats
    $todayViews = isset($data['daily'][$today]) ? intval($data['daily'][$today]['views'] ?? 0) : 0;
    $todayVisitorsList = isset($data['daily'][$today]['visitors']) && is_array($data['daily'][$today]['visitors'])
        ? array_keys($data['daily'][$today]['visitors'])
        : [];
    $todayVisitors = count($todayVisitorsList);

    // 2. Yesterday stats
    $yesterdayViews = isset($data['daily'][$yesterday]) ? intval($data['daily'][$yesterday]['views'] ?? 0) : 0;
    $yesterdayVisitors = isset($data['daily'][$yesterday]['visitors']) && is_array($data['daily'][$yesterday]['visitors'])
        ? count($data['daily'][$yesterday]['visitors'])
        : 0;

    // 3. Weekly (Last 7 days)
    $weekViews = 0;
    $weekVisitorsMap = [];
    for ($i = 0; $i < 7; $i++) {
        $d = date('Y-m-d', strtotime("-$i days"));
        if (isset($data['daily'][$d])) {
            $weekViews += intval($data['daily'][$d]['views'] ?? 0);
            if (isset($data['daily'][$d]['visitors']) && is_array($data['daily'][$d]['visitors'])) {
                foreach (array_keys($data['daily'][$d]['visitors']) as $vid) {
                    $weekVisitorsMap[$vid] = true;
                }
            }
        }
    }
    $weekVisitors = count($weekVisitorsMap);

    // 4. Monthly (This Month)
    $monthViews = 0;
    $monthVisitorsMap = [];
    if (isset($data['daily']) && is_array($data['daily'])) {
        foreach ($data['daily'] as $d => $dData) {
            if (strpos($d, $currentMonth) === 0) {
                $monthViews += intval($dData['views'] ?? 0);
                if (isset($dData['visitors']) && is_array($dData['visitors'])) {
                    foreach (array_keys($dData['visitors']) as $vid) {
                        $monthVisitorsMap[$vid] = true;
                    }
                }
            }
        }
    }
    $monthVisitors = count($monthVisitorsMap);

    // 5. Yearly (This Year)
    $yearViews = 0;
    $yearVisitorsMap = [];
    if (isset($data['daily']) && is_array($data['daily'])) {
        foreach ($data['daily'] as $d => $dData) {
            if (strpos($d, $currentYear) === 0) {
                $yearViews += intval($dData['views'] ?? 0);
                if (isset($dData['visitors']) && is_array($dData['visitors'])) {
                    foreach (array_keys($dData['visitors']) as $vid) {
                        $yearVisitorsMap[$vid] = true;
                    }
                }
            }
        }
    }
    $yearVisitors = count($yearVisitorsMap);

    // 6. All time
    $allTimeViews = intval($data['totalViews'] ?? 0);
    $allTimeVisitors = isset($data['uniqueVisitors']) && is_array($data['uniqueVisitors'])
        ? count($data['uniqueVisitors'])
        : 0;

    // 7. Active Now (last 5 minutes heartbeat)
    $activeCount = 0;
    if (isset($data['activeHeartbeats']) && is_array($data['activeHeartbeats'])) {
        foreach ($data['activeHeartbeats'] as $vid => $t) {
            if ($t >= $activeCutoff) {
                $activeCount++;
            }
        }
    }

    // 8. Last 14 days chart data
    $chartDays = [];
    for ($i = 13; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i days"));
        $fDate = date('d M', strtotime($d));
        $views = isset($data['daily'][$d]) ? intval($data['daily'][$d]['views'] ?? 0) : 0;
        $vis = isset($data['daily'][$d]['visitors']) && is_array($data['daily'][$d]['visitors'])
            ? count($data['daily'][$d]['visitors'])
            : 0;
        $chartDays[] = [
            'date' => $d,
            'label' => $fDate,
            'views' => $views,
            'visitors' => $vis
        ];
    }

    // 9. Top 10 Pages
    $topPages = [];
    if (isset($data['pages']) && is_array($data['pages'])) {
        foreach ($data['pages'] as $path => $pData) {
            $topPages[] = [
                'path' => $path,
                'title' => $pData['title'] ?? $path,
                'views' => intval($pData['views'] ?? 0)
            ];
        }
        usort($topPages, function($a, $b) {
            return $b['views'] - $a['views'];
        });
        $topPages = array_slice($topPages, 0, 10);
    }

    // 10. Devices & Browsers
    $devices = $data['devices'] ?? ['mobile' => 0, 'desktop' => 0, 'tablet' => 0];
    $recentVisits = array_slice($data['recentVisits'] ?? [], 0, 15);

    return [
        'today' => ['views' => $todayViews, 'visitors' => $todayVisitors],
        'yesterday' => ['views' => $yesterdayViews, 'visitors' => $yesterdayVisitors],
        'thisWeek' => ['views' => $weekViews, 'visitors' => $weekVisitors],
        'thisMonth' => ['views' => $monthViews, 'visitors' => $monthVisitors],
        'thisYear' => ['views' => $yearViews, 'visitors' => $yearVisitors],
        'allTime' => ['views' => $allTimeViews, 'visitors' => $allTimeVisitors],
        'activeNow' => $activeCount,
        'chartDays' => $chartDays,
        'topPages' => $topPages,
        'devices' => $devices,
        'recentVisits' => $recentVisits,
        'lastUpdated' => date('Y-m-d H:i:s')
    ];
}

// GET Request: Return computed statistics
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = loadAnalyticsData($dataFile);
    $summary = computeSummary($data);
    echo json_encode($summary, JSON_UNESCAPED_UNICODE);
    exit;
}

// POST Request: Track visit or heartbeat
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!$payload) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
        exit;
    }

    $action = preg_replace('/[^a-zA-Z0-9_]/', '', $payload['action'] ?? 'track');
    $visitorId = preg_replace('/[^a-zA-Z0-9_\-]/', '', substr(trim($payload['visitorId'] ?? ''), 0, 64));
    if (!$visitorId) {
        $visitorId = 'anon_' . substr(md5($_SERVER['REMOTE_ADDR'] ?? microtime()), 0, 12);
    }

    $data = loadAnalyticsData($dataFile);
    $now = time();
    $today = date('Y-m-d');

    // Clean old heartbeats (> 1 hour)
    if (isset($data['activeHeartbeats']) && is_array($data['activeHeartbeats'])) {
        $cutoffHour = $now - 3600;
        foreach ($data['activeHeartbeats'] as $vid => $t) {
            if ($t < $cutoffHour) {
                unset($data['activeHeartbeats'][$vid]);
            }
        }
    }

    // Always update heartbeat
    $data['activeHeartbeats'][$visitorId] = $now;

    if ($action === 'track') {
        $path = substr(strip_tags(trim($payload['path'] ?? '/')), 0, 250);
        $title = substr(strip_tags(trim($payload['title'] ?? 'Tabeeb Pedia')), 0, 250);
        $device = in_array($payload['device'] ?? '', ['mobile', 'desktop', 'tablet']) ? $payload['device'] : 'desktop';
        $browser = substr(strip_tags(trim($payload['browser'] ?? 'Browser')), 0, 100);


        // 1. Increment total views
        $data['totalViews'] = intval($data['totalViews'] ?? 0) + 1;

        // 2. Track unique visitor all-time
        if (!isset($data['uniqueVisitors'][$visitorId])) {
            $data['uniqueVisitors'][$visitorId] = $now;
        }

        // 3. Track daily views and unique visitors
        if (!isset($data['daily'][$today])) {
            $data['daily'][$today] = ['views' => 0, 'visitors' => []];
        }
        $data['daily'][$today]['views'] = intval($data['daily'][$today]['views'] ?? 0) + 1;
        $data['daily'][$today]['visitors'][$visitorId] = 1;

        // Keep last 60 days of daily records to prevent file from growing indefinitely
        if (count($data['daily']) > 60) {
            ksort($data['daily']);
            $data['daily'] = array_slice($data['daily'], -60, null, true);
        }

        // 4. Track page/article
        if (!isset($data['pages'][$path])) {
            $data['pages'][$path] = ['views' => 0, 'title' => $title];
        }
        $data['pages'][$path]['views'] = intval($data['pages'][$path]['views'] ?? 0) + 1;
        if (!empty($title) && $data['pages'][$path]['title'] !== $title) {
            $data['pages'][$path]['title'] = $title;
        }

        // 5. Track device
        if (!isset($data['devices'][$device])) {
            $data['devices'][$device] = 0;
        }
        $data['devices'][$device] = intval($data['devices'][$device] ?? 0) + 1;

        // 6. Prepend recent visit
        $visitEntry = [
            'visitorId' => substr($visitorId, 0, 8) . '...',
            'path' => $path,
            'title' => $title,
            'device' => $device,
            'browser' => $browser,
            'time' => date('h:i:s A'),
            'timestamp' => $now
        ];
        array_unshift($data['recentVisits'], $visitEntry);
        if (count($data['recentVisits']) > 30) {
            $data['recentVisits'] = array_slice($data['recentVisits'], 0, 30);
        }

        saveAnalyticsData($dataFile, $data);
        $summary = computeSummary($data);
        echo json_encode(['status' => 'success', 'summary' => $summary], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'heartbeat') {
        saveAnalyticsData($dataFile, $data);
        $activeCutoff = $now - 300;
        $activeCount = 0;
        foreach ($data['activeHeartbeats'] as $vid => $t) {
            if ($t >= $activeCutoff) $activeCount++;
        }
        echo json_encode(['status' => 'success', 'activeNow' => $activeCount]);
        exit;
    }

    echo json_encode(['status' => 'ok']);
    exit;
}
?>
