// ─── Theme Manager ───────────────────────────────────────────────────────────
// Default theme: 'dark' (Dark Space)
// Persists the user's choice in localStorage across sessions.
(function () {
    const DEFAULT_THEME = 'dark';
    const STORAGE_KEY = 'enxua-theme';
    const root = document.documentElement;

    /** Apply a theme and persist it */
    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
        updateActiveIndicator(theme);
    }

    /** Highlight the active menu item */
    function updateActiveIndicator(activeTheme) {
        document.querySelectorAll('[data-set-theme]').forEach(btn => {
            const isActive = btn.getAttribute('data-set-theme') === activeTheme;
            btn.classList.toggle('theme-active', isActive);
        });
    }

    /** Restore saved theme (or fall back to default) immediately */
    let savedTheme = DEFAULT_THEME;
    try { savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME; } catch (e) {}
    applyTheme(savedTheme);

    /** Wire up click handlers once DOM is ready */
    function initTheme() {
        document.querySelectorAll('[data-set-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                applyTheme(e.currentTarget.getAttribute('data-set-theme'));
            });
        });
        // Sync indicator in case DOM was not ready during first call
        updateActiveIndicator(savedTheme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

