import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@fontsource-variable/playfair-display/wght.css';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/work-sans/wght.css';

// Mobile nav toggle (both the open hamburger and the close button share this attribute)
const navToggles = document.querySelectorAll('[data-nav-toggle]');
const mobileNav = document.getElementById('mobile-nav');

if (navToggles.length && mobileNav) {
  navToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = mobileNav.getAttribute('data-open') === 'true';
      mobileNav.setAttribute('data-open', String(!isOpen));
      navToggles.forEach((b) => b.setAttribute('aria-expanded', String(!isOpen)));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.setAttribute('data-open', 'false');
      navToggles.forEach((b) => b.setAttribute('aria-expanded', 'false'));
      document.body.style.overflow = '';
    });
  });
}

// Scroll reveal - threshold 0 + a shallow negative bottom margin so the
// reveal fires the moment any part of a section is on screen, so a fast
// scroll flick can't skip a short section without ever triggering it.
const revealTargets = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

// Film grain: one fixed, pointer-events-none overlay for the whole page,
// injected once here rather than repeated in every page's markup.
const grain = document.createElement('div');
grain.id = 'grain';
grain.setAttribute('aria-hidden', 'true');
document.body.appendChild(grain);

// Magnetic buttons: a subtle pointer-follow on primary/outline CTAs.
// Skipped entirely under reduced motion, and only active on pointers that
// actually hover (skips touch devices, where it has no meaning).
const supportsHover = window.matchMedia('(hover: hover)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (supportsHover && !reduceMotion) {
  document.querySelectorAll('.btn').forEach((btn) => {
    const strength = 0.25;
    let pressed = false;

    const apply = (x, y) => {
      const scale = pressed ? 0.97 : 1;
      btn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };

    let lastX = 0;
    let lastY = 0;

    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      lastX = (event.clientX - (rect.left + rect.width / 2)) * strength;
      lastY = (event.clientY - (rect.top + rect.height / 2)) * strength;
      apply(lastX, lastY);
    });
    btn.addEventListener('pointerdown', () => {
      pressed = true;
      apply(lastX, lastY);
    });
    btn.addEventListener('pointerup', () => {
      pressed = false;
      apply(lastX, lastY);
    });
    btn.addEventListener('pointerleave', () => {
      pressed = false;
      btn.style.transform = '';
    });
  });
}

// Contact form: client-side validation + success state.
// NOTE: this demo has no backend. Wire it up to a real endpoint (Netlify
// Forms, Formspree, or the studio's own mail handler) before launch.
const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    contactForm.querySelectorAll('[required]').forEach((field) => {
      const errorEl = field.closest('[data-field]')?.querySelector('[data-field-error]');
      const isEmpty = !field.value.trim();
      const isBadEmail = field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value.trim());

      if (isEmpty || isBadEmail) {
        isValid = false;
        errorEl?.classList.remove('hidden');
        field.setAttribute('aria-invalid', 'true');
      } else {
        errorEl?.classList.add('hidden');
        field.removeAttribute('aria-invalid');
      }
    });

    if (!isValid) return;

    contactForm.hidden = true;
    const success = document.querySelector('[data-form-success]');
    if (success) {
      success.hidden = false;
      success.focus();
    }
  });
}
