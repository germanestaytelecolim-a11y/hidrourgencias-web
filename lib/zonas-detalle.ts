import { zonas } from "@/lib/zonas";

type ZonaComunaKey = keyof typeof zonas;

type ComunaZoneProfile = {
  comuna: string;
  comunaSlug: string;
  landingSlug: string;
  terrain: string[];
  network: string[];
  risks: string[];
  clientFocus: string[];
  nearbyComunas: string[];
};

export type ZonaDetalle = {
  nombre: string;
  comuna: string;
  slug: string;
  landingSlug: string;
  comunaSlug: string;
  contextNote: string;
  networkNote: string;
  issueNote: string;
  clientNote: string;
  nearbyComunas: string[];
};

const comunaProfiles: Record<ZonaComunaKey, ComunaZoneProfile> = {
  vinaDelMar: {
    comuna: "Vina del Mar",
    comunaSlug: "vina-del-mar",
    landingSlug: "destape-alcantarillado-vina-del-mar",
    terrain: [
      "la combinacion entre edificios en altura y alto flujo de residentes exige respuesta sanitaria rapida",
      "la demanda comercial y residencial mantiene presion constante sobre redes verticales y horizontales",
      "la carga sanitaria en condominios y comercio aumenta el riesgo de obstrucciones en horas punta",
    ],
    network: [
      "redes verticales de edificios con multiples descargas simultaneas",
      "tramos horizontales comunitarios con alta acumulacion de sedimentos",
      "camaras de alcantarillado sometidas a carga operativa continua",
    ],
    risks: [
      "grasas adheridas y sedimentos compactados",
      "rebalses por acumulacion de residuos en puntos criticos",
      "retorno de aguas servidas en artefactos sanitarios",
    ],
    clientFocus: ["edificios", "condominios", "empresas", "locales comerciales"],
    nearbyComunas: ["Concon", "Valparaiso", "Quilpue"],
  },
  valparaiso: {
    comuna: "Valparaiso",
    comunaSlug: "valparaiso",
    landingSlug: "destape-alcantarillado-valparaiso",
    terrain: [
      "la topografia de cerros y cambios de pendiente exige diagnostico tecnico por tramo",
      "la infraestructura sanitaria heterogenea requiere intervencion precisa para evitar reincidencias",
      "la combinacion de zonas residenciales y comerciales demanda continuidad operativa permanente",
    ],
    network: [
      "colectores y redes con variacion de pendiente",
      "sistemas sanitarios en edificios de uso mixto",
      "tramos antiguos con alto desgaste operativo",
    ],
    risks: [
      "colapsos por sedimentos en puntos de descarga",
      "rebalses en sectores con alta densidad peatonal",
      "obstrucciones cronicas en camaras de inspeccion",
    ],
    clientFocus: ["comunidades", "administradores", "comercio", "empresas de servicio"],
    nearbyComunas: ["Vina del Mar", "Placilla de Curauma", "Quilpue"],
  },
  concon: {
    comuna: "Concon",
    comunaSlug: "concon",
    landingSlug: "hidrojet-concon",
    terrain: [
      "el uso gastronomico y residencial premium exige continuidad sanitaria sin margen de error",
      "la operacion de condominios y restaurantes requiere control preventivo permanente",
      "la alta demanda en cocinas comerciales incrementa la acumulacion de grasas en ductos",
    ],
    network: [
      "desagues de cocinas con alta carga organica",
      "redes horizontales de condominios de alta densidad",
      "colectores con variaciones de flujo por horario de uso",
    ],
    risks: [
      "bloqueos por grasa en tramos de descarga",
      "drenaje lento con riesgo de rebalse en cocina",
      "olores sanitarios por estancamiento en tramos secundarios",
    ],
    clientFocus: ["restaurantes", "condominios", "hoteleria", "locales comerciales"],
    nearbyComunas: ["Vina del Mar", "Quintero", "Puchuncavi"],
  },
  villaAlemana: {
    comuna: "Villa Alemana",
    comunaSlug: "villa-alemana",
    landingSlug: "destape-alcantarillado-villa-alemana",
    terrain: [
      "la red domiciliaria con alto uso familiar exige respuesta sanitaria 24/7",
      "el crecimiento residencial incrementa la carga sobre camaras y redes compartidas",
      "la mezcla de vivienda y comercio requiere intervenciones tecnicas sin improvisacion",
    ],
    network: [
      "desagues domiciliarios con uso simultaneo en horario punta",
      "redes comunitarias en condominios y pasajes interiores",
      "tramos verticales y horizontales con mantenimiento reactivo",
    ],
    risks: [
      "obstrucciones por residuos solidos y grasas",
      "retorno en banos y lavaplatos",
      "rebalses por acumulacion progresiva en camaras",
    ],
    clientFocus: ["comunidades", "edificios", "empresas", "clientes residenciales"],
    nearbyComunas: ["Quilpue", "Limache", "Vina del Mar"],
  },
  quilpue: {
    comuna: "Quilpue",
    comunaSlug: "quilpue",
    landingSlug: "destape-alcantarillado-quilpue",
    terrain: [
      "la combinacion de barrios residenciales y comercio de alto flujo exige operacion sanitaria estable",
      "el crecimiento de sectores perifericos aumenta la demanda de mantencion preventiva",
      "la presion sobre redes compartidas requiere diagnostico por puntos criticos",
    ],
    network: [
      "redes horizontales en condominios y viviendas",
      "camaras domiciliarias con uso intensivo",
      "desagues de locales comerciales y patios de servicio",
    ],
    risks: [
      "saturacion por grasas y sedimentos",
      "drenaje lento recurrente en cocina y bano",
      "rebalses por falta de limpieza profunda",
    ],
    clientFocus: ["condominios", "empresas", "locales", "comunidades"],
    nearbyComunas: ["Villa Alemana", "Vina del Mar", "Valparaiso"],
  },
};

const zonaSlugOverrides: Record<string, string> = {
  "El Belloto|quilpue": "belloto-quilpue",
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createZonaSlug(nombre: string, comunaSlug: string): string {
  const override = zonaSlugOverrides[`${nombre}|${comunaSlug}`];
  if (override) {
    return override;
  }

  const zoneBase = slugify(nombre).replace(/^(el|la|los|las)-/, "");

  if (zoneBase.includes(comunaSlug) || zoneBase.endsWith(comunaSlug)) {
    return zoneBase;
  }

  return `${zoneBase}-${comunaSlug}`;
}

function buildZonaDetalle(key: ZonaComunaKey, zoneName: string, index: number): ZonaDetalle {
  const profile = comunaProfiles[key];

  const contextNote = `En ${zoneName}, ${profile.terrain[index % profile.terrain.length]}.`;
  const networkNote = `La intervencion se concentra en ${profile.network[index % profile.network.length]} con trazabilidad tecnica en terreno.`;
  const issueNote = `Los eventos mas frecuentes incluyen ${profile.risks[index % profile.risks.length]}, por eso priorizamos diagnostico de causa raiz y respuesta inmediata.`;
  const clientNote = `Atendemos ${profile.clientFocus.join(", ")} en ${zoneName} con protocolo profesional para urgencias sanitarias 24 horas.`;

  return {
    nombre: zoneName,
    comuna: profile.comuna,
    slug: createZonaSlug(zoneName, profile.comunaSlug),
    landingSlug: profile.landingSlug,
    comunaSlug: profile.comunaSlug,
    contextNote,
    networkNote,
    issueNote,
    clientNote,
    nearbyComunas: profile.nearbyComunas,
  };
}

export const zonasDetalle: ZonaDetalle[] = (Object.entries(zonas) as Array<[ZonaComunaKey, readonly string[]]>).flatMap(
  ([key, zoneNames]) => zoneNames.map((zoneName, index) => buildZonaDetalle(key, zoneName, index)),
);

const zonasBySlug = new Map(zonasDetalle.map((item) => [item.slug, item]));

export function getZonaSlugs(): string[] {
  return zonasDetalle.map((item) => item.slug);
}

export function getZonaBySlug(slug: string): ZonaDetalle | undefined {
  return zonasBySlug.get(slug);
}

export function getZonasByLandingSlug(landingSlug: string): ZonaDetalle[] {
  return zonasDetalle.filter((item) => item.landingSlug === landingSlug);
}
