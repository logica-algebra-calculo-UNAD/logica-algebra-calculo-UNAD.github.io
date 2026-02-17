/* ========================================
   RED LAC — FLUID GEOMETRY INTERACTIONS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PARALLAX GLYPHS =====
    const glyphs = document.querySelectorAll('.glyphs span');
    if (glyphs.length && window.innerWidth > 768) {
        let mx = 0, my = 0, cx = 0, cy = 0;
        window.addEventListener('mousemove', e => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        function animateGlyphs() {
            cx += (mx - cx) * 0.04;
            cy += (my - cy) * 0.04;
            glyphs.forEach((g, i) => {
                const depth = 6 + i * 4;
                g.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
            });
            requestAnimationFrame(animateGlyphs);
        }
        animateGlyphs();
    }

    // ===== NAVIGATION =====
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const allNavLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        allNavLinks.forEach(l => l.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }));
    }

    // Active nav tracking
    const sects = document.querySelectorAll('section[id], header[id]');
    const navObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                const match = document.querySelector(`.nav-menu a[href="#${e.target.id}"]`);
                if (match) match.classList.add('active');
            }
        });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sects.forEach(s => navObs.observe(s));

    // ===== SCROLL REVEAL (STAGGERED) =====
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const parent = el.parentElement;
                const siblings = parent ? [...parent.children].filter(c => c.hasAttribute('data-v')) : [];
                const idx = siblings.indexOf(el);
                const delay = Math.max(0, idx) * 90;
                setTimeout(() => el.classList.add('show'), delay);
                revealObs.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('[data-v]').forEach(el => revealObs.observe(el));

    // ===== NUMBER COUNTERS =====
    const countObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1200;
                const start = performance.now();
                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
                countObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

    // ===== COURSE FILTER =====
    const filterBtns = document.querySelectorAll('.fbtn');
    const courseCards = document.querySelectorAll('.bc');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.f;

            courseCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.cat === filter;
                if (show) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px) scale(0.97)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s var(--ease), transform 0.4s var(--ease)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, i * 50);
                } else {
                    card.style.transition = 'opacity 0.25s, transform 0.25s';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px) scale(0.97)';
                    setTimeout(() => card.classList.add('hidden'), 300);
                }
            });
        });
    });

    // ===== COUNTDOWN =====
    const evtEl = document.getElementById('featuredEvent');
    if (evtEl) {
        const start = new Date(evtEl.dataset.eventDate);
        const end = new Date(evtEl.dataset.eventEnd);
        const dEl = document.getElementById('countDays');
        const hEl = document.getElementById('countHours');
        const mEl = document.getElementById('countMinutes');
        const sEl = document.getElementById('countSeconds');
        const statusEl = document.getElementById('countdownStatus');

        function tick() {
            const now = new Date();
            let diff, text, cls;
            if (now < start) {
                diff = start - now; text = 'Faltan'; cls = '';
            } else if (now <= end) {
                diff = end - now;
                text = '\u00a1El evento est\u00e1 EN VIVO ahora!';
                cls = 'live';
            } else {
                diff = 0;
                text = 'Evento finalizado. \u00a1Pronto el siguiente!';
                cls = 'past';
            }
            if (diff > 0) {
                const d = Math.floor(diff / 864e5);
                const h = Math.floor((diff % 864e5) / 36e5);
                const m = Math.floor((diff % 36e5) / 6e4);
                const s = Math.floor((diff % 6e4) / 1e3);
                dEl.textContent = String(d).padStart(2, '0');
                hEl.textContent = String(h).padStart(2, '0');
                mEl.textContent = String(m).padStart(2, '0');
                sEl.textContent = String(s).padStart(2, '0');
            } else {
                dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
            }
            statusEl.textContent = text;
            statusEl.className = 'cd-status ' + cls;
        }
        tick();
        setInterval(tick, 1000);
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== TILT ON COURSE CARDS (desktop) =====
    if (window.innerWidth > 768) {
        document.querySelectorAll('.bc, .acard').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-4px) scale(1.01) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
