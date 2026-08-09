// Cuenta regresiva hasta la fecha de la boda.
const WEDDING_DATE = new Date('2026-09-12T11:00:00');

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
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };
  if (!els.days) return;

  function update() {
    const diff = WEDDING_DATE.getTime() - Date.now();
    const totalSeconds = Math.max(Math.floor(diff / 1000), 0);

    tick(els.days, Math.floor(totalSeconds / 86400));
    tick(els.hours, Math.floor((totalSeconds % 86400) / 3600));
    tick(els.minutes, Math.floor((totalSeconds % 3600) / 60));
    tick(els.seconds, totalSeconds % 60);

    if (diff <= 0) clearInterval(interval);
  }

  update();
  const interval = setInterval(update, 1000);
}
