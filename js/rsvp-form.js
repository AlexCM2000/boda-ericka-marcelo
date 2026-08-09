// Formulario RSVP: validacion en tiempo real + envio real a Formspree
// (fuente de verdad para el correo y la confirmacion en pantalla) y, en
// paralelo, una copia "best effort" a una Google Sheet via Apps Script
// para llevar el control en una hoja de calculo.
//
// SHEET_WEBHOOK_URL: pega aqui la URL de tu Web App de Google Apps Script
// (termina en /exec). Si la dejas vacia, simplemente no se manda copia a
// ninguna hoja y el RSVP sigue funcionando normal solo con Formspree.
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyt3jZDOGjjnhrl0kKB_NLYbq5WlLabc2DWKlGDspZCtb6WV6d0XXjvg554Z9y0ZKfMvQ/exec';

export function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  const success = document.getElementById('rsvp-success');
  const successMsg = document.getElementById('rsvp-success-msg');
  const networkError = document.getElementById('rsvp-network-error');
  const nombreGroup = form.querySelector('#rsvp-nombre').closest('.form-group');
  const radioGroup = form.querySelector('.form-group--radio');
  const acompanantesInput = form.querySelector('#rsvp-acompanantes');
  const acompanantesGroup = document.getElementById('rsvp-acompanantes-group');
  const submitBtn = form.querySelector('button[type="submit"]');

  // El campo "cuantas personas asistiran" solo importa si la respuesta es "si".
  function syncAcompanantesVisibility() {
    const asistencia = form.querySelector('input[name="asistencia"]:checked');
    const asiste = asistencia && asistencia.value === 'si';
    acompanantesGroup.hidden = !asiste;
  }
  form.querySelectorAll('input[name="asistencia"]').forEach((r) => {
    r.addEventListener('change', () => {
      radioGroup.classList.remove('invalid');
      syncAcompanantesVisibility();
    });
  });
  syncAcompanantesVisibility();

  function validate() {
    let valid = true;

    const nombre = form.nombre.value.trim();
    nombreGroup.classList.toggle('invalid', !nombre);
    if (!nombre) valid = false;

    const asistencia = form.querySelector('input[name="asistencia"]:checked');
    radioGroup.classList.toggle('invalid', !asistencia);
    if (!asistencia) valid = false;

    if (asistencia && asistencia.value === 'si') {
      const max = parseInt(acompanantesInput.max, 10) || 1;
      const cantidad = parseInt(acompanantesInput.value, 10);
      const enRango = Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= max;
      acompanantesGroup.classList.toggle('invalid', !enRango);
      if (!enRango) valid = false;
    } else {
      acompanantesGroup.classList.remove('invalid');
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    networkError.classList.remove('is-visible');
    submitBtn.disabled = true;

    // Copia a la Google Sheet: no bloquea ni afecta el resultado que ve el
    // usuario. Apps Script no deja leer la respuesta entre dominios, asi
    // que la mandamos "a ciegas" (modo no-cors) y seguimos de largo.
    if (SHEET_WEBHOOK_URL) {
      fetch(SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form),
      }).catch(() => {});
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Error al enviar');

      const asiste = form.querySelector('input[name="asistencia"]:checked').value === 'si';
      successMsg.textContent = asiste
        ? '¡Gracias por confirmar! Nos vemos en la boda.'
        : 'Gracias por avisarnos. ¡Te vamos a extrañar ese día!';

      form.hidden = true;
      success.hidden = false;

      if (asiste && window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8A9A7E', '#C9D2C0', '#FBFBF8'],
        });
      }
    } catch {
      networkError.classList.add('is-visible');
      submitBtn.disabled = false;
    }
  });

  form.querySelector('#rsvp-nombre').addEventListener('input', () => {
    nombreGroup.classList.remove('invalid');
  });
  acompanantesInput.addEventListener('input', () => {
    acompanantesGroup.classList.remove('invalid');
  });
}