<?php
// Rate Limiter & Brute-Force Attack Shield for Tabeeb Pedia APIs

function getClientIpAddress() {
    $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            $ip = trim($ipList[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function checkRateLimit($action = 'login', $maxAttempts = 5, $decaySeconds = 600, $lockoutSeconds = 900) {
    $ip = getClientIpAddress();
    $cacheFile = __DIR__ . '/../data/.rate_limits.json';
    $now = time();

    $limits = [];
    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        if ($content) {
            $limits = json_decode($content, true) ?: [];
        }
    }

    $key = md5($ip . '_' . $action);

    // Clean expired entries
    foreach ($limits as $k => $entry) {
        if (isset($entry['blocked_until']) && $entry['blocked_until'] < $now && isset($entry['last_attempt']) && ($now - $entry['last_attempt'] > 3600)) {
            unset($limits[$k]);
        }
    }

    if (isset($limits[$key])) {
        $entry = $limits[$key];

        // Check if currently locked out
        if (isset($entry['blocked_until']) && $entry['blocked_until'] > $now) {
            $remaining = ceil(($entry['blocked_until'] - $now) / 60);
            http_response_code(429);
            header('Retry-After: ' . ($entry['blocked_until'] - $now));
            echo json_encode([
                'status' => 'error',
                'error' => 'سیکیورٹی الرٹ: بہت زیادہ غلط کوششوں کی وجہ سے آپ کی رسائی عارضی طور پر معطل ہے۔ براہِ کرم ' . $remaining . ' منٹ بعد دوبارہ کوشش کریں۔',
                'remainingMinutes' => $remaining
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Reset if decay period passed
        if (isset($entry['first_attempt']) && ($now - $entry['first_attempt'] > $decaySeconds)) {
            unset($limits[$key]);
        }
    }

    return true;
}

function recordFailedAttempt($action = 'login', $maxAttempts = 5, $decaySeconds = 600, $lockoutSeconds = 900) {
    $ip = getClientIpAddress();
    $cacheFile = __DIR__ . '/../data/.rate_limits.json';
    $now = time();

    $limits = [];
    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        if ($content) {
            $limits = json_decode($content, true) ?: [];
        }
    }

    $key = md5($ip . '_' . $action);

    if (!isset($limits[$key])) {
        $limits[$key] = [
            'ip' => $ip,
            'action' => $action,
            'attempts' => 1,
            'first_attempt' => $now,
            'last_attempt' => $now
        ];
    } else {
        $limits[$key]['attempts'] = intval($limits[$key]['attempts'] ?? 0) + 1;
        $limits[$key]['last_attempt'] = $now;

        if ($limits[$key]['attempts'] >= $maxAttempts) {
            $limits[$key]['blocked_until'] = $now + $lockoutSeconds;
        }
    }

    @file_put_contents($cacheFile, json_encode($limits, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function resetRateLimit($action = 'login') {
    $ip = getClientIpAddress();
    $cacheFile = __DIR__ . '/../data/.rate_limits.json';

    if (file_exists($cacheFile)) {
        $content = @file_get_contents($cacheFile);
        if ($content) {
            $limits = json_decode($content, true) ?: [];
            $key = md5($ip . '_' . $action);
            if (isset($limits[$key])) {
                unset($limits[$key]);
                @file_put_contents($cacheFile, json_encode($limits, JSON_UNESCAPED_UNICODE), LOCK_EX);
            }
        }
    }
}
?>
