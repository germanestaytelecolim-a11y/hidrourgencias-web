# Deploy SEO revision sanitaria precompra

## Fecha

2026-08-27T19:52:22-04:00

## Rama y commit

- Rama de deploy: `codex/seo-revision-sanitaria-precompra`
- Commit: `17e112a0e2655f977cec393231caf37c9bab2bc8`
- Mensaje: `Corrige coherencia SEO de revision sanitaria precompra`

## Archivos incluidos en el commit

- `SEO_ANALISIS_TECNICO_PROPIEDAD_FIX.md`
- `app/servicios/[slug]/page.tsx`
- `components/ServiciosGrid.tsx`
- `lib/blog-data.ts`
- `lib/servicios.ts`
- `lib/site-config.ts`

## Validaciones previas al deploy

- `npm run lint`: PASS
- `npx tsc --noEmit`: PASS
- `npm run audit:seo`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Build

- Next.js: `16.2.3`
- Paginas generadas en worktree limpio: `959`
- Vercel build: PASS
- Deployment ID: `dpl_AsAc5EiWZ4xcoh6tdBmeNATPiPk2`
- Deployment URL: `https://hidrourgencias-djt2vzkyq-germanestaytelecolim-9238s-projects.vercel.app`
- Alias productivo: `https://hidrourgencias.cl`
- Estado: `READY`

## URL final en produccion

`https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`

## Validacion usuario normal

- HTTP: `200`
- Title: `Revisión sanitaria precompra, preventa y arriendo | Hidrourgencias SpA`
- H1: `Revisión sanitaria precompra, preventa y arriendo`
- Canonical: `https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`
- Robots: `index, follow`
- JSON-LD: `Service` presente

## Validacion Googlebot

- HTTP: `200`
- Title: `Revisión sanitaria precompra, preventa y arriendo | Hidrourgencias SpA`
- H1: `Revisión sanitaria precompra, preventa y arriendo`
- Canonical: `https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`
- Robots: `index, follow`
- JSON-LD: `Service` presente

## Sitemap

- `https://hidrourgencias.cl/sitemap.xml`: HTTP `200`
- URL objetivo presente: `1`
- Variantes con `www`, `http`, parametros o duplicados: `0`

## Robots

- `https://hidrourgencias.cl/robots.txt`: HTTP `200`
- Sitemap declarado: `https://hidrourgencias.cl/sitemap.xml`

## Redirecciones criticas

- `https://www.hidrourgencias.cl/`: `308` permanente hacia `https://hidrourgencias.cl/`, final `200`
- `https://hidrourgencias.cl/?page_id=12&utm_source=google&gclid=test-click&fbclid=test-social`: `301` hacia `https://hidrourgencias.cl/?utm_source=google&gclid=test-click&fbclid=test-social`, final `200`
- `https://hidrourgencias.cl/hidrojet-concon`: `200`, sin redireccion

## Search Console

Pasos pendientes manuales:

1. Inspeccionar `https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`.
2. Presionar `Probar URL publicada`.
3. Confirmar URL disponible para Google, indexacion permitida, canonical correcto y ausencia de `noindex`.
4. Solicitar indexacion.
