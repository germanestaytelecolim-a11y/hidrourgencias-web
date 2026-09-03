import type { MetadataRoute } from "next";

import { getBlogSlugs } from "@/lib/blog-data";
import { getCaseStudySlugs } from "@/lib/case-studies";
import { getComunaPaths } from "@/lib/comuna-landings";
import { MAX_PROGRAMMATIC_ROUTES, getPrioritySeoRoutes, getSeoRouteBySlug } from "@/lib/seo-territorial";
import { buildCanonicalUrl, normalizeCanonicalPath } from "@/lib/site-config";
import { getServicioSlugs } from "@/lib/servicios";
import { getZonaSlugs } from "@/lib/zonas-detalle";

const dailyLastModified = (() => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
})();

export type SitemapRouteKind =
  | "home"
  | "blog-index"
  | "case-study-index"
  | "service-index"
  | "coverage-index"
  | "contact"
  | "landing"
  | "blog-post"
  | "case-study"
  | "service"
  | "zone"
  | "programmatic";

export type SitemapRouteSpec = {
  path: string;
  kind: SitemapRouteKind;
};

const strategicProgrammaticSitemapSlugs = [
  "destape-alcantarillado-loncura-quintero",
  "destape-alcantarillado-centro-quintero-quintero",
  "destape-alcantarillado-villa-olimpica-quilpue",
] as const;

function getChangeFrequency(kind: SitemapRouteKind): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (kind === "blog-post" || kind === "case-study") {
    return "monthly";
  }

  return "weekly";
}

export function getSitemapPriority(kind: SitemapRouteKind): number {
  if (kind === "home") {
    return 1;
  }

  if (kind === "landing") {
    return 0.9;
  }

  if (kind === "blog-index" || kind === "case-study-index" || kind === "service-index" || kind === "coverage-index") {
    return 0.85;
  }

  if (kind === "contact") {
    return 0.78;
  }

  if (kind === "service") {
    return 0.83;
  }

  if (kind === "zone") {
    return 0.8;
  }

  if (kind === "programmatic") {
    return 0.72;
  }

  return 0.75;
}

export function getSitemapRouteSpecs(): SitemapRouteSpec[] {
  const routeSpecs: SitemapRouteSpec[] = [
    { path: "/", kind: "home" },
    { path: "/servicios", kind: "service-index" },
    { path: "/cobertura", kind: "coverage-index" },
    { path: "/contacto", kind: "contact" },
    { path: "/blog", kind: "blog-index" },
    { path: "/casos-de-exito", kind: "case-study-index" },
    ...getComunaPaths().map((slug) => ({ path: `/${slug}`, kind: "landing" as const })),
    ...getZonaSlugs().map((slug) => ({ path: `/zona/${slug}`, kind: "zone" as const })),
    ...getServicioSlugs().map((slug) => ({ path: `/servicios/${slug}`, kind: "service" as const })),
    ...getBlogSlugs().map((slug) => ({ path: `/blog/${slug}`, kind: "blog-post" as const })),
    ...getCaseStudySlugs().map((slug) => ({ path: `/casos-de-exito/${slug}`, kind: "case-study" as const })),
    ...strategicProgrammaticSitemapSlugs
      .filter((slug) => getSeoRouteBySlug(slug))
      .map((slug) => ({ path: `/${slug}`, kind: "programmatic" as const })),
    // Keep the programmatic sitemap capped to avoid abrupt expansion and protect crawl budget.
    ...getPrioritySeoRoutes(MAX_PROGRAMMATIC_ROUTES).map((route) => ({ path: `/${route.slug}`, kind: "programmatic" as const })),
  ];

  return Array.from(
    new Map(
      routeSpecs.map((route) => {
        const normalizedPath = normalizeCanonicalPath(route.path);
        return [normalizedPath, { ...route, path: normalizedPath }];
      }),
    ).values(),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapRouteSpecs().map((route) => ({
    url: buildCanonicalUrl(route.path),
    lastModified: dailyLastModified,
    changeFrequency: getChangeFrequency(route.kind),
    priority: getSitemapPriority(route.kind),
  }));
}
