<?php
require_once 'db.php';
$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // In production, generate a JWT token here. For now, simple success flag.
        echo json_encode(["success" => true, "message" => "لاگ ان کامیاب", "token" => bin2hex(random_bytes(16))]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "پاسورڈ یا یوزر نیم غلط ہے"]);
    }
}
?>
