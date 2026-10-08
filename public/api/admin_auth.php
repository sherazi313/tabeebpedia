<?php
// Tabeeb Pedia - Backward Compatibility Wrapper for admin_auth.php
// Forwards requests to enterprise auth.php
if (file_exists(__DIR__ . '/auth.php')) {
    if (empty($_GET['action'])) {
        $_GET['action'] = 'login';
    }
    require_once __DIR__ . '/auth.php';
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Auth module not found']);
}
?>
