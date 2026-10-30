<?php
// admin/article_form.php - Article / Post Editor with Push Notification on Publish
require_once __DIR__ . '/notification_engine.php';

$alert = null;
$alertType = 'info';

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_article') {
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $category = trim($_POST['category'] ?? 'tibb-unani');
    $content = trim($_POST['content'] ?? '');
    $excerpt = trim($_POST['excerpt'] ?? '');
    $featuredImage = trim($_POST['featured_image'] ?? 'https://tabeebpedia.com/og-banner.png');
    $status = trim($_POST['status'] ?? 'published'); // 'published' or 'private'
    $sendPush = isset($_POST['send_push']) && $_POST['send_push'] === '1';

    if (empty($title)) {
        $alert = "براہ کرم مضمون کا عنوان درج کریں۔";
        $alertType = 'error';
    } else {
        if (empty($slug)) {
            $slug = 'post-' . time();
        }
        if (empty($excerpt)) {
            $excerpt = mb_substr(strip_tags($content), 0, 140, 'UTF-8') . '...';
        }

        // Save article to data/articles.json
        $dataFile = __DIR__ . '/../data/articles.json';
        if (!file_exists($dataFile)) {
            $dataFile = __DIR__ . '/../../public/data/articles.json';
        }
        $articles = [];
        if (file_exists($dataFile)) {
            $articles = json_decode(@file_get_contents($dataFile), true) ?: [];
        }

        $newArticle = [
            'id' => time(),
            'title' => $title,
            'slug' => $slug,
            'category' => $category,
            'content' => $content,
            'excerpt' => $excerpt,
            'featuredImage' => $featuredImage,
            'status' => $status,
            'date' => date('Y-m-d'),
            'createdAt' => date('c'),
            'author' => 'طبیب پیڈیا ریسرچ ٹیم'
        ];

        array_unshift($articles, $newArticle);
        @file_put_contents($dataFile, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $pushMsg = "";
        // Auto trigger push notification on publish
        if ($sendPush && ($status === 'published' || $status === 'publish')) {
            $targetUrl = 'https://tabeebpedia.com/blog/' . $slug;
            $pushRes = send_onesignal_notification(
                "طبیب پیڈیا: " . $title,
                $excerpt ?: "طبیب پیڈیا پر نیا طبی مضمون شائع ہو گیا ہے، ابھی مطالعہ کریں۔",
                $targetUrl,
                $featuredImage
            );

            if ($pushRes['success']) {
                $pushMsg = " اور " . intval($pushRes['recipients'] ?? 0) . " سبسکرائبرز کو پش نوٹیفکیشن بھیج دیا گیا! 🔔";
            } else {
                $pushMsg = " (تاہم پش نوٹیفکیشن میں مسئلہ: " . ($pushRes['error'] ?? '') . ")";
            }
        }

        $alert = "مضمون کامیابی سے محفوظ ہو گیا" . $pushMsg;
        $alertType = 'success';
    }
}
?>
<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نیا مضمون شائع کریں | طبیب پیڈیا ایڈمن</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Almarai', system-ui, sans-serif; }
        .urdu-text { font-family: 'Noto Nastaliq Urdu', 'Almarai', serif; line-height: 1.8; }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex">

    <!-- Admin Sidebar -->
    <?php include __DIR__ . '/sidebar.php'; ?>

    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <div class="max-w-5xl mx-auto space-y-6">

            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <h1 class="text-2xl font-bold text-white urdu-text">نیا مضمون / نسخہ تحریر کریں</h1>
                    <p class="text-xs text-slate-400">نئی پوسٹ پبلش ہوتے ہی تمام سبسکرائبرز کو بیک وقت خودکار نوٹیفکیشن پہنچ جائے گا۔</p>
                </div>
                <a href="/admin/notifications.php" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2">
                    <span>🔔</span>
                    <span>نوٹیفکیشنز ڈیش بورڈ</span>
                </a>
            </div>

            <?php if ($alert): ?>
                <div class="p-4 rounded-2xl text-xs font-bold flex items-center justify-between <?php echo ($alertType === 'success') ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'; ?>">
                    <span><?php echo htmlspecialchars($alert); ?></span>
                    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">✕</button>
                </div>
            <?php endif; ?>

            <form method="POST" action="article_form.php" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <input type="hidden" name="action" value="save_article">

                <!-- Main Content (2 Columns) -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                        <div>
                            <label class="block text-slate-300 font-bold mb-1 text-xs urdu-text">مضمون کا عنوان *</label>
                            <input 
                                type="text" 
                                name="title" 
                                required 
                                placeholder="مثلاً: قانون مفرد اعضاء میں نبض شناسی کے بنیادی اصول" 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-sans"
                            />
                        </div>

                        <div>
                            <label class="block text-slate-300 font-bold mb-1 text-xs urdu-text">مختصر تعارف (Excerpt)</label>
                            <textarea 
                                name="excerpt" 
                                rows="2" 
                                placeholder="نوٹیفکیشن اور گوگل سرچ کے لیے مختصر خلاصہ..." 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500 font-sans"
                            ></textarea>
                        </div>

                        <div>
                            <label class="block text-slate-300 font-bold mb-1 text-xs urdu-text">مکمل متن (Article Content)</label>
                            <textarea 
                                name="content" 
                                rows="12" 
                                placeholder="یہاں مضمون کا تفصیلی متن لکھیں..." 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500 font-sans"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Publish Sidebar Box (1 Column) -->
                <div class="space-y-4">
                    
                    <!-- The Publish Box -->
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                            <h3 class="text-sm font-bold text-white urdu-text">پبلش و ترسیل (Publish)</h3>
                            <span class="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">لائیو پورٹل</span>
                        </div>

                        <div class="space-y-3 text-xs">
                            <div>
                                <label class="block text-slate-400 mb-1">پبلشنگ اسٹیٹس:</label>
                                <select name="status" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-emerald-500">
                                    <option value="published">🌐 پبلک (لائیو شائع کریں)</option>
                                    <option value="private">🔒 ڈرافٹ (محفوظ رکھیں)</option>
                                </select>
                            </div>

                            <!-- THE REQUIRED CHECKBOX (CHECKED BY DEFAULT) -->
                            <div class="pt-2 border-t border-slate-800">
                                <label class="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 cursor-pointer hover:bg-emerald-950/60 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        name="send_push" 
                                        value="1" 
                                        checked 
                                        class="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <span class="text-xs font-bold text-emerald-300 select-none urdu-text">
                                        🔔 تمام سبسکرائبرز کو پش نوٹیفکیشن بھیجیں
                                    </span>
                                </label>
                                <span class="text-[10px] text-slate-400 mt-1 block">پوسٹ شائع ہوتے ہی OneSignal اور لوکل پش انجن سے لائیو براڈکاسٹ ہو جائے گی۔</span>
                            </div>

                            <div>
                                <label class="block text-slate-400 mb-1">تھمب نیل تصویر کا لنک:</label>
                                <input 
                                    type="text" 
                                    name="featured_image" 
                                    value="https://tabeebpedia.com/og-banner.png" 
                                    class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-[11px] font-sans focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label class="block text-slate-400 mb-1">زمرہ (Category):</label>
                                <select name="category" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500">
                                    <option value="tibb-unani">طب یونانی (Tibb-e-Unani)</option>
                                    <option value="qanoon-mufrad-aza">قانون مفرد اعضاء</option>
                                    <option value="herbs-encyclopedia">جڑی بوٹیاں (Herbs)</option>
                                    <option value="prescriptions">مستند نسخہ جات</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                            >
                                <span>🚀</span>
                                <span>پبلش کریں اور نوٹیفکیشن بھیجیں</span>
                            </button>
                        </div>
                    </div>

                </div>
            </form>

        </div>
    </main>

</body>
</html>
