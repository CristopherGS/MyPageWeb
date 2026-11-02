# SG Labs — Desarrollador freelance en Guatemala

Sitio estático (una sola página) en español e inglés; detecta el idioma del navegador y permite cambiarlo con el botón EN/ES, además del parámetro `?lang=es|en` para enlaces por idioma. Reposicionado para un desarrollador freelance en Guatemala, con la filosofía de propiedad total (el cliente es dueño del 100% del código, sin mensualidades). Los importes son ejemplos editables en `app.js` y no son cotizaciones reales.

Para cambiar la marca o el dominio:
- Marca «SG Labs»: en `index.html` (cabecera, pie y datos estructurados) y en `app.js` (`document.title`).
- Dominio `https://sglabs.lat`: en `index.html` (`canonical`, `hreflang`, Open Graph y JSON-LD), `robots.txt` y `sitemap.xml`.
- Imagen social opcional: añade un archivo `og-image.png` (1200×630) a la raíz; ya está referenciado en las etiquetas Open Graph/Twitter. Si lo agregas, inclúyelo también en la línea `COPY` del `Dockerfile`.

## Integración

1. Importa `n8n-telegram.json` en n8n. Configura las credenciales del bot en el nodo Telegram y reemplaza `REEMPLAZAR_CHAT_ID`. Inicia una conversación con el bot para que pueda enviarte mensajes.
2. Activa el flujo y copia la URL de producción del webhook. Configura `LEADS_WEBHOOK_URL` en el entorno de farmacia-api y reinicia la API. No guardes tokens en el sitio ni en el repositorio.
3. Sirve esta carpeta con HTTPS y configura el servidor web para enviar `/api/v1/public/leads` a farmacia-api en el mismo origen. El formulario requiere esta ruta. El webhook debe ser privado o tener protección de acceso a nivel de red; configura límites de tráfico y protección antispam en el proxy antes de hacerlo público.
4. Realiza una solicitud de prueba y comprueba que llega a Telegram. El webhook responde al recibir la solicitud, por lo que la confirmación no garantiza que Telegram la haya entregado; revisa los errores y reintentos en n8n.

## SEO

Ya incluido: título y descripción orientados a «desarrollador freelance en Guatemala», URL canónica, etiquetas geo (GT), Open Graph/Twitter, `hreflang` es/en, `robots.txt`, `sitemap.xml` y datos estructurados JSON-LD (`ProfessionalService` con ubicación en Ciudad de Guatemala + `FAQPage`).

Pasos finales para posicionar:
1. Publica con el dominio definitivo (si no es `sglabs.lat`, reemplázalo en los archivos indicados arriba).
2. Registra el sitio en Google Search Console y envía `https://sglabs.lat/sitemap.xml`.
3. Crea o reclama el perfil de **Google Business Profile** (negocio en Ciudad de Guatemala) con el mismo nombre y datos; es lo que más ayuda al posicionamiento local.
4. Consigue enlaces y menciones (redes, directorios locales) y mantén el nombre/ubicación consistentes.

Nota: ningún cambio garantiza una posición en buscadores; el posicionamiento depende de Google y toma tiempo.

## Coolify

Selecciona Dockerfile, directorio `/`, puerto expuesto `8081` y ruta de salud `/healthz`. Define la variable de ejecución `API_UPSTREAM` con la URL de la API existente, sin barra final ni ruta, por ejemplo `https://bknmed.sglabs.lat` si ese dominio es accesible desde el contenedor. Si se usa un nombre de red privada, ambas aplicaciones deben compartir red. Nginx reenvía `/api/` a la API. El backend necesita `LEADS_WEBHOOK_URL` con la URL de producción del flujo n8n.

### Dirección del backend

En la aplicación **MyPageWeb** de Coolify, abre Environment Variables y agrega una variable disponible en ejecución:

```text
API_UPSTREAM=https://DOMINIO-REAL-DE-TU-BACKEND
```

Sustituye el valor de ejemplo por el dominio real del backend, o por `http://NOMBRE-INTERNO:8080` si ambos contenedores comparten red. No incluyas `/api`, rutas, barra final ni credenciales. No uses `localhost`, porque apunta al contenedor de la web. Guarda y redespliega MyPageWeb. Si falta la variable, el contenedor no arrancará y explicará el problema en sus registros.

El navegador envía el formulario a `https://TU-DOMINIO-WEB/api/v1/public/leads`; Nginx lo reenvía al backend configurado. La URL que aparece en el navegador es la de la web, no revela el destino interno. Si Cloudflare desafía ese POST en el dominio de la web, cambiar API_UPSTREAM no elimina ese desafío: revisa Security Events y la regla correspondiente. Si el dominio público del backend también usa Cloudflare y desafía la conexión de Nginx, usa una dirección privada accesible o ajusta su regla.
