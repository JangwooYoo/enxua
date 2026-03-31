function initTheme() {
    const themeButtons = document.querySelectorAll('[data-set-theme]');
    const root = document.documentElement;

    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = e.target.getAttribute('data-set-theme');
            root.setAttribute('data-theme', theme);
        });
    });
}
