document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Dropdown (touch/click support; hover handled in CSS on desktop)
  document.querySelectorAll('.nav-item.has-dropdown > .drop-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.closest('.nav-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.has-dropdown.open').forEach((el) => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      document.querySelectorAll('.nav-item.has-dropdown.open').forEach((el) => el.classList.remove('open'));
    }
  });

  // Close mobile menu when a plain link is clicked
  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks && navLinks.classList.remove('is-open');
      burger && burger.classList.remove('is-open');
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Back to top
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('is-visible', window.scrollY > 500);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});
