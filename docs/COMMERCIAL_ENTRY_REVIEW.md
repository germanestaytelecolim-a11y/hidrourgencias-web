# Revisión comercial local · 2026-11-28

Base remota comprobada: `7e9a23883af5c175bcb8deb80b9283a6db4a042b`. Rama: `feature/commercial-entry-redesign`, en el clon `hidrourgencias-commercial-20261126`. Las ramas comerciales y GSC previas se conservan. No hubo push, PR, merge ni despliegue.

## Comportamiento

- Portada con dos accesos prioritarios antes del texto explicativo; el H1 y el contenido técnico se conservan.
- Bienvenida en landings una vez por sesión. Escape, botón Cerrar y fondo permiten salir; diálogo nativo con foco modal y devolución de foco. Al navegar o recargar tras cerrar no vuelve a aparecer.
- Formularios independientes de urgencia y cotización, construidos con controles y validación compartidos. Urgencia exige nombre, comuna, dirección, categoría, descripción y términos; no contiene enlaces telefónicos.
- Mensaje de WhatsApp preparado únicamente tras envío válido y acción del usuario; no se envía automáticamente. Se conserva el número comercial. El mensaje expresa que se requiere confirmación de disponibilidad.
- `sessionStorage` guarda solo la marca de sesión; los datos del nuevo formulario permanecen únicamente en memoria mientras está abierto. No se incorporan analítica de campos, bases de datos ni endpoints.
- Icono ICO de 48 px y Apple Touch Icon de 180 px derivados mediante reducción del logotipo oficial existente; original intacto. Referencias en ambos routers. Sin manifest existente que corregir.

## Evidencia

- Node.js `v24.22.3`; Next.js `16.4.6`; compilación webpack satisfactoria (1036 páginas estáticas).
- 11 pruebas focalizadas aprobadas: obligatoriedad de urgencia, términos, mensaje y destino de WhatsApp, cotización, rutas de bienvenida, conversión existente y cobertura/canonical.
- TypeScript y ESLint sin errores. Advertencia heredada de Cache-Control para `/_next/static` e `inlineCss` experimental: no modificados.
- Chrome: bienvenida directa en Quillota, cierre Escape, navegación a Concón y recarga sin repetición; reapertura de ambos formularios; checkbox inicialmente desmarcado y obligatorio; sin llamadas dentro del formulario urgente. No se envió ninguna solicitud comercial.
- Revisión visual a 360 y 390 px, tablet 768 px y escritorio 1440 px; menú móvil, diálogos desplazables y tarjetas. La barra fija de portada sustituye visualmente a la anterior para evitar superposición. Sin errores de consola observados.
- Comparación HTTP reproducible: `scripts/verify-commercial-http.mjs`, servidores locales base 3128 y final 3131. Resultados en `COMMERCIAL_HTTP_EVIDENCE.json`. No sigue redirecciones; usa el canonical de Forestal porque `/zona/forestal-vina-del-mar` conserva su redirección 301 existente.
- Se comparan datos de portada con una compilación previa local de `f87a476`, cuyo árbol coincide con el merge base. Los props son iguales, no solo su tamaño; se conservan enlaces de blog, casos y cobertura. Canonical de inicio, Quillota y contacto comprobados. Sitemap, robots y contenido territorial no tienen diff.

## Archivos

`app/favicon.ico`, `app/layout.tsx`, `pages/_app.tsx`, `pages/_document.tsx`, `components/EmergencyAlertModalGate.tsx`, `components/HeroUrgencias.tsx`, `components/HomePageContent.tsx`, `components/ServiciosGrid.tsx`, `components/commercial-entry.tsx`, `lib/commercial-entry.ts`, `lib/commercial-entry.test.ts`, `styles/commercial-entry.css`, `public/apple-touch-icon.png`, `scripts/verify-commercial-http.mjs`, esta revisión y `docs/COMMERCIAL_HTTP_EVIDENCE.json`.

## Condiciones antes de publicar

1. Gerencia debe confirmar la versión comercial de los términos: se reutilizó el texto existente y se identificó como `texto-web-2026-11-28` (referencia de esta revisión, no fecha de aprobación legal). Su última cláusula declara aceptación por contacto; requiere revisión para concordar con la aceptación expresa del nuevo flujo. No se reescribió el documento legal. El checkbox y la declaración en WhatsApp no son prueba legal concluyente ni registro de recepción.
2. No se incorporó la nueva imagen generada: falta el archivo local y la aprobación específica de uso. Permanece la fotografía real existente.
3. La prueba prepara y valida el mensaje sin enviarlo al teléfono comercial. No acredita recepción, atención o contratación. No hay medición nueva de conversiones.
4. Validación visual no sustituye una auditoría completa de accesibilidad ni una prueba en dispositivos físicos. El alcance fue focalizado.

## Costos y reversión

Sin dependencias, funciones, almacenamiento o servicios nuevos. Compilación con las mismas rutas; pequeño aumento de JS/CSS cliente y transferencia HTML; datos serializados constantes. Los iconos son estáticos, sin procesamiento en tiempo real. La imagen principal y su mecanismo de entrega se conservan. El uso real de Vercel depende del tráfico y plan; no se afirma costo cero. No se modificaron credenciales o infraestructura.

Reversión local: volver a la base `7e9a238` mediante otra rama, conservando este commit. Si se publicara en el futuro, revertir el commit mediante PR autorizado; no requiere revertir datos ni migraciones.

Dictamen: APTO CON CONDICIONES para revisión; publicación pendiente de revisión de términos, conformidad visual y autorización independiente.
