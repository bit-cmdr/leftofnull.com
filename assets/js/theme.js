(function () {
    'use strict';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var button = document.getElementById('theme-toggle');
        if (button) {
            button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            /* localStorage unavailable; in-memory only */
        }
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function init() {
        var button = document.getElementById('theme-toggle');
        if (!button) return;
        button.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
        button.addEventListener('click', function () {
            applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
