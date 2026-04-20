(function () {
    function goBackWithFallback(fallbackUrl) {
        // If there is a session history entry, try going back.
        // If not (or if back does nothing), send the user to a safe page.
        var hasHistory = window.history.length > 1;

        if (!hasHistory) {
            window.location.href = fallbackUrl;
            return;
        }

        var navigatedAway = false;
        window.addEventListener(
            'beforeunload',
            function () {
                navigatedAway = true;
            },
            { once: true }
        );

        window.history.back();

        // If the page was opened directly in a new tab, some browsers may not navigate.
        // In that case, use the fallback.
        window.setTimeout(function () {
            if (!navigatedAway) {
                window.location.href = fallbackUrl;
            }
        }, 400);
    }

    function setupBackButton(buttonEl) {
        if (!buttonEl) return;

        // You can override fallback per-page: data-fallback="student.html" etc.
        var fallbackUrl = buttonEl.getAttribute('data-fallback') || 'index.html';

        buttonEl.addEventListener('click', function () {
            goBackWithFallback(fallbackUrl);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var buttons = document.querySelectorAll('[data-back-button]');
        for (var i = 0; i < buttons.length; i++) {
            setupBackButton(buttons[i]);
        }
    });
})();
