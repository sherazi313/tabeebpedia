<?php
// db.php - Database Configuration for Hostinger

// Hostinger MySQL Credentials (Change these when uploading to Hostinger)
$db_host = 'localhost';
$db_user = 'root'; // Change to your Hostinger MySQL Username e.g. u1234567_admin
$db_pass = '';     // Change to your Hostinger MySQL Password
$db_name = 'tabeeb_pedia_db'; // Change to your Hostinger Database Name

header("Access-Control-Allow-Origin: *"); // For testing; change to your domain in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed", "message" => $e->getMessage()]);
    exit();
}
?>
