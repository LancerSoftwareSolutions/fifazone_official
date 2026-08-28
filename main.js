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


  /* =========================================================
     CART SYSTEM
     Client-side only — no backend. Orders are handed off to
     WhatsApp as a pre-filled message rather than processed here.
     ========================================================= */

  // TODO: replace with the real business WhatsApp number, digits only,
  // in international format with no leading + or 00 (e.g. Lebanon
  // mobile "961 71 234567" becomes "96171234567").
  const WHATSAPP_NUMBER = '9613076749';

  let cart = []; // [{ name, price, qty }]

  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartCheckoutBtn = document.getElementById('cartCheckout');

  function openCart() {
    cartOverlay.hidden = false;
    cartDrawer.hidden = false;
    // Next tick so the transition actually runs instead of snapping open.
    requestAnimationFrame(() => {
      cartOverlay.classList.add('is-open');
      cartDrawer.classList.add('is-open');
    });
  }

  function closeCart() {
    cartOverlay.classList.remove('is-open');
    cartDrawer.classList.remove('is-open');
    setTimeout(() => {
      cartOverlay.hidden = true;
      cartDrawer.hidden = true;
    }, 250);
  }

  function addToCart(name, price) {
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    renderCart();
    openCart();
  }

  function changeQty(name, delta) {
    const item = cart.find((i) => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.name !== name);
    }
    renderCart();
  }

  function removeItem(name) {
    cart = cart.filter((i) => i.name !== name);
    renderCart();
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalQty;

    cartItemsEl.innerHTML = '';
    cartEmptyEl.hidden = cart.length > 0;

    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">$${item.price.toFixed(2)} each</p>
          <div class="cart-item__qty">
            <button type="button" data-action="dec" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="cart-item__remove" data-action="remove">Remove</button>
        </div>
      `;
      li.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.name, 1));
      li.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.name, -1));
      li.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(item.name));
      cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = `$${cartTotal().toFixed(2)}`;
  }

  // Wire up every "Add to cart" button on the page using its card's data attributes.
  document.querySelectorAll('.js-add-to-cart').forEach((btn) => {
    const card = btn.closest('[data-name][data-price]');
    if (!card) return;
    btn.addEventListener('click', () => {
      addToCart(card.dataset.name, parseFloat(card.dataset.price));
    });
  });

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cartDrawer.classList.contains('is-open')) closeCart();
  });

  // Build a WhatsApp click-to-chat link with the full order pre-filled,
  // then open it — WhatsApp handles everything from there, no server needed.
  cartCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const lines = cart.map((item) => `• ${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}`);
    const message = [
      'New order from FifaZone Official website:',
      '',
      ...lines,
      '',
      `Total: $${cartTotal().toFixed(2)}`,
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  });

});
