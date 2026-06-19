This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Uso del panel administrador HIDROURGENCIAS

El sitio usa Decap CMS como panel híbrido. Antes de usarlo en producción, editar `public/admin/config.yml` y reemplazar `USUARIO/REPOSITORIO` por el repositorio real de GitHub. El backend guarda cambios como archivos Markdown dentro de `content/` y las imágenes en `public/uploads`.

Para ingresar al panel, abrir `https://hidrourgencias.cl/admin` o, en desarrollo local, `http://localhost:3000/admin`. Iniciar sesión con la cuenta de GitHub autorizada para escribir en el repositorio.

Para subir una imagen desde celular, entrar a la colección correspondiente, tocar el campo de imagen, elegir subir archivo y seleccionar una foto desde la galería o cámara. Completar siempre el campo `Alt SEO` con una descripción clara, por ejemplo: `Equipo hidrojet realizando limpieza de cámara sanitaria en Viña del Mar`.

Para cambiar una imagen de maquinaria, entrar a `Configuración editable del sitio`, abrir `Tecnología y Equipamiento`, elegir el equipo y reemplazar `Imagen del equipo`. Mantener el nombre técnico y completar `Alt SEO`.

Para publicar un caso de éxito, entrar a `Casos de Éxito`, crear una nueva entrada, completar título, descripción, servicio, comuna, fecha, imagen principal y alt SEO. Dejar `Publicado` activo para que aparezca en el sitio. Si se quiere preparar sin mostrar, desactivar `Publicado`.

Para agregar video, entrar a `Videos`, crear una entrada con título, URL del video, miniatura y alt SEO. El sitio muestra miniatura y enlace; no carga iframes pesados al inicio.

Para editar el título del Home, entrar a `Configuración editable del sitio`, abrir `Home Principal`, modificar `Título principal Home` y guardar. En esa misma pantalla se puede cambiar subtítulo, imagen principal y CTAs.

Para eliminar contenido, abrir la entrada en su colección y usar la opción eliminar del CMS. Si solo se quiere ocultar temporalmente, es mejor desactivar `Publicado` para conservar el contenido.

Para guardar cambios, presionar `Guardar` en el panel. Decap CMS enviará el cambio a GitHub; después del deploy, el sitio quedará actualizado manteniendo rutas, SEO, schema, sitemap, robots, eventos de Ads/GA4, WhatsApp y llamadas.
