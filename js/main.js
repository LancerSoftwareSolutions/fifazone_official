/* FifaZone Official — sample site interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu after tapping a link
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Scroll reveal ----
     Elements marked [data-reveal] fade/slide in once they enter the viewport. */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---- Holo card tilt + shine ----
     Tracks pointer position over the hero card and maps it to a 3D tilt
     plus a CSS custom-property-driven light sweep, mimicking how a
     foil trading card catches the light when you turn it in your hand. */
  const holoCard = document.getElementById('holoCard');

  if (holoCard && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const maxTilt = 10; // degrees

    holoCard.addEventListener('mousemove', (event) => {
      const bounds = holoCard.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;  // 0–1 across the card
      const py = (event.clientY - bounds.top) / bounds.height;  // 0–1 down the card

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      holoCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      holoCard.style.setProperty('--mx', `${px * 100}%`);
      holoCard.style.setProperty('--my', `${py * 100}%`);
    });

    holoCard.addEventListener('mouseleave', () => {
      holoCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      holoCard.style.setProperty('--mx', '50%');
      holoCard.style.setProperty('--my', '50%');
    });
  }

  /* ---- Newsletter form ----
     Sample-site stub: no backend wired up yet, just confirms the intent. */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      if (email) {
        newsletterNote.textContent = `You're on the list — we'll email ${email} before the next drop.`;
        newsletterForm.reset();
      }
    });
  }

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
