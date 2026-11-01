<?php
// admin/sidebar.php - Authentic WordPress Style Navigation Sidebar
$currentPage = basename($_SERVER['PHP_SELF'] ?? '');
?>
<aside class="w-56 sm:w-60 bg-[#1d2327] text-[#f0f0f1] min-h-screen flex flex-col shrink-0 border-r border-[#2c3338] shadow-md font-sans select-none" dir="ltr">
    <!-- Top Brand & Site Link -->
    <div class="h-14 flex items-center justify-between px-4 bg-[#1d2327] border-b border-[#2c3338]">
        <a href="/" class="flex items-center gap-2.5 text-white hover:text-[#72aee6] transition-colors font-bold text-sm tracking-wide">
            <span class="w-7 h-7 rounded bg-[#2271b1] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                TP
            </span>
            <div class="flex flex-col text-left">
                <span class="font-bold text-[13px] leading-tight text-white">طبیب پیڈیا</span>
                <span class="text-[10px] text-[#a7aaad] leading-none">WordPress CMS</span>
            </div>
        </a>
    </div>

    <!-- WordPress Navigation Menu -->
    <nav class="flex-1 py-2 text-[13px] font-medium space-y-0.5">
        <a href="/?admin=true&tab=dashboard" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">📊</span>
            <span>Dashboard</span>
        </a>

        <a href="/?admin=true&tab=articles" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">📌</span>
            <span>Posts (مضامین)</span>
        </a>

        <a href="/?admin=true&tab=media" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">🖼️</span>
            <span>Media</span>
        </a>

        <a href="/?admin=true&tab=pages" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">📄</span>
            <span>Pages (صفحات)</span>
        </a>

        <a href="/?admin=true&tab=categories" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">📁</span>
            <span>Menus & Categories</span>
        </a>

        <a href="/?admin=true&tab=doctors" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">👨‍⚕️</span>
            <span>Doctors (اطباء)</span>
        </a>

        <a href="/?admin=true&tab=comments" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">💬</span>
            <span>Comments</span>
        </a>

        <a href="/admin/notifications.php" class="flex items-center justify-between px-3.5 py-2.5 transition-colors <?php echo ($currentPage === 'notifications.php') ? 'bg-[#2271b1] text-white font-semibold' : 'text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6]'; ?>">
            <div class="flex items-center gap-3">
                <span class="text-base <?php echo ($currentPage === 'notifications.php') ? 'text-white' : 'text-[#a7aaad]'; ?>">🔔</span>
                <span>Notifications</span>
            </div>
            <span class="px-1.5 py-0.2 rounded text-[10px] bg-emerald-600/80 text-white font-bold">Live</span>
        </a>

        <a href="/?admin=true&tab=settings" class="flex items-center gap-3 px-3.5 py-2.5 text-[#f0f0f1] hover:bg-[#135e96] hover:text-[#72aee6] transition-colors">
            <span class="text-base text-[#a7aaad]">⚙️</span>
            <span>Settings</span>
        </a>
    </nav>

    <!-- Bottom / Logout -->
    <div class="p-3 border-t border-[#2c3338] bg-[#161a1d] text-xs">
        <a href="/" class="flex items-center gap-2.5 px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#23282d] rounded transition-colors font-medium">
            <span>🌐</span>
            <span>ویب سائٹ دیکھیں</span>
        </a>
    </div>
</aside>
