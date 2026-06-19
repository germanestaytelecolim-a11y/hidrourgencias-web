import fs from "node:fs";
import path from "node:path";

import { load } from "js-yaml";

const contentRoot = path.join(process.cwd(), "content");

type Frontmatter = Record<string, unknown>;

export type CmsHomeSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
};

export type CmsEquipmentItem = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type CmsFeaturedService = {
  title: string;
  description: string;
  image: string;
  alt: string;
  url: string;
};

export type CmsClientItem = {
  name: string;
  logo?: string;
  alt: string;
  description?: string;
};

export type CmsCommercialBlock = {
  title: string;
  text: string;
  image?: string;
  alt?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export type CmsGalleryImage = {
  image: string;
  alt: string;
};

export type CmsCaseEntry = {
  slug: string;
  published: boolean;
  title: string;
  subtitle?: string;
  description: string;
  service: string;
  commune: string;
  date?: string;
  client?: string;
  image: string;
  alt: string;
  gallery: CmsGalleryImage[];
  videoUrl?: string;
  body: string;
};

export type CmsGalleryEntry = {
  slug: string;
  published: boolean;
  title: string;
  description?: string;
  service?: string;
  commune?: string;
  date?: string;
  image: string;
  alt: string;
};

export type CmsVideoEntry = {
  slug: string;
  published: boolean;
  title: string;
  description?: string;
  service?: string;
  commune?: string;
  date?: string;
  videoUrl: string;
  thumbnail: string;
  thumbnailAlt: string;
};

export type CmsBlogEntry = {
  slug: string;
  published: boolean;
  title: string;
  h1: string;
  description: string;
  heroSummary: string;
  date?: string;
  image: string;
  alt: string;
  keywords: string[];
  ctaMessage: string;
  body: string;
};

const defaultHomeSettings: CmsHomeSettings = {
  heroTitle: "Disponibles 24/7 en la Región de Valparaíso",
  heroSubtitle: "Urgencias sanitarias 24 horas con respuesta técnica",
  heroImage: "/images/logo-hidrourgencias.jpg",
  heroImageAlt: "Logo Hidrourgencias SpA",
  primaryCtaText: "WhatsApp urgencia",
  primaryCtaUrl: "whatsapp:Urgencia sanitaria: necesito ayuda inmediata en la Región de Valparaíso",
  secondaryCtaText: "Servicios sanitarios",
  secondaryCtaUrl: "/#servicios",
};

const defaultEquipmentItems: CmsEquipmentItem[] = [
  {
    title: "RIDGID K-50",
    description: "Destape compacto para redes interiores, desagües, WC, lavamanos, lavaplatos y urinarios.",
    image: "/images/PRINCIPAL/WhatsApp Image 2026-05-19 at 3.36.38 PM.jpeg",
    alt: "Equipo RIDGID K-50 para destape de redes interiores",
  },
  {
    title: "RIDGID K-1500",
    description: "Destape profesional de colectores principales, cámaras y redes horizontales.",
    image: "/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.30.50 AM.jpeg",
    alt: "Equipo RIDGID K-1500 para colectores y cámaras sanitarias",
  },
  {
    title: "Hidrojet de alta presión",
    description: "Limpieza hidrodinámica de redes con grasa, sarro, sedimentos y residuos adheridos.",
    image: "/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.54.35 AM.jpeg",
    alt: "Hidrojet de alta presión para limpieza sanitaria",
  },
  {
    title: "Videoinspección sanitaria",
    description: "Diagnóstico visual de fisuras, contrapendientes, raíces, sedimentos y deformaciones.",
    image: "/images/PRINCIPAL/WhatsApp Image 2026-05-15 at 10.19.09 PM.jpeg",
    alt: "Videoinspección sanitaria para diagnóstico de redes",
  },
  {
    title: "Motobombas",
    description: "Extracción de aguas acumuladas en emergencias sanitarias, cámaras, subterráneos y espacios técnicos.",
    image: "/images/hero-motobomba.jpg",
    alt: "Motobomba para extracción de aguas en urgencias sanitarias",
  },
  {
    title: "Herramientas de diagnóstico",
    description: "Revisión técnica de puntos sanitarios, cámaras, artefactos y tramos con pérdida de flujo.",
    image: "/images/trabajo-3.jpg",
    alt: "Herramientas de diagnóstico para redes sanitarias",
  },
  {
    title: "Sanitización e higienización",
    description: "Limpieza, control de olores y recuperación de espacios afectados por aguas servidas o residuos.",
    image: "/images/servicios/default (2).jpg",
    alt: "Sanitización e higienización posterior a contingencias sanitarias",
  },
];

const defaultFeaturedServices: CmsFeaturedService[] = [
  {
    title: "Destape de alcantarillado y desagües",
    description: "Eliminación de obstrucciones en redes sanitarias, desagües y alcantarillado con equipos profesionales.",
    image: "/images/hero-urgencia.jpg",
    alt: "Destape de alcantarillado y desagües",
    url: "/servicios/destape-alcantarillado",
  },
  {
    title: "Hidrojet de alta presión",
    description: "Lavado técnico para remover grasa, sarro, sedimentos y residuos adheridos en tuberías sanitarias.",
    image: "/images/hero-hidrojet.jpg",
    alt: "Hidrojet de alta presión",
    url: "/servicios/hidrojet",
  },
  {
    title: "Destape de edificios",
    description: "Respuesta para comunidades, salas técnicas, cámaras y redes compartidas con trazabilidad operativa.",
    image: "/images/servicios/default (3).jpg",
    alt: "Destape de edificios y comunidades",
    url: "/servicios/destape-edificios",
  },
  {
    title: "Destape de verticales",
    description: "Intervención de bajadas sanitarias, shaft y ductos verticales con control por tramo.",
    image: "/images/servicios/default (4).jpg",
    alt: "Destape de verticales sanitarias",
    url: "/servicios/destape-verticales",
  },
  {
    title: "Destape de horizontales",
    description: "Recuperación de colectores, tramos entre cámaras y redes principales con prueba de flujo final.",
    image: "/images/trabajo-1.jpg",
    alt: "Destape de redes horizontales",
    url: "/servicios/destape-horizontales",
  },
  {
    title: "Mantención preventiva de redes",
    description: "Planes programados para reducir rebalses, reincidencias y costos por urgencias repetidas.",
    image: "/images/hero-mantencion.jpg",
    alt: "Mantención preventiva de redes sanitarias",
    url: "/servicios/mantencion-preventiva-redes",
  },
  {
    title: "Destape de cámaras de inspección",
    description: "Limpieza de cámaras saturadas, grasa, sedimentos y puntos críticos de alcantarillado.",
    image: "/images/servicios/default (2).jpg",
    alt: "Destape de cámaras de inspección",
    url: "/servicios/destape-camaras-inspeccion",
  },
  {
    title: "Destape de artefactos sanitarios",
    description: "Solución para WC, lavamanos, lavaplatos, urinarios y desagües interiores con mínima intervención.",
    image: "/images/servicios/default (1).jpg",
    alt: "Destape de artefactos sanitarios",
    url: "/servicios/destape-artefactos-sanitarios",
  },
  {
    title: "Videoinspección sanitaria",
    description: "Diagnóstico visual de fisuras, contrapendientes, raíces, sedimentos y deformaciones internas.",
    image: "/images/trabajo-2.jpg",
    alt: "Videoinspección sanitaria",
    url: "/servicios/destape-camaras-inspeccion",
  },
  {
    title: "Motobombas para extracción de aguas",
    description: "Extracción de aguas acumuladas en emergencias, inundaciones, cámaras y espacios técnicos.",
    image: "/images/hero-motobomba.jpg",
    alt: "Motobombas para extracción de aguas",
    url: "/servicios/motobombas-extraccion-aguas",
  },
  {
    title: "Limpieza, higienización y sanitización",
    description: "Recuperación de higiene, control de olores y sanitización tras rebalses o aguas servidas.",
    image: "/images/servicios/default (2).jpg",
    alt: "Limpieza higienización y sanitización",
    url: "/servicios/limpieza-higienizacion-sanitizacion",
  },
  {
    title: "Reparación de tuberías HDPE",
    description: "Reparaciones técnicas en redes HDPE para recuperar continuidad sanitaria y reducir filtraciones.",
    image: "/images/hero-mantencion.jpg",
    alt: "Reparación de tuberías HDPE",
    url: "/servicios/reparacion-tuberias-hdpe",
  },
];

const defaultClients: CmsClientItem[] = [
  { name: "KFC", logo: "/logos/kfc.webp", alt: "Logo de KFC", description: "Restaurantes y continuidad operativa" },
  { name: "Sheraton", alt: "Cliente Sheraton", description: "Hoteles y operación de alto estándar" },
  { name: "Mesita Grande", logo: "/logos/mesita-grande.png", alt: "Logo de Mesita Grande", description: "Locales gastronómicos" },
  { name: "UPLA", alt: "Cliente Universidad de Playa Ancha", description: "Universidades e instituciones" },
  { name: "Bomberos", alt: "Cliente Bomberos", description: "Instituciones de respuesta pública" },
  { name: "Carabineros", logo: "/logos/carabineros.png", alt: "Logo de Carabineros", description: "Instituciones públicas" },
  { name: "Comunidades y edificios", alt: "Cliente comunidades y edificios", description: "Administraciones y condominios" },
  { name: "Restaurantes y locales", alt: "Cliente restaurantes y locales", description: "Comercio, cocinas y atención al público" },
];

const defaultCommercialBlocks: CmsCommercialBlock[] = [
  {
    title: "Especialistas en urgencias sanitarias",
    text: "Intervenimos rebalses, cámaras saturadas, verticales obstruidas y redes críticas con criterio técnico y trazabilidad.",
  },
  {
    title: "Respuesta para operación continua",
    text: "Soporte para edificios, comunidades, empresas, restaurantes e instituciones que necesitan recuperar servicio sin improvisación.",
  },
  {
    title: "Maquinaria profesional RIDGID",
    text: "Equipos mecánicos, hidrojet, videoinspección y motobombas para diagnosticar, destapar y prevenir reincidencias.",
  },
  {
    title: "Cobertura técnica regional",
    text: "Atención 24/7 en comunas y sectores estratégicos de la Región de Valparaíso, con prioridad para emergencias.",
  },
];

function readFrontmatter(filePath: string): { data: Frontmatter; body: string } {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (!match) {
      return { data: {}, body: raw.trim() };
    }

    const parsed = load(match[1]);
    return {
      data: parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Frontmatter) : {},
      body: raw.slice(match[0].length).trim(),
    };
  } catch {
    return { data: {}, body: "" };
  }
}

function readSettingsFile(fileName: string) {
  return readFrontmatter(path.join(contentRoot, "site-settings", fileName)).data;
}

function readCollection(folder: string): Array<{ slug: string; data: Frontmatter; body: string }> {
  const folderPath = path.join(contentRoot, folder);

  try {
    return fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => {
        const filePath = path.join(folderPath, entry.name);
        const { data, body } = readFrontmatter(filePath);
        return {
          slug: asString(data.slug, path.basename(entry.name, ".md")),
          data,
          body,
        };
      })
      .sort((a, b) => asString(b.data.date, "").localeCompare(asString(a.data.date, "")));
  } catch {
    return [];
  }
}

function asString(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

function asBoolean(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizePublicPath(value: unknown, fallback: string) {
  const raw = asString(value, fallback).replace(/\\/g, "/");

  if (raw.startsWith("public/")) {
    return raw.replace(/^public/, "");
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  return raw ? `/${raw}` : fallback;
}

function mergeList<T>(items: unknown, mapper: (item: unknown, index: number) => T | null, fallback: T[]) {
  const mapped = asArray(items)
    .map(mapper)
    .filter((item): item is T => item !== null);

  return mapped.length ? mapped : fallback;
}

function mapEquipmentItem(item: unknown, index: number): CmsEquipmentItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Frontmatter;
  const fallback = defaultEquipmentItems[index] ?? defaultEquipmentItems[0];
  const title = asString(record.title, fallback.title);

  return {
    title,
    description: asString(record.description, fallback.description),
    image: normalizePublicPath(record.image, fallback.image),
    alt: asString(record.alt, `${title} de Hidrourgencias SpA`),
  };
}

function mapFeaturedService(item: unknown, index: number): CmsFeaturedService | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Frontmatter;
  const fallback = defaultFeaturedServices[index] ?? defaultFeaturedServices[0];
  const title = asString(record.title, fallback.title);

  return {
    title,
    description: asString(record.description, fallback.description),
    image: normalizePublicPath(record.image, fallback.image),
    alt: asString(record.alt, `${title} de Hidrourgencias SpA`),
    url: asString(record.url, fallback.url),
  };
}

function mapClientItem(item: unknown, index: number): CmsClientItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Frontmatter;
  const fallback = defaultClients[index] ?? defaultClients[0];
  const name = asString(record.name, fallback.name);
  const logo = normalizeOptionalPublicPath(record.logo);

  return {
    name,
    ...(logo ? { logo } : {}),
    alt: asString(record.alt, logo ? `Logo de ${name}` : `Cliente ${name}`),
    description: asString(record.description, fallback.description ?? "Cliente atendido por Hidrourgencias SpA"),
  };
}

function mapCommercialBlock(item: unknown, index: number): CmsCommercialBlock | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Frontmatter;
  const fallback = defaultCommercialBlocks[index] ?? defaultCommercialBlocks[0];
  const title = asString(record.title, fallback.title);
  const image = normalizeOptionalPublicPath(record.image);
  const ctaText = asString(record.cta_text, "");
  const ctaUrl = asString(record.cta_url, "");

  return {
    title,
    text: asString(record.text, fallback.text),
    ...(image ? { image } : {}),
    alt: asString(record.alt, title),
    ...(ctaText ? { ctaText } : {}),
    ...(ctaUrl ? { ctaUrl } : {}),
  };
}

function normalizeOptionalPublicPath(value: unknown) {
  const raw = asString(value, "");

  if (!raw) {
    return undefined;
  }

  return normalizePublicPath(raw, raw);
}

function mapGallery(value: unknown, fallbackAlt: string): CmsGalleryImage[] {
  return asArray(value)
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          image: normalizePublicPath(item, ""),
          alt: `${fallbackAlt} - imagen ${index + 1}`,
        };
      }

      if (item && typeof item === "object") {
        const record = item as Frontmatter;
        const image = normalizePublicPath(record.image ?? record.src, "");

        if (!image) {
          return null;
        }

        return {
          image,
          alt: asString(record.alt, `${fallbackAlt} - imagen ${index + 1}`),
        };
      }

      return null;
    })
    .filter((item): item is CmsGalleryImage => item !== null);
}

function mapCaseEntry(entry: { slug: string; data: Frontmatter; body: string }): CmsCaseEntry {
  const title = asString(entry.data.title, entry.slug.replace(/-/g, " "));
  const service = asString(entry.data.service, "Destape de alcantarillado y desagües");
  const commune = asString(entry.data.commune, "Región de Valparaíso");
  const description = asString(
    entry.data.description,
    `Trabajo técnico de ${service.toLowerCase()} realizado por Hidrourgencias SpA en ${commune}.`,
  );

  return {
    slug: entry.slug,
    published: asBoolean(entry.data.published, true),
    title,
    subtitle: asString(entry.data.subtitle, ""),
    description,
    service,
    commune,
    date: asString(entry.data.date, ""),
    client: asString(entry.data.client, "Cliente Hidrourgencias"),
    image: normalizePublicPath(entry.data.image, "/images/hero-urgencia.jpg"),
    alt: asString(entry.data.alt, `${title} - ${service} en ${commune}`),
    gallery: mapGallery(entry.data.gallery, title),
    videoUrl: asString(entry.data.video_url, ""),
    body: entry.body,
  };
}

function mapGalleryEntry(entry: { slug: string; data: Frontmatter }): CmsGalleryEntry {
  const title = asString(entry.data.title, entry.slug.replace(/-/g, " "));

  return {
    slug: entry.slug,
    published: asBoolean(entry.data.published, true),
    title,
    description: asString(entry.data.description, ""),
    service: asString(entry.data.service, ""),
    commune: asString(entry.data.commune, ""),
    date: asString(entry.data.date, ""),
    image: normalizePublicPath(entry.data.image, "/images/trabajo-1.jpg"),
    alt: asString(entry.data.alt, `${title} - Hidrourgencias SpA`),
  };
}

function mapVideoEntry(entry: { slug: string; data: Frontmatter }): CmsVideoEntry {
  const title = asString(entry.data.title, entry.slug.replace(/-/g, " "));

  return {
    slug: entry.slug,
    published: asBoolean(entry.data.published, true),
    title,
    description: asString(entry.data.description, ""),
    service: asString(entry.data.service, ""),
    commune: asString(entry.data.commune, ""),
    date: asString(entry.data.date, ""),
    videoUrl: asString(entry.data.video_url, ""),
    thumbnail: normalizePublicPath(entry.data.thumbnail, "/images/hero-urgencia.jpg"),
    thumbnailAlt: asString(entry.data.thumbnail_alt, `${title} - video Hidrourgencias SpA`),
  };
}

function mapBlogEntry(entry: { slug: string; data: Frontmatter; body: string }): CmsBlogEntry {
  const h1 = asString(entry.data.h1, asString(entry.data.title, entry.slug.replace(/-/g, " ")));
  const title = asString(entry.data.title, h1);
  const description = asString(
    entry.data.description,
    `Guía técnica de Hidrourgencias SpA sobre ${h1.toLowerCase()}.`,
  );
  const rawKeywords = asArray(entry.data.keywords);
  const keywords = rawKeywords
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        return asString((item as Frontmatter).keyword, "");
      }

      return "";
    })
    .filter(Boolean);

  return {
    slug: entry.slug,
    published: asBoolean(entry.data.published, true),
    title,
    h1,
    description,
    heroSummary: asString(entry.data.hero_summary, description),
    date: asString(entry.data.date, ""),
    image: normalizePublicPath(entry.data.image, "/images/hero-mantencion.jpg"),
    alt: asString(entry.data.alt, h1),
    keywords: keywords.length ? keywords : ["destape de alcantarillado", "urgencias sanitarias", "hidrojet"],
    ctaMessage: asString(
      entry.data.cta_message,
      `Hola, necesito orientación técnica sobre ${h1.toLowerCase()} con Hidrourgencias SpA.`,
    ),
    body: entry.body,
  };
}

export function getCmsHomeSettings(): CmsHomeSettings {
  const data = readSettingsFile("home.md");

  return {
    heroTitle: asString(data.hero_title, defaultHomeSettings.heroTitle),
    heroSubtitle: asString(data.hero_subtitle, defaultHomeSettings.heroSubtitle),
    heroImage: normalizePublicPath(data.hero_image, defaultHomeSettings.heroImage),
    heroImageAlt: asString(data.hero_image_alt, defaultHomeSettings.heroImageAlt),
    primaryCtaText: asString(data.primary_cta_text, defaultHomeSettings.primaryCtaText),
    primaryCtaUrl: asString(data.primary_cta_url, defaultHomeSettings.primaryCtaUrl),
    secondaryCtaText: asString(data.secondary_cta_text, defaultHomeSettings.secondaryCtaText),
    secondaryCtaUrl: asString(data.secondary_cta_url, defaultHomeSettings.secondaryCtaUrl),
  };
}

export function getCmsEquipmentItems() {
  const data = readSettingsFile("equipment.md");
  return mergeList(data.items, mapEquipmentItem, defaultEquipmentItems);
}

export function getCmsFeaturedServices() {
  const data = readSettingsFile("featured-services.md");
  return mergeList(data.items, mapFeaturedService, defaultFeaturedServices);
}

export function getCmsClients() {
  const data = readSettingsFile("clients.md");
  return mergeList(data.items, mapClientItem, defaultClients);
}

export function getCmsCommercialBlocks() {
  const data = readSettingsFile("commercial-blocks.md");
  return mergeList(data.items, mapCommercialBlock, defaultCommercialBlocks);
}

export function getCmsCaseEntries() {
  return readCollection("casos-exito")
    .map(mapCaseEntry)
    .filter((entry) => entry.published);
}

export function getCmsWorkEntries() {
  return readCollection("trabajos-reales")
    .map(mapCaseEntry)
    .filter((entry) => entry.published);
}

export function getCmsGalleryEntries() {
  return readCollection("galeria")
    .map(mapGalleryEntry)
    .filter((entry) => entry.published);
}

export function getCmsVideoEntries() {
  return readCollection("videos")
    .map(mapVideoEntry)
    .filter((entry) => entry.published && entry.videoUrl);
}

export function getCmsBlogEntries() {
  return readCollection("blog")
    .map(mapBlogEntry)
    .filter((entry) => entry.published);
}

export function getCmsHighlightedClients() {
  return readCollection("clientes-destacados")
    .map((entry) => {
      const item = mapClientItem(entry.data, 0);
      return item ? { ...item, slug: entry.slug, published: asBoolean(entry.data.published, true) } : null;
    })
    .filter((item): item is CmsClientItem & { slug: string; published: boolean } => Boolean(item?.published));
}
