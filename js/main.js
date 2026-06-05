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

document.getElementById('modalForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const servicios = [...document.querySelectorAll('input[name="servicio"]:checked')].map(i => i.value);
  const email = document.querySelector('input[name="email"]').value;
  const tel = document.querySelector('input[name="telefono"]').value;
  const mailtoBody = `Servicios de interés: ${servicios.join(', ') || 'Ninguno seleccionado'}%0ATeléfono: +569${tel}`;
  window.location.href = `mailto:admin@operumti.com?subject=Contacto desde web&body=${mailtoBody}%0ACorreo: ${email}`;
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
