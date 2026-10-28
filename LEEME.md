# Estela · sitio web

Sitio de 7 páginas (más privacidad) para Estela, la agencia de comunicación de Valentina.
Trabajo práctico de Marketing Digital (Universidad Siglo 21), grupo Deriva.

## Cómo verlo
- En la compu: `node servidor.mjs` y abrir http://localhost:8084
- Se puede publicar tal cual en Vercel o Netlify (es HTML, CSS y JS, sin nada que compilar).

## Qué se edita y dónde
- **`js/datos.js`**: WhatsApp, mail, Instagram, ciudad, compromiso de respuesta, horarios de la llamada y precios. Todo lo que hay que confirmar con Valentina está ahí.
- `css/estela.css`: colores y tipografías (tema de mar; el acento cambia según el fondo con `--baliza`).
- `js/estela.js`: la baliza de la portada, el test de 3 segundos, la revisión de bio, los testimonios y el formulario.

## Cómo llegan las consultas
1. El formulario abre WhatsApp con el mensaje armado hacia el número de `datos.js`.
2. Además manda una copia al mail con FormSubmit. **La primera vez que alguien lo use, FormSubmit manda un mail para confirmar la dirección: hay que tocar el enlace de ese mail**; recién después llegan las copias.
3. Los eventos `test_completado`, `bio_revisada`, `horario_elegido` y `formulario_enviado` quedan en `window.dataLayer`, listos para Google Tag Manager o Analytics.

## Pendiente
- Foto de Valentina (hoy hay un ojo de buey con una "V").
- Instagram de Estela y dominio propio (`estela.ar` es de ejemplo).
- Confirmar ciudad, horarios, compromiso de respuesta y precios.
- Las marcas, los casos y los testimonios son inventados para el TP (así lo aclara el pie de cada página).
- Las páginas tienen `noindex` para que Google no las muestre mientras sean de prueba.
