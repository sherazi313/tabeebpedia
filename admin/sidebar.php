<?php
// admin/sidebar.php - Admin Navigation Sidebar
$currentPage = basename($_SERVER['PHP_SELF'] ?? '');
?>
<aside class="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col shrink-0 border-l border-slate-800 shadow-xl font-sans" dir="rtl">
    <!-- Brand -->
    <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <a href="/" class="flex items-center gap-3">
            <img src="/logo1.png" alt="طبیب پیڈیا" class="w-10 h-10 object-contain rounded-xl bg-white/10 p-1" />
            <div>
                <h1 class="text-base font-bold text-white tracking-wide">طبیب پیڈیا ایڈمن</h1>
                <span class="text-[10px] text-emerald-400 block">TabeebPedia Portal</span>
            </div>
        </a>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 p-4 space-y-1.5 text-xs font-medium">
        <div class="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">مرکزی کنٹرول</div>
        
        <a href="/admin/notifications.php" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all <?php echo ($currentPage === 'notifications.php') ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-900/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'; ?>">
            <div class="flex items-center gap-2.5">
                <span class="text-base">🔔</span>
                <span class="font-bold">Notifications (پش نوٹیفکیشنز)</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
        </a>

        <a href="/" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <span class="text-base">🌐</span>
            <span>ویب سائٹ دیکھیں (Live Site)</span>
        </a>

        <div class="pt-4 px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">انتظامی امور</div>

        <a href="/?admin=true&tab=notifications" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 transition-all font-bold">
            <span class="text-base">🔔</span>
            <span>ایڈمن پش پینل (React CMS)</span>
        </a>

        <a href="/?admin=true" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <span class="text-base">📝</span>
            <span>مضامین و صفحات (React CMS)</span>
        </a>

        <a href="/?admin=true&tab=doctors" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <span class="text-base">👨‍⚕️</span>
            <span>اطباء و کلینکس</span>
        </a>

        <a href="/?admin=true&tab=settings" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all">
            <span class="text-base">⚙️</span>
            <span>سسٹم ترتیبات (Settings)</span>
        </a>
    </nav>

    <!-- Footer / Version -->
    <div class="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>ہائبرڈ پش انجن</span>
        <span class="text-emerald-400 font-bold">v16.0 Pro</span>
    </div>
</aside>
