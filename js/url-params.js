// Personaliza el mensaje segun los parametros de la URL:
// ?nombre=Familia+Perez&invitados=2
export function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre') || 'Invitado especial';
  const invitados = parseInt(params.get('invitados'), 10) || 1;

  document.querySelectorAll('.nombre-invitado').forEach(el => { el.textContent = nombre; });
  document.querySelectorAll('.num-pases').forEach(el => { el.textContent = String(invitados); });

  const rsvpNombre = document.getElementById('rsvp-nombre');
  if (rsvpNombre && params.get('nombre')) rsvpNombre.value = nombre;

  // El numero de "pases" de la URL es el tope de personas que puede
  // confirmar esta invitacion (ej: familia de 4 -> ?invitados=4).
  const acompanantes = document.getElementById('rsvp-acompanantes');
  if (acompanantes) {
    acompanantes.max = String(invitados);
    acompanantes.value = String(invitados);
  }
}
