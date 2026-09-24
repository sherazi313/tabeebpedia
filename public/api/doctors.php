<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET all doctors (or single doctor by id/slug)
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch());
    } else {
        $stmt = $pdo->query("SELECT * FROM doctors ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
    }
}
// POST new doctor (Register)
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Simple validation
    if(empty($data['whatsapp']) || empty($data['name'])) {
        http_response_code(400);
        echo json_encode(["error" => "Name and WhatsApp are required"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO doctors (name, title, clinic, city, whatsapp, email, password, fee, about, status, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)");
    
    try {
        $stmt->execute([
            $data['name'], 
            $data['title'] ?? '', 
            $data['clinic'] ?? '', 
            $data['city'] ?? '', 
            $data['whatsapp'], 
            $data['email'] ?? '', 
            $data['password'] ?? '',
            $data['fee'] ?? 'Free',
            $data['about'] ?? ''
        ]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId(), "message" => "Registration successful. Waiting for admin approval."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Registration failed. WhatsApp or Email might already exist.", "details" => $e->getMessage()]);
    }
}
?>
