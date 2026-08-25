// Personaliza el mensaje segun los parametros de la URL:
// ?nombre=Familia+Perez&invitados=2
// ?nombre=Familia+Perez&invitados=familia  -> invitacion "sin numero fijo",
// para cuando se quiere invitar a toda la familia sin contar cuantos son.
const FAMILIA_KEYWORDS = ['familia', 'todos'];
const MAX_FAMILIA = 20; // tope tecnico del campo del RSVP, no se muestra en ningun texto

export function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre') || 'Invitado especial';
  const invitadosRaw = (params.get('invitados') || '').trim().toLowerCase();
  const esFamilia = FAMILIA_KEYWORDS.includes(invitadosRaw);
  const invitados = esFamilia ? null : (parseInt(invitadosRaw, 10) || 1);

  document.querySelectorAll('.nombre-invitado').forEach(el => { el.textContent = nombre; });
  if (!esFamilia) {
    document.querySelectorAll('.num-pases').forEach(el => { el.textContent = String(invitados); });
  }

  const rsvpNombre = document.getElementById('rsvp-nombre');
  if (rsvpNombre && params.get('nombre')) rsvpNombre.value = nombre;

  const mensajePases = document.getElementById('mensaje-pases');
  const rsvpHint = document.getElementById('rsvp-pases-hint');
  if (esFamilia) {
    if (mensajePases) mensajePases.textContent = 'Esta invitación es para ti y toda tu familia.';
    if (rsvpHint) rsvpHint.textContent = 'Puedes confirmar a toda tu familia.';
  }

  // El numero de "pases" de la URL es el tope de personas que puede
  // confirmar esta invitacion (ej: familia de 4 -> ?invitados=4). Con
  // ?invitados=familia no hay tope real, solo un limite tecnico generoso.
  const acompanantes = document.getElementById('rsvp-acompanantes');
  if (acompanantes) {
    acompanantes.max = esFamilia ? String(MAX_FAMILIA) : String(invitados);
    acompanantes.value = esFamilia ? '1' : String(invitados);
    // Valor al que se vuelve si marcan "no" y despues "si" de nuevo. Para
    // "familia" no usamos el tope tecnico (20) como default, se veria como
    // un numero exagerado sin sentido: volvemos a 1.
    acompanantes.dataset.default = esFamilia ? '1' : String(invitados);
  }
}
