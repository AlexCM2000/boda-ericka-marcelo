// Reproductor de musica de fondo: boton flotante fijo.
export function initAudioPlayer() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if (!audio || !btn) return { play: () => {} };

  function setPlaying(isPlaying) {
    btn.classList.toggle('playing', isPlaying);
    btn.setAttribute('aria-pressed', String(isPlaying));
    btn.setAttribute('aria-label', isPlaying ? 'Pausar musica de fondo' : 'Reproducir musica de fondo');
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));

  // El navegador bloquea el autoplay: se usa el click de "Ingresar" como gancho.
  return {
    play() { audio.play().catch(() => {}); },
  };
}
