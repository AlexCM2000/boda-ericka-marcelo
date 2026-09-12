// Cuenta regresiva hasta la fecha de la boda.
const WEDDING_DATE = new Date('2026-09-12T11:00:00');

// Ventana de "boda en curso": desde la hora de inicio hasta 12h despues,
// para cubrir ceremonia + recepcion sin poner una hora exacta de cierre.
const EN_CURSO_MS = 12 * 60 * 60 * 1000;

const FORMATTER_FECHA = new Intl.DateTimeFormat('es-BO', {
  day: 'numeric', month: 'long', year: 'numeric',
});

function tick(el, value) {
  const formatted = String(Math.max(value, 0)).padStart(2, '0');
  if (el.textContent !== formatted) {
    el.textContent = formatted;
    el.classList.remove('tick');
    void el.offsetWidth; // reinicia la animacion CSS
    el.classList.add('tick');
  }
}

export function initCountdown() {
  const countdownBox = document.getElementById('countdown');
  const statusEl = document.getElementById('countdown-status');
  const agendarBtn = document.getElementById('btn-agendar');
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };
  if (!els.days) return;

  let interval;

  function showEnCurso() {
    clearInterval(interval);
    if (countdownBox) countdownBox.hidden = true;
    if (agendarBtn) agendarBtn.hidden = true;
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = '¡Hoy es el gran día! Estamos celebrando 🎉';
    }
  }

  function showHistorico() {
    clearInterval(interval);
    if (countdownBox) countdownBox.hidden = true;
    if (agendarBtn) agendarBtn.hidden = true;
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = `Nos casamos el ${FORMATTER_FECHA.format(WEDDING_DATE)} 💍`;
    }
  }

  function update() {
    const diff = WEDDING_DATE.getTime() - Date.now();

    if (diff <= 0 && diff > -EN_CURSO_MS) {
      showEnCurso();
      return;
    }
    if (diff <= -EN_CURSO_MS) {
      showHistorico();
      return;
    }

    const totalSeconds = Math.max(Math.floor(diff / 1000), 0);
    tick(els.days, Math.floor(totalSeconds / 86400));
    tick(els.hours, Math.floor((totalSeconds % 86400) / 3600));
    tick(els.minutes, Math.floor((totalSeconds % 3600) / 60));
    tick(els.seconds, totalSeconds % 60);
  }

  update();
  if (!(countdownBox && countdownBox.hidden)) {
    interval = setInterval(update, 1000);
  }
}
