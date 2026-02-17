/* ========================================
   RED LAC — INTERACTIVE EXPERIENCE
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CANVAS: MATHEMATICAL CURVES =====
    const canvas = document.getElementById('mathCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, time = 0, mouseX = 0.5, mouseY = 0.5;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Track mouse for parallax
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX / w;
            mouseY = e.clientY / h;
        });

        // Particle class
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.05;
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                const o = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 36, 60, ${o})`;
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 80 }, () => new Particle());

        function drawCurve(fn, offsetX, offsetY, color, alpha, lineW) {
            ctx.beginPath();
            ctx.strokeStyle = color.replace('ALPHA', alpha);
            ctx.lineWidth = lineW;
            for (let i = 0; i <= w; i += 2) {
                const x = i;
                const y = fn(i, time, offsetX, offsetY);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Mathematical curve functions
        const sinCurve = (x, t, ox, oy) =>
            oy + Math.sin((x + ox) * 0.003 + t * 0.4) * 80 * (0.7 + mouseY * 0.6) +
            Math.sin((x + ox) * 0.007 + t * 0.2) * 30;

        const cosCurve = (x, t, ox, oy) =>
            oy + Math.cos((x + ox) * 0.004 + t * 0.3) * 60 +
            Math.sin((x + ox) * 0.001 + t * 0.15) * 100 * mouseX;

        const tanCurve = (x, t, ox, oy) => {
            const val = Math.tan((x + ox) * 0.002 + t * 0.25);
            return oy + Math.max(-120, Math.min(120, val * 20));
        };

        function drawGrid() {
            ctx.strokeStyle = 'rgba(255,255,255,0.012)';
            ctx.lineWidth = 0.5;
            const spacing = 60;
            for (let x = 0; x < w; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }
        }

        function animate() {
            time += 0.016;
            ctx.clearRect(0, 0, w, h);

            // Grid
            drawGrid();

            // Curves
            drawCurve(sinCurve, 0, h * 0.3, 'rgba(232,36,60,ALPHA)', '0.06', 1.5);
            drawCurve(sinCurve, 200, h * 0.35, 'rgba(232,36,60,ALPHA)', '0.03', 1);
            drawCurve(cosCurve, 100, h * 0.6, 'rgba(123,140,255,ALPHA)', '0.05', 1.2);
            drawCurve(cosCurve, 400, h * 0.65, 'rgba(123,140,255,ALPHA)', '0.025', 0.8);
            drawCurve(tanCurve, 0, h * 0.5, 'rgba(52,211,153,ALPHA)', '0.035', 1);

            // Axis markers
            ctx.fillStyle = 'rgba(255,255,255,0.015)';
            const cx = w * (0.35 + mouseX * 0.3);
            const cy = h * (0.35 + mouseY * 0.3);
            ctx.fillRect(cx - 0.5, 0, 1, h);
            ctx.fillRect(0, cy - 0.5, w, 1);

            // Particles
            particles.forEach(p => { p.update(); p.draw(); });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== CURSOR ORB =====
    const orb = document.getElementById('cursorOrb');
    if (orb && window.innerWidth > 768) {
        let orbX = 0, orbY = 0, targetX = 0, targetY = 0;
        document.addEventListener('mousemove', e => {
            targetX = e.clientX;
            targetY = e.clientY;
        });
        function moveOrb() {
            orbX += (targetX - orbX) * 0.06;
            orbY += (targetY - orbY) * 0.06;
            orb.style.transform = `translate(${orbX - 250}px, ${orbY - 250}px)`;
            requestAnimationFrame(moveOrb);
        }
        moveOrb();
    }

    // ===== PARALLAX EQUATIONS =====
    const equations = document.querySelectorAll('.eq');
    if (equations.length) {
        document.addEventListener('mousemove', e => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 2;
            const my = (e.clientY / window.innerHeight - 0.5) * 2;
            equations.forEach(eq => {
                const speed = parseFloat(eq.dataset.speed) || 0.02;
                const x = mx * speed * 600;
                const y = my * speed * 400;
                eq.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ===== NAVIGATION =====
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll detection
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 50);
        lastScroll = y;
    });

    // Mobile menu
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            menu.classList.toggle('open');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                menu.classList.remove('open');
            });
        });
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const observerNav = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observerNav.observe(s));

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-anim]').forEach(el => revealObserver.observe(el));

    // ===== COUNTERS =====
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                let current = 0;
                const step = target / 40;
                const interval = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(interval); }
                    el.textContent = Math.round(current);
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

    // ===== COURSE FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.c-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            courseCards.forEach((card, i) => {
                const match = filter === 'all' || card.dataset.cat === filter;
                card.style.transition = `opacity 0.3s ${i * 0.03}s, transform 0.3s ${i * 0.03}s`;
                if (match) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    setTimeout(() => card.classList.add('hidden'), 350);
                }
            });
        });
    });

    // ===== COUNTDOWN =====
    const featuredEvent = document.getElementById('featuredEvent');
    if (featuredEvent) {
        const eventDate = new Date(featuredEvent.dataset.eventDate);
        const eventEnd = new Date(featuredEvent.dataset.eventEnd);
        const countDays = document.getElementById('countDays');
        const countHours = document.getElementById('countHours');
        const countMinutes = document.getElementById('countMinutes');
        const countSeconds = document.getElementById('countSeconds');
        const countdownStatus = document.getElementById('countdownStatus');

        function updateCountdown() {
            const now = new Date();
            let diff, statusText, statusClass;

            if (now < eventDate) {
                diff = eventDate - now;
                statusText = 'Faltan';
                statusClass = '';
            } else if (now >= eventDate && now <= eventEnd) {
                diff = eventEnd - now;
                statusText = '\u{1F389} \u00a1El evento est\u00e1 EN VIVO ahora!';
                statusClass = 'live';
            } else {
                diff = 0;
                statusText = 'Este evento ya finaliz\u00f3. \u00a1Pronto anunciaremos el siguiente!';
                statusClass = 'past';
            }

            if (diff > 0) {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                countDays.textContent = String(d).padStart(2, '0');
                countHours.textContent = String(h).padStart(2, '0');
                countMinutes.textContent = String(m).padStart(2, '0');
                countSeconds.textContent = String(s).padStart(2, '0');
            } else {
                countDays.textContent = '00';
                countHours.textContent = '00';
                countMinutes.textContent = '00';
                countSeconds.textContent = '00';
            }

            if (statusClass === '') {
                countdownStatus.textContent = statusText;
            } else {
                countdownStatus.innerHTML = statusText;
            }
            countdownStatus.className = 'cd-status ' + statusClass;
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
