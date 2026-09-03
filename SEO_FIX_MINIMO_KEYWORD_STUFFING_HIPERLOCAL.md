# Correccion minima de keyword stuffing hiperlocal

Fecha: 2026-09-03

Rama: `codex/landing-visual-redesign`

## Causa encontrada

El problema venia de dos puntos comunes:

- `lib/seo-content-engine.ts`: la plantilla programatica reutilizaba muchas veces el mismo patron `{servicio} en {sector}, {comuna}` en parrafos, headings, CTA y FAQ.
- `lib/comuna-landings.ts`: el alcance de landings estaticas se componia desde `serviceName` y luego algunas funciones volvian a agregar `en {comuna}`, generando textos como `destape de alcantarillado en Maitencillo en Maitencillo`.
- `lib/navigation.ts`: la navegacion de cobertura dependia solo de `zonas-detalle`; Quintero y Puchuncavi tenian landings activas en datos/rutas SEO, pero no sectores en ese origen.

## Archivos modificados

- `lib/seo-content-engine.ts`
- `lib/comuna-landings.ts`
- `lib/navigation.ts`
- `components/site-header.tsx`

## Por que el cambio fue minimo

No se cambiaron URLs, rutas, sitemap, redirects, metadata estabilizada ni componentes de layout. La correccion se aplico en los helpers/plantillas que generan el contenido repetitivo y en el agregador central de navegacion territorial.

## Ejemplos antes/despues

- Antes: `Cada solicitud de destape de alcantarillado en Loncura, Quintero... En destape de alcantarillado en Loncura, Quintero...`
- Despues: `Cada solicitud de servicio sanitario de urgencia en Loncura, Quintero... La atencion en Loncura considera...`
- Antes: `destape de alcantarillado en Maitencillo en Maitencillo`
- Despues: `destape de alcantarillado en Maitencillo`
- Antes: `rutas territoriales utiles fuera del sitemap`
- Despues: `zonas proximas con servicio disponible`
- Antes: Quintero/Puchuncavi podian mostrar `Sin sectores con landing propia publicados.`
- Despues: Quintero muestra Centro Quintero, Loncura, Ritoque, Mantagua, Santa Adela y El Bato; Puchuncavi muestra Maitencillo y los sectores de datos/rutas activas.

## Rutas revisadas

- `/destape-alcantarillado-casablanca`
- `/destape-alcantarillado-centro-villa-alemana`
- `/destape-alcantarillado-loncura-quintero`
- `/destape-alcantarillado-centro-quintero-quintero`
- `/destape-alcantarillado-maitencillo-puchuncavi`
- `/destape-alcantarillado-quintero`
- `/destape-alcantarillado-puchuncavi`
- `/destape-alcantarillado-quilpue`
- `/destape-alcantarillado-valparaiso`

## Validaciones ejecutadas

- `npm run lint`: OK
- `npx tsc --noEmit`: OK
- `npm run audit:seo`: falla por duplicidad editorial global preexistente/amplia; queda en 0 para URLs duplicadas, slugs duplicados, conflictos de rutas, faltantes de sitemap, redirects criticos, page_id=12, frases defectuosas y similitud excesiva.
- `npm run build`: OK, genero 966 paginas estaticas.
- `git diff --check`: OK

## Commit y deployment

- Commit del fix: `aa74f56` (`Reduce keyword stuffing hiperlocal con fix minimo`).
- Push: `codex/landing-visual-redesign` y `main` quedaron apuntando a `aa74f56` en `origin`.
- Deployment Vercel manual: la ejecucion `npx vercel --prod --yes` respondio `Not authorized` en esta sesion local.
- Deployment Vercel por Git: no confirmado desde esta sesion. Tras empujar `main`, `https://hidrourgencias.cl/` siguio sirviendo contenido anterior en rutas programaticas cacheadas.
- URL de produccion validada: `https://hidrourgencias.cl/`
- Estado de produccion al cierre de esta revision: redirecciones criticas OK, pero nuevo contenido del fix todavia no promovido/visible en las rutas programaticas revisadas.

## Cantidad final de paginas generadas

- Build Next.js: 966 paginas estaticas generadas.
- Auditor SEO: 952 URLs conocidas generadas, 831 URLs programaticas generables, 421 URLs en sitemap.

## Riesgos pendientes

- `npm run audit:seo` mantiene salida 1 por reglas amplias de duplicidad editorial (`exactSeoParagraphs`, `repeatedSeoSentences`, `duplicateSeoFaqQuestions`, `duplicateSeoFaqAnswers`). Corregirlo completo requiere una revision editorial mayor de la matriz programatica y no corresponde al alcance minimo solicitado.
- Las landings estaticas de comuna redujeron la repeticion exacta principal, pero conservan la keyword en posiciones SEO visibles para mantener intencion de busqueda.
- Produccion requiere revisar Vercel con una sesion autorizada o el panel del proyecto, porque la CLI local no pudo promover el deploy y el sitio siguio mostrando contenido anterior despues del push a `main`.

## Recomendacion

Como el build esta aprobado y no se tocaron redirects ni URLs, el cambio esta listo en Git. El siguiente paso operativo es entrar a Vercel con permisos del proyecto `hidrourgencias-web`, confirmar o reintentar el production deployment de `aa74f56`, y luego pedir reindexacion en Search Console para las rutas prioritarias.
