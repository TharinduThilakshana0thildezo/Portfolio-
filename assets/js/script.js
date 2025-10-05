/* Global Interactions: typing, smooth scroll, web background, lightbox, back-to-top, theme toggle, reveal */

// ---- Configurable Social Links (real links) ----
const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/tharindu.gm',
  github: 'https://github.com/TharinduThilakshana0thildezo',
  linkedin: 'https://www.linkedin.com/in/tharindu-thilakshana-de-zoysa-1606a2274/',
};

// ---- Navbar Active Link & Smooth Scroll for same-page anchors ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-social]')?.forEach((el) => {
    const key = el.getAttribute('data-social');
    const currentHref = el.getAttribute('href');
    // Only set href from SOCIAL_LINKS if it's missing or a placeholder
    if (key && SOCIAL_LINKS[key] && (!currentHref || currentHref === '#' || currentHref === '')) {
      el.setAttribute('href', SOCIAL_LINKS[key]);
    }
    // Ensure external social links open in a new tab securely
    const href = el.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noreferrer noopener');
    }
  });

  // Active highlight based on current page
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.endsWith(current)) a.classList.add('active');
  });

  // Smooth scroll for hash links on same page
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form handler (basic validation + UX)
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        if (status) { status.textContent = 'Please fill in name, email, and message.'; status.style.color = 'var(--warning)'; }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) { status.textContent = 'Please enter a valid email address.'; status.style.color = 'var(--warning)'; }
        return;
      }
      if (status) { status.textContent = 'Thanks, I\'ll get back to you!'; status.style.color = 'var(--electric-blue-2)'; }
      form.reset();
    });
  }
});

// Fade-in once everything is ready
window.addEventListener('load', () => {
  document.body.classList.add('page-ready');
});

// ---- Typing Effect (Home) ----
(function typingEffect() {
  const el = document.getElementById('typing');
  if (!el) return;
  const roles = [
    'A Software Engineer 💻',
    'A Creative Web Developer 🚀',
    'A Tech Enthusiast ⚡',
    'A Full Stack Developer 🌐',
    'A Cloud & DevOps Enthusiast ☁️'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const type = () => {
    const current = roles[roleIdx];
    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }
    el.textContent = current.substring(0, charIdx);
    let delay = isDeleting ? 40 : 90;
    if (!isDeleting && charIdx === current.length) {
      delay = 1400; isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400;
    }
    setTimeout(type, delay);
  };
  type();
})();

// ---- Back to Top + Theme Toggle ----
const backToTopBtn = document.getElementById('backToTop');
const themeToggleBtn = document.getElementById('themeToggle');

window.addEventListener('scroll', () => {
  if (!backToTopBtn) return;
  const show = window.scrollY > 400;
  backToTopBtn.classList.toggle('hidden', !show);
});

backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

themeToggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// ---- Reveal on Scroll ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// Grouped stagger reveal
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const group = entry.target;
    const children = Array.from(group.children);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
      child.classList.add('visible');
    });
    staggerObserver.unobserve(group);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal-stagger]').forEach((el) => staggerObserver.observe(el));

// ---- Web-like Background (Home) ----
(function webBackground() {
  const canvas = document.getElementById('bg-web');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5); // cap for perf

  const COUNT = Math.min(56, Math.max(36, Math.floor((window.innerWidth * window.innerHeight) / 45000)));
  const nodes = new Array(COUNT).fill(0).map(() => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.025, // slower drift
    vy: (Math.random() - 0.5) * 0.025, // slower drift
  }));
  const mouse = { x: null, y: null };

  const onResize = () => {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const MAX_DIST = 140;
  let last = 0;
  const STEP_MS = 1000 / 60; // ~60fps
  const draw = (ts) => {
    if (ts - last < STEP_MS) { requestAnimationFrame(draw); return; }
    last = ts;
    ctx.clearRect(0, 0, width, height);

    // update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      // gentle movement with light damping
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.995; n.vy *= 0.995;
      if (n.x < 0 || n.x > 1) n.vx *= -1;
      if (n.y < 0 || n.y > 1) n.vy *= -1;
      // mild mouse attraction for depth
      if (mouse.x !== null) {
        const dx = mouse.x - n.x * width;
        const dy = mouse.y - n.y * height;
        n.vx += (dx / width) * 0.00035; // slower response
        n.vy += (dy / height) * 0.00035; // slower response
      }
    }

    // draw connections
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const d = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          const alpha = 0.12 * (1 - d / MAX_DIST);
          ctx.strokeStyle = `rgba(61,220,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
    }

    // subtle node dots (no shadow for perf)
    ctx.fillStyle = 'rgba(0,178,255,0.8)';
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x * width, n.y * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
  onResize();
  requestAnimationFrame(draw);
})();

// ---- Portrait-local particle web (sits behind image) ----
(function portraitParticles() {
  const canvas = document.querySelector('.portrait-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let width = 0, height = 0;

  const nodes = new Array(36).fill(0).map(() => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.02,
    vy: (Math.random() - 0.5) * 0.02,
  }));

  const resize = () => {
    const box = canvas.parentElement.getBoundingClientRect();
    width = Math.max(240, box.width + 28);
    height = Math.max(320, box.height + 28);
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const MAX_DIST = 90;
  let last = 0;
  const STEP = 1000 / 60;
  const render = (ts) => {
    if (ts - last < STEP) { requestAnimationFrame(render); return; }
    last = ts;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy; n.vx *= 0.996; n.vy *= 0.996;
      if (n.x < 0 || n.x > 1) n.vx *= -1;
      if (n.y < 0 || n.y > 1) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const d = Math.hypot(dx, dy);
        if (d < MAX_DIST) {
          const alpha = 0.18 * (1 - d / MAX_DIST);
          ctx.strokeStyle = `rgba(61,220,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(0,178,255,0.9)';
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x * width, n.y * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize);
  const obs = new ResizeObserver(resize);
  obs.observe(canvas.parentElement);
  resize();
  requestAnimationFrame(render);
})();

// ---- Gallery Lightbox ----
(function lightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('[data-lightbox]')?.forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.getAttribute('src');
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
})();

// ---- Slider (Gallery) ----
(function slider() {
  const slider = document.getElementById('slider');
  const slidesWrap = document.getElementById('slides');
  if (!slider || !slidesWrap) return;
  const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('sliderDots');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  let idx = 0; let autoplayId; let startX = null; let isTouch = false;

  const go = (i) => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === idx));
    if (dotsWrap) Array.from(dotsWrap.children).forEach((d, n) => d.classList.toggle('active', n === idx));
  };
  const nextFn = () => go(idx + 1);
  const prevFn = () => go(idx - 1);
  const startAutoplay = () => { stopAutoplay(); autoplayId = setInterval(nextFn, 4000); };
  const stopAutoplay = () => { if (autoplayId) clearInterval(autoplayId); };

  // Dots
  if (dotsWrap) {
    slides.forEach((_, n) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => { go(n); startAutoplay(); });
      dotsWrap.appendChild(b);
    });
  }

  // Arrows
  prev?.addEventListener('click', () => { prevFn(); startAutoplay(); });
  next?.addEventListener('click', () => { nextFn(); startAutoplay(); });

  // Swipe support
  slidesWrap.addEventListener('touchstart', (e) => { isTouch = true; startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  slidesWrap.addEventListener('touchmove', (e) => { if (startX == null) return; const dx = e.touches[0].clientX - startX; if (Math.abs(dx) > 40) { dx > 0 ? prevFn() : nextFn(); startX = null; } }, { passive: true });
  slidesWrap.addEventListener('touchend', () => { startX = null; startAutoplay(); }, { passive: true });

  go(0);
  startAutoplay();
})();




