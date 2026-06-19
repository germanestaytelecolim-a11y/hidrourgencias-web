import type { Metadata } from "next";

import { createSeoLandingContent, stableHash, type SeoLandingContent } from "./seo-content-engine";
import { buildCanonicalUrl, siteConfig } from "./site-config";

export const MAX_PROGRAMMATIC_ROUTES = 300;

export const priorityProgrammaticComunas = [
  "vina-del-mar",
  "valparaiso",
  "concon",
  "quilpue",
  "villa-alemana",
  "renaca",
] as const;

export type ComunaSeo = {
  comuna: string;
  slug: string;
  landingPath: string;
  sectores: string[];
  tiposRed: string[];
  clientes: string[];
  contexto: string;
};

export type ServicioSeo = {
  nombre: string;
  slug: string;
  pageSlug: string;
  equipo: string;
  equipos: string[];
  enfoque: string;
  tipoRed: string;
  problemas: string[];
  recomendaciones: string[];
};

export type SeoRoute = {
  slug: string;
  sector: string;
  sectorSlug: string;
  comuna: ComunaSeo;
  service: ServicioSeo;
  probableIssue: string;
  recommendation: string;
  clientType: string;
  networkType: string;
};

export const equiposSeo = {
  hidrojet: "Hidrojet RIDGID KJ-3100",
  k1500: "RIDGID K-1500A",
  k50: "RIDGID K-50",
  videoinspeccion: "Videoinspeccion RIDGID",
} as const;

export const problemasSanitariosSeo = [
  "rebalse de aguas servidas",
  "desague lento",
  "retorno por WC",
  "camara saturada",
  "grasa, sarro y sedimentos adheridos",
  "perdida de capacidad hidraulica",
  "mal olor por estancamiento sanitario",
  "obstruccion por residuos solidos",
] as const;

export const recomendacionesTecnicasSeo = [
  "realizar diagnostico inicial antes de aplicar presion o destape mecanico",
  "verificar camaras y puntos sanitarios antes de cerrar el servicio",
  "usar hidrojet cuando existe grasa, sarro o sedimento adherido",
  "aplicar videoinspeccion si hay recurrencia, raices o dudas estructurales",
  "definir mantencion preventiva en redes de alto uso",
  "realizar prueba hidraulica posterior para confirmar recuperacion de flujo",
] as const;

export const comunasSeo: ComunaSeo[] = [
  {
    comuna: "Vina del Mar",
    slug: "vina-del-mar",
    landingPath: "/destape-alcantarillado-vina-del-mar",
    sectores: [
      "Recreo",
      "Forestal",
      "Miraflores",
      "Achupallas",
      "Renaca",
      "Gomez Carreno",
      "Santa Ines",
      "Chorrillos",
      "El Olivar",
      "Nueva Aurora",
      "Glorias Navales",
      "Vina Oriente",
      "Villa Dulce",
      "Agua Santa",
    ],
    tiposRed: ["redes verticales de edificios", "colectores horizontales", "camaras domiciliarias"],
    clientes: ["administradores de edificios", "comunidades residenciales", "locales comerciales"],
    contexto: "alta densidad residencial, edificios en altura y comercio activo",
  },
  {
    comuna: "Valparaiso",
    slug: "valparaiso",
    landingPath: "/destape-alcantarillado-valparaiso",
    sectores: [
      "Cerro Alegre",
      "Cerro Concepcion",
      "Cerro Baron",
      "Cerro Placeres",
      "Cerro Polanco",
      "Cerro Cordillera",
      "Cerro Artilleria",
      "Cerro Mariposas",
      "Cerro Bellavista",
      "Cerro Florida",
      "Cerro Merced",
      "Cerro Toro",
      "Cerro Larrain",
      "Playa Ancha",
    ],
    tiposRed: ["redes con pendiente variable", "colectores antiguos", "edificios de uso mixto"],
    clientes: ["comunidades", "comercios", "administradores de inmuebles"],
    contexto: "topografia de cerros, redes antiguas y actividad comercial intensiva",
  },
  {
    comuna: "Concon",
    slug: "concon",
    landingPath: "/hidrojet-concon",
    sectores: [
      "Bosques de Montemar",
      "Costa de Montemar",
      "Lomas de Montemar",
      "Centro Concon",
      "La Boca",
      "Colmo",
      "Mantagua",
      "Rotonda Concon",
      "Av. Concon-Renaca",
    ],
    tiposRed: ["desagues gastronomicos", "redes de condominios", "colectores costeros"],
    clientes: ["restaurantes", "condominios", "administraciones premium"],
    contexto: "carga gastronomica, condominios y sectores costeros de alta demanda",
  },
  {
    comuna: "Quilpue",
    slug: "quilpue",
    landingPath: "/destape-alcantarillado-quilpue",
    sectores: [
      "Centro Quilpue",
      "El Belloto Norte",
      "El Belloto Sur",
      "Los Pinos",
      "Valencia",
      "Marga Marga",
      "Paso Hondo",
      "Colliguay",
      "Canal Chacao",
      "Villa Olimpica",
      "Sol del Pacifico",
      "Retiro",
    ],
    tiposRed: ["camaras domiciliarias", "redes horizontales de condominios", "desagues comerciales"],
    clientes: ["familias", "condominios", "locales de barrio"],
    contexto: "crecimiento residencial, comercio local y redes con uso sostenido",
  },
  {
    comuna: "Villa Alemana",
    slug: "villa-alemana",
    landingPath: "/destape-alcantarillado-villa-alemana",
    sectores: [
      "Centro Villa Alemana",
      "Penablanca",
      "Troncos Viejos",
      "Villa Alemana Norte",
      "Villa Alemana Sur",
      "El Sauce",
      "Quebrada Escobares",
      "Las Americas",
      "Nueva Esperanza",
      "San Enrique",
      "Villa Alemana Oriente",
    ],
    tiposRed: ["redes domiciliarias", "camaras de condominios", "tramos interiores de alto uso"],
    clientes: ["clientes residenciales", "comunidades", "comercios de cercania"],
    contexto: "uso residencial intenso, condominios y comercio de barrio",
  },
  {
    comuna: "Quintero",
    slug: "quintero",
    landingPath: "/destape-alcantarillado-quintero",
    sectores: ["Centro Quintero", "Loncura", "Ritoque", "Mantagua", "Santa Adela", "El Bato"],
    tiposRed: ["redes costeras", "camaras domiciliarias", "desagues comerciales"],
    clientes: ["viviendas", "comercios", "servicios costeros"],
    contexto: "actividad costera, viviendas y redes con demanda estacional",
  },
  {
    comuna: "Puchuncavi",
    slug: "puchuncavi",
    landingPath: "/destape-alcantarillado-puchuncavi",
    sectores: ["Centro Puchuncavi", "Ventanas", "La Greda", "Maitencillo", "Horcon", "Campiche", "La Chocota", "Los Maitenes", "El Rungue"],
    tiposRed: ["redes de uso mixto", "camaras con sedimentos", "desagues de temporada"],
    clientes: ["condominios", "viviendas", "empresas de servicio"],
    contexto: "sectores residenciales, costeros e industriales con uso variable",
  },
  {
    comuna: "Limache",
    slug: "limache",
    landingPath: "/destape-alcantarillado-limache",
    sectores: ["Centro Limache", "San Francisco de Limache", "Limache Viejo", "Los Laureles", "Tabolango", "Lliu Lliu", "Lo Gamboa"],
    tiposRed: ["redes domiciliarias extensas", "camaras interiores", "tramos productivos"],
    clientes: ["viviendas", "bodegas", "comercio local"],
    contexto: "uso residencial y productivo con sectores de carga concentrada",
  },
  {
    comuna: "Quillota",
    slug: "quillota",
    landingPath: "/destape-alcantarillado-quillota",
    sectores: ["Centro Quillota", "San Pedro", "Boco", "La Palma", "Pocochay", "Manzanar", "Rauten"],
    tiposRed: ["colectores urbanos", "camaras domiciliarias", "redes comerciales"],
    clientes: ["edificios", "empresas", "viviendas"],
    contexto: "actividad urbana, comercial y residencial con redes de alto uso",
  },
  {
    comuna: "Placilla Curauma",
    slug: "placilla-curauma",
    landingPath: "/destape-alcantarillado-placilla-curauma",
    sectores: ["Placilla", "Curauma", "Placilla Oriente", "Placilla Poniente", "Curauma Norte", "Curauma Sur", "Lago Penuelas", "Sector Universidad"],
    tiposRed: ["redes compartidas de condominios", "camaras comunitarias", "desagues comerciales"],
    clientes: ["condominios", "comunidades", "comercios"],
    contexto: "expansion residencial y comercial con redes compartidas",
  },
  {
    comuna: "Renaca",
    slug: "renaca",
    landingPath: "/zona/renaca-vina-del-mar",
    sectores: ["Renaca Centro", "Renaca Alto", "Jardin del Mar", "Los Almendros", "El Encanto", "Costa de Renaca", "Cochoa"],
    tiposRed: ["redes costeras", "verticales de edificios", "desagues de comercio y turismo"],
    clientes: ["edificios", "condominios", "locales gastronomicos"],
    contexto: "zona costera con edificios, comercio y demanda estacional",
  },
];

export const serviciosSeo: ServicioSeo[] = [
  {
    nombre: "Destape de alcantarillado",
    slug: "destape-alcantarillado",
    pageSlug: "destape-alcantarillado",
    equipo: "RIDGID K-1500A, RIDGID K-50 e hidrojet segun condicion de red",
    equipos: [equiposSeo.k1500, equiposSeo.k50, equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "obstrucciones en colectores, camaras, redes horizontales y sistemas de aguas servidas",
    tipoRed: "colectores, camaras y redes de aguas servidas",
    problemas: ["rebalse de aguas servidas", "retorno por WC", "camara saturada", "perdida de capacidad hidraulica"],
    recomendaciones: ["revisar camaras antes de intervenir", "validar flujo posterior", "evaluar hidrojet si hay sedimentos"],
  },
  {
    nombre: "Destape de desagues",
    slug: "destape-desagues",
    pageSlug: "destape-artefactos-sanitarios",
    equipo: "RIDGID K-50 y herramientas de desobstruccion tecnica",
    equipos: [equiposSeo.k50, equiposSeo.videoinspeccion],
    enfoque: "desagues domiciliarios, banos, cocinas, lavamanos, lavaplatos y artefactos sanitarios",
    tipoRed: "desagues interiores y artefactos sanitarios",
    problemas: ["desague lento", "retorno por artefacto", "mal olor por estancamiento", "bloqueo en cocina o bano"],
    recomendaciones: ["evitar quimicos corrosivos", "identificar si la falla es puntual o de red", "probar descarga al cierre"],
  },
  {
    nombre: "Hidrojet",
    slug: "hidrojet",
    pageSlug: "hidrojet",
    equipo: "hidrojet de alta presion",
    equipos: [equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "limpieza interna de tuberias con grasa, sarro, sedimentos y residuos adheridos",
    tipoRed: "redes con adherencia interna, grasa o sarro",
    problemas: ["grasa adherida", "sarro en tuberias", "sedimentos compactados", "perdida de seccion util"],
    recomendaciones: ["aplicar limpieza hidrodinamica", "controlar puntos de descarga", "calendarizar mantencion por carga de uso"],
  },
  {
    nombre: "Destape de verticales",
    slug: "destape-verticales",
    pageSlug: "destape-verticales",
    equipo: "RIDGID K-50, RIDGID K-1500A y apoyo de hidrojet segun factibilidad",
    equipos: [equiposSeo.k50, equiposSeo.k1500, equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "bajadas sanitarias, ductos verticales y redes de edificios",
    tipoRed: "bajadas sanitarias y ductos verticales",
    problemas: ["retorno en pisos inferiores", "vertical saturada", "descarga simultanea lenta", "olor en shaft"],
    recomendaciones: ["confirmar pisos afectados", "controlar descarga por tramo", "evaluar videoinspeccion si hay recurrencia"],
  },
  {
    nombre: "Destape de horizontales",
    slug: "destape-horizontales",
    pageSlug: "destape-horizontales",
    equipo: "RIDGID K-1500A e hidrojet",
    equipos: [equiposSeo.k1500, equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "colectores horizontales, tramos entre camaras y redes principales",
    tipoRed: "tramos horizontales entre camaras",
    problemas: ["camara con nivel alto", "colector obstruido", "sedimentos en tramo largo", "rebalse por pendiente insuficiente"],
    recomendaciones: ["abrir camaras de inspeccion", "medir respuesta hidraulica", "usar hidrojet en tramos con sedimento"],
  },
  {
    nombre: "Destape de edificios",
    slug: "destape-edificios",
    pageSlug: "destape-edificios",
    equipo: "RIDGID, hidrojet, motobombas y videoinspeccion",
    equipos: [equiposSeo.k1500, equiposSeo.k50, equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "comunidades, edificios, salas de basura, camaras y colectores",
    tipoRed: "redes sanitarias comunitarias de edificios",
    problemas: ["rebalse en areas comunes", "retorno en pisos bajos", "camara comunitaria saturada", "vertical con alta carga"],
    recomendaciones: ["coordinar con administracion", "aislar puntos de uso", "dejar pauta preventiva por comunidad"],
  },
  {
    nombre: "Destape de camaras de alcantarillado",
    slug: "destape-camaras-alcantarillado",
    pageSlug: "destape-camaras-inspeccion",
    equipo: "RIDGID K-1500A, hidrojet y herramientas de extraccion",
    equipos: [equiposSeo.k1500, equiposSeo.hidrojet, equiposSeo.videoinspeccion],
    enfoque: "camaras de inspeccion, camaras saturadas, grasa, sedimentos y aguas servidas",
    tipoRed: "camaras de inspeccion y colectores conectados",
    problemas: ["camara saturada", "grasas compactadas", "sedimentos acumulados", "aguas servidas expuestas"],
    recomendaciones: ["limpiar camara y tramo asociado", "retirar sedimento visible", "confirmar descarga aguas abajo"],
  },
  {
    nombre: "Mantencion preventiva de redes sanitarias",
    slug: "mantencion-preventiva-redes",
    pageSlug: "mantencion-preventiva-redes",
    equipo: "hidrojet, videoinspeccion y protocolo de limpieza programada",
    equipos: [equiposSeo.hidrojet, equiposSeo.videoinspeccion, equiposSeo.k1500],
    enfoque: "prevencion de rebalses, continuidad operativa y limpieza tecnica",
    tipoRed: "redes sanitarias de alto uso con plan preventivo",
    problemas: ["eventos recurrentes", "perdida de capacidad hidraulica", "camaras con grasa", "sedimentos en tramos criticos"],
    recomendaciones: ["definir frecuencia de limpieza", "priorizar puntos recurrentes", "documentar hallazgos por visita"],
  },
];

export const reservedRootSlugs = [
  "blog",
  "servicios",
  "zona",
  "destape-alcantarillado-vina-del-mar",
  "destape-alcantarillado-valparaiso",
  "destape-alcantarillado-villa-alemana",
  "destape-alcantarillado-quilpue",
  "destape-alcantarillado-puchuncavi",
  "destape-alcantarillado-quintero",
  "destape-alcantarillado-limache",
  "destape-alcantarillado-quillota",
  "destape-alcantarillado-placilla-curauma",
  "hidrojet-concon",
  "mantencion-desagues-quilpue",
  "urgencias-sanitarias-villa-alemana",
] as const;

const comunaMap = new Map(comunasSeo.map((comuna) => [comuna.slug, comuna] as const));
const serviceMap = new Map(serviciosSeo.map((service) => [service.slug, service] as const));

export function slugifySeo(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createSeoSlug(serviceSlug: string, sector: string, comunaSlug: string): string {
  return `${serviceSlug}-${slugifySeo(sector)}-${comunaSlug}`;
}

function pickDeterministic<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function buildSeoRoute(comuna: ComunaSeo, service: ServicioSeo, sector: string): SeoRoute {
  const sectorSlug = slugifySeo(sector);
  const slug = createSeoSlug(service.slug, sector, comuna.slug);
  const seed = stableHash(slug);

  return {
    slug,
    sector,
    sectorSlug,
    comuna,
    service,
    probableIssue: pickDeterministic(service.problemas, seed + 1),
    recommendation: pickDeterministic(service.recomendaciones, seed + 2),
    clientType: pickDeterministic(comuna.clientes, seed + 3),
    networkType: service.tipoRed || pickDeterministic(comuna.tiposRed, seed + 4),
  };
}

const allSeoRoutes = comunasSeo.flatMap((comuna) =>
  comuna.sectores.flatMap((sector) => serviciosSeo.map((service) => buildSeoRoute(comuna, service, sector))),
);

const routeMap = new Map(allSeoRoutes.map((route) => [route.slug, route] as const));

export function getAllSeoRoutes(): SeoRoute[] {
  return allSeoRoutes;
}

export function getSeoRouteBySlug(slug: string): SeoRoute | undefined {
  return routeMap.get(slug);
}

export function getComunaSeoBySlug(slug: string): ComunaSeo | undefined {
  return comunaMap.get(slug);
}

export function getServicioSeoBySlug(slug: string): ServicioSeo | undefined {
  return serviceMap.get(slug);
}

export function getSeoStaticParams(): Array<{ seoSlug: string }> {
  return allSeoRoutes.map((route) => ({ seoSlug: route.slug }));
}

export function getServicePagePath(service: ServicioSeo): string {
  return `/servicios/${service.pageSlug}`;
}

export function getNearbySeoRoutes(route: SeoRoute, count = 3): SeoRoute[] {
  const sectors = route.comuna.sectores;
  const currentIndex = sectors.indexOf(route.sector);

  return sectors
    .map((sector, index) => ({ sector, distance: Math.abs(index - currentIndex) || sectors.length }))
    .filter((item) => item.sector !== route.sector)
    .sort((a, b) => a.distance - b.distance || a.sector.localeCompare(b.sector))
    .slice(0, count)
    .map((item) => getSeoRouteBySlug(createSeoSlug(route.service.slug, item.sector, route.comuna.slug)))
    .filter((item): item is SeoRoute => item !== undefined);
}

export function getPrioritySeoRoutes(limit = MAX_PROGRAMMATIC_ROUTES): SeoRoute[] {
  const prioritySet = new Set<string>(priorityProgrammaticComunas);
  const priorityRoutes = allSeoRoutes.filter((route) => prioritySet.has(route.comuna.slug));
  const restRoutes = allSeoRoutes.filter((route) => !prioritySet.has(route.comuna.slug));

  return [...priorityRoutes, ...restRoutes].slice(0, limit);
}

export function buildSeoMetadata(route: SeoRoute): Metadata {
  const title = `${route.service.nombre} en ${route.sector} | ${route.comuna.comuna} 24/7 | Hidrourgencias`;
  const description = `Servicio de ${route.service.nombre.toLowerCase()} en ${route.sector}, ${route.comuna.comuna}. Atencion 24/7, diagnostico tecnico, equipos RIDGID, hidrojet y respuesta inmediata.`;
  const canonical = buildCanonicalUrl(`/${route.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: "/images/hero-urgencia.jpg",
          width: 1200,
          height: 630,
          alt: `${route.service.nombre} en ${route.sector}, ${route.comuna.comuna}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-urgencia.jpg"],
    },
  };
}

export function buildSeoRouteContent(route: SeoRoute): SeoLandingContent {
  return createSeoLandingContent(route);
}

export function buildProgrammaticWhatsAppMessage(route: SeoRoute): string {
  return `Necesito ${route.service.nombre.toLowerCase()} en ${route.sector} ${route.comuna.comuna}`;
}

export function getSeoRouteCounts() {
  const byComuna = new Map<string, number>();
  const byService = new Map<string, number>();

  for (const route of allSeoRoutes) {
    byComuna.set(route.comuna.comuna, (byComuna.get(route.comuna.comuna) ?? 0) + 1);
    byService.set(route.service.nombre, (byService.get(route.service.nombre) ?? 0) + 1);
  }

  return {
    total: allSeoRoutes.length,
    byComuna: Object.fromEntries(byComuna),
    byService: Object.fromEntries(byService),
  };
}
