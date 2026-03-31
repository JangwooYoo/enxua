function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

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
    if (typeof VANTA !== 'undefined') {
        VANTA.NET({
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
                }
            });
        }

        // Pinning mechanism
        if (!isLastCard) {
            ScrollTrigger.create({
                trigger: card,
                start: "top top",
                end: () => `+=${window.innerHeight}`,
                pin: true,
                pinSpacing: false, // The next section will overlap this one
                id: `pin-${index}`
            });
        }
    });

    // Handle Anchor Links (Smooth scroll)
    const anchorLinks = document.querySelectorAll('.anchor-menu a');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // To support ScrollTrigger pin space calculations, 
                // we'll jump using vanilla scrollIntoView, but GSAP ScrollTo is better if we loaded the plugin.
                // Since we didn't load ScrollToPlugin, we use native behavior.
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: 'scrolled', targets: navbar }
    });
}
