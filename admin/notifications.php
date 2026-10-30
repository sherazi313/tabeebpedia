<?php
// admin/notifications.php - Admin Notifications Panel
require_once __DIR__ . '/notification_engine.php';

$alert = null;
$alertType = 'info';

// Handle Broadcast Notification Submit
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'broadcast_push') {
    $title = $_POST['title'] ?? '';
    $message = $_POST['message'] ?? '';
    $targetUrl = $_POST['url'] ?? '';
    $imageUrl = $_POST['image_url'] ?? '';

    $res = send_onesignal_notification($title, $message, $targetUrl, $imageUrl);
    if ($res['success']) {
        $recipients = $res['recipients'] ?? 0;
        $alert = "پش نوٹیفکیشن کامیابی کے ساتھ تمام سبسکرائبرز کو بھیج دیا گیا ہے! (موصول کنندگان: " . intval($recipients) . ")";
        $alertType = 'success';
    } else {
        $alert = "نوٹیفکیشن بھیجنے میں خرابی پیش آئی: " . ($res['error'] ?? 'نامعلوم غلطی');
        $alertType = 'error';
    }
}

// Handle Save Credentials
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    $appId = $_POST['onesignal_app_id'] ?? '';
    $apiKey = $_POST['onesignal_api_key'] ?? '';

    if (!empty($appId) && !empty($apiKey)) {
        save_notification_config($appId, $apiKey);
        $alert = "OneSignal API اسناد کامیابی کے ساتھ محفوظ ہو گئیں!";
        $alertType = 'success';
    } else {
        $alert = "برائے مہربانی App ID اور API Key دونوں درج کریں۔";
        $alertType = 'error';
    }
}

// Load Current Data
$config = get_notification_config();
$liveStats = get_onesignal_live_stats();
$localCount = get_local_subscribers_count();

// Fetch latest local subscribers
$localSubscribers = [];
try {
    $db = get_notification_db();
    $stmt = $db->query("SELECT * FROM push_subscribers ORDER BY id DESC LIMIT 50");
    $localSubscribers = $stmt->fetchAll();
} catch (Exception $e) {}
?>
<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>پش نوٹیفکیشن ڈیش بورڈ | طبیب پیڈیا ایڈمن</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Almarai', system-ui, sans-serif;
        }
        .urdu-text {
            font-family: 'Noto Nastaliq Urdu', 'Almarai', serif;
            line-height: 1.8;
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex">

    <!-- Admin Sidebar -->
    <?php include __DIR__ . '/sidebar.php'; ?>

    <!-- Main Content Area -->
    <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto space-y-8">
            
            <!-- Page Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">🔔</span>
                        <h1 class="text-2xl font-bold text-white tracking-tight urdu-text">ہائبرڈ پش نوٹیفکیشن کنٹرول روم</h1>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">Dual Delivery Web Push System (OneSignal کلاؤڈ + ہمارا اپنا لوکل SQLite ڈیٹا بیس)</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold <?php echo $liveStats['connected'] ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'; ?>">
                        <span class="w-2 h-2 rounded-full <?php echo $liveStats['connected'] ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'; ?>"></span>
                        <?php echo $liveStats['connected'] ? 'OneSignal API جڑا ہوا ہے' : 'API کا رابطہ غیر فعال ہے'; ?>
                    </span>
                </div>
            </div>

            <!-- Feedback Alert -->
            <?php if ($alert): ?>
                <div class="p-4 rounded-2xl text-xs font-bold flex items-center justify-between <?php echo ($alertType === 'success') ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'; ?>">
                    <div class="flex items-center gap-2.5">
                        <span class="text-base"><?php echo ($alertType === 'success') ? '✅' : '⚠️'; ?></span>
                        <span><?php echo htmlspecialchars($alert); ?></span>
                    </div>
                    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white text-base">✕</button>
                </div>
            <?php endif; ?>

            <!-- 4 Top Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Card 1: OneSignal Cloud Active Subscribers -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform"></div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-400 font-semibold">OneSignal کلاؤڈ سبسکرائبرز</span>
                        <span class="p-2 bg-blue-500/10 text-blue-400 rounded-xl text-lg">☁️</span>
                    </div>
                    <div class="mt-3">
                        <div class="text-3xl font-extrabold text-white">
                            <?php echo number_format($liveStats['active_subscribers'] ?? 0); ?>
                        </div>
                        <span class="text-[11px] text-emerald-400 font-medium">ایکٹو / میسج ایبل صارفین</span>
                    </div>
                </div>

                <!-- Card 2: Self-Hosted Local Database Count -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform"></div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-400 font-semibold">ہمارا لوکل ڈیٹا بیس (Self-Hosted)</span>
                        <span class="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-lg">🗄️</span>
                    </div>
                    <div class="mt-3">
                        <div class="text-3xl font-extrabold text-emerald-400">
                            <?php echo number_format($localCount); ?>
                        </div>
                        <span class="text-[11px] text-slate-400 font-medium">SQLite میں تصدیق شدہ ٹوکنز</span>
                    </div>
                </div>

                <!-- Card 3: Total Devices History -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-purple-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform"></div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-400 font-semibold">کل ڈیوائسز ہسٹری (Total Devices)</span>
                        <span class="p-2 bg-purple-500/10 text-purple-400 rounded-xl text-lg">📱</span>
                    </div>
                    <div class="mt-3">
                        <div class="text-3xl font-extrabold text-white">
                            <?php echo number_format($liveStats['total_devices'] ?? 0); ?>
                        </div>
                        <span class="text-[11px] text-purple-300 font-medium">تمام رجسٹرڈ ڈیوائسز</span>
                    </div>
                </div>

                <!-- Card 4: API Connection Status -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform"></div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-400 font-semibold">API کنکشن اسٹیٹس</span>
                        <span class="p-2 bg-amber-500/10 text-amber-400 rounded-xl text-lg">⚡</span>
                    </div>
                    <div class="mt-3">
                        <div class="text-xl font-bold <?php echo $liveStats['connected'] ? 'text-emerald-400' : 'text-amber-400'; ?>">
                            <?php echo $liveStats['connected'] ? 'Online & Ready' : 'Disconnected'; ?>
                        </div>
                        <span class="text-[11px] text-slate-400 font-medium">REST API v16 Authentication</span>
                    </div>
                </div>

            </div>

            <!-- Two Column Form Grid: Broadcast + Settings -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                <!-- Form 1: Direct Broadcast Notification Form (2 Columns) -->
                <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                    <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">📢</span>
                            <h2 class="text-base font-bold text-white urdu-text">تمام صارفین کو فوری پش نوٹیفکیشن بھیجیں (Broadcast)</h2>
                        </div>
                        <span class="text-[11px] text-slate-400">سیگمنٹ: <strong class="text-emerald-400 font-sans">Subscribed Users</strong></span>
                    </div>

                    <form method="POST" action="notifications.php" class="space-y-4 text-xs">
                        <input type="hidden" name="action" value="broadcast_push">

                        <div>
                            <label class="block text-slate-300 font-bold mb-1.5 urdu-text">عنوان (Notification Title) *</label>
                            <input 
                                type="text" 
                                name="title" 
                                required 
                                placeholder="مثلاً: طب یونانی کا نیا نسخہ شائع ہو گیا ہے" 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                            />
                        </div>

                        <div>
                            <label class="block text-slate-300 font-bold mb-1.5 urdu-text">پیغام کی تفصیل (Notification Message) *</label>
                            <textarea 
                                name="message" 
                                required 
                                rows="3" 
                                placeholder="پیغام کا متن یہاں لکھیں جو یوزر کی موبائل / کمپیوٹر اسکرین پر نظر آئے گا..." 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                            ></textarea>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-300 font-bold mb-1.5 urdu-text">ٹارگٹ لنک (Target URL)</label>
                                <input 
                                    type="text" 
                                    name="url" 
                                    placeholder="https://tabeebpedia.com/blog/... یا /doctors" 
                                    class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                                />
                                <span class="text-[10px] text-slate-400 mt-1 block">خالی چھوڑنے پر خودکار https://tabeebpedia.com/ لگے گا۔</span>
                            </div>

                            <div>
                                <label class="block text-slate-300 font-bold mb-1.5 urdu-text">بڑی تصویر کا لنک (Big Image URL - اختیاری)</label>
                                <input 
                                    type="text" 
                                    name="image_url" 
                                    placeholder="https://tabeebpedia.com/uploads/... یا تصویر کا مکمل لنک" 
                                    class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div class="pt-3 flex items-center justify-between">
                            <span class="text-[11px] text-slate-400">ترسیل فوری ہوگی اور تمام براؤزرز پر خودکار ڈسپلے ہوگی۔</span>
                            <button 
                                type="submit" 
                                class="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/30 transition-all cursor-pointer font-sans"
                            >
                                <span>🚀</span>
                                <span>ابھی نوٹیفکیشن بھیجیں (Send Broadcast)</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Form 2: OneSignal API Credentials Settings Box (1 Column) -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div class="border-b border-slate-800 pb-3 flex items-center gap-2">
                        <span class="text-xl">🔑</span>
                        <h2 class="text-base font-bold text-white urdu-text">OneSignal API اسناد (Credentials)</h2>
                    </div>

                    <form method="POST" action="notifications.php" class="space-y-4 text-xs">
                        <input type="hidden" name="action" value="save_settings">

                        <div>
                            <label class="block text-slate-300 font-bold mb-1">OneSignal App ID</label>
                            <input 
                                type="text" 
                                name="onesignal_app_id" 
                                required 
                                value="<?php echo htmlspecialchars($config['onesignal_app_id'] ?? ''); ?>" 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label class="block text-slate-300 font-bold mb-1">REST API Key (v2 Key)</label>
                            <textarea 
                                name="onesignal_api_key" 
                                required 
                                rows="3" 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500 transition-all"
                            ><?php echo htmlspecialchars($config['onesignal_api_key'] ?? ''); ?></textarea>
                            <span class="text-[10px] text-slate-400 mt-1 block">یہ کی (Key) خفیہ رکھی جاتی ہے اور محفوظ SQLite ڈیٹا بیس میں محفوظ ہوتی ہے۔</span>
                        </div>

                        <button 
                            type="submit" 
                            class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 font-sans"
                        >
                            <span>💾</span>
                            <span>سیٹنگز محفوظ کریں (Save API Keys)</span>
                        </button>
                    </form>

                    <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 leading-relaxed">
                        <div class="text-slate-300 font-bold">ℹ️ سروس ورکر کنفیگریشن:</div>
                        <div>روٹ فائلز <code class="text-emerald-400 font-mono">/OneSignalSDKWorker.js</code> اور <code class="text-emerald-400 font-mono">/OneSignalSDKUpdaterWorker.js</code> فعال ہیں۔</div>
                    </div>
                </div>

            </div>

            <!-- Bottom Panel: Self-Hosted Push Engine Subscriber List -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl">🛡️</span>
                        <div>
                            <h2 class="text-base font-bold text-white urdu-text">ہمارا ذاتی پش نوٹیفکیشن سسٹم (Self-Hosted Push Engine)</h2>
                            <p class="text-xs text-slate-400">لوکل ڈیٹا بیس ٹیبل <code class="text-emerald-400 font-mono">push_subscribers</code> میں محفوظ تمام لائیو ٹوکنز اور سبسکرائبرز</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/20">
                        کل محفوظ سبسکرائبرز: <?php echo count($localSubscribers); ?>
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="text-slate-400 border-b border-slate-800 text-[11px]">
                                <th class="py-2.5 px-3 font-bold">ID</th>
                                <th class="py-2.5 px-3 font-bold">براؤزر / ڈیوائس (User Agent)</th>
                                <th class="py-2.5 px-3 font-bold">IP ایڈریس</th>
                                <th class="py-2.5 px-3 font-bold">تاریخ رجسٹریشن</th>
                                <th class="py-2.5 px-3 font-bold text-center">اسٹیٹس</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 font-sans">
                            <?php if (empty($localSubscribers)): ?>
                                <tr>
                                    <td colspan="5" class="py-8 text-center text-slate-500">
                                        ابھی تک کوئی لوکل سبسکرائبر ریکارڈ نہیں ملا۔ ویب سائٹ پر نوٹیفکیشن کی گھنٹی پر کلک ہونے کے بعد یہاں لائیو نظر آئیں گے۔
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($localSubscribers as $sub): ?>
                                    <tr class="hover:bg-slate-800/40 transition-colors">
                                        <td class="py-3 px-3 text-slate-400 font-mono">#<?php echo htmlspecialchars($sub['id']); ?></td>
                                        <td class="py-3 px-3 text-slate-200 max-w-md truncate" title="<?php echo htmlspecialchars($sub['user_agent'] ?? ''); ?>">
                                            <?php 
                                            $ua = $sub['user_agent'] ?? '';
                                            $device = 'Desktop Browser';
                                            if (stripos($ua, 'Android') !== false) $device = '📱 Android Device';
                                            elseif (stripos($ua, 'iPhone') !== false || stripos($ua, 'iPad') !== false) $device = '🍏 iOS Device';
                                            elseif (stripos($ua, 'Windows') !== false) $device = '💻 Windows PC';
                                            elseif (stripos($ua, 'Mac') !== false) $device = '🍎 MacOS';
                                            echo $device . ' — <span class="text-slate-400 text-[10px]">' . htmlspecialchars(substr($ua, 0, 60)) . '...</span>';
                                            ?>
                                        </td>
                                        <td class="py-3 px-3 text-slate-400 font-mono text-[11px]"><?php echo htmlspecialchars($sub['ip_address'] ?? '—'); ?></td>
                                        <td class="py-3 px-3 text-slate-400 text-[11px]"><?php echo htmlspecialchars($sub['created_at'] ?? '—'); ?></td>
                                        <td class="py-3 px-3 text-center">
                                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </main>

</body>
</html>
