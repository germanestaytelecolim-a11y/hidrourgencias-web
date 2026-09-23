/**
 * Authoritative territorial catalogue.
 *
 * Every public territorial label, internal link and programmatic route must be
 * derived from this module. Aliases are compatibility metadata only: they are
 * never returned as public navigation items.
 */
export type TerritorySector = {
  /** Stable URL segment. It is intentionally independent from the display name. */
  slug: string;
  name: string;
  aliases: readonly string[];
  publishedZone: boolean;
};

export type TerritoryComuna = {
  comuna: string;
  slug: string;
  canonicalPath: string;
  showInCoverage?: boolean;
  sectores: readonly TerritorySector[];
  tiposRed: readonly string[];
  clientes: readonly string[];
  contexto: string;
};

const sectorMetadata: Record<string, Partial<Omit<TerritorySector, "name">>> = {
  "concon|Concón Centro": { slug: "centro-concon", aliases: ["Centro Concón"], publishedZone: true },
  "quilpue|Belloto Norte": { slug: "el-belloto-norte", aliases: ["El Belloto Norte"], publishedZone: true },
  "quilpue|Belloto Sur": { slug: "el-belloto-sur", aliases: ["El Belloto Sur"], publishedZone: true },
  "vina-del-mar|Recreo": { publishedZone: true },
  "vina-del-mar|Forestal": { publishedZone: true },
  "vina-del-mar|Miraflores": { publishedZone: true },
  "vina-del-mar|Achupallas": { publishedZone: true },
  "vina-del-mar|Renaca": { publishedZone: true },
  "vina-del-mar|Gomez Carreno": { publishedZone: true },
  "vina-del-mar|Chorrillos": { publishedZone: true },
  "valparaiso|Cerro Placeres": { publishedZone: true },
  "valparaiso|Cerro Baron": { publishedZone: true },
  "valparaiso|Cerro Alegre": { publishedZone: true },
  "valparaiso|Playa Ancha": { publishedZone: true },
  "valparaiso|Curauma": { publishedZone: true },
  "valparaiso|Placilla": { publishedZone: true },
  "concon|Bosques de Montemar": { publishedZone: true },
  "quilpue|Centro Quilpue": { publishedZone: true },
  "villa-alemana|Centro Villa Alemana": { publishedZone: true },
  "villa-alemana|Penablanca": { publishedZone: true },
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " y ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function sectors(comunaSlug: string, names: readonly string[]): TerritorySector[] {
  return names.map((name) => {
    const metadata = sectorMetadata[`${comunaSlug}|${name}`];
    return {
      name,
      slug: metadata?.slug ?? slugify(name),
      aliases: metadata?.aliases ?? [],
      publishedZone: metadata?.publishedZone ?? false,
    };
  });
}

export const territorialCoverage: readonly TerritoryComuna[] = [
  { comuna: "Vina del Mar", slug: "vina-del-mar", canonicalPath: "/destape-alcantarillado-vina-del-mar", sectores: sectors("vina-del-mar", ["Recreo", "Forestal", "Miraflores", "Achupallas", "Renaca", "Gomez Carreno", "Santa Ines", "Chorrillos", "El Olivar", "Nueva Aurora", "Glorias Navales", "Vina Oriente", "Villa Dulce", "Agua Santa"]), tiposRed: ["redes verticales de edificios", "colectores horizontales", "camaras domiciliarias"], clientes: ["administradores de edificios", "comunidades residenciales", "locales comerciales"], contexto: "alta densidad residencial, edificios en altura y comercio activo" },
  { comuna: "Valparaíso", slug: "valparaiso", canonicalPath: "/destape-alcantarillado-valparaiso", sectores: sectors("valparaiso", ["Cerro Alegre", "Cerro Concepcion", "Cerro Baron", "Cerro Placeres", "Cerro Polanco", "Cerro Cordillera", "Cerro Artilleria", "Cerro Mariposas", "Cerro Bellavista", "Cerro Florida", "Cerro Merced", "Cerro Toro", "Cerro Larrain", "Playa Ancha"]), tiposRed: ["redes con pendiente variable", "colectores antiguos", "edificios de uso mixto"], clientes: ["comunidades", "comercios", "administradores de inmuebles"], contexto: "topografia de cerros, redes antiguas y actividad comercial intensiva" },
  { comuna: "Concón", slug: "concon", canonicalPath: "/hidrojet-concon", sectores: sectors("concon", ["Bosques de Montemar", "Costa de Montemar", "Lomas de Montemar", "Concón Centro", "La Boca", "Colmo", "Mantagua", "Rotonda Concón", "Av. Concón-Renaca"]), tiposRed: ["desagues gastronomicos", "redes de condominios", "colectores costeros"], clientes: ["restaurantes", "condominios", "administraciones premium"], contexto: "carga gastronomica, condominios y sectores costeros de alta demanda" },
  { comuna: "Quilpue", slug: "quilpue", canonicalPath: "/destape-alcantarillado-quilpue", sectores: sectors("quilpue", ["Centro Quilpue", "Belloto Norte", "Belloto Sur", "Los Pinos", "Valencia", "Marga Marga", "Paso Hondo", "Colliguay", "Canal Chacao", "Villa Olimpica", "Sol del Pacifico", "Retiro"]), tiposRed: ["camaras domiciliarias", "redes horizontales de condominios", "desagues comerciales"], clientes: ["familias", "condominios", "locales de barrio"], contexto: "crecimiento residencial, comercio local y redes con uso sostenido" },
  { comuna: "Villa Alemana", slug: "villa-alemana", canonicalPath: "/destape-alcantarillado-villa-alemana", sectores: sectors("villa-alemana", ["Centro Villa Alemana", "Penablanca", "Troncos Viejos", "Villa Alemana Norte", "Villa Alemana Sur", "El Sauce", "Quebrada Escobares", "Las Americas", "Nueva Esperanza", "San Enrique", "Villa Alemana Oriente"]), tiposRed: ["redes domiciliarias", "camaras de condominios", "tramos interiores de alto uso"], clientes: ["clientes residenciales", "comunidades", "comercios de cercania"], contexto: "uso residencial intenso, condominios y comercio de barrio" },
  { comuna: "Quintero", slug: "quintero", canonicalPath: "/destape-alcantarillado-quintero", sectores: sectors("quintero", ["Centro Quintero", "Loncura", "Ritoque", "Mantagua", "Santa Adela", "El Bato"]), tiposRed: ["redes costeras", "camaras domiciliarias", "desagues comerciales"], clientes: ["viviendas", "comercios", "servicios costeros"], contexto: "actividad costera, viviendas y redes con demanda estacional" },
  { comuna: "Puchuncavi", slug: "puchuncavi", canonicalPath: "/destape-alcantarillado-puchuncavi", sectores: sectors("puchuncavi", ["Centro Puchuncavi", "Ventanas", "La Greda", "Maitencillo", "Horcon", "Campiche", "La Chocota", "Los Maitenes", "El Rungue"]), tiposRed: ["redes de uso mixto", "camaras con sedimentos", "desagues de temporada"], clientes: ["condominios", "viviendas", "empresas de servicio"], contexto: "sectores residenciales, costeros e industriales con uso variable" },
  { comuna: "Limache", slug: "limache", canonicalPath: "/destape-alcantarillado-limache", sectores: sectors("limache", ["Centro Limache", "San Francisco de Limache", "Limache Viejo", "Los Laureles", "Tabolango", "Lliu Lliu", "Lo Gamboa"]), tiposRed: ["redes domiciliarias extensas", "camaras interiores", "tramos productivos"], clientes: ["viviendas", "bodegas", "comercio local"], contexto: "uso residencial y productivo con sectores de carga concentrada" },
  { comuna: "Quillota", slug: "quillota", canonicalPath: "/destape-alcantarillado-quillota", sectores: sectors("quillota", ["Centro Quillota", "San Pedro", "Boco", "La Palma", "Pocochay", "Manzanar", "Rauten"]), tiposRed: ["colectores urbanos", "camaras domiciliarias", "redes comerciales"], clientes: ["edificios", "empresas", "viviendas"], contexto: "actividad urbana, comercial y residencial con redes de alto uso" },
  { comuna: "Placilla Curauma", slug: "placilla-curauma", canonicalPath: "/destape-alcantarillado-placilla-curauma", sectores: sectors("placilla-curauma", ["Placilla", "Curauma", "Placilla Oriente", "Placilla Poniente", "Curauma Norte", "Curauma Sur", "Lago Penuelas", "Sector Universidad"]), tiposRed: ["redes compartidas de condominios", "camaras comunitarias", "desagues comerciales"], clientes: ["condominios", "comunidades", "comercios"], contexto: "expansion residencial y comercial con redes compartidas" },
  { comuna: "Renaca", slug: "renaca", canonicalPath: "/destape-alcantarillado-renaca-vina-del-mar", showInCoverage: false, sectores: sectors("renaca", ["Renaca Centro", "Renaca Alto", "Jardin del Mar", "Los Almendros", "El Encanto", "Costa de Renaca", "Cochoa"]), tiposRed: ["redes costeras", "verticales de edificios", "desagues de comercio y turismo"], clientes: ["edificios", "condominios", "locales gastronomicos"], contexto: "zona costera con edificios, comercio y demanda estacional" },
  { comuna: "Casablanca", slug: "casablanca", canonicalPath: "/destape-alcantarillado-casablanca", sectores: sectors("casablanca", ["Centro de Casablanca", "Lo Vásquez", "Las Dichas", "Lagunillas", "Quintay"]), tiposRed: ["redes domiciliarias", "camaras exteriores", "tramos privados"], clientes: ["viviendas", "parcelas", "comercios"], contexto: "territorio urbano y rural con redes privadas" },
  { comuna: "Maitencillo", slug: "maitencillo-puchuncavi", canonicalPath: "/destape-alcantarillado-maitencillo-puchuncavi", sectores: sectors("maitencillo-puchuncavi", ["Puchuncaví", "Cachagua", "Zapallar", "Horcón", "Ventanas"]), tiposRed: ["redes costeras", "camaras exteriores", "desagues de temporada"], clientes: ["viviendas costeras", "condominios", "restaurantes"], contexto: "balneario residencial de ocupacion estacional" },
] as const;

export function getTerritoryComuna(slug: string) {
  return territorialCoverage.find((comuna) => comuna.slug === slug);
}

export function getTerritoryComunaByPath(path: string) {
  return territorialCoverage.find((comuna) => comuna.canonicalPath === path);
}

export function getPublishedTerritorySectors() {
  return territorialCoverage.flatMap((comuna) => comuna.sectores.filter((sector) => sector.publishedZone).map((sector) => ({ comuna, sector })));
}

export function getCoverageTerritories() {
  return territorialCoverage.filter((comuna) => comuna.showInCoverage !== false);
}

export function uniqueByCanonicalPath<T extends { canonicalPath: string }>(items: readonly T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.canonicalPath, item])).values());
}
