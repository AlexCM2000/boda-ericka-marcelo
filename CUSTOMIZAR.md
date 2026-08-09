# Cómo personalizar tu invitación

Todo el contenido de ejemplo (nombres "Ana & Carlos", fecha, lugares, etc.) está
marcado con comentarios `<!-- TODO: ... -->` en el código. Esta es la lista
completa de lo que debes reemplazar antes de enviarla.

## 1. Nombres, fecha y textos — [index.html](index.html)
Busca "Ana" y "Carlos" (aparecen en el sobre, portada, footer y `<title>`) y
reemplázalos por los nombres reales. Actualiza también los textos de mensaje,
padres/padrinos, dress code e itinerario directamente en el HTML.

## 2. Fecha del countdown — [js/countdown.js](js/countdown.js)
Cambia la constante `WEDDING_DATE` por la fecha/hora real (formato
`'YYYY-MM-DDTHH:MM:SS'`).

## 3. Botón "Agendar evento" — [index.html](index.html), sección `#fecha`
Ajusta el parámetro `dates=` del link de Google Calendar (formato
`YYYYMMDDTHHMMSS/YYYYMMDDTHHMMSS`) y el `location=`.

## 4. Fotos
Reemplaza estos archivos SVG placeholder por tus fotos reales (mismo nombre,
o cambia el `src` en `index.html`). Recomendado: JPG/WebP comprimido con
[Squoosh](https://squoosh.app):
- `assets/images/hero-bg.svg` → foto de portada
- `assets/images/galeria-1.svg` … `galeria-6.svg` → galería "Nosotros" (puedes agregar más `swiper-slide` copiando el patrón)
- `assets/images/ceremonia.svg`, `recepcion.svg` → fotos/iconos de las tarjetas de evento
- `assets/images/qr-placeholder.svg` → tu QR real de transferencia (genera uno gratis en cualquier web de QR)
- `assets/icons/favicon.svg` → tu propio monograma (opcional)
- `assets/images/sello.svg` → el sello del sobre animado. Si nos pasas tu propia
  imagen (ideal: circular o cuadrada, buena resolución, fondo simple), la
  reemplazamos aquí con el mismo nombre, o cambia el `src` del `<img>` dentro
  de `.envelope__seal` en `index.html`.

## 5. Ubicaciones (mapas) — [index.html](index.html), sección `#evento`
Cada botón "Ver ubicación" tiene atributos `data-lat` y `data-lng` con las
coordenadas del lugar. El modal muestra un mapa (OpenStreetMap, sin API key)
con un marcador exacto en ese punto, más un botón "Cómo llegar" que abre
Google Maps con direcciones reales.

Para obtener las coordenadas reales de tu ceremonia/recepción:
1. Busca el lugar en [Google Maps](https://maps.google.com).
2. Clic derecho sobre el punto exacto → aparecen las coordenadas (ej.
   `19.4342, -99.1332`) → clic para copiarlas.
3. Reemplaza `data-lat="..."` (primer número) y `data-lng="..."` (segundo
   número, con el signo negativo si aplica) en el botón correspondiente.
   También actualiza `data-name="..."` con el nombre real del lugar.

## 6. Datos bancarios — [index.html](index.html), sección `#regalos`
Reemplaza el banco, titular y número de cuenta de ejemplo.

## 7. Álbum para compartir fotos — [index.html](index.html), sección `#compartir`
Crea un álbum compartido en Google Photos y pega el link en el `href="#"`.

## 8. Música — assets/audio/
Agrega tu archivo con el nombre `assets/audio/cancion.mp3`. El reproductor ya
está conectado, no necesitas tocar código.

## 9. RSVP real (opcional) — [index.html](index.html) + [js/rsvp-form.js](js/rsvp-form.js)
Ahora mismo el formulario es solo visual. Para que te lleguen las respuestas:
1. Crea una cuenta gratis en [formspree.io](https://formspree.io) y copia tu ID.
2. Reemplaza `TU_ID` en el `action` del `<form id="rsvp-form">`.
3. En `js/rsvp-form.js` sigue las instrucciones del comentario al inicio del
   archivo para activar el envío real (son 5 líneas).

## 10. Personalización por invitado
Comparte links distintos por invitado con parámetros en la URL:
```
tudominio.com/?nombre=Familia+Pérez&invitados=2
```
El nombre y número de pases se muestran automáticamente en la sección de
mensaje y se prellenan en el formulario RSVP.

## 11. Ver los cambios en tu navegador
No hace falta instalar nada: abre `index.html` con la extensión **Live
Server** de VS Code (clic derecho → "Open with Live Server"), o corre
`npx serve` en esta carpeta.

## 12. Íconos
Todos los íconos son de [Phosphor Icons](https://phosphoricons.com) (peso
"light", línea fina). Si quieres cambiar alguno, busca el nombre en su sitio
y usa la clase `ph-light ph-<nombre>` (ej. `ph-light ph-heart`).

## 13. Colores y tiempos del sobre animado — [css/styles.css](css/styles.css)
Las clases `.envelope__*` controlan el sobre. Los colores salen de las
variables en [css/variables.css](css/variables.css) (cambia esas y se
actualiza todo el sitio). La velocidad de la animación se ajusta en
`js/main.js`, función `initEnvelope` (los valores `duration` de cada paso).

## 14. Publicar (deploy)
1. Sube esta carpeta a un repositorio de GitHub.
2. Conéctalo a [Netlify](https://netlify.com) o [Vercel](https://vercel.com) (plan gratis).
3. Listo — obtienes una URL `https://tu-invitacion.netlify.app` con HTTPS automático.
