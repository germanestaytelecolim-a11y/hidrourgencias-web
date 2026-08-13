import { getComunaPaths } from "@/lib/comuna-landings";
import { getAllServicios, type ServicioPageData } from "@/lib/servicios";
import { comunasSeo } from "@/lib/seo-territorial";
import { getZonasByLandingSlug } from "@/lib/zonas-detalle";

export type NavigationService = Pick<ServicioPageData, "slug" | "navLabel"> & {
  priority?: boolean;
};

export type NavigationServiceGroup = {
  label: string;
  services: NavigationService[];
};

export type NavigationCoverage = {
  comuna: string;
  landingPath: string;
  sectors: Array<{ label: string; href: string }>;
};

const priorityServiceSlugs = [
  "destape-alcantarillado",
  "hidrojet",
  "mantencion-preventiva-redes",
  "destape-artefactos-sanitarios",
  "destape-verticales",
] as const;

const serviceBySlug = new Map(getAllServicios().map((service) => [service.slug, service] as const));
const priorityIndex = new Map<string, number>(priorityServiceSlugs.map((slug, index) => [slug, index]));

function getServices(slugs: string[]): NavigationService[] {
  return slugs
    .map((slug) => serviceBySlug.get(slug))
    .filter((service): service is ServicioPageData => Boolean(service))
    .map((service) => ({
      slug: service.slug,
      navLabel: service.navLabel,
      priority: priorityIndex.has(service.slug),
    }));
}

export const navigationServiceGroups: NavigationServiceGroup[] = [
  {
    label: "Destapes e hidrojet",
    services: getServices([
      "destape-alcantarillado",
      "hidrojet",
      "destape-artefactos-sanitarios",
      "destape-camaras-inspeccion",
      "destape-verticales",
      "destape-horizontales",
      "destape-edificios",
    ]),
  },
  {
    label: "Mantenimiento y prevencion",
    services: getServices([
      "mantencion-preventiva-redes",
      "asesoria-mantenimiento-integral-redes-sanitarias",
      "limpieza-higienizacion-sanitizacion",
      "limpieza-domicilios-recuperacion-espacios",
      "limpieza-fachadas-hidrolavado-superficies",
    ]),
  },
  {
    label: "Diagnostico y apoyo tecnico",
    services: getServices([
      "analisis-tecnico-propiedad-redes-sanitarias",
      "motobombas-extraccion-aguas",
      "extraccion-aguas-estanques-piscinas",
      "reparacion-tuberias-hdpe",
    ]),
  },
];

export const navigationPriorityServices = priorityServiceSlugs
  .map((slug) => serviceBySlug.get(slug))
  .filter((service): service is ServicioPageData => Boolean(service))
  .sort((a, b) => (priorityIndex.get(a.slug) ?? 99) - (priorityIndex.get(b.slug) ?? 99))
  .map((service) => ({ slug: service.slug, navLabel: service.navLabel, priority: true }));

const validComunaPaths = new Set(getComunaPaths().map((slug) => `/${slug}`));

export const navigationCoverage: NavigationCoverage[] = comunasSeo
  .filter((comuna) => validComunaPaths.has(comuna.landingPath))
  .map((comuna) => ({
    comuna: comuna.comuna,
    landingPath: comuna.landingPath,
    sectors: getZonasByLandingSlug(comuna.landingPath.slice(1)).map((zone) => ({
      label: zone.nombre,
      href: `/zona/${zone.slug}`,
    })),
  }));

export const navigationResources = [
  { label: "Evidencia operativa", href: "/#clientes" },
  { label: "Casos de exito", href: "/casos-de-exito" },
  { label: "Blog tecnico", href: "/blog" },
] as const;

export function getNavigationServiceGroupForSlug(slug: string) {
  return navigationServiceGroups.find((group) => group.services.some((service) => service.slug === slug));
}
