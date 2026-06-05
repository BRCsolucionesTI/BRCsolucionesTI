// Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

const openModal = () => {
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
};

const closeModal = () => {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
};

document.querySelectorAll('.js-open-modal').forEach(btn => {
  btn.addEventListener('click', openModal);
});

if (modalClose) modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.getElementById('modalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.modal__submit');

  const nombre = form.querySelector('input[name="nombre"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const telefono = form.querySelector('input[name="telefono"]').value;
  const servicios = [...form.querySelectorAll('input[name="servicio"]:checked')].map(i => i.value).join(', ') || 'Ninguno seleccionado';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    await fetch('https://script.google.com/macros/s/AKfycbztB3r9w2gE5q-GE_LsbDz9eJbZhOPX2Z81pKPHu6Ln7tNlHN6RnP3tsN6LenlDZCyT/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, telefono, servicios })
    });

    form.reset();
    form.innerHTML = '<p class="modal__success">Dentro de las próximas 24h BRCsoluciones te estará contactando para coordinar una reunión.</p>';
    setTimeout(() => closeModal(), 4000);
  } catch {
    submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
    submitBtn.disabled = false;
  }
});

// Marquee infinito sin espacios en blanco
(function () {
  function setupMarquee() {
    var track = document.getElementById('clientsTrack');
    if (!track) return;

    var singleSet = track.innerHTML;
    var setWidth = track.scrollWidth;

    if (setWidth === 0) {
      requestAnimationFrame(setupMarquee);
      return;
    }

    // Cuántas copias necesitamos para que UNA mitad llene la pantalla
    var copies = Math.max(Math.ceil(window.innerWidth / setWidth) + 1, 2);

    var half = '';
    for (var i = 0; i < copies; i++) half += singleSet;

    // El track = mitad A + mitad B (idénticas), la animación -50% hace el loop
    track.innerHTML = half + half;
  }

  requestAnimationFrame(setupMarquee);
})();

// Nav shadow on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none';
});

// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobile');

if (hamburger && mobileMenu) {
  const closeMenu = () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) lucide.createIcons();
  });

  const closeBtn = document.getElementById('navMobileClose');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
