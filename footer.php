<!-- Tabeeb Pedia - Hybrid Push Notification System Footer Integration -->
<!-- OneSignal v16 Web Push SDK -->
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>

<!-- Floating Bell Widget (Pure Inline Style: Bottom-Right, Fixed, z-index 999999) -->
<div id="tabeeb-push-bell" style="position: fixed; bottom: 24px; right: 24px; z-index: 999999; display: flex; align-items: center; justify-content: center;">
    <button id="tabeeb-bell-btn" type="button" aria-label="نوٹیفکیشن سبسکرائب کریں" title="طبیب پیڈیا نوٹیفکیشن سبسکرائب کریں" style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #059669, #0d9488); color: #ffffff; border: 3px solid #ffffff; box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.5), 0 8px 10px -6px rgba(5, 150, 105, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 26px; transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease; outline: none;">
        <span style="animation: tabeebBellWiggle 3s infinite ease-in-out; display: inline-block;">🔔</span>
    </button>
</div>

<style>
@keyframes tabeebBellWiggle {
    0%, 100% { transform: rotate(0deg); }
    10%, 30% { transform: rotate(-15deg); }
    20%, 40% { transform: rotate(15deg); }
    50% { transform: rotate(0deg); }
}
</style>

<script>
(function() {
    var ONESIGNAL_APP_ID = "20fdd339-ff26-47c5-85c4-67c57aaf7089";

    // 1. Check if visitor already clicked bell in previous visit
    var bellContainer = document.getElementById('tabeeb-push-bell');
    var bellBtn = document.getElementById('tabeeb-bell-btn');

    if (localStorage.getItem('tabeeb_bell_clicked') === 'true') {
        if (bellContainer) {
            bellContainer.style.display = 'none';
        }
    }

    // 2. Initialize OneSignal Deferred Queue
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            await OneSignal.init({
                appId: ONESIGNAL_APP_ID,
                allowLocalhostAsSecureOrigin: true,
                notifyButton: { enable: false }
            });
        } catch (e) {
            console.warn("OneSignal init:", e);
        }

        // Hybrid Sync Helper: Sends push subscription credentials to /api/subscribe_push.php
        async function syncPushToLocalDatabase() {
            try {
                var endpoint = null;
                var p256dh = null;
                var auth = null;

                // Native Service Worker Push Subscription
                if ('serviceWorker' in navigator) {
                    var reg = await navigator.serviceWorker.ready;
                    if (reg && reg.pushManager) {
                        var sub = await reg.pushManager.getSubscription();
                        if (sub) {
                            var jsonSub = JSON.parse(JSON.stringify(sub));
                            endpoint = sub.endpoint;
                            if (jsonSub && jsonSub.keys) {
                                p256dh = jsonSub.keys.p256dh;
                                auth = jsonSub.keys.auth;
                            }
                        }
                    }
                }

                // Fallback / OneSignal Push Subscription Token
                if (!endpoint && OneSignal.User && OneSignal.User.PushSubscription) {
                    endpoint = OneSignal.User.PushSubscription.token || OneSignal.User.PushSubscription.id;
                }

                if (endpoint) {
                    fetch('/api/subscribe_push.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            endpoint: endpoint,
                            p256dh: p256dh,
                            auth: auth
                        })
                    }).catch(function() {});
                }
            } catch (err) {
                // Ignore silent sync failure
            }
        }

        // Listen for OneSignal subscription events
        try {
            if (OneSignal.User && OneSignal.User.PushSubscription) {
                OneSignal.User.PushSubscription.addEventListener("change", function() {
                    syncPushToLocalDatabase();
                });
            }
        } catch(e) {}

        // Immediate sync if already subscribed
        syncPushToLocalDatabase();

        // 2-Second Timeout Re-Verification (per Requirement 5)
        setTimeout(function() {
            syncPushToLocalDatabase();
        }, 2000);

        // Auto Slidedown Popup: 1.5 seconds after page load (per Requirement 4)
        setTimeout(function() {
            try {
                if (OneSignal.Slidedown) {
                    OneSignal.Slidedown.promptPush();
                }
            } catch (err) {}
        }, 1500);

        // Floating Bell Click Handler (per Requirement 3)
        if (bellBtn) {
            bellBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.setItem('tabeeb_bell_clicked', 'true');

                // Animate out and hide
                bellBtn.style.transform = 'scale(0) rotate(90deg)';
                bellBtn.style.opacity = '0';
                setTimeout(function() {
                    if (bellContainer) bellContainer.style.display = 'none';
                }, 350);

                // Show OneSignal permission / prompt popup
                try {
                    if (OneSignal.Slidedown) {
                        OneSignal.Slidedown.promptPush();
                    } else if (OneSignal.Notifications) {
                        OneSignal.Notifications.requestPermission();
                    }
                } catch(e) {}
            });
        }
    });
})();
</script>
