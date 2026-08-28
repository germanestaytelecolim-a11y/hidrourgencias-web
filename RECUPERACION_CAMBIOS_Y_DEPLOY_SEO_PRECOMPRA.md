# Recuperacion de cambios recientes y deploy SEO precompra

## Causa raiz

El deploy SEO de revision sanitaria precompra se ejecuto desde un worktree limpio separado, en la rama `codex/seo-revision-sanitaria-precompra`, basado en el commit `5b58d2e47b72a6042c0246ea8e4c22fbd870e1de`.

Ese worktree no contenia el bloque de cambios locales sin commit que seguia presente en `C:\Users\Alumno\Desktop\hidrourgencias-next`. Por eso produccion quedo con la correccion SEO, pero sin las mejoras recientes del panel administrativo, casos dinamicos, gateway y contenido relacionado.

## Deployment involucrado

- Deployment SEO acotado: `dpl_AsAc5EiWZ4xcoh6tdBmeNATPiPk2`
- URL: `https://hidrourgencias-djt2vzkyq-germanestaytelecolim-9238s-projects.vercel.app`
- Alias: `https://hidrourgencias.cl`
- Estado: `READY`

## Deployment final recuperado

- Preview: `dpl_FPdwyydbhCKikmwQ8xi7KRCk4xzc`
- Preview URL: `https://hidrourgencias-krti1gn2f-germanestaytelecolim-9238s-projects.vercel.app`
- Production: `dpl_ANZS7nEih8vN1gaJ9ANjehy9DhdK`
- Production URL: `https://hidrourgencias-7n9gx9vql-germanestaytelecolim-9238s-projects.vercel.app`
- Alias: `https://hidrourgencias.cl`
- Estado: `READY`

## Referencia historica

- Deployment con mejoras recientes: `dpl_BVq1A5aoZxrz1JqgSc3inms6Z2PQ`
- URL: `https://hidrourgencias-63ppyd9hy-germanestaytelecolim-9238s-projects.vercel.app`
- Fecha: 2026-08-25 05:21:04 -04:00
- Estado: `READY`

## Cambios recuperados

- Nuevo panel `/admin` con login propio y sin GitHub como acceso principal.
- APIs administrativas para login, logout, media, trabajos, blog y cambio de password.
- Persistencia con PostgreSQL y media en Vercel Blob.
- Casos recientes publicados desde admin y casos historicos importables/editables.
- Integracion de casos dinamicos en Home, casos, servicios y landings.
- Blog editable y mezcla segura de posts legacy/admin.
- Gateway de urgencias con formulario contextual, sessionStorage, WhatsApp y llamada.
- Bloque de RRSS con Facebook, Instagram, YouTube y TikTok donde estaba implementado.
- Navegacion/cobertura con rutas `/servicios`, `/cobertura` y `/contacto`.
- Redirecciones legacy de zonas y conservacion de `page_id=12`.
- Exclusion de carpetas operativas locales mediante `.vercelignore`.

## SEO precompra preservado

- URL: `https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`
- Title: `Revisión sanitaria precompra, preventa y arriendo | Hidrourgencias SpA`
- H1: `Revisión sanitaria precompra, preventa y arriendo`
- Canonical: `https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`
- Robots: `index, follow`
- JSON-LD: `Service`
- Sitemap: una unica URL canonica.

## Validaciones locales antes del commit

- `npm run lint`: PASS
- `npx tsc --noEmit`: PASS
- `npm run audit:seo`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Paginas generadas: `966`

## Validacion local de navegador

- Home: PASS
- Casos de exito: PASS
- Blog: PASS
- Landing Vina del Mar: PASS
- Admin login: PASS, sin GitHub
- Precompra: PASS
- Overflow horizontal: `0` en rutas revisadas
- WhatsApp: presente en rutas comerciales
- 16 enlaces `/servicios/*` en landing piloto: PASS

## Archivos recuperados

Ver commit final de recuperacion para el listado exacto de archivos. Se excluyeron archivos `.env`, caches locales, `reports/` generados ignorados y carpetas operativas privadas.

## Search Console

Tras el deploy final, inspeccionar:

`https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias`

Usar `Probar URL publicada` y luego `Solicitar indexacion` cuando Google confirme title, canonical, indexabilidad y contenido actualizado.
