// Formularios de contacto (el de la sección "Contacto" y el del popup) comparten la misma lógica de envío
function handleLeadFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.modal__submit');

  const nombre = form.querySelector('input[name="nombre"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const telefono = form.querySelector('input[name="telefono"]').value;
  const servicios = [...form.querySelectorAll('input[name="servicio"]:checked')].map(i => i.value).join(', ') || 'Ninguno seleccionado';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  fetch('https://script.google.com/macros/s/AKfycbztB3r9w2gE5q-GE_LsbDz9eJbZhOPX2Z81pKPHu6Ln7tNlHN6RnP3tsN6LenlDZCyT/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, telefono, servicios })
  })
    .then(() => {
      form.reset();
      form.innerHTML = '<p class="modal__success">Dentro de las próximas 24h BRCsoluciones te estará contactando para coordinar una reunión.</p>';
      if (form.closest('.modal-overlay')) {
        setTimeout(closeModal, 4000);
      }
    })
    .catch(() => {
      submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
      submitBtn.disabled = false;
    });
}

document.querySelectorAll('.js-lead-form').forEach(form => {
  form.addEventListener('submit', handleLeadFormSubmit);
});

// Popup de contacto: aparece centrado en pantalla, sin scrollear ni cambiar de página
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (modalOverlay) {
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
}

// Scroll a anclas internas (#inicio, etc.) compensando el nav fijo
(function () {
  function scrollToHash(hash) {
    if (!hash || hash === '#') return;
    var target = document.querySelector(hash);
    if (!target) return;
    var navEl = document.querySelector('.nav');
    var offset = (navEl ? navEl.offsetHeight : 0) + 16;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      // Cierra el menú móvil de inmediato (sin esperar la transición) antes de hacer scroll
      var hamburgerEl = document.getElementById('navHamburger');
      var mobileMenuEl = document.getElementById('navMobile');
      if (mobileMenuEl && mobileMenuEl.classList.contains('is-open')) {
        hamburgerEl.classList.remove('is-open');
        mobileMenuEl.classList.remove('is-open');
        document.body.style.overflow = '';
      }

      history.pushState(null, '', hash);
      scrollToHash(hash);
    });
  });

  // Si la página carga con un hash, espera a que el layout esté listo antes de hacer scroll.
  if (window.location.hash) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        scrollToHash(window.location.hash);
      }, 120);
    });
  }
})();

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
