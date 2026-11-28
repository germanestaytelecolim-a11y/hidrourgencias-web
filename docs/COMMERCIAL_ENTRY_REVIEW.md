# Revisión comercial local · 2026-11-28

Base de este cierre: `3e205ce922a9c6eb080f5b12cb5ff06b0aca717a`, sobre `7e9a23883af5c175bcb8deb80b9283a6db4a042b`. Rama: `feature/commercial-entry-redesign`, en el clon `hidrourgencias-commercial-20261126`. Se conserva el commit anterior. No hubo push, PR, merge ni despliegue.

## Comportamiento

- Portada con dos accesos prioritarios antes del texto explicativo; el H1 y el contenido técnico se conservan.
- Bienvenida en landings una vez por sesión. Escape, botón Cerrar y fondo permiten salir; diálogo nativo con foco modal y devolución de foco. Al navegar o recargar tras cerrar no vuelve a aparecer.
- Formularios independientes de urgencia y cotización, construidos con controles y validación compartidos. Ambos exigen aceptación expresa, con checkbox desmarcado y declaración/versionado en el mensaje. Urgencia exige además nombre, comuna, dirección, categoría y descripción; no contiene enlaces telefónicos.
- Mensaje de WhatsApp preparado únicamente tras envío válido y acción del usuario; no se envía automáticamente. Se conserva el número comercial. El mensaje expresa que se requiere confirmación de disponibilidad.
- `sessionStorage` guarda solo la marca de sesión; los datos del nuevo formulario permanecen únicamente en memoria mientras está abierto. No se incorporan analítica de campos, bases de datos ni endpoints.
- Favicon definitivo: gota azul con llave proporcionada por Gerencia; ICO con 16, 32 y 48 px, PNG de 96 px y Apple Touch Icon de 180 px. Reducción proporcional sin redibujar, sin cambiar el logotipo del encabezado. Referencias versionadas en ambos routers para renovar caché; hash HTTP verificado en inicio, landing, contacto y login administrativo. Sin manifest existente que corregir.
- Imagen principal autorizada: variantes WebP de 480/768/1254 px con 60.362/126.736/254.496 bytes. Se conserva el encuadre completo y se identifica como imagen comercial ilustrativa. Los dos PNG originales quedan fuera del repositorio; hashes de procedencia y salidas en `APPROVED_COMMERCIAL_ASSETS.json`. La fotografía anterior permanece en `public/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.54.35 AM.webp` para reversión.

## Evidencia

- Node.js `v24.22.3`; Next.js `16.4.6`; compilación webpack satisfactoria (1036 páginas estáticas).
- 11 pruebas focalizadas aprobadas: obligatoriedad de urgencia, términos, mensaje y destino de WhatsApp, cotización, rutas de bienvenida, conversión existente y cobertura/canonical.
- TypeScript y ESLint sin errores. Advertencia heredada de Cache-Control para `/_next/static` e `inlineCss` experimental: no modificados.
- Chrome: bienvenida directa en Quillota, cierre Escape, navegación a Concón y recarga sin repetición; reapertura de ambos formularios; checkbox inicialmente desmarcado y obligatorio; sin llamadas dentro del formulario urgente. No se envió ninguna solicitud comercial.
- Revisión visual a 360 y 390 px, tablet 768 px y escritorio 1440 px; menú móvil, diálogos desplazables y tarjetas. La barra fija de portada sustituye visualmente a la anterior para evitar superposición. Sin errores de consola observados.
- Comparación HTTP reproducible: `scripts/verify-commercial-http.mjs`, línea base HTTP del commit `3e205ce` capturada antes de recompilar y guardada fuera de Git. Servidor final en 3133. Resultados en `COMMERCIAL_HTTP_EVIDENCE.json`. No sigue redirecciones; usa el canonical de Forestal porque `/zona/forestal-vina-del-mar` conserva su redirección 301 existente.
- Los props son iguales, no solo su tamaño: `__NEXT_DATA__` conserva 119.352 bytes; se conservan enlaces de blog, casos y cobertura. Canonical de inicio, Quillota y contacto comprobados. Sitemap, robots, funcionalidades administrativas y contenido territorial no tienen diff.

## Archivos

Archivos de este cierre: `app/favicon.ico`, `app/layout.tsx`, `pages/_document.tsx`, `components/HeroUrgencias.tsx`, `components/commercial-entry.tsx`, `components/service-terms.tsx`, `lib/commercial-entry.ts`, `lib/commercial-entry.test.ts`, `styles/commercial-entry.css`, `public/apple-touch-icon.png`, `public/favicon-96.png`, tres variantes `public/images/commercial/servicio-aprobado-*.webp`, `scripts/prepare-approved-commercial-assets.mjs`, `scripts/verify-commercial-http.mjs`, esta revisión, `docs/APPROVED_COMMERCIAL_ASSETS.json` y `docs/COMMERCIAL_HTTP_EVIDENCE.json`.

## Cierre y límites de evidencia

1. Resuelta la aceptación implícita por autorización de Gerencia: se sustituyó únicamente la última cláusula, sin cambiar cláusulas económicas, garantía u obligaciones. Referencia: `texto-web-2026-11-28-aceptacion-expresa`. El checkbox y la declaración de WhatsApp no se presentan como prueba legal concluyente ni registro de recepción.
2. Ambos archivos de imagen proporcionados se incorporaron mediante variantes estáticas, sin generación nueva, retoque del logotipo o recorte del encuadre.
3. La prueba prepara y valida el mensaje sin enviarlo al teléfono comercial. No acredita recepción, atención o contratación. No hay medición nueva de conversiones. En Chrome se comprobó que una cotización completa con términos desmarcados mantiene el formulario bloqueado.
4. Validación visual focalizada a 360/390 px y escritorio; tablet y teclado se reutilizan de la validación anterior cuando el código no cambió. No se afirma mejora de Core Web Vitals ni auditoría completa de accesibilidad.

## Costos y reversión

Sin dependencias, funciones, bases de datos o servicios nuevos. Compilación con las mismas rutas; datos serializados constantes. Imagen e iconos son archivos estáticos, sin procesamiento en tiempo real. La fotografía previa pesa 114.440 bytes: el WebP de 768 px añade 12.296 bytes y el de 1254 px añade 140.056; el de 480 px reduce 54.078 bytes. Chrome a 390 px seleccionó la variante de 768 px; no descarga las tres por diseño de `srcSet`. Respecto al PNG aprobado de 2.919.868 bytes, todas las variantes reducen transferencia. Las tres nuevas variantes almacenan en total 441.594 bytes. El uso real de Vercel depende del tráfico, densidad de pantalla y plan; no se afirma costo cero. No se modificaron credenciales o infraestructura.

Reversión del cierre: revertir su nuevo commit para recuperar `3e205ce`, incluidos fotografía y favicon anteriores. Para recuperar toda la versión productiva previa al rediseño, base `7e9a238` mediante una rama separada. Cualquier publicación/reversión remota requiere autorización; no hay migraciones ni datos que revertir.

Dictamen: APTO para preparar PR tras autorización independiente de publicación. El desarrollo local queda cerrado; este dictamen no autoriza push, PR, merge ni despliegue.
