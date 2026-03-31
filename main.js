// Main script depends on globally available init functions from other scripts.

document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Transparent Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1. Initialize Localization
    initI18n();
    
    // 2. Initialize Theme Switcher
    initTheme();
    
    // 3. Initialize Auth Mock
    initAuth();
    
    // 4. Initialize Chat Widget
    initChat();
    
    // 5. Initialize GSAP ScrollTrigger Animations
    initGSAP();
});
