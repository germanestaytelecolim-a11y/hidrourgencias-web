import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sitemap, { getSitemapPriority, getSitemapRouteSpecs, type SitemapRouteKind } from "../app/sitemap";
import nextConfig from "../next.config";
import { getBlogSlugs } from "../lib/blog-data";
import { getComunaPaths } from "../lib/comuna-landings";
import {
  MAX_PROGRAMMATIC_ROUTES,
  getAllSeoRoutes,
  getPrioritySeoRoutes,
  reservedRootSlugs,
} from "../lib/seo-territorial";
import { buildCanonicalUrl, normalizeCanonicalPath, siteConfig } from "../lib/site-config";
import { getServicioSlugs } from "../lib/servicios";
import { getZonaSlugs } from "../lib/zonas-detalle";

type AuditRouteKind = SitemapRouteKind;

type AuditRouteSpec = {
  path: string;
  kind: AuditRouteKind;
  source: "home" | "blog-index" | "landing" | "blog-post" | "service" | "zone" | "programmatic";
};

type DuplicateEntry = {
  value: string;
  count: number;
};

type ManualIndexationLevel = {
  title: string;
  paths: string[];
};

const reportsDir = join(process.cwd(), "reports");
const seoAuditReportPath = join(reportsDir, "seo-audit.json");
const indexationPriorityPath = join(reportsDir, "indexation-priority.txt");

const manualIndexationLevels: ManualIndexationLevel[] = [
  {
    title: "NIVEL 1 - Base del sitio",
    paths: [
      "/",
      "/destape-alcantarillado-vina-del-mar",
      "/destape-alcantarillado-valparaiso",
      "/destape-alcantarillado-quilpue",
      "/destape-alcantarillado-villa-alemana",
    ],
  },
  {
    title: "NIVEL 2 - Servicios principales",
    paths: [
      "/servicios/destape-alcantarillado",
      "/servicios/hidrojet",
      "/servicios/destape-edificios",
      "/servicios/destape-verticales",
      "/servicios/destape-horizontales",
      "/servicios/destape-camaras-inspeccion",
      "/servicios/mantencion-preventiva-redes",
    ],
  },
  {
    title: "NIVEL 3 - Zonas estrategicas",
    paths: [
      "/zona/renaca-vina-del-mar",
      "/zona/recreo-vina-del-mar",
      "/zona/miraflores-vina-del-mar",
      "/zona/gomez-carreno-vina-del-mar",
      "/zona/cerro-baron-valparaiso",
      "/zona/belloto-norte-quilpue",
      "/zona/penablanca-villa-alemana",
    ],
  },
  {
    title: "NIVEL 4 - Programaticas de alta intencion",
    paths: [
      "/destape-alcantarillado-recreo-vina-del-mar",
      "/hidrojet-recreo-vina-del-mar",
      "/destape-edificios-recreo-vina-del-mar",
      "/destape-alcantarillado-renaca-vina-del-mar",
      "/hidrojet-renaca-vina-del-mar",
      "/destape-alcantarillado-cerro-baron-valparaiso",
    ],
  },
  {
    title: "NIVEL 5 - Blog tecnico",
    paths: [
      "/blog/rebalse-alcantarillado-edificio",
      "/blog/desague-lento-cocina",
      "/blog/camara-saturada-grasa",
      "/blog/mal-olor-alcantarillado",
      "/blog/grasa-redes-sanitarias",
      "/blog/raices-en-tuberias-alcantarillado",
      "/blog/inundacion-aguas-servidas",
    ],
  },
];

function ensureReportsDir() {
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
}

function findDuplicates(values: string[]): DuplicateEntry[] {
  return Object.entries(countBy(values))
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

function uniqueByPath(routes: AuditRouteSpec[]): AuditRouteSpec[] {
  return Array.from(
    new Map(
      routes.map((route) => {
        const path = normalizeCanonicalPath(route.path);
        return [path, { ...route, path }];
      }),
    ).values(),
  );
}

function getKnownRouteSpecs(): AuditRouteSpec[] {
  return uniqueByPath([
    { path: "/", kind: "home", source: "home" },
    { path: "/blog", kind: "blog-index", source: "blog-index" },
    ...getComunaPaths().map((slug) => ({ path: `/${slug}`, kind: "landing" as const, source: "landing" as const })),
    ...getZonaSlugs().map((slug) => ({ path: `/zona/${slug}`, kind: "zone" as const, source: "zone" as const })),
    ...getServicioSlugs().map((slug) => ({ path: `/servicios/${slug}`, kind: "service" as const, source: "service" as const })),
    ...getBlogSlugs().map((slug) => ({ path: `/blog/${slug}`, kind: "blog-post" as const, source: "blog-post" as const })),
    ...getAllSeoRoutes().map((route) => ({
      path: `/${route.slug}`,
      kind: "programmatic" as const,
      source: "programmatic" as const,
    })),
  ]);
}

function getRootDirectories(): string[] {
  const rootAppDir = join(process.cwd(), "app");

  if (!existsSync(rootAppDir)) {
    return [];
  }

  return readdirSync(rootAppDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("["));
}

function pathToSlug(path: string) {
  if (path === "/") {
    return "/";
  }

  return path.split("/").filter(Boolean).at(-1) ?? path;
}

function routePathFromUrl(url: string) {
  return normalizeCanonicalPath(new URL(url).pathname);
}

function isPatternPath(path: string) {
  return path.includes(":") || path.includes("*") || path.includes("(") || path.includes(")");
}

function destinationPath(destination: string): string | null {
  if (isPatternPath(destination)) {
    return null;
  }

  const url = new URL(destination, siteConfig.siteUrl);

  if (url.hostname !== new URL(siteConfig.siteUrl).hostname) {
    return null;
  }

  return normalizeCanonicalPath(url.pathname);
}

function writeIndexationPriorityReport(knownPathSet: Set<string>, sitemapPathSet: Set<string>) {
  const lines = [
    "Prioridad recomendada para solicitud manual en Google Search Console",
    "Sitio: https://hidrourgencias.cl",
    "",
  ];

  for (const level of manualIndexationLevels) {
    lines.push(level.title);

    for (const path of level.paths) {
      const normalizedPath = normalizeCanonicalPath(path);
      const status = knownPathSet.has(normalizedPath) ? "OK build" : "REVISAR build";
      const sitemapStatus = sitemapPathSet.has(normalizedPath) ? "en sitemap" : "fuera de sitemap";
      lines.push(`- ${buildCanonicalUrl(normalizedPath)} (${status}, ${sitemapStatus})`);
    }

    lines.push("");
  }

  writeFileSync(indexationPriorityPath, lines.join("\n"), "utf8");
}

async function main() {
  ensureReportsDir();

  const knownRoutes = getKnownRouteSpecs();
  const knownPaths = knownRoutes.map((route) => route.path);
  const knownPathSet = new Set(knownPaths);
  const allSeoRoutes = getAllSeoRoutes();
  const priorityProgrammaticRoutes = getPrioritySeoRoutes(MAX_PROGRAMMATIC_ROUTES);
  const priorityProgrammaticPathSet = new Set(priorityProgrammaticRoutes.map((route) => normalizeCanonicalPath(`/${route.slug}`)));
  const sitemapSpecs = getSitemapRouteSpecs();
  const sitemapEntries = sitemap();
  const sitemapPaths = sitemapEntries.map((entry) => routePathFromUrl(entry.url));
  const sitemapPathSet = new Set(sitemapPaths);
  const sitemapSpecByPath = new Map(sitemapSpecs.map((spec) => [normalizeCanonicalPath(spec.path), spec]));
  const redirects = nextConfig.redirects ? await nextConfig.redirects() : [];

  const rootDirectories = getRootDirectories();
  const reserved = new Set<string>([...reservedRootSlugs, ...rootDirectories]);
  const routeConflicts = allSeoRoutes
    .filter((route) => reserved.has(route.slug))
    .map((route) => ({
      slug: route.slug,
      url: buildCanonicalUrl(`/${route.slug}`),
      reason: "Programmatic root slug conflicts with a reserved or static app route.",
    }));

  const duplicateUrls = findDuplicates(knownPaths);
  const duplicateSlugs = findDuplicates(knownRoutes.map((route) => pathToSlug(route.path)).filter((slug) => slug !== "/"));
  const sitemapDuplicateUrls = findDuplicates(sitemapEntries.map((entry) => entry.url));
  const programmaticOutsideSitemap = allSeoRoutes
    .filter((route) => !priorityProgrammaticPathSet.has(normalizeCanonicalPath(`/${route.slug}`)))
    .map((route) => ({
      path: `/${route.slug}`,
      url: buildCanonicalUrl(`/${route.slug}`),
      service: route.service.nombre,
      comuna: route.comuna.comuna,
      sector: route.sector,
      reason: `Fuera del sitemap por MAX_PROGRAMMATIC_ROUTES=${MAX_PROGRAMMATIC_ROUTES}.`,
    }));
  const sitemapMissingBuild = sitemapPaths
    .filter((path) => !knownPathSet.has(path))
    .map((path) => ({ path, url: buildCanonicalUrl(path) }));

  const exactRedirects = redirects.filter((redirect) => !isPatternPath(redirect.source));
  const redirectSources = exactRedirects.map((redirect) => normalizeCanonicalPath(redirect.source));
  const redirectSourceSet = new Set(redirectSources);
  const redirectSourcesInSitemap = exactRedirects
    .filter((redirect) => sitemapPathSet.has(normalizeCanonicalPath(redirect.source)))
    .map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      sourceUrl: buildCanonicalUrl(redirect.source),
    }));
  const redirectLoops = exactRedirects
    .map((redirect) => ({
      source: normalizeCanonicalPath(redirect.source),
      destination: redirect.destination,
      destinationPath: destinationPath(redirect.destination),
    }))
    .filter((redirect) => redirect.destinationPath !== null && redirect.source === redirect.destinationPath);
  const redirectChains = exactRedirects
    .map((redirect) => ({
      source: normalizeCanonicalPath(redirect.source),
      destination: redirect.destination,
      destinationPath: destinationPath(redirect.destination),
    }))
    .filter((redirect) => redirect.destinationPath !== null && redirectSourceSet.has(redirect.destinationPath));
  const redirectDestinationsMissingBuild = exactRedirects
    .map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      destinationPath: destinationPath(redirect.destination),
    }))
    .filter((redirect) => redirect.destinationPath !== null && !knownPathSet.has(redirect.destinationPath))
    .map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      destinationPath: redirect.destinationPath,
    }));

  const expectedCanonicals = knownRoutes.map((route) => ({
    path: route.path,
    url: buildCanonicalUrl(route.path),
    canonical: buildCanonicalUrl(route.path),
    kind: route.kind,
    inSitemap: sitemapPathSet.has(route.path),
    indexable: true,
  }));

  const recommendedPriorities = sitemapPaths.map((path) => {
    const spec = sitemapSpecByPath.get(path);

    return {
      path,
      url: buildCanonicalUrl(path),
      kind: spec?.kind ?? "unknown",
      priority: spec ? getSitemapPriority(spec.kind) : null,
    };
  });

  const manualIndexationCandidates = manualIndexationLevels.flatMap((level) =>
    level.paths.map((path) => {
      const normalizedPath = normalizeCanonicalPath(path);

      return {
        level: level.title,
        path: normalizedPath,
        url: buildCanonicalUrl(normalizedPath),
        existsInBuild: knownPathSet.has(normalizedPath),
        inSitemap: sitemapPathSet.has(normalizedPath),
      };
    }),
  );

  const shouldNotBeInSitemap = [
    ...exactRedirects.map((redirect) => ({
      path: normalizeCanonicalPath(redirect.source),
      url: buildCanonicalUrl(redirect.source),
      reason: `Redirects to ${redirect.destination}.`,
    })),
    ...programmaticOutsideSitemap.map((route) => ({
      path: normalizeCanonicalPath(route.path),
      url: route.url,
      reason: route.reason,
    })),
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: siteConfig.siteUrl,
    maxProgrammaticRoutes: MAX_PROGRAMMATIC_ROUTES,
    totals: {
      generatedKnownUrls: knownRoutes.length,
      generatedProgrammaticUrls: allSeoRoutes.length,
      sitemapUrls: sitemapEntries.length,
      sitemapProgrammaticUrls: sitemapSpecs.filter((spec) => spec.kind === "programmatic").length,
      programmaticOutsideSitemap: programmaticOutsideSitemap.length,
      redirects: redirects.length,
    },
    duplicates: {
      generatedUrls: duplicateUrls,
      generatedSlugs: duplicateSlugs,
      sitemapUrls: sitemapDuplicateUrls,
    },
    routeConflicts,
    programmaticOutsideSitemap,
    sitemapMissingBuild,
    noindex: {
      sitemapUrls: [],
      note: "Known sitemap routes are generated from indexable route data. noindex appears only in not-found fallbacks for invalid dynamic params.",
    },
    expectedCanonicals,
    recommendedPriorities,
    manualIndexationCandidates,
    shouldNotBeInSitemap,
    redirects: {
      sourcesInSitemap: redirectSourcesInSitemap,
      loops: redirectLoops,
      chains: redirectChains,
      destinationsMissingBuild: redirectDestinationsMissingBuild,
      criticalMap: redirects,
    },
    robots: {
      expectedUserAgent: "*",
      expectedAllow: "/",
      expectedSitemap: buildCanonicalUrl("/sitemap.xml"),
      blockedSeoSections: [],
    },
    validationSummary: {
      duplicateUrls: duplicateUrls.length,
      duplicateSlugs: duplicateSlugs.length,
      routeConflicts: routeConflicts.length,
      sitemapMissingBuild: sitemapMissingBuild.length,
      redirectSourcesInSitemap: redirectSourcesInSitemap.length,
      redirectLoops: redirectLoops.length,
      redirectChains: redirectChains.length,
      redirectDestinationsMissingBuild: redirectDestinationsMissingBuild.length,
    },
  };

  writeFileSync(seoAuditReportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeIndexationPriorityReport(knownPathSet, sitemapPathSet);

  console.log("SEO route audit");
  console.log("===============");
  console.log(`Total URLs generadas: ${knownRoutes.length}`);
  console.log(`Total URLs en sitemap: ${sitemapEntries.length}`);
  console.log(`URLs programaticas generables: ${allSeoRoutes.length}`);
  console.log(`URLs programaticas en sitemap: ${report.totals.sitemapProgrammaticUrls}`);
  console.log(`MAX_PROGRAMMATIC_ROUTES: ${MAX_PROGRAMMATIC_ROUTES}`);
  console.log(`URLs programaticas fuera del sitemap: ${programmaticOutsideSitemap.length}`);
  console.log("");
  console.log("Validacion");
  console.table(report.validationSummary);
  console.log("Canonical esperado (muestra)");
  console.table(expectedCanonicals.slice(0, 12));
  console.log("Prioridad recomendada (muestra)");
  console.table(recommendedPriorities.slice(0, 12));
  console.log("");
  console.log(`Reporte JSON: ${seoAuditReportPath}`);
  console.log(`Prioridad de indexacion: ${indexationPriorityPath}`);

  const hasBlockingIssues =
    duplicateUrls.length > 0 ||
    duplicateSlugs.length > 0 ||
    sitemapDuplicateUrls.length > 0 ||
    routeConflicts.length > 0 ||
    sitemapMissingBuild.length > 0 ||
    redirectSourcesInSitemap.length > 0 ||
    redirectLoops.length > 0 ||
    redirectChains.length > 0 ||
    redirectDestinationsMissingBuild.length > 0;

  if (hasBlockingIssues) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
