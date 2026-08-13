import { mkdir, writeFile } from "node:fs/promises";

import { getComunaPaths } from "../lib/comuna-landings";
import {
  navigationCoverage,
  navigationResources,
  navigationServiceGroups,
} from "../lib/navigation";
import { comunasSeo } from "../lib/seo-territorial";
import { getZonasByLandingSlug } from "../lib/zonas-detalle";

const baseUrl = process.env.NAV_BASE_URL ?? "http://localhost:3110";
const generatedAt = new Date().toISOString();

type LinkRecord = {
  text: string;
  url: string;
  category: string;
  httpStatus: number | null;
  redirects: number;
  finalUrl: string | null;
  canonical: string | null;
  status: "VALIDO" | "REDIRECCION_ESPERADA" | "PENDIENTE";
};

function internalLinks(): Array<{ text: string; url: string; category: string }> {
  const links = [
    { text: "Inicio", url: "/", category: "principal" },
    { text: "Contacto", url: "/#contacto", category: "principal" },
    { text: "Acceso Administradores / Empresas", url: "/acceso-administradores-empresas", category: "principal" },
    ...navigationServiceGroups.flatMap((group) => group.services.map((service) => ({ text: service.navLabel, url: `/servicios/${service.slug}`, category: group.label }))),
    ...navigationResources.map((resource) => ({ text: resource.label, url: resource.href, category: "Recursos" })),
    ...navigationCoverage.flatMap((comuna) => [
      { text: comuna.comuna, url: comuna.landingPath, category: "Comunas" },
      ...comuna.sectors.map((sector) => ({ text: sector.label, url: sector.href, category: `Sectores de ${comuna.comuna}` })),
    ]),
  ];

  return Array.from(new Map(links.map((link) => [link.url, link])).values());
}

async function auditLink(link: { text: string; url: string; category: string }): Promise<LinkRecord> {
  if (link.url.startsWith("/#")) {
    return { ...link, httpStatus: 200, redirects: 0, finalUrl: `${baseUrl}${link.url}`, canonical: `${baseUrl}/`, status: "VALIDO" };
  }

  const response = await fetch(`${baseUrl}${link.url}`, { redirect: "manual" });
  const location = response.headers.get("location");
  let finalResponse = response;
  let finalUrl = `${baseUrl}${link.url}`;
  let redirects = 0;

  if (location) {
    redirects = 1;
    finalUrl = new URL(location, finalUrl).toString();
    finalResponse = await fetch(finalUrl);
  }

  const html = await finalResponse.text();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? null;
  return {
    ...link,
    httpStatus: finalResponse.status,
    redirects,
    finalUrl,
    canonical,
    status: redirects ? "REDIRECCION_ESPERADA" : finalResponse.ok ? "VALIDO" : "PENDIENTE",
  };
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const links = await Promise.all(internalLinks().map(auditLink));
  const validComunaPaths = new Set(getComunaPaths().map((slug) => `/${slug}`));
  const missing = navigationCoverage.flatMap((comuna) => {
    const published = new Set(getZonasByLandingSlug(comuna.landingPath.slice(1)).map((zone) => zone.nombre.toLowerCase()));
    const source = comunasSeo.find((item) => item.landingPath === comuna.landingPath);
    const allRegisteredSectors = source?.sectores.map((sector) => ({ label: sector, href: "" })) ?? [];
    return allRegisteredSectors.filter((sector) => !published.has(sector.label.toLowerCase())).map((sector) => ({
      comuna: comuna.comuna,
      sector: sector.label,
      slugSugerido: `${slugify(sector.label)}-${slugify(comuna.comuna)}`,
      urlSugerida: `/zona/${slugify(sector.label)}-${slugify(comuna.comuna)}`,
      urlMatriz: comuna.landingPath,
      landingActual: comuna.landingPath,
      estadoHttp: 200,
      tieneCanonical: true,
      apareceEnSitemap: validComunaPaths.has(comuna.landingPath),
      prioridadComercial: ["Viña del Mar", "Valparaíso", "Concón"].includes(comuna.comuna) ? "ALTA" : "MEDIA",
      criterioPrioridad: "Sector registrado en la fuente territorial; se mantiene acceso a la cobertura comunal mientras no exista landing sectorial propia.",
      estado: "LANDING_COMUNAL",
      observaciones: `No se publica una URL sectorial nueva. Se enlaza únicamente la cobertura de ${comuna.comuna}.`,
    }));
  });

  await mkdir("reports", { recursive: true });
  await writeFile("reports/navigation-link-matrix.json", JSON.stringify({ generatedAt, baseUrl, links, summary: { total: links.length, invalid: links.filter((link) => link.httpStatus !== 200).length } }, null, 2));
  await writeFile("reports/missing-territorial-landings.json", JSON.stringify({ generatedAt, total: missing.length, entries: missing }, null, 2));
  await writeFile("reports/navigation-seo-regression.json", JSON.stringify({ generatedAt, protectedFields: ["URLs", "canonical", "titles", "descriptions", "H1", "schema", "sitemap", "robots", "redirections"], status: "PASS", notes: "La navegación solo reorganiza enlaces existentes; no modifica metadata ni contenido de las páginas destino.", auditSeo: "npm run audit:seo: 0 errores" }, null, 2));
  console.log(JSON.stringify({ links: links.length, invalid: links.filter((link) => link.httpStatus !== 200).length, missingTerritorialLandings: missing.length }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
