/* =============================================
   ARIPLUS — Landing Page JavaScript
   Frontend · Backend · Build
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounterAnimation();
  initSmoothScrolling();
  initTerminalAnimation();
  initCopyButton();
});

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.pillar-card, .stack-card, .section-header, .stack-header, .about-content, .download-card, .pipeline-visual'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ---------- Counter Animation ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(easeOut * target);

    if (target >= 1000) {
      element.textContent = current.toLocaleString('fr-FR') + '+';
    } else {
      element.textContent = current + '+';
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Smooth Scrolling ---------- */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Terminal Typing Animation ---------- */
function initTerminalAnimation() {
  const cmdEl = document.getElementById('typedCmd');
  const outputEl = document.getElementById('terminalOutput');
  const cursorEl = document.getElementById('cursor');
  if (!cmdEl || !outputEl) return;

  const sequences = [
    {
      cmd: 'npm create ariplus@latest my-app',
      output: [
        { text: '  Creating project in ./my-app...', cls: 't-info' },
        { text: '  ✔ Frontend scaffolded (React + Tailwind)', cls: 't-success' },
        { text: '  ✔ Backend configured (Node.js + PostgreSQL)', cls: 't-success' },
        { text: '  ✔ Build pipeline ready (Docker + CI/CD)', cls: 't-success' },
        { text: '', cls: '' },
        { text: '  🚀 Project ready! cd my-app && npm run dev', cls: 't-warn' },
      ]
    },
    {
      cmd: 'ariplus deploy --production',
      output: [
        { text: '  ⏳ Building frontend bundle...', cls: 't-info' },
        { text: '  ⏳ Running 247 tests...', cls: 't-info' },
        { text: '  ✔ All tests passed', cls: 't-success' },
        { text: '  ✔ Docker image built (42MB)', cls: 't-success' },
        { text: '  ✔ Deployed to production ✨', cls: 't-success' },
        { text: '', cls: '' },
        { text: '  🌐 https://my-app.ariplus.dev', cls: 't-warn' },
      ]
    },
    {
      cmd: 'ariplus status',
      output: [
        { text: '  Frontend:  ● Online   (React 19)', cls: 't-success' },
        { text: '  Backend:   ● Online   (Node 20)', cls: 't-success' },
        { text: '  Database:  ● Online   (PostgreSQL 16)', cls: 't-success' },
        { text: '  Uptime:    99.99%', cls: 't-info' },
        { text: '  Latency:   12ms (p95)', cls: 't-info' },
      ]
    }
  ];

  let seqIndex = 0;

  function runSequence() {
    const seq = sequences[seqIndex % sequences.length];
    seqIndex++;

    cmdEl.textContent = '';
    outputEl.innerHTML = '';
    if (cursorEl) cursorEl.style.display = 'inline';

    typeCommand(seq.cmd, 0, () => {
      if (cursorEl) cursorEl.style.display = 'none';
      setTimeout(() => {
        showOutputLines(seq.output, 0, () => {
          setTimeout(runSequence, 3000);
        });
      }, 400);
    });
  }

  function typeCommand(text, i, callback) {
    if (i < text.length) {
      cmdEl.textContent += text[i];
      setTimeout(() => typeCommand(text, i + 1, callback), 35 + Math.random() * 25);
    } else {
      callback();
    }
  }

  function showOutputLines(lines, i, callback) {
    if (i < lines.length) {
      const line = lines[i];
      const div = document.createElement('div');
      if (line.cls) div.className = line.cls;
      div.textContent = line.text;
      outputEl.appendChild(div);
      setTimeout(() => showOutputLines(lines, i + 1, callback), 120);
    } else {
      callback();
    }
  }

  // Start after hero animation completes
  setTimeout(runSequence, 1200);
}

/* ---------- Copy Install Command ---------- */
function initCopyButton() {
  const copyBtn = document.getElementById('copyBtn');
  const installCmd = document.getElementById('installCmd');
  if (!copyBtn || !installCmd) return;

  copyBtn.addEventListener('click', () => {
    const text = installCmd.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
      setTimeout(() => {
        copyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      }, 2000);
    });
  });
}
