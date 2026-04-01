function initGSAP() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initial Sutera Typography Animation
    const words = document.querySelectorAll('.word');
    const heroSub = document.querySelector('.sutera-subtitle');
    const scrollInd = document.querySelector('.scroll-indicator');

    const tl = gsap.timeline();
    
    if (words.length > 0) {
        tl.from(words, { 
            y: "110%", 
            duration: 1.2, 
            ease: "power4.out", 
            stagger: 0.15 
        }, 0.2);
    }
    if (heroSub) {
        tl.from(heroSub, { opacity: 0, y: 20, duration: 1, ease: "power2.out" }, 1.0);
    }
    if (scrollInd) {
        tl.from(scrollInd, { opacity: 0, duration: 1, ease: "power2.out" }, 1.3);
    }

    // Initialize Immersive WebGL Background
    let vantaEffect = null;
    if (typeof VANTA !== 'undefined') {
        vantaEffect = VANTA.NET({
            el: "#section-1",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xcfff04, // Cyber Lime matching Enxua aesthetic
            backgroundColor: 0x050510, // Deep sleek navy/black
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00
        });
    }

    const cards = gsap.utils.toArray('.pin-wrapper');

    cards.forEach((card, index) => {
        const isLastCard = index === cards.length - 1;

        // Content animate-in when scrolling down
        const content = card.querySelector('.card-content');
        if (content) {
            gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 60%",
                    end: "top 20%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        }

        // Pinning mechanism — invalidateOnRefresh ensures end value
        // is recalculated each time ScrollTrigger.refresh() is called
        if (!isLastCard) {
            ScrollTrigger.create({
                trigger: card,
                start: "top top",
                end: () => `+=${window.innerHeight}`,
                pin: true,
                pinSpacing: false,
                id: `pin-${index}`,
                invalidateOnRefresh: true,
            });
        }
    });

    // Handle Anchor Links (GSAP-compatible smooth scroll)
    const anchorLinks = document.querySelectorAll('.anchor-menu a, #btn-learn-more');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Use currentTarget to always get the <a>'s href
            const targetId = e.currentTarget.getAttribute('href');
            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Find the ScrollTrigger for this section or use offsetTop as fallback
                const st = ScrollTrigger.getAll().find(s => s.trigger === targetElement);
                const targetPos = st ? st.start : targetElement.offsetTop;

                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: targetPos,
                    ease: "power2.inOut",
                    overwrite: "auto"
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: 'scrolled', targets: navbar },
        invalidateOnRefresh: true,
    });

    // ─────────────────────────────────────────────────────────────
    // Resize handler: Recalculate all ScrollTrigger measurements
    // whenever the viewport dimensions change.
    // Without this, pinned sections retain stale pixel offsets
    // after the window is resized, causing clipped / broken layout.
    // ─────────────────────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Force GSAP to re-read every element's bounding rect
            ScrollTrigger.refresh(true);

            // Also resize the WebGL canvas so it fills the new viewport
            if (vantaEffect && vantaEffect.resize) {
                vantaEffect.resize();
            }
        }, 200); // 200 ms debounce — fast enough, avoids thrashing
    });
}
