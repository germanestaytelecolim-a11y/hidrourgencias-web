import type { NextConfig } from "next";

// Critical redirect map:
// - hostRedirect canonicalizes www to the apex domain.
// - legacyLandingRedirects normalize old service/landing URLs to final 200 pages.
// - legacyServiceRedirects catch old /servicios/* slugs that are not rendered.
// - encodedAccentRedirects normalize accented legacy URLs to ASCII canonicals.
const legacyLandingRedirects = [
  {
    source: "/servicios",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/servicios/hidrourgencias",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/servicios/servicios-destape-alcantarillado",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/destape-de-alcantarillado-vina-del-mar",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/destape-de-alcantarillado-valparaiso",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-valparaiso",
    permanent: true,
  },
  {
    source: "/hidrojet-en-concon",
    destination: "https://hidrourgencias.cl/hidrojet-concon",
    permanent: true,
  },
  {
    source: "/mantencion-de-desagues-quilpue",
    destination: "https://hidrourgencias.cl/mantencion-desagues-quilpue",
    permanent: true,
  },
  {
    source: "/urgencias-sanitarias-villa-alemana-24-7",
    destination: "https://hidrourgencias.cl/urgencias-sanitarias-villa-alemana",
    permanent: true,
  },
  {
    source: "/destape-desagues-vina-del-mar",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/destape-desagues-valparaiso",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-valparaiso",
    permanent: true,
  },
];

const legacyServiceRedirects = [
  {
    source: "/servicios/destape-desagues",
    destination: "https://hidrourgencias.cl/servicios/destape-artefactos-sanitarios",
    permanent: true,
  },
  {
    source: "/servicios/destape-camaras-alcantarillado",
    destination: "https://hidrourgencias.cl/servicios/destape-camaras-inspeccion",
    permanent: true,
  },
  {
    source: "/servicios/reparacion-tuberias",
    destination: "https://hidrourgencias.cl/servicios/reparacion-tuberias-hdpe",
    permanent: true,
  },
  {
    source: "/servicios/motobombas",
    destination: "https://hidrourgencias.cl/servicios/motobombas-extraccion-aguas",
    permanent: true,
  },
  {
    source: "/servicios/videoinspeccion",
    destination: "https://hidrourgencias.cl/servicios/destape-camaras-inspeccion",
    permanent: true,
  },
  {
    source: "/servicios/mantencion-preventiva",
    destination: "https://hidrourgencias.cl/servicios/mantencion-preventiva-redes",
    permanent: true,
  },
  {
    source: "/blog/mantencion-preventiva",
    destination: "https://hidrourgencias.cl/blog/mantencion-preventiva-clave-redes-sanitarias",
    permanent: true,
  },
];

const encodedAccentRedirects = [
  {
    source: "/destape-alcantarillado-vi%C3%B1a-del-mar",
    destination: "https://hidrourgencias.cl/destape-alcantarillado-vina-del-mar",
    permanent: true,
  },
  {
    source: "/zona/re%C3%B1aca-vina-del-mar",
    destination: "https://hidrourgencias.cl/zona/renaca-vina-del-mar",
    permanent: true,
  },
  {
    source: "/zona/g%C3%B3mez-carre%C3%B1o-vina-del-mar",
    destination: "https://hidrourgencias.cl/zona/gomez-carreno-vina-del-mar",
    permanent: true,
  },
  {
    source: "/zona/pe%C3%B1ablanca-villa-alemana",
    destination: "https://hidrourgencias.cl/zona/penablanca-villa-alemana",
    permanent: true,
  },
];

const hostRedirect = {
  source: "/:path*",
  has: [
    {
      type: "host",
      value: "www.hidrourgencias.cl",
    },
  ],
  destination: "https://hidrourgencias.cl/:path*",
  permanent: true,
};

const longTermCacheHeader = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const adminNoStoreHeader = {
  key: "Cache-Control",
  value: "no-store, max-age=0",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 85],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|webp|avif|gif|svg|ico|pdf|woff|woff2)",
        headers: [longTermCacheHeader],
      },
      {
        source: "/_next/static/:path*",
        headers: [longTermCacheHeader],
      },
      {
        source: "/admin",
        headers: [adminNoStoreHeader],
      },
      {
        source: "/admin/:path*",
        headers: [adminNoStoreHeader],
      },
      {
        source: "/api/auth",
        headers: [adminNoStoreHeader],
      },
      {
        source: "/api/auth/:path*",
        headers: [adminNoStoreHeader],
      },
    ];
  },
  async redirects() {
    return [...legacyLandingRedirects, ...legacyServiceRedirects, ...encodedAccentRedirects, hostRedirect];
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
};

export default nextConfig;
