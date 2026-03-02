/* ============================================================
   TECSTRYDE – GLOBAL SHARED JS
   ============================================================ */

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const bar    = document.querySelector('.loader-bar-fill');
  if (!loader) return;
  if (bar) { setTimeout(() => { bar.style.width = '100%'; }, 60); }
  setTimeout(() => { loader.classList.add('hidden'); }, 1800);
});

// ── CUSTOM CURSOR ──
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
if (cursorDot && cursorRing) {
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    cursorDot.style.left  = e.clientX + 'px';
    cursorDot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  });
  const animate = () => { requestAnimationFrame(animate); };
  animate();
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── ACTIVE NAV LINK ──
(function() {
  const links = document.querySelectorAll('.nav-links a, #mobile-nav a');
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === cur || (cur === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── MOBILE NAV ──
const burger  = document.querySelector('.nav-hamburger');
const mobileN = document.getElementById('mobile-nav');
const overlay = document.getElementById('overlay');
if (burger && mobileN && overlay) {
  const toggle = () => {
    burger.classList.toggle('open');
    mobileN.classList.toggle('open');
    overlay.classList.toggle('show');
  };
  burger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
  mobileN.querySelectorAll('a').forEach(a => a.addEventListener('click', toggle));
}

// ── BACK TO TOP ──
const backTop = document.getElementById('back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 400);
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── STAGGER CHILDREN ──
document.querySelectorAll('[data-stagger]').forEach(parent => {
  [...parent.children].forEach((child, i) => {
    child.style.transitionDelay = (i * 0.1) + 's';
    child.classList.add('reveal');
    revealObs.observe(child);
  });
});

// ── PARTICLES ──
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pts = [];
  const COUNT = 70;
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    pts.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random()
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${p.a * 0.5})`;
      ctx.fill();
    });
    // Connect nearby dots
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${0.05 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
})();

// ── COUNTER ANIMATION ──
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 1800;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}
const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));
}

// ── 3D TILT ──
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * -8;
    const ry = ((e.clientX - cx) / (r.width  / 2)) *  8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => { card.style.transition = ''; });
});

// ── PARALLAX ──
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    el.style.transform = `translateY(${sy * speed}px)`;
  });
});

// ── TABS (for filter/categories) ──
document.querySelectorAll('[data-tab-group]').forEach(group => {
  const id  = group.dataset.tabGroup;
  const btns = document.querySelectorAll(`[data-tab="${id}"]`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      group.querySelectorAll('[data-cat]').forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });
});

// ── TESTIMONIAL SLIDER ──
(function() {
  const track  = document.getElementById('testi-track');
  const prev   = document.getElementById('testi-prev');
  const next   = document.getElementById('testi-next');
  const dots   = document.querySelectorAll('.testi-dot');
  if (!track) return;
  let idx = 0;
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;

  const go = (n) => {
    idx = (n + total) % total;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  };
  if (prev) prev.addEventListener('click', () => go(idx - 1));
  if (next) next.addEventListener('click', () => go(idx + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  setInterval(() => go(idx + 1), 5500);
})();
