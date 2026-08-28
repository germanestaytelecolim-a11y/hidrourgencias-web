# Correccion SEO de /hidrojet-concon

## Diagnostico

La ruta `/hidrojet-concon` existe como pagina estatica en App Router (`app/hidrojet-concon/page.tsx`) y consume datos centralizados desde `lib/comuna-landings.ts`.

La causa probable del conflicto era una combinacion de senales historicas y senales actuales incompletamente alineadas:

- El titulo SEO anterior de la landing no coincidia exactamente con la intencion final solicitada para "Hidrojet en Concon".
- Open Graph y Twitter heredaban el H1 mediante la plantilla general, no un titulo social explicito de hidrojet.
- El JSON-LD `Service` no declaraba un `name` propio para "Hidrojet en Concon" ni una URL de servicio explicita.
- Algunos enlaces internos hacia `/hidrojet-concon` usaban anchors genericos sin acentuacion ni formulacion consistente.

No se detecto una redireccion desde `/hidrojet-concon` hacia una URL de destape ni una canonical hacia otra landing.

## Archivos modificados

- `lib/comuna-landings.ts`
- `components/comuna-landing-page.tsx`
- `lib/blog-data.ts`
- `lib/blog-problemas.ts`

## Metadata final aplicada

```ts
title: "Hidrojet en Concón | Limpieza hidrodinámica de redes | Hidrourgencias SpA"
description: "Servicio profesional de hidrojet en Concón para limpieza hidrodinámica de redes sanitarias, eliminación de grasa, sarro, sedimentos y obstrucciones complejas. Atención técnica en Concón y sectores cercanos."
```

El titulo de `/hidrojet-concon` se declara como `absolute` para evitar que el template global agregue una segunda vez `| Hidrourgencias SpA`.

## Canonical final

```html
<link rel="canonical" href="https://hidrourgencias.cl/hidrojet-concon" />
```

## Open Graph y Twitter

Open Graph y Twitter Cards quedaron alineados con hidrojet:

- `og:title`: `Hidrojet en Concón | Limpieza hidrodinámica de redes | Hidrourgencias SpA`
- `og:description`: `Servicio profesional de hidrojet en Concón para limpieza de redes sanitarias, eliminación de grasa, sarro, sedimentos y obstrucciones complejas.`
- `og:url`: `https://hidrourgencias.cl/hidrojet-concon`
- `twitter:title`: `Hidrojet en Concón | Limpieza hidrodinámica de redes | Hidrourgencias SpA`
- `twitter:description`: `Servicio profesional de hidrojet en Concón para limpieza de redes sanitarias, eliminación de grasa, sarro, sedimentos y obstrucciones complejas.`

## JSON-LD final

La ruta renderiza un schema `Service` especifico:

```json
{
  "@type": "Service",
  "name": "Hidrojet en Concón",
  "serviceType": "Limpieza hidrodinámica de redes sanitarias",
  "areaServed": {
    "@type": "City",
    "name": "Concón"
  },
  "provider": {
    "@type": "LocalBusiness",
    "name": "Hidrourgencias SpA",
    "url": "https://hidrourgencias.cl"
  },
  "url": "https://hidrourgencias.cl/hidrojet-concon"
}
```

## Sitemap revisado

`/hidrojet-concon` aparece una sola vez en el generador de sitemap como:

```text
https://hidrourgencias.cl/hidrojet-concon
```

No aparece con `www`, `http`, parametros ni duplicados.

## Enlaces internos corregidos

Se actualizaron anchors internos que apuntaban a `/hidrojet-concon`:

- `servicio de hidrojet en Concón`
- `Hidrojet en Concón`

## Comandos de validacion usados

```bash
rg -n -i "Destape de Alcantarillado en Concon|Destape de Alcantarillado en Concón|destape alcantarillado concon|destape alcantarillado concón|servicio hidrojet en Concon|hidrojet en Concon" components lib app pages scripts reports
npm run lint
npx tsc --noEmit
npm run audit:seo
npm run build
npm run start -- -p 3115
```

## Evidencia local de HTML renderizado

Servidor local de produccion: `http://localhost:3115`

- Usuario normal: HTTP 200.
- Googlebot: HTTP 200.
- Title: `Hidrojet en Concón | Limpieza hidrodinámica de redes | Hidrourgencias SpA`.
- Description: corresponde a hidrojet.
- Canonical: `https://hidrourgencias.cl/hidrojet-concon`.
- Robots: `index, follow`.
- H1: `Hidrojet en Concón | Limpieza hidrodinámica de redes`.
- JSON-LD `Service`: declara `Hidrojet en Concón`.
- Coincidencias antiguas criticas: 0.
- HTML normal y Googlebot: mismas senales SEO principales.

## Redirecciones protegidas revisadas

- `/?page_id=12&utm_source=google&gclid=test-click&fbclid=test-social` devuelve 301 y conserva parametros hacia `https://hidrourgencias.cl/?utm_source=google&gclid=test-click&fbclid=test-social`.
- `www.hidrourgencias.cl` sigue consolidando hacia `https://hidrourgencias.cl` como redireccion permanente de Next.

## Resultado esperado en Google Search Console

Despues del despliegue:

1. Inspeccionar `https://hidrourgencias.cl/hidrojet-concon`.
2. Ejecutar "Probar URL publicada".
3. Confirmar que Google ve title, canonical y HTML actualizado.
4. Solicitar indexacion.
5. Revisar "canonical elegido por Google".
6. Monitorear el cambio de titulo en resultados publicos durante los siguientes rastreos.
