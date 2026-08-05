import serviceAttribution from "@/public/images/servicios/heroes/attribution.json";
import zoneAttribution from "@/public/images/zonas/attribution.json";

export type LandingVisualVariant = "panorama" | "split" | "technical" | "diagnostic" | "recovery" | "engineering";

export type LandingVisualProfile = {
  slug: string;
  family: "zona" | "servicio";
  variant: LandingVisualVariant;
  image: string;
  alt: string;
  objectPosition: string;
  accent: string;
  imageSide?: "left" | "right";
  source: {
    label: string;
    url?: string;
    license: string;
    licenseUrl?: string;
  };
};

type ZoneAttribution = (typeof zoneAttribution)[number];
type ServiceAttribution = (typeof serviceAttribution)[number];

function getZoneSource(slug: string): LandingVisualProfile["source"] {
  const entry = (zoneAttribution as ZoneAttribution[]).find((item) => item.slug === slug);
  if (!entry) {
    throw new Error(`Falta atribución visual para la zona ${slug}.`);
  }

  return {
    label: entry.author || "Wikimedia Commons",
    url: entry.sourceUrl,
    license: entry.license,
    licenseUrl: entry.licenseUrl ?? undefined,
  };
}

function getServiceSource(slug: string): LandingVisualProfile["source"] {
  const entry = (serviceAttribution as ServiceAttribution[]).find((item) => item.slug === slug);
  if (!entry) {
    throw new Error(`Falta atribución visual para el servicio ${slug}.`);
  }

  if (entry.sourceType === "imagegen") {
    return {
      label: "Recurso original generado para Hidrourgencias",
      license: entry.license,
    };
  }

  if ("rightsStatus" in entry && entry.rightsStatus === "corporate-owned") {
    return {
      label: "Archivo fotográfico corporativo de Hidrourgencias SpA",
      license: entry.license,
    };
  }

  return {
    label: "Archivo fotográfico preexistente (procedencia no verificada)",
    license: entry.license,
  };
}

function zoneProfile(
  slug: string,
  variant: LandingVisualVariant,
  alt: string,
  accent: string,
  options: Pick<LandingVisualProfile, "objectPosition" | "imageSide"> = {
    objectPosition: "center",
    imageSide: "right",
  },
): LandingVisualProfile {
  return {
    slug,
    family: "zona",
    variant,
    image: `/images/zonas/${slug}.webp`,
    alt,
    accent,
    objectPosition: options.objectPosition,
    imageSide: options.imageSide,
    source: getZoneSource(slug),
  };
}

function serviceProfile(
  slug: string,
  variant: LandingVisualVariant,
  alt: string,
  accent: string,
  options: Pick<LandingVisualProfile, "objectPosition" | "imageSide"> = {
    objectPosition: "center",
    imageSide: "right",
  },
): LandingVisualProfile {
  return {
    slug,
    family: "servicio",
    variant,
    image: `/images/servicios/heroes/${slug}.webp`,
    alt,
    accent,
    objectPosition: options.objectPosition,
    imageSide: options.imageSide,
    source: getServiceSource(slug),
  };
}

const zoneVisualProfiles = new Map<string, LandingVisualProfile>([
  zoneProfile("renaca-vina-del-mar", "panorama", "Borde costero y playa de Reñaca en Viña del Mar", "#22d3ee", {
    objectPosition: "center 54%",
    imageSide: "right",
  }),
  zoneProfile(
    "gomez-carreno-vina-del-mar",
    "recovery",
    "Vegetación y senderos del Parque Natural Gómez Carreño",
    "#34d399",
    { objectPosition: "center", imageSide: "left" },
  ),
  zoneProfile("forestal-vina-del-mar", "panorama", "Laderas urbanas iluminadas del sector Forestal en Viña del Mar", "#f59e0b", {
    objectPosition: "center 58%",
    imageSide: "right",
  }),
  zoneProfile(
    "recreo-vina-del-mar",
    "split",
    "Edificios residenciales y laderas del sector Recreo en Viña del Mar",
    "#fbbf24",
    { objectPosition: "center", imageSide: "right" },
  ),
  zoneProfile("chorrillos-vina-del-mar", "technical", "Andenes de la estación Chorrillos en Viña del Mar", "#a3e635", {
    objectPosition: "center",
    imageSide: "left",
  }),
  zoneProfile(
    "miraflores-vina-del-mar",
    "split",
    "Entorno urbano y equipamiento del sector Miraflores en Viña del Mar",
    "#38bdf8",
    { objectPosition: "center", imageSide: "left" },
  ),
  zoneProfile(
    "achupallas-vina-del-mar",
    "diagnostic",
    "Entorno urbano nocturno de Achupallas en los cerros de Viña del Mar",
    "#fb7185",
    { objectPosition: "center", imageSide: "right" },
  ),
  zoneProfile(
    "cerro-placeres-valparaiso",
    "split",
    "Calle residencial del Cerro Placeres con vista hacia Valparaíso",
    "#fb7185",
    { objectPosition: "center", imageSide: "left" },
  ),
  zoneProfile("cerro-baron-valparaiso", "engineering", "Ascensor Barón y vista urbana de Valparaíso", "#67e8f9", {
    objectPosition: "center",
    imageSide: "right",
  }),
  zoneProfile(
    "cerro-alegre-valparaiso",
    "panorama",
    "Fachadas coloridas y arte urbano del Cerro Alegre de Valparaíso",
    "#fbbf24",
    { objectPosition: "center 58%", imageSide: "right" },
  ),
  zoneProfile("playa-ancha-valparaiso", "panorama", "Acantilados y costa de Playa Ancha en Valparaíso", "#60a5fa", {
    objectPosition: "center",
    imageSide: "right",
  }),
  zoneProfile("concon-centro", "split", "Rotonda y entorno urbano de Concón Centro", "#2dd4bf", {
    objectPosition: "center",
    imageSide: "right",
  }),
  zoneProfile(
    "bosques-de-montemar-concon",
    "recovery",
    "Entorno residencial y vegetación de Bosques de Montemar en Concón",
    "#4ade80",
    { objectPosition: "center", imageSide: "left" },
  ),
  zoneProfile("centro-quilpue", "split", "Vista urbana del centro de Quilpué", "#38bdf8", {
    objectPosition: "center",
    imageSide: "right",
  }),
  zoneProfile("belloto-norte-quilpue", "recovery", "Sendero y vegetación del sector Belloto Norte en Quilpué", "#84cc16", {
    objectPosition: "center",
    imageSide: "left",
  }),
  zoneProfile("belloto-sur-quilpue", "diagnostic", "Vista nocturna del entorno urbano de El Belloto en Quilpué", "#f59e0b", {
    objectPosition: "center",
    imageSide: "right",
  }),
  zoneProfile(
    "centro-villa-alemana",
    "split",
    "Paseo Latorre y actividad urbana del centro de Villa Alemana",
    "#fb7185",
    { objectPosition: "center", imageSide: "left" },
  ),
  zoneProfile(
    "penablanca-villa-alemana",
    "panorama",
    "Atardecer y antiguo molino en Peñablanca, Villa Alemana",
    "#fbbf24",
    { objectPosition: "center", imageSide: "right" },
  ),
].map((profile) => [profile.slug, profile]));

const serviceVisualProfiles = new Map<string, LandingVisualProfile>([
  serviceProfile(
    "reparacion-tuberias-hdpe",
    "engineering",
    "Preparación técnica de una unión por electrofusión en tubería HDPE",
    "#38bdf8",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "motobombas-extraccion-aguas",
    "technical",
    "Motobomba de alto caudal preparada para extracción de aguas",
    "#fbbf24",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "destape-alcantarillado",
    "technical",
    "Técnico retirando raíces desde una cámara de alcantarillado",
    "#22d3ee",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "destape-artefactos-sanitarios",
    "split",
    "Revisión de desagüe en lavaplatos domiciliario",
    "#34d399",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "destape-camaras-inspeccion",
    "diagnostic",
    "Cámara sanitaria abierta durante una intervención técnica",
    "#67e8f9",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile("hidrojet", "technical", "Equipo hidrojet y mangueras durante una limpieza de redes", "#22d3ee", {
    objectPosition: "center",
    imageSide: "left",
  }),
  serviceProfile(
    "destape-verticales",
    "engineering",
    "Acceso técnico a una conexión vertical de la red sanitaria",
    "#a3e635",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "destape-horizontales",
    "technical",
    "Equipo de cable seccional trabajando un colector horizontal",
    "#fbbf24",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "destape-edificios",
    "panorama",
    "Unidad técnica atendiendo una emergencia sanitaria en un edificio",
    "#fb7185",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "mantencion-preventiva-redes",
    "split",
    "Equipo de alta presión preparado para mantención programada",
    "#4ade80",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "limpieza-higienizacion-sanitizacion",
    "recovery",
    "Técnico con EPP sanitizando un recinto de servicio",
    "#2dd4bf",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "limpieza-domicilios-recuperacion-espacios",
    "recovery",
    "Revisión final de humedad en un espacio limpio y recuperado",
    "#34d399",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "limpieza-fachadas-hidrolavado-superficies",
    "split",
    "Hidrolavado profesional y controlado de una fachada exterior",
    "#38bdf8",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "extraccion-aguas-estanques-piscinas",
    "technical",
    "Espacio anegado que requiere extracción controlada de agua",
    "#60a5fa",
    { objectPosition: "center", imageSide: "right" },
  ),
  serviceProfile(
    "asesoria-mantenimiento-integral-redes-sanitarias",
    "engineering",
    "Profesional revisando planos e informe de mantenimiento sanitario",
    "#fbbf24",
    { objectPosition: "center", imageSide: "left" },
  ),
  serviceProfile(
    "analisis-tecnico-propiedad-redes-sanitarias",
    "diagnostic",
    "Videoinspección CCTV de una tubería sanitaria con monitor técnico",
    "#22d3ee",
    { objectPosition: "center", imageSide: "right" },
  ),
].map((profile) => [profile.slug, profile]));

export function getZoneVisualProfile(slug: string) {
  return zoneVisualProfiles.get(slug);
}

export function getServiceVisualProfile(slug: string) {
  return serviceVisualProfiles.get(slug);
}

export function getAllLandingVisualProfiles() {
  return [...zoneVisualProfiles.values(), ...serviceVisualProfiles.values()];
}
