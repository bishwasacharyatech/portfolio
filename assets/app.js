(() => {
  'use strict';

  const root = document.documentElement;

  /* Theme */
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('bishwas-theme');
  } catch (e) {}

  if (savedTheme) {
    root.dataset.theme = savedTheme;
  } else if (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-color-scheme: light)').matches
  ) {
    root.dataset.theme = 'light';
  }

  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const updateThemeLabel = () => {
    const light = root.dataset.theme === 'light';

    if (themeMeta) {
      themeMeta.content = light ? '#f5f8fc' : '#0d1117';
    }

    if (!themeButton) return;

    themeButton.setAttribute(
      'aria-label',
      light ? 'Switch to dark theme' : 'Switch to light theme'
    );
    themeButton.textContent = light ? '☾' : '☼';
  };

  updateThemeLabel();

  themeButton?.addEventListener('click', () => {
    root.dataset.theme =
      root.dataset.theme === 'light' ? 'dark' : 'light';

    try {
      localStorage.setItem('bishwas-theme', root.dataset.theme);
    } catch (e) {}

    updateThemeLabel();
  });

  /* Mobile navigation */
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  const setMenuState = open => {
    if (!nav || !menuButton) return;

    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );
    menuButton.textContent = open ? '×' : '☰';
  };

  menuButton?.addEventListener('click', () => {
    if (!nav) return;
    setMenuState(!nav.classList.contains('open'));
  });

  nav?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => setMenuState(false))
  );

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      setMenuState(false);
      menuButton?.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!nav?.classList.contains('open')) return;
    if (nav.contains(event.target) || menuButton?.contains(event.target)) {
      return;
    }
    setMenuState(false);
  });

  if (typeof matchMedia === 'function') {
    const desktop = matchMedia('(min-width: 721px)');
    desktop.addEventListener?.('change', event => {
      if (event.matches) setMenuState(false);
    });
  }

  /* Active navigation link */
  const current = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* Scroll progress + back-to-top */
  const progress = document.querySelector('.progress-line');
  const backTop = document.querySelector('.back-top');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;

    if (progress) {
      progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    }

    backTop?.classList.toggle('show', scrollY > 500);
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const prefersReducedMotion =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  backTop?.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* Scroll reveal */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* Project filter */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      projects.forEach(card => {
        card.hidden =
          filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  /* Contact form */
  const form = document.querySelector('[data-contact-form]');

  form?.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') ?? '').toString().trim();
    const email = (data.get('email') ?? '').toString().trim();
    const message = (data.get('message') ?? '').toString().trim();

    if (!name || !email || !message) {
      form.reportValidity?.();
      return;
    }

    const subject = encodeURIComponent(`Portfolio contact: ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    location.href =
      `mailto:bishwasacharya.tech@gmail.com?subject=${subject}&body=${body}`;
  });

  /* Copyright year */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();