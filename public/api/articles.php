<?php
require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

// GET all articles
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, title, slug, category_id as category, content, excerpt, featured_image as featuredImage, author, reading_time as readingTime, tags, status, seo_title as seoTitle, seo_description as seoDescription, views, created_at as createdAt FROM articles ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
}
// POST new article (Admin)
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO articles (title, slug, category_id, content, excerpt, featured_image, author, tags, status, seo_title, seo_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['category'] ?? 'tibb-unani',
            $data['content'] ?? '',
            $data['excerpt'] ?? '',
            $data['featuredImage'] ?? '',
            $data['author'] ?? 'طبیب پیڈیا',
            $data['tags'] ?? '',
            $data['status'] ?? 'private',
            $data['seoTitle'] ?? '',
            $data['seoDescription'] ?? ''
        ]);
        echo json_encode(["success" => true, "message" => "مضمون محفوظ ہو گیا"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save article", "details" => $e->getMessage()]);
    }
}
?>
