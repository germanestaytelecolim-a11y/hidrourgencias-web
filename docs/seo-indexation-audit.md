# Auditoría SEO e indexación

## Matriz previa a la modificación de rutas

Ambas familias ofrecen destape de alcantarillado, diagnóstico, hidrojet de apoyo y atención de urgencias para inmuebles, comunidades y comercios del mismo sector. La plantilla legacy declara ese servicio en título, H1 y Service. La plantilla nueva utiliza el mismo servicio y audiencia con contexto territorial. Los textos no son idénticos; la intención sí. Se conservan las páginas de hidrojet, mantención y otros servicios.

Concón Centro y Centro Concón son el mismo sector. Belloto Norte/El Belloto Norte y Belloto Sur/El Belloto Sur son equivalencias separadas: nunca se fusionan Norte y Sur. Placilla y Curauma se mantienen separados, con sus destinos individuales dentro del grupo Placilla-Curauma (Valparaíso); la landing conjunta conserva su alcance más amplio. Reñaca sector Viña del Mar no se confunde con sus subsectores.

| URL antigua | URL definitiva | Ubicación comparada | Acción prevista |
|---|---|---|---|
| /zona/renaca-vina-del-mar | /destape-alcantarillado-renaca-vina-del-mar | Reñaca, Vina del Mar → Renaca, Vina del Mar | 301 directo |
| /zona/gomez-carreno-vina-del-mar | /destape-alcantarillado-gomez-carreno-vina-del-mar | Gómez Carreño, Vina del Mar → Gomez Carreno, Vina del Mar | 301 directo |
| /zona/forestal-vina-del-mar | /destape-alcantarillado-forestal-vina-del-mar | Forestal, Vina del Mar → Forestal, Vina del Mar | 301 directo |
| /zona/recreo-vina-del-mar | /destape-alcantarillado-recreo-vina-del-mar | Recreo, Vina del Mar → Recreo, Vina del Mar | 301 directo |
| /zona/chorrillos-vina-del-mar | /destape-alcantarillado-chorrillos-vina-del-mar | Chorrillos, Vina del Mar → Chorrillos, Vina del Mar | 301 directo |
| /zona/miraflores-vina-del-mar | /destape-alcantarillado-miraflores-vina-del-mar | Miraflores, Vina del Mar → Miraflores, Vina del Mar | 301 directo |
| /zona/achupallas-vina-del-mar | /destape-alcantarillado-achupallas-vina-del-mar | Achupallas, Vina del Mar → Achupallas, Vina del Mar | 301 directo |
| /zona/cerro-placeres-valparaiso | /destape-alcantarillado-cerro-placeres-valparaiso | Cerro Placeres, Valparaiso → Cerro Placeres, Valparaíso | 301 directo |
| /zona/cerro-baron-valparaiso | /destape-alcantarillado-cerro-baron-valparaiso | Cerro Barón, Valparaiso → Cerro Baron, Valparaíso | 301 directo |
| /zona/cerro-alegre-valparaiso | /destape-alcantarillado-cerro-alegre-valparaiso | Cerro Alegre, Valparaiso → Cerro Alegre, Valparaíso | 301 directo |
| /zona/playa-ancha-valparaiso | /destape-alcantarillado-playa-ancha-valparaiso | Playa Ancha, Valparaiso → Playa Ancha, Valparaíso | 301 directo |
| /zona/curauma-valparaiso | /destape-alcantarillado-curauma-placilla-curauma | Curauma, Valparaiso → Curauma, Placilla Curauma | 301 directo |
| /zona/placilla-valparaiso | /destape-alcantarillado-placilla-placilla-curauma | Placilla, Valparaiso → Placilla, Placilla Curauma | 301 directo |
| /zona/concon-centro | /destape-alcantarillado-centro-concon-concon | Concón Centro, Concon → Centro Concón, Concón | 301 directo |
| /zona/bosques-de-montemar-concon | /destape-alcantarillado-bosques-de-montemar-concon | Bosques de Montemar, Concon → Bosques de Montemar, Concón | 301 directo |
| /zona/centro-quilpue | /destape-alcantarillado-centro-quilpue-quilpue | Centro Quilpué, Quilpue → Centro Quilpue, Quilpue | 301 directo |
| /zona/belloto-norte-quilpue | /destape-alcantarillado-el-belloto-norte-quilpue | Belloto Norte, Quilpue → El Belloto Norte, Quilpue | 301 directo |
| /zona/belloto-sur-quilpue | /destape-alcantarillado-el-belloto-sur-quilpue | Belloto Sur, Quilpue → El Belloto Sur, Quilpue | 301 directo |
| /zona/centro-villa-alemana | /destape-alcantarillado-centro-villa-alemana-villa-alemana | Centro Villa Alemana, Villa Alemana → Centro Villa Alemana, Villa Alemana | 301 directo |
| /zona/penablanca-villa-alemana | /destape-alcantarillado-penablanca-villa-alemana | Peñablanca, Villa Alemana → Penablanca, Villa Alemana | 301 directo |


Se aplanarán también los alias históricos existentes que apuntan a estas páginas, sin cambiar su asociación territorial previa.

## Estado inicial comprobado en producción

Contacto y contacto?origen=prueba: HTTP 200, canonical https://hidrourgencias.cl/contacto, index/follow. El código genera origen en CTA; el formulario actual no lo lee ni precarga (no se elimina ninguna función existente). Se conservan los parámetros de campaña y eventos. Portal demostrativo: HTTP 200, index/follow incorrecto, ya excluido del sitemap. Sitemap: HTTP 200, 424 entradas. Robots: HTTP 200, Allow / y sitemap correcto. Ambas URLs de Concón Centro: HTTP 200 y canonical propio, duplicidad de intención confirmada.

## Cobertura

A: localidades del tablero de cobertura actual, sin ampliarlo. B: La Cruz, Cachagua y Zapallar son menciones de proximidad en los datos; no existe evidencia en el repositorio que confirme atención habitual. C: las solicitudes para esas localidades requieren confirmación de disponibilidad. Se conservarán las menciones con esa condición y se excluirán del areaServed habitual. La Cruz en el formulario es una sugerencia para describir la solicitud, no una promesa de cobertura.

## Ampliación previa: Mantagua

Se detectó la misma localidad asignada a Concón y Quintero. La [Municipalidad de Quintero](https://www.muniquintero.cl/index.php/2026/08/21/dideco-a-tu-barrio-en-quintero-genera-ahorro-economico-familiar-y-acerca-el-municipio-a-sectores-alejados/) identifica Mantagua como una de sus localidades. Comparación: mismo sector y servicio, mismos problemas, equipos y recomendaciones de `serviciosSeo`, sin propósito independiente; sólo cambia el contexto comunal generado. Se conserva Quintero y cada servicio por separado.

| URL antigua | URL definitiva | Acción prevista |
|---|---|---|
| /destape-alcantarillado-mantagua-concon | /destape-alcantarillado-mantagua-quintero | 301 |
| /destape-desagues-mantagua-concon | /destape-desagues-mantagua-quintero | 301 |
| /hidrojet-mantagua-concon | /hidrojet-mantagua-quintero | 301 |
| /destape-verticales-mantagua-concon | /destape-verticales-mantagua-quintero | 301 |
| /destape-horizontales-mantagua-concon | /destape-horizontales-mantagua-quintero | 301 |
| /destape-camaras-alcantarillado-mantagua-concon | /destape-camaras-alcantarillado-mantagua-quintero | 301 |
| /destape-edificios-mantagua-concon | /destape-edificios-mantagua-quintero | 301 |
| /mantencion-preventiva-redes-mantagua-concon | /mantencion-preventiva-redes-mantagua-quintero | 301 |

Ocho servicios confirmados en el catálogo (no nueve). No existe una ruta independiente de videoinspección: no se inventa ni se redirige.

## Editorial

Búsqueda en app, pages, components, lib y content: sin coincidencias activas para las cinco frases antiguas ni fechas 2020. No se reescriben casos históricos.

## Resultado final local — 16 de septiembre de 2026

Las acciones previstas en las matrices anteriores están implementadas y verificadas **en local**, no desplegadas. No se cambió CSS, branding ni formulario. Los únicos textos ajustados distinguen cobertura sujeta a disponibilidad.

| Comprobación | Resultado |
|---|---|
| `/contacto` y cinco combinaciones de parámetros | 200, un canonical limpio, mismo título, descripción y robots; formulario presente |
| Canonicals de páginas indexables | 924 páginas 200 con un canonical autorreferente HTTPS, sin conflictos de headers |
| Nuevas consolidaciones | 20 zonas y 8 variantes Mantagua-Concón → equivalente Mantagua-Quintero |
| Redirecciones territoriales comprobadas | 37 reglas: las 28 anteriores más 9 alias existentes; todas 301 → 200 en un salto |
| Parámetros en redirecciones | `origen` y `utm_source` conservados |
| Portal demostrativo | 200, `noindex, follow`; no se alteró autenticación, APIs ni formulario de acceso |
| Sitemap | 410 URLs únicas: 200, indexables, canonical propio; cero parámetros, redirecciones o noindex |
| Robots | 200, `Allow: /`, referencia a `https://hidrourgencias.cl/sitemap.xml`; sin cambios |
| Enlaces internos | 61.815 relaciones revisadas; cero destinos 404 y cero enlaces a redirecciones |
| Cobertura en navegador | Cachagua/Zapallar/La Cruz conservadas con disponibilidad; excluidas de `Service.areaServed` habitual |
| Formulario en navegador | Campos y selectores interactivos; validación activa; sin errores de consola. No se envió solicitud real ni se midió una conversión real |
| Tracking, WhatsApp, teléfono | Implementación preservada; auditoría de conversión de 10 rutas completada con HTTP 200 |
| `npm run lint` | PASS |
| `npm run build` | PASS, 958 páginas generadas |
| `npx tsc --noEmit` | PASS |
| `git diff --check` | PASS |
| `npm run audit:indexation` | PASS |
| `AUDIT_ALL_ROUTES=1 npm run audit:seo:runtime` | PASS; PowerShell: `$env:AUDIT_ALL_ROUTES='1'; npm run audit:seo:runtime` |
| `npx tsx scripts/audit-territorial-equivalence.ts` | PASS |
| `npm run audit:seo` | PASS después de corregir la clasificación de fragmentos compartidos; advertencias editoriales conservadas |
| `npm run test:seo` | PASS: cinco pruebas de regresión del control de cuerpos duplicados |

### Bloqueo inicial y resolución después de «continuar»

`scripts/audit-seo-routes.ts` considera bloqueante cualquier párrafo, oración o FAQ compartida. El contenido generado en `lib/seo-content-engine.ts`, consumido por `lib/seo-territorial.ts` y `app/[seoSlug]/page.tsx`, ya presenta esas repeticiones.

La comprobación con el contenido comunal original de Git y el generador original, antes de consolidar Mantagua, reproduce exactamente los conteos iniciales: 1.522 grupos de párrafos, 2.913 de oraciones, 115 de preguntas FAQ y 240 de respuestas FAQ repetidas. Después de consolidar Mantagua: 1.511, 2.897, 110 y 232 respectivamente. No hay títulos, H1 ni metadescripciones duplicados, ni pares por encima del umbral de similitud del propio auditor.

Ejemplo: la recomendación de evaluar hidrojet cuando existe grasa/sarro se comparte entre distintas páginas de servicios y sectores de Viña del Mar. El auditor también cuenta preguntas de contacto repetidas entre servicios de un mismo sector. Estos son grupos de fragmentos repetidos, no ese número de páginas idénticas ni prueba de una penalización de Google.

El primer intento se detuvo. Tras la instrucción de continuar, se corrigió el criterio del auditor: un fragmento compartido no equivale por sí solo a una página duplicada. Las cifras anteriores permanecen visibles en `editorialWarnings`; no se eliminaron del informe ni se reescribieron textos para disfrazar coincidencias.

Siguen bloqueando las identidades SEO duplicadas, secuencias de encabezados idénticas, contenido defectuoso y similitud documental excesiva. Además se comprueba el cuerpo principal sin depender de títulos o metadatos: copiarlo, reordenarlo o modificar superficialmente una copia bloquea el despliegue. El umbral existente de Jaccard sobre 5-gramas permanece en 0,90; no es un umbral de Google. Máxima similitud corporal observada: 0,788835; cuerpos duplicados: cero. Cinco pruebas verifican tanto casos legítimos como copias exactas y casi idénticas.

Referencia: [Google sobre canonicalización y contenido duplicado](https://developers.google.com/search/docs/crawling-indexing/canonicalization). Esta validación técnica no garantiza que Google seleccione el canonical ni certifica la calidad editorial de todas las landings. Los fragmentos repetidos quedan como trabajo editorial posterior.

### Alias anteriores aplanados

| Origen | Destino final |
|---|---|
| /zona/re%C3%B1aca-vina-del-mar | /destape-alcantarillado-renaca-vina-del-mar |
| /zona/g%C3%B3mez-carre%C3%B1o-vina-del-mar | /destape-alcantarillado-gomez-carreno-vina-del-mar |
| /zona/pe%C3%B1ablanca-villa-alemana | /destape-alcantarillado-penablanca-villa-alemana |
| /zona/maitencillo-puchuncavi | /destape-alcantarillado-maitencillo-puchuncavi |
| /zona/casablanca | /destape-alcantarillado-casablanca |
| /zona/centro-concon | /destape-alcantarillado-centro-concon-concon |
| /zona/costa-de-montemar-concon | /destape-alcantarillado-bosques-de-montemar-concon |
| /zona/belloto-quilpue | /destape-alcantarillado-el-belloto-sur-quilpue |
| /zona/olmo-concon | /destape-alcantarillado-colmo-concon |

Estos nueve alias conservan la asociación territorial que ya tenía el repositorio. No se reinterpretó Costa de Montemar como Bosques: se aplanó su redirección previa existente.

### URLs retiradas del sitemap

Se retiraron las 20 URLs `/zona/` de la primera matriz y las ocho variantes de Mantagua bajo Concón. Se mantienen sus destinos canónicos. El portal y las URLs con parámetros ya estaban fuera: no se atribuye una eliminación inexistente. El total cambia de 424 a 410 porque 14 destinos de las zonas ya estaban incluidos; se preservan los restantes y se deduplican.

### Archivos modificados o añadidos

- `next.config.ts`, `package.json`.
- `app/acceso-administradores-empresas/page.tsx`, `app/sitemap.ts`, `app/zona/[slug]/page.tsx`.
- `app/blog/[slug]/page.tsx`, `app/cobertura/page.tsx`, `app/servicios/[slug]/page.tsx`.
- `components/comuna-landing-page.tsx`, `components/territorial-landing-hero.tsx`.
- `lib/blog-problemas.ts`, `lib/comuna-landings.ts`, `lib/navigation.ts`, `lib/seo-territorial.ts`.
- Nuevos: `lib/territorial-canonical.ts`, `lib/coverage-scope.ts`, `scripts/audit-territorial-equivalence.ts`, `scripts/verify-seo-indexation.ts`, este informe.
- Auditorías corregidas: `scripts/audit-seo-routes.ts`, `scripts/audit-indexability.mjs`; nuevos `scripts/lib/seo-content-audit.ts` y `scripts/seo-content-audit.test.ts`. El auditor HTTP verifica también el destino y el número de saltos de los alias históricos.

Se conservaron sin modificar los archivos ajenos inicialmente sin seguimiento: `SEO_SITEMAP_HIPERLOCAL_FIX.md`, `public/guia tecnica/` y `public/images/PRINCIPAL/hidro/`. No se cambiaron variables de entorno, configuración Vercel, proveedor ni credenciales.

### Producción y comprobación pública

Estado antes de publicar: lint, build, TypeScript, cinco tests, auditoría SEO, auditoría de indexabilidad y comprobación HTTP de 924 páginas/37 redirecciones aprobados. El primer intento no desplegó. Se utiliza el procedimiento existente de Vercel, proyecto enlazado `hidrourgencias-web`, para el dominio `https://hidrourgencias.cl`.

Se comprobaron 61 URLs públicas (contacto normal/parametrizado, robots, sitemap, portal, los 28 orígenes nuevos y sus destinos): todas respondieron 200. Esto confirma que los nuevos 301 y el noindex del portal **todavía no están en producción**. El sitemap público conserva 424 entradas. No hay validación post-deploy, porque no hubo deploy.

Evidencias locales ignoradas por Git: `reports/seo-runtime-local.json`, `reports/search-console-indexing-audit.json`, `reports/seo-audit.json`, `reports/seo-audit-original-content.json`, `reports/production-not-deployed.json`.

### Google Search Console — después de resolver el bloqueo y desplegar

1. Volver a comprobar los HTTP públicos antes de cualquier solicitud de indexación.
2. Reenviar el sitemap y probar las URLs definitivas, contacto normal y con parámetros.
3. Solicitar indexación de los destinos prioritarios; comprobar que Google elige el canonical limpio de contacto.
4. Comprobar el noindex público del portal y esperar su nuevo rastreo; no bloquearlo en robots.
5. Supervisar las URLs antiguas como «Página con redirección» y las parametrizadas como duplicadas con canonical. Mantener las redirecciones permanentes.

No se accedió ni se enviaron cambios a Search Console.
