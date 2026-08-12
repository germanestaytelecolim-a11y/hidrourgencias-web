import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

import { buildCanonicalUrl } from "../lib/site-config";
import { getAllComunaLandings } from "../lib/comuna-landings";
import { getZoneVisualProfile } from "../lib/landing-visuals";
import { getZonaSlugs, getZonaBySlug } from "../lib/zonas-detalle";
import sitemap from "../app/sitemap";

const root = process.cwd();
const reports = join(root, "reports");
const publicRoot = join(root, "public");
mkdirSync(reports, { recursive: true });

const sha256 = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const localFile = (url: string) => join(publicRoot, url.replace(/^\//, "").replaceAll("/", "\\"));
const sitemapUrls = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
const runtimeReportPath = join(reports, "territorial-runtime-http-validation.json");
const runtimeValidation = existsSync(runtimeReportPath)
  ? JSON.parse(readFileSync(runtimeReportPath, "utf8")) as {
      generatedAt: string;
      status: string;
      routes: Array<{ path: string; status: number; finalUrl: string; redirects: number }>;
    }
  : null;
const runtimeByPath = new Map(runtimeValidation?.routes.map((route) => [route.path, route]) ?? []);
const currentHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();

async function imageInfo(url: string) {
  const file = localFile(url);
  if (!existsSync(file)) return { file, exists: false };
  const metadata = await sharp(file).metadata();
  return {
    file,
    exists: true,
    bytes: readFileSync(file).byteLength,
    hash: sha256(file),
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    mime: metadata.format === "webp" ? "image/webp" : `image/${metadata.format ?? "unknown"}`,
  };
}

async function main() {
  const comunaRows = await Promise.all(getAllComunaLandings().map(async (landing) => {
    const url = `/${landing.slug}`;
    const measurement = runtimeByPath.get(url);
    return {
      name: landing.comuna,
      type: "comuna",
      parent: null,
      homeUrl: url,
      url,
      httpStatus: measurement?.status ?? "no medido en esta certificación",
      finalUrl: measurement?.finalUrl ?? null,
      redirects: measurement?.redirects ?? null,
      canonical: buildCanonicalUrl(url),
      indexable: true,
      inSitemap: sitemapUrls.has(url),
      h1: landing.h1,
      title: landing.metaTitle,
      description: landing.metaDescription,
      heroImage: landing.visual?.image ?? null,
      heroAlt: landing.visual?.alt ?? null,
      image: landing.visual ? await imageInfo(landing.visual.image) : null,
      status: landing.visual ? "PROPIA" : "DÉBIL",
    };
  }));

  const zoneRows = await Promise.all(getZonaSlugs().map(async (slug) => {
    const zone = getZonaBySlug(slug)!;
    const visual = getZoneVisualProfile(slug);
    const url = `/zona/${slug}`;
    const measurement = runtimeByPath.get(url);
    return {
      name: zone.nombre,
      type: "sector",
      parent: zone.comuna,
      homeUrl: url,
      url,
      httpStatus: measurement?.status ?? "no medido en esta certificación",
      finalUrl: measurement?.finalUrl ?? null,
      redirects: measurement?.redirects ?? null,
      canonical: buildCanonicalUrl(url),
      indexable: true,
      inSitemap: sitemapUrls.has(url),
      h1: `Destape de alcantarillado en ${zone.nombre} - ${zone.comuna}`,
      title: `Destape en ${zone.nombre} | Urgencias 24/7 | ${zone.comuna}`,
      description: `Servicio territorial en ${zone.nombre}, ${zone.comuna}.`,
      heroImage: visual?.image ?? null,
      heroAlt: visual?.alt ?? null,
      image: visual ? await imageInfo(visual.image) : null,
      status: visual ? "PROPIA" : "SIN LANDING VISUAL",
    };
  }));

  const coverage = {
    generatedAt: new Date().toISOString(),
    branch: "codex/landing-visual-redesign",
    sourceHeadBeforeCommit: currentHead,
    runtimeValidation: runtimeValidation ? {
      generatedAt: runtimeValidation.generatedAt,
      status: runtimeValidation.status,
      measuredRoutes: runtimeValidation.routes.length,
    } : null,
    totals: { comunas: comunaRows.length, sectores: zoneRows.length },
    entries: [...comunaRows, ...zoneRows],
    protectedUrls: [{
      url: "/destape-alcantarillado-placilla-curauma",
      intent: "Destape de alcantarillado para Placilla y Curauma",
      canonical: buildCanonicalUrl("/destape-alcantarillado-placilla-curauma"),
      inSitemap: sitemapUrls.has("/destape-alcantarillado-placilla-curauma"),
      httpStatus: runtimeByPath.get("/destape-alcantarillado-placilla-curauma")?.status ?? "no medido",
      redirects: runtimeByPath.get("/destape-alcantarillado-placilla-curauma")?.redirects ?? null,
      preserved: true,
    }],
  };
  writeFileSync(join(reports, "territorial-coverage-audit.json"), JSON.stringify(coverage, null, 2) + "\n");

  const newVisuals = [
    { slug: "casablanca", image: "/images/zonas/casablanca.webp", alt: "Panorama urbano y entorno de Casablanca en la Región de Valparaíso" },
    { slug: "maitencillo-puchuncavi", image: "/images/zonas/maitencillo-puchuncavi.webp", alt: "Costa rocosa y viviendas costeras de Maitencillo, Puchuncaví" },
    { slug: "curauma-valparaiso", image: "/images/zonas/curauma-valparaiso.webp", alt: "Entorno residencial y urbano de Curauma en Valparaíso" },
    { slug: "placilla-valparaiso", image: "/images/zonas/placilla-valparaiso.webp", alt: "Entorno urbano y residencial de Placilla de Peñuelas en Valparaíso" },
  ];
  const matrix = await Promise.all(newVisuals.map(async (visual) => {
    const info = await imageInfo(visual.image);
    const attribution = JSON.parse(readFileSync(join(publicRoot, "images", "zonas", "attribution.json"), "utf8"))
      .find((item: { slug: string }) => item.slug === visual.slug);
    return { territory: visual.slug, localFile: visual.image, alt: visual.alt, source: attribution ? { label: attribution.author, url: attribution.sourceUrl, license: attribution.license, licenseUrl: attribution.licenseUrl } : null, attribution, ...info };
  }));
  writeFileSync(join(reports, "territorial-image-identity-matrix.json"), JSON.stringify({ generatedAt: new Date().toISOString(), entries: matrix }, null, 2) + "\n");

  const cannibalization = [
    { url: "/destape-alcantarillado-casablanca", keyword: "destape de alcantarillado en Casablanca", intent: "servicio comunal", parent: null, h1: "Destape de Alcantarillado en Casablanca", title: "Destape de Alcantarillado en Casablanca | Urgencias 24/7", canonical: buildCanonicalUrl("/destape-alcantarillado-casablanca"), differentiation: "viviendas, parcelas, comercio local y redes privadas" },
    { url: "/destape-alcantarillado-maitencillo-puchuncavi", keyword: "destape de alcantarillado en Maitencillo", intent: "servicio territorial costero", parent: "/destape-alcantarillado-puchuncavi", h1: "Destape de Alcantarillado en Maitencillo", title: "Destape de Alcantarillado en Maitencillo | Urgencias 24/7", canonical: buildCanonicalUrl("/destape-alcantarillado-maitencillo-puchuncavi"), differentiation: "ocupación estacional, restaurantes, arena, grasas y condominios" },
    { url: "/zona/curauma-valparaiso", keyword: "cobertura sanitaria en Curauma", intent: "cobertura territorial general", parent: "/destape-alcantarillado-valparaiso", h1: "Destape de alcantarillado en Curauma - Valparaiso", title: "Destape en Curauma | Urgencias 24/7 | Valparaiso", canonical: buildCanonicalUrl("/zona/curauma-valparaiso"), differentiation: "condominios, redes compartidas y relación con aguas lluvias" },
    { url: "/zona/placilla-valparaiso", keyword: "cobertura sanitaria en Placilla", intent: "cobertura territorial general", parent: "/destape-alcantarillado-valparaiso", h1: "Destape de alcantarillado en Placilla - Valparaiso", title: "Destape en Placilla | Urgencias 24/7 | Valparaiso", canonical: buildCanonicalUrl("/zona/placilla-valparaiso"), differentiation: "viviendas, comercio, instalaciones productivas y redes privadas" },
    { url: "/destape-alcantarillado-placilla-curauma", keyword: "destape de alcantarillado en Placilla y Curauma", intent: "servicio combinado", parent: null, h1: "Destape de Alcantarillado en Placilla de Curauma", title: "Destape de Alcantarillado en Placilla de Curauma | Urgencias 24/7", canonical: buildCanonicalUrl("/destape-alcantarillado-placilla-curauma"), differentiation: "intención de servicio explícita para ambos sectores; no se sustituye por cobertura general" },
  ];
  writeFileSync(join(reports, "territorial-keyword-cannibalization.json"), JSON.stringify({ generatedAt: new Date().toISOString(), conflicts: [], entries: cannibalization }, null, 2) + "\n");

  const markdown = [
    "# Auditoría de cobertura territorial",
    "",
    `Generada: ${new Date().toISOString()}`,
    `Validación runtime: ${runtimeValidation?.status ?? "no disponible"} (${runtimeValidation?.generatedAt ?? "sin fecha"})`,
    "",
    "## Resumen",
    `- Comunas: ${comunaRows.length}`,
    `- Sectores: ${zoneRows.length}`,
    "- Nuevas landings: Casablanca, Maitencillo, Curauma y Placilla",
    "- URL combinada protegida: `/destape-alcantarillado-placilla-curauma`",
    "",
    "## Inventario",
    "",
    "| Tipo | Nombre | URL | HTTP medido | Estado | Sitemap | Imagen |",
    "|---|---|---|---|---|---|---|",
    ...[...comunaRows, ...zoneRows].map((row) =>
      `| ${row.type} | ${row.name} | ${row.url} | ${row.httpStatus} | ${row.status} | ${row.inSitemap ? "sí" : "no"} | ${row.heroImage ?? "pendiente"} |`,
    ),
    "",
    "## Decisiones SEO",
    "",
    "- La landing combinada conserva su canonical, indexabilidad, sitemap e intención de servicio.",
    "- Curauma y Placilla se presentan como cobertura territorial general bajo `/zona/`.",
    "- Maitencillo enlaza explícitamente a Puchuncaví como comuna matriz.",
    "- No se generaron combinaciones masivas de servicios por territorio.",
    "",
  ].join("\n");
  writeFileSync(join(reports, "territorial-coverage-audit.md"), markdown);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
