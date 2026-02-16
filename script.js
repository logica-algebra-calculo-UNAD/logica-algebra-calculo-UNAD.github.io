// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 1500;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * ease);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => statsObserver.observe(el));

// ===== COURSE FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const courseCards = document.querySelectorAll('.course-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        courseCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll(
    '.about-card, .course-card, .director-card, .event-card, .contact-wrapper'
);
fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 80);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Add fadeIn keyframes dynamically
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);

// ===== COUNTDOWN TIMER =====
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
            // Evento por venir
            diff = eventDate - now;
            statusText = 'Faltan';
            statusClass = '';
        } else if (now >= eventDate && now <= eventEnd) {
            // Evento en curso
            diff = eventEnd - now;
            statusText = '&#127881; ¡El evento está EN VIVO ahora!';
            statusClass = 'live';
        } else {
            // Evento pasado
            diff = 0;
            statusText = 'Este evento ya finalizó. ¡Pronto anunciaremos el siguiente!';
            statusClass = 'past';
        }

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countDays.textContent = String(days).padStart(2, '0');
            countHours.textContent = String(hours).padStart(2, '0');
            countMinutes.textContent = String(minutes).padStart(2, '0');
            countSeconds.textContent = String(seconds).padStart(2, '0');
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
        countdownStatus.className = 'countdown-status ' + statusClass;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
