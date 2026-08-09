import { initCountdown } from './countdown.js';
import { initUrlParams } from './url-params.js';
import { initAudioPlayer } from './audio-player.js';
import { initRsvpForm } from './rsvp-form.js';

// El navegador a veces restaura el scroll de una visita anterior al recargar.
// Forzamos que la invitación siempre arranque desde el principio.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

// ===================== Preloader =====================
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  preloader.style.opacity = '0';
  setTimeout(() => { preloader.style.display = 'none'; }, 500);
});

// ===================== Sobre / pantalla de entrada =====================
// Secuencia: el sello "se rompe", la solapa gira en 3D como una puerta,
// y la tarjeta se desliza hacia afuera antes de que el sobre se desvanezca.
function initEnvelope(audioPlayer) {
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('btn-ingresar');
  const flap = document.getElementById('envelope-flap');
  const card = document.getElementById('envelope-card');
  const pocket = document.getElementById('envelope-pocket');
  const back = envelope ? envelope.querySelector('.envelope__back') : null;
  const hero = document.getElementById('portada');
  if (!envelope || !seal) return;

  document.body.classList.add('no-scroll');

  function revealHero() {
    if (hero) hero.classList.add('is-revealed');
    showScrollNext();
  }

  function finish() {
    envelope.classList.add('is-hidden');
    document.body.classList.remove('no-scroll');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  // Pantalla completa al abrir el sobre. Tiene que dispararse en el mismo
  // gesto de click (sin await/setTimeout antes) porque el navegador solo
  // permite pedir fullscreen como reaccion directa a una interaccion del
  // usuario. En navegadores sin soporte (ej. Safari de iPhone) no hace nada.
  function enterFullscreen() {
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (!request) return;
    try {
      const result = request.call(el);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch {}
  }

  seal.addEventListener('click', () => {
    enterFullscreen();
    seal.disabled = true;
    audioPlayer.play();

    if (window.gsap && flap && card && pocket && back) {
      // 1) el sello se rompe, 2) la solapa gira en 3D como una puerta,
      // 3) la tarjeta pasa al frente y queda QUIETA y a opacidad completa
      // un momento (para que se vea bien el papel), 4) recien despues se
      // desliza hacia afuera mientras el fondo/contenido de la portada
      // aparece con su propio fundido (ver ".hero.is-revealed" en css) y
      // el sobre se desvanece por encima: todo se funde en un solo gesto
      // continuo, sin salto entre "sobre" y "contenido".
      const tl = window.gsap.timeline({ onComplete: finish });
      tl.to(seal, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(2)' })
        .to(flap, { rotateX: -170, duration: 1.1, ease: 'power3.inOut' }, '-=0.05')
        .set(card, { zIndex: 6 })
        .to({}, { duration: 1.5 }) // pausa larga: la tarjeta se ve completa y quieta
        .addLabel('salida')
        .to(card, { y: '-130%', opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 'salida')
        .call(revealHero, [], 'salida')
        .to([pocket, back], { opacity: 0, duration: 0.9 }, 'salida+=0.2')
        .to(envelope, { opacity: 0, duration: 1, ease: 'sine.out' }, 'salida+=0.45');
    } else {
      // Sin GSAP: igual mostramos la tarjeta al frente antes de desvanecer todo.
      card.style.zIndex = '6';
      envelope.classList.add('is-open');
      revealHero();
      setTimeout(finish, 1400);
    }
  }, { once: true });
}

// ===================== Boton flotante "bajar" =====================
// Aparece al abrir el sobre y se mantiene fijo en pantalla durante todo el
// recorrido (a diferencia de la version anterior, que solo vivia en la
// portada). Se oculta solo cerca del pie de pagina, donde ya no hay a donde
// bajar.
function showScrollNext() {
  const btn = document.getElementById('scroll-next');
  if (!btn) return;
  btn.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => btn.classList.add('is-visible')));
}

function initScrollNext() {
  const btn = document.getElementById('scroll-next');
  const footer = document.querySelector('.footer');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  });

  if (footer && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      btn.classList.toggle('is-visible', !entry.isIntersecting && !btn.hidden);
    }, { threshold: 0.1 });
    observer.observe(footer);
  }
}

// ===================== Petalos cayendo (fondo del sobre) =====================
// Cada petalo son 3 elementos anidados con una sola animacion de transform
// cada uno (caida, vaiven y giro), para que se combinen sin pisarse.
function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['var(--petal-a)', 'var(--petal-b)', 'var(--petal-c)'];
  const count = 22;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const fallDuration = 8 + Math.random() * 7;
    const swayDuration = 2.6 + Math.random() * 2.6;
    const spinDuration = 4 + Math.random() * 5;
    const size = 8 + Math.random() * 9;

    const fall = document.createElement('span');
    fall.className = 'petal-fall';
    fall.style.left = `${Math.random() * 100}%`;
    fall.style.animationDuration = `${fallDuration}s`;
    fall.style.animationDelay = `-${Math.random() * fallDuration}s`;

    const sway = document.createElement('span');
    sway.className = 'petal-sway';
    sway.style.animationDuration = `${swayDuration}s`;
    sway.style.animationDelay = `-${Math.random() * swayDuration}s`;
    sway.style.setProperty('--sway', `${10 + Math.random() * 18}px`);

    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 0.75}px`;
    petal.style.animationDuration = `${spinDuration}s`;
    petal.style.animationDelay = `-${Math.random() * spinDuration}s`;
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    petal.style.opacity = String(0.5 + Math.random() * 0.35);

    sway.appendChild(petal);
    fall.appendChild(sway);
    frag.appendChild(fall);
  }
  container.appendChild(frag);
}

// ===================== Toast =====================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

// ===================== Copiar numero de cuenta =====================
function initCopyAccount() {
  const btn = document.getElementById('copy-account');
  const number = document.getElementById('account-number');
  if (!btn || !number) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(number.textContent.trim());
      showToast('¡Copiado!');
    } catch {
      showToast('No se pudo copiar');
    }
  });
}

// ===================== Modal de mapa =====================
// Usa OpenStreetMap (sin API key) para mostrar un marcador real en el punto
// exacto, y agrega un link a Google Maps para direcciones reales.
function initMapModal() {
  const modal = document.getElementById('map-modal');
  const frame = document.getElementById('map-frame');
  const title = document.getElementById('map-modal-title');
  const directions = document.getElementById('map-directions');
  if (!modal || !frame) return;

  let lastFocused = null;

  function openModal(lat, lng, name) {
    lastFocused = document.activeElement;

    const delta = 0.006; // ~650m alrededor del punto
    const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',');
    frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    if (title) title.textContent = name || 'Ubicación';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal__close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    frame.src = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-lat][data-lng]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(parseFloat(btn.dataset.lat), parseFloat(btn.dataset.lng), btn.dataset.name);
    });
  });

  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

// ===================== Galeria: Swiper + GLightbox =====================
function initGallery() {
  if (window.Swiper) {
    new window.Swiper('.gallery-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: false,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 2.2, spaceBetween: 20 },
        1024: { slidesPerView: 3.4, spaceBetween: 24 },
      },
    });
  }

  if (window.GLightbox) {
    window.GLightbox({ selector: '.glightbox' });
  }
}

// ===================== Timeline: linea SVG que se dibuja al hacer scroll =====================
function initTimelineDraw() {
  const wrap = document.getElementById('timeline');
  const svg = document.getElementById('timeline-line');
  const path = document.getElementById('timeline-path');
  if (!wrap || !svg || !path || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  function draw() {
    const height = wrap.offsetHeight;
    svg.setAttribute('viewBox', `0 0 4 ${height}`);
    svg.setAttribute('height', height);
    path.setAttribute('d', `M2,0 L2,${height}`);

    const length = height;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    window.ScrollTrigger.getAll().forEach((st) => { if (st.vars.id === 'timeline') st.kill(); });

    window.gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        id: 'timeline',
        trigger: wrap,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: true,
      },
    });
  }

  draw();
  window.addEventListener('resize', draw);
}

// ===================== Init general =====================
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const audioPlayer = initAudioPlayer();

  initUrlParams();
  initCountdown();
  initEnvelope(audioPlayer);
  initScrollNext();
  initPetals();
  initCopyAccount();
  initMapModal();
  initGallery();
  initRsvpForm();

  if (window.AOS) window.AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });

  initTimelineDraw();
});
