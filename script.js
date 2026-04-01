/* ===================================================
   BES Security – Main Script
   Handles: sticky nav, mobile menu, smooth scroll,
            animated counters, form validation
   =================================================== */

(function () {
  'use strict';

  /* ── DOM references ── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const backToTop  = document.getElementById('backToTop');
  const yearEl     = document.getElementById('year');
  const form       = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ── Current year in footer ── */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Sticky nav + back-to-top visibility ── */
  function onScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }

    /* Highlight active nav link based on section in view */
    highlightActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Back to top ── */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mobile hamburger ── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });

    /* Close menu when a nav link is clicked */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Active nav link highlighting ── */
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function highlightActiveLink() {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Animated counters ── */
  var ANIMATION_DURATION_MS = 1800;
  var ANIMATION_FRAME_INTERVAL_MS = 16;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var increment = target / (ANIMATION_DURATION_MS / ANIMATION_FRAME_INTERVAL_MS);
    var current = 0;
    var statItem = el.closest('.stat-item');
    var suffix = statItem ? getSuffix(statItem) : '';

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, ANIMATION_FRAME_INTERVAL_MS);
  }

  function getSuffix(statItem) {
    var label = statItem.querySelector('.label');
    if (!label) return '';
    var text = label.textContent;
    if (text.includes('%')) return '%';
    if (text.includes('+')) return '+';
    return '';
  }

  /* Observe stats section */
  const statsNumbers = document.querySelectorAll('.stat-item .number[data-target]');
  if ('IntersectionObserver' in window && statsNumbers.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsNumbers.forEach(function (el) { observer.observe(el); });
  }

  /* ── Form validation & submission ── */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      /* Name */
      const nameEl = document.getElementById('name');
      const fgName = document.getElementById('fg-name');
      if (!nameEl.value.trim()) {
        fgName.classList.add('error');
        valid = false;
      } else {
        fgName.classList.remove('error');
      }

      /* Email */
      const emailEl = document.getElementById('email');
      const fgEmail = document.getElementById('fg-email');
      if (!emailEl.value.trim() || !emailEl.validity.valid) {
        fgEmail.classList.add('error');
        valid = false;
      } else {
        fgEmail.classList.remove('error');
      }

      /* Service */
      const serviceEl = document.getElementById('service');
      const fgService = document.getElementById('fg-service');
      if (!serviceEl.value) {
        fgService.classList.add('error');
        valid = false;
      } else {
        fgService.classList.remove('error');
      }

      if (!valid) return;

      /* Simulate success */
      form.querySelector('[type="submit"]').disabled = true;
      form.querySelector('[type="submit"]').innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      setTimeout(function () {
        form.reset();
        formSuccess.classList.add('visible');
        form.querySelector('[type="submit"]').style.display = 'none';

        /* Scroll success message into view */
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });

    /* Real-time validation: clear error on input */
    ['name', 'email', 'service'].forEach(function (id) {
      const el = document.getElementById(id);
      const fg = document.getElementById('fg-' + id);
      if (el && fg) {
        el.addEventListener('input', function () { fg.classList.remove('error'); });
        el.addEventListener('change', function () { fg.classList.remove('error'); });
      }
    });
  }

})();
