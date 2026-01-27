

// ═══════════════════════════════════════════════════════════════════════════
// التهيئة العامة - Global Initialization
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 شات مدى - تم تحميل الصفحة بنجاح', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
    
    // تهيئة جميع المكونات
    initLoadingBar();
    initParticles();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initAnimationsOnScroll();
    initCounters();
    initTypingEffect();
    initParallax();
    initChatButton();
    initTooltips();
    initTextReveal();
    lazyLoadImages();
});

// ═══════════════════════════════════════════════════════════════════════════
// شريط التحميل - Loading Bar
// ═══════════════════════════════════════════════════════════════════════════

function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    if (!loadingBar) return;

    loadingBar.classList.add('active');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingBar.style.opacity = '0';
            setTimeout(() => {
                loadingBar.remove();
            }, 300);
        }, 500);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// نظام الجسيمات المتحركة - Particle System
// ═══════════════════════════════════════════════════════════════════════════

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // ضبط حجم الكانفاس
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // تتبع الماوس
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // فئة الجسيم
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                'rgba(0, 212, 255, ',
                'rgba(124, 58, 237, ',
                'rgba(244, 114, 182, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (0.3 + Math.random() * 0.3) + ')';
            ctx.fill();
        }

        update() {
            // حركة طبيعية
            this.x += this.speedX;
            this.y += this.speedY;

            // إعادة الموضع عند الخروج من الشاشة
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // تفاعل مع الماوس
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density * 0.5;
                    let directionY = forceDirectionY * force * this.density * 0.5;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    // إنشاء الجسيمات
    function createParticles() {
        particles = [];
        const numberOfParticles = Math.min((canvas.width * canvas.height) / 15000, 100);
        
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    // رسم الخطوط بين الجسيمات
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 - distance / 1200})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // حلقة الرسم
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    // إعادة إنشاء الجسيمات عند تغيير الحجم
    window.addEventListener('resize', () => {
        createParticles();
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// الهيدر المتفاعل - Interactive Header
// ═══════════════════════════════════════════════════════════════════════════

function initHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // إضافة/إزالة فئة scrolled
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // إخفاء/إظهار الهيدر عند التمرير
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// قائمة الهاتف - Mobile Menu
// ═══════════════════════════════════════════════════════════════════════════

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
    });

    // إغلاق القائمة عند النقر على رابط
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuBtn.innerHTML = '☰';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// التمرير السلس - Smooth Scroll
// ═══════════════════════════════════════════════════════════════════════════

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// الأسئلة الشائعة - FAQ Accordion
// ═══════════════════════════════════════════════════════════════════════════

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // إغلاق جميع الأسئلة
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // فتح السؤال المحدد إذا لم يكن مفتوحاً
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// الرسوم المتحركة عند التمرير - Scroll Animations
// ═══════════════════════════════════════════════════════════════════════════

function initAnimationsOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // إضافة الرسوم المتحركة للعناصر الأخرى
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.feature-card, .step-card, .guideline-card, .faq-item');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            card.classList.add('animate-on-scroll');
            observer.observe(card);
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// عداد الأرقام المتحرك - Animated Counters
// ═══════════════════════════════════════════════════════════════════════════

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString('ar-EG');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('ar-EG') + '+';
        }
    };

    updateCounter();
}

// ═══════════════════════════════════════════════════════════════════════════
// تأثير الكتابة - Typing Effect
// ═══════════════════════════════════════════════════════════════════════════

function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    if (!typingElements.length) return;

    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        let index = 0;

        element.innerHTML = '';

        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }

        // بدء الكتابة عند ظهور العنصر
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                type();
                observer.disconnect();
            }
        });

        observer.observe(element);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// تأثير البارالاكس - Parallax Effect
// ═══════════════════════════════════════════════════════════════════════════

function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // تأثير البارالاكس للكرات المتوهجة
    const glowOrbs = document.querySelectorAll('.glow-orb');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        glowOrbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// زر دخول الدردشة - Chat Button
// ═══════════════════════════════════════════════════════════════════════════

function initChatButton() {
    window.enterChat = function() {
        // إظهار تأثير التحميل
        showLoadingOverlay();

        // توليد رقم عشوائي بين 0 و 999
        const randomNumber = Math.floor(Math.random() * 1000);

        // رابط الدردشة مع الرقم العشوائي
        const chatURL = `https://madahost.online/?${randomNumber}`;

        // فتح الرابط بنفس الصفحة بعد التأثير البصري
        setTimeout(() => {
            window.location.href = chatURL;
            hideLoadingOverlay();
        }, 1000);
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// تأثير التحميل - Loading Overlay
// ═══════════════════════════════════════════════════════════════════════════

function showLoadingOverlay() {
    // إنشاء طبقة التحميل إذا لم تكن موجودة
    let overlay = document.querySelector('.loading-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>جاري فتح الدردشة...</p>
            </div>
        `;
        
        // إضافة الأنماط
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .loading-overlay.active {
                opacity: 1;
            }
            .loading-content {
                text-align: center;
            }
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(0, 212, 255, 0.2);
                border-top-color: #00d4ff;
                border-radius: 50%;
                margin: 0 auto 1rem;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .loading-content p {
                color: #fff;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }

    // تفعيل الطبقة
    setTimeout(() => overlay.classList.add('active'), 10);
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// التلميحات - Tooltips
// ═══════════════════════════════════════════════════════════════════════════

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    if (!tooltipElements.length) return;

    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // إضافة الأنماط إذا لم تكن موجودة
            if (!document.querySelector('#tooltip-styles')) {
                const style = document.createElement('style');
                style.id = 'tooltip-styles';
                style.textContent = `
                    .tooltip {
                        position: fixed;
                        background: rgba(0, 212, 255, 0.9);
                        color: #0a0a0f;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        font-size: 0.875rem;
                        font-weight: 600;
                        z-index: 10001;
                        pointer-events: none;
                        animation: tooltipFade 0.2s ease;
                    }
                    @keyframes tooltipFade {
                        from { opacity: 0; transform: translateY(5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(tooltip);

            // تحديد موضع التلميح
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// تأثير تموج الأزرار - Button Ripple Effect
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn');
    if (!button) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;

    // إضافة أنماط الريبل
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .btn { position: relative; overflow: hidden; }
            @keyframes rippleEffect {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// ═══════════════════════════════════════════════════════════════════════════
// تأثير تحريك الماوس - Mouse Move Effect
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .step-card, .guideline-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // تأثير الإضاءة المتبعة
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// إضافة أنماط تأثير الماوس
(function addMouseEffectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .feature-card::after,
        .step-card::after,
        .guideline-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                300px circle at var(--mouse-x) var(--mouse-y),
                rgba(0, 212, 255, 0.1),
                transparent 40%
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .feature-card:hover::after,
        .step-card:hover::after,
        .guideline-card:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
})();

// ═══════════════════════════════════════════════════════════════════════════
// تأثير الكتابة على لوحة المفاتيح - Keyboard Shortcuts
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter للدخول السريع للدردشة
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (typeof window.enterChat === 'function') {
            window.enterChat();
        }
    }

    // Escape لإغلاق القائمة
    if (e.key === 'Escape') {
        const nav = document.querySelector('nav.active');
        if (nav) {
            nav.classList.remove('active');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) menuBtn.innerHTML = '☰';
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// تأثير الظهور التدريجي للنص - Text Reveal Effect
// ═══════════════════════════════════════════════════════════════════════════

function initTextReveal() {
    const revealElements = document.querySelectorAll('.text-reveal');
    
    revealElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
                animation: revealChar 0.5s ease forwards;
                animation-delay: ${index * 0.03}s;
            `;
            element.appendChild(span);
        });
    });
}

// إضافة أنماط الكشف عن النص
(function addTextRevealStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes revealChar {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
})();

// ═══════════════════════════════════════════════════════════════════════════
// تحسين الأداء - Performance Optimization
// ═══════════════════════════════════════════════════════════════════════════

// تأجيل تحميل الصور
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// تقليل تحديثات الرسوم المتحركة عند عدم النشاط
let isPageVisible = true;

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
});

// ═══════════════════════════════════════════════════════════════════════════
// رسائل وحدة التحكم - Console Messages
// ═══════════════════════════════════════════════════════════════════════════

console.log(`
%c╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🚀 شات مدى - شات سوريا الأصلي                            ║
║                                                              ║
║     مرحباً بك في كود شات مدى!                                ║
║     تم تصميم هذا الموقع بعناية فائقة                         ║
║     لإظهار قوة وعظمة البرمجة الحديثة                        ║
║                                                              ║
║     التقنيات المستخدمة:                                      ║
║     • HTML5 Semantic                                         ║
║     • CSS3 Animations & Custom Properties                    ║
║     • Vanilla JavaScript ES6+                                ║
║     • Canvas API for Particles                               ║
║     • Intersection Observer API                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace;');

// ═══════════════════════════════════════════════════════════════════════════
// تصدير الدوال للاستخدام الخارجي
// ═══════════════════════════════════════════════════════════════════════════

window.MadaChat = {
    enterChat: () => window.enterChat(),
    showLoading: () => showLoadingOverlay(),
    hideLoading: () => hideLoadingOverlay(),
    version: '2.0.0',
    author: 'شات مدى'
};

