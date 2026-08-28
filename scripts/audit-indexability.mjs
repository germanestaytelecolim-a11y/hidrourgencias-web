import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3110";
const siteUrl = "https://hidrourgencias.cl";
const reportPath = path.join(process.cwd(), "reports", "search-console-indexing-audit.json");
const markdownPath = path.join(process.cwd(), "reports", "search-console-indexing-audit.md");

const priorityPaths = [
  "/",
  "/servicios/destape-alcantarillado",
  "/servicios/hidrojet",
  "/servicios/destape-artefactos-sanitarios",
  "/servicios/destape-camaras-inspeccion",
  "/servicios/destape-verticales",
  "/servicios/destape-horizontales",
  "/servicios/destape-edificios",
  "/servicios/mantencion-preventiva-redes",
  "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
  "/servicios/limpieza-higienizacion-sanitizacion",
  "/servicios/limpieza-domicilios-recuperacion-espacios",
  "/servicios/limpieza-fachadas-hidrolavado-superficies",
  "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
  "/servicios/motobombas-extraccion-aguas",
  "/servicios/extraccion-aguas-estanques-piscinas",
  "/servicios/reparacion-tuberias-hdpe",
  "/destape-alcantarillado-vina-del-mar",
  "/destape-alcantarillado-valparaiso",
  "/destape-alcantarillado-quilpue",
  "/destape-alcantarillado-villa-alemana",
  "/destape-alcantarillado-limache",
  "/destape-alcantarillado-quintero",
  "/destape-alcantarillado-puchuncavi",
  "/destape-alcantarillado-placilla-curauma",
];

const searchConsoleSeedUrls = [
  "/zona/costa-de-montemar-concon",
  "/zona/centro-concon",
  "/zona/belloto-quilpue",
  "/zona/colmo-concon",
  "/zona/paso-hondo-quilpue",
  "/destape-alcantarillado-vina-del-mar",
  "/nosotros-equipo-experto-en-destapes",
  "/_next/static/media/legacy-font.woff2",
];

const expectedRedirects = new Map([
  ["/zona/costa-de-montemar-concon", "/zona/bosques-de-montemar-concon"],
  ["/zona/centro-concon", "/zona/concon-centro"],
  ["/zona/belloto-quilpue", "/zona/belloto-sur-quilpue"],
  ["/servicios", "/destape-alcantarillado-vina-del-mar"],
  ["/servicios/hidrourgencias", "/destape-alcantarillado-vina-del-mar"],
  ["/servicios/servicios-destape-alcantarillado", "/destape-alcantarillado-vina-del-mar"],
  ["/destape-de-alcantarillado-vina-del-mar", "/destape-alcantarillado-vina-del-mar"],
  ["/destape-de-alcantarillado-valparaiso", "/destape-alcantarillado-valparaiso"],
  ["/hidrojet-en-concon", "/hidrojet-concon"],
  ["/mantencion-de-desagues-quilpue", "/mantencion-desagues-quilpue"],
  ["/urgencias-sanitarias-villa-alemana-24-7", "/urgencias-sanitarias-villa-alemana"],
  ["/destape-desagues-vina-del-mar", "/destape-alcantarillado-vina-del-mar"],
  ["/destape-desagues-valparaiso", "/destape-alcantarillado-valparaiso"],
  ["/servicios/destape-desagues", "/servicios/destape-artefactos-sanitarios"],
  ["/servicios/destape-camaras-alcantarillado", "/servicios/destape-camaras-inspeccion"],
  ["/servicios/reparacion-tuberias", "/servicios/reparacion-tuberias-hdpe"],
  ["/servicios/motobombas", "/servicios/motobombas-extraccion-aguas"],
  ["/servicios/videoinspeccion", "/servicios/destape-camaras-inspeccion"],
  ["/servicios/mantencion-preventiva", "/servicios/mantencion-preventiva-redes"],
  ["/blog/mantencion-preventiva", "/blog/mantencion-preventiva-clave-redes-sanitarias"],
  ["/destape-alcantarillado-vi%C3%B1a-del-mar", "/destape-alcantarillado-vina-del-mar"],
  ["/zona/re%C3%B1aca-vina-del-mar", "/zona/renaca-vina-del-mar"],
  ["/zona/g%C3%B3mez-carre%C3%B1o-vina-del-mar", "/zona/gomez-carreno-vina-del-mar"],
  ["/zona/pe%C3%B1ablanca-villa-alemana", "/zona/penablanca-villa-alemana"],
]);

const intentional404Paths = new Set([
  "/zona/colmo-concon",
  "/zona/paso-hondo-quilpue",
  "/nosotros-equipo-experto-en-destapes",
  "/_next/static/media/legacy-font.woff2",
]);

function toLocalUrl(input) {
  const url = new URL(input, siteUrl);
  return new URL(`${url.pathname}${url.search}`, baseUrl).toString();
}

function toCanonicalUrl(pathname) {
  return new URL(pathname, siteUrl).toString().replace(/\/$/, pathname === "/" ? "/" : "");
}

function getPathname(input) {
  return new URL(input, siteUrl).pathname;
}

function extractSitemapUrls(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1].trim());
}

function getHeader(headers, name) {
  return headers.get(name) || "";
}

function parseHtmlSignals(html) {
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] || null;
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1] || null;
  const hrefs = Array.from(html.matchAll(/\s(?:href|src)=["']([^"'#][^"']*)["']/gi)).map((match) => match[1]);
  return { canonical, robots, hrefs };
}

function normalizeInternalHref(href) {
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("whatsapp:") ||
    href.startsWith("data:")
  ) {
    return null;
  }

  const parsed = new URL(href, siteUrl);
  if (parsed.hostname !== "hidrourgencias.cl" && parsed.hostname !== "www.hidrourgencias.cl") {
    return null;
  }

  return `${parsed.pathname}${parsed.search}` || "/";
}

async function fetchWithRedirectTrace(input, maxRedirects = 8) {
  const chain = [];
  let current = toLocalUrl(input);
  let response;

  for (let index = 0; index <= maxRedirects; index += 1) {
    response = await fetch(current, { redirect: "manual", headers: { "User-Agent": "HidrourgenciasIndexationAudit/1.0" } });
    const location = getHeader(response.headers, "location");
    chain.push({
      url: current,
      status: response.status,
      location: location || null,
    });

    if (![301, 302, 303, 307, 308].includes(response.status) || !location) {
      break;
    }

    const nextUrl = new URL(location, current);
    current =
      nextUrl.hostname === "hidrourgencias.cl" || nextUrl.hostname === "www.hidrourgencias.cl"
        ? toLocalUrl(`${nextUrl.pathname}${nextUrl.search}`)
        : nextUrl.toString();
  }

  const html = response && (getHeader(response.headers, "content-type").includes("text/html") ? await response.text() : "");
  const signals = html ? parseHtmlSignals(html) : { canonical: null, robots: null, hrefs: [] };
  const finalUrl = new URL(current);
  const pathname = finalUrl.pathname === "" ? "/" : finalUrl.pathname;

  return {
    input,
    path: getPathname(input),
    status: chain[0]?.status || 0,
    finalStatus: response?.status || 0,
    finalUrl: `${siteUrl}${pathname}${finalUrl.search}`,
    redirectCount: chain.length - 1,
    chain,
    canonical: signals.canonical,
    robots: signals.robots,
    xRobotsTag: getHeader(response.headers, "x-robots-tag") || null,
    hrefs: signals.hrefs,
  };
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function isNoindex(value) {
  return Boolean(value && value.toLowerCase().includes("noindex"));
}

function isIndexableResult(result) {
  return (
    result.status === 200 &&
    result.finalStatus === 200 &&
    result.redirectCount === 0 &&
    !isNoindex(result.robots) &&
    !isNoindex(result.xRobotsTag) &&
    result.canonical === toCanonicalUrl(result.path)
  );
}

function classifySeed(result) {
  const expectedDestination = expectedRedirects.get(result.path);

  if (expectedDestination) {
    return {
      ...result,
      expectedDestination: toCanonicalUrl(expectedDestination),
      classification:
        result.status === 301 || result.status === 308 ? "REDIRECT_INTENCIONAL_CON_EQUIVALENTE" : "ERROR_REDIRECT_NO_ACTIVO",
    };
  }

  if (intentional404Paths.has(result.path)) {
    return {
      ...result,
      classification: result.finalStatus === 404 ? "404_INTENCIONAL_SIN_EQUIVALENTE" : "REVISAR_NO_ES_404",
    };
  }

  return {
    ...result,
    classification: isIndexableResult(result) ? "INDEXABLE" : "REVISAR",
  };
}

function summarizePriority(result) {
  return {
    path: result.path,
    http: result.status,
    canonical: result.canonical,
    robots: result.robots || "indexable",
    xRobotsTag: result.xRobotsTag || "sin noindex",
    indexable: isIndexableResult(result) ? "YES" : "NO",
  };
}

function tableRow(cells) {
  return `| ${cells.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`;
}

async function main() {
  const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl), { redirect: "manual" });
  const robotsResponse = await fetch(new URL("/robots.txt", baseUrl), { redirect: "manual" });
  const sitemapXml = await sitemapResponse.text();
  const robotsText = await robotsResponse.text();
  const sitemapUrls = extractSitemapUrls(sitemapXml);

  const sitemapResults = await mapLimit(sitemapUrls, 12, (url) => fetchWithRedirectTrace(url));
  const priorityResults = await mapLimit(priorityPaths, 8, (url) => fetchWithRedirectTrace(url));
  const seedResults = await mapLimit(searchConsoleSeedUrls, 6, (url) => fetchWithRedirectTrace(url).then(classifySeed));

  const crawledPageResults = sitemapResults.filter((result) => result.finalStatus === 200 && result.canonical);
  const links = [];
  for (const page of crawledPageResults) {
    for (const href of page.hrefs) {
      const normalized = normalizeInternalHref(href);
      if (normalized) {
        links.push({ source: page.path, href: normalized });
      }
    }
  }

  const uniqueLinks = Array.from(new Map(links.map((link) => [`${link.source} -> ${link.href}`, link])).values());
  const uniqueHrefs = Array.from(new Set(uniqueLinks.map((link) => link.href)));
  const hrefAuditByHref = new Map(
    (await mapLimit(uniqueHrefs, 12, (href) => fetchWithRedirectTrace(href))).map((result) => [result.input, result]),
  );

  const internalBrokenLinks = uniqueLinks
    .map((link) => ({ ...link, audit: hrefAuditByHref.get(link.href) }))
    .filter((link) => link.audit?.finalStatus === 404);

  const internalRedirectLinks = uniqueLinks
    .map((link) => ({ ...link, audit: hrefAuditByHref.get(link.href) }))
    .filter((link) => link.audit && link.audit.redirectCount > 0);

  const sitemapRedirects = sitemapResults.filter((result) => result.redirectCount > 0 || result.status !== 200);
  const sitemap404 = sitemapResults.filter((result) => result.finalStatus === 404);
  const sitemapNoindex = sitemapResults.filter((result) => isNoindex(result.robots) || isNoindex(result.xRobotsTag));
  const sitemapCanonicalErrors = sitemapResults.filter((result) => result.finalStatus === 200 && result.canonical !== toCanonicalUrl(result.path));
  const sitemapWww = sitemapUrls.filter((url) => new URL(url).hostname !== "hidrourgencias.cl");
  const redirectChains = seedResults.filter((result) => result.redirectCount > 1);
  const redirectLoops = seedResults.filter((result) => result.chain.some((step) => step.location && new URL(step.location, step.url).toString() === step.url));

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    searchConsoleAccess: {
      status: "NO_AUTENTICADO_DESDE_CLI",
      note: "Los enlaces compartidos de Search Console redirigen a Google Login; se auditan las URLs semilla del prompt y toda la arquitectura local/sitemap.",
    },
    indexable: priorityResults.map(summarizePriority),
    intentionalRedirects: seedResults.filter((result) => result.classification === "REDIRECT_INTENCIONAL_CON_EQUIVALENTE"),
    fixedRedirects: [
      {
        source: "/zona/costa-de-montemar-concon",
        destination: "/zona/bosques-de-montemar-concon",
        reason: "Slug historico enlazado internamente con equivalente actual de Bosques de Montemar.",
      },
      {
        source: "/zona/centro-concon",
        destination: "/zona/concon-centro",
        reason: "Slug historico con orden de palabras distinto al slug actual generado.",
      },
      {
        source: "/zona/belloto-quilpue",
        destination: "/zona/belloto-sur-quilpue",
        reason: "Slug historico amplio de El Belloto consolidado hacia landing existente de zona.",
      },
    ],
    intentional404: seedResults.filter((result) => result.classification === "404_INTENCIONAL_SIN_EQUIVALENTE"),
    fixed404: [],
    intentionalNoindex: [
      {
        path: "/creditos-imagenes",
        reason: "Pagina publica de atribuciones, enlazable pero no orientada a posicionamiento comercial.",
      },
      {
        path: "/admin",
        reason: "Decap CMS publico con meta robots noindex,nofollow.",
      },
      {
        path: "/api/auth/callback",
        reason: "Callback OAuth con X-Robots-Tag noindex,nofollow.",
      },
    ],
    fixedNoindex: [],
    errors: [
      ...sitemapRedirects.map((result) => ({ type: "SITEMAP_REDIRECT_OR_NON_200", path: result.path, status: result.status })),
      ...sitemap404.map((result) => ({ type: "SITEMAP_404", path: result.path })),
      ...sitemapNoindex.map((result) => ({ type: "SITEMAP_NOINDEX", path: result.path })),
      ...sitemapCanonicalErrors.map((result) => ({ type: "SITEMAP_CANONICAL", path: result.path, canonical: result.canonical, expected: toCanonicalUrl(result.path) })),
      ...internalBrokenLinks.map((link) => ({ type: "INTERNAL_404", source: link.source, href: link.href })),
      ...internalRedirectLinks.map((link) => ({ type: "INTERNAL_REDIRECT", source: link.source, href: link.href, finalUrl: link.audit.finalUrl })),
      ...priorityResults.filter((result) => !isIndexableResult(result)).map((result) => ({ type: "PRIORITY_NOT_INDEXABLE", path: result.path, status: result.status, canonical: result.canonical })),
      ...sitemapWww.map((url) => ({ type: "SITEMAP_NON_CANONICAL_HOST", url })),
    ],
    sitemap: {
      status: sitemapResponse.status,
      total: sitemapUrls.length,
      urls200: sitemapResults.filter((result) => result.status === 200 && result.finalStatus === 200).length,
      redirects: sitemapRedirects.length,
      notFound: sitemap404.length,
      noindex: sitemapNoindex.length,
      canonicalErrors: sitemapCanonicalErrors.length,
      nonCanonicalHost: sitemapWww.length,
    },
    robots: {
      status: robotsResponse.status,
      body: robotsText,
      disallowGlobal: /disallow:\s*\/\s*$/im.test(robotsText),
      sitemapDeclared: /sitemap:\s*https:\/\/hidrourgencias\.cl\/sitemap\.xml/im.test(robotsText),
    },
    redirects: {
      chains: redirectChains,
      loops: redirectLoops,
    },
    internalLinks: {
      checked: uniqueLinks.length,
      uniqueTargets: uniqueHrefs.length,
      redirects: internalRedirectLinks,
      broken404: internalBrokenLinks,
    },
    searchConsoleSeeds: seedResults,
  };

  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  const matrixRows = seedResults.map((result) =>
    tableRow([
      result.path,
      result.status,
      result.finalStatus,
      result.redirectCount ? result.finalUrl : "-",
      result.classification,
    ]),
  );
  const markdown = [
    "# Search Console Indexing Audit",
    "",
    `Base auditada: ${baseUrl}`,
    `Sitemap URLs: ${report.sitemap.total}`,
    `Errores criticos: ${report.errors.length}`,
    "",
    "## URLs semilla Search Console",
    tableRow(["URL", "Inicial", "Final", "Destino", "Clasificacion"]),
    tableRow(["---", "---", "---", "---", "---"]),
    ...matrixRows,
    "",
    "## Sitemap",
    JSON.stringify(report.sitemap, null, 2),
    "",
    "## Robots",
    JSON.stringify(report.robots, null, 2),
    "",
  ].join("\n");
  await writeFile(markdownPath, markdown);

  console.log(`Indexation audit: ${report.errors.length ? "FAIL" : "PASS"}`);
  console.log(`Sitemap URLs: ${report.sitemap.total}`);
  console.log(`Internal links checked: ${report.internalLinks.checked}`);
  console.log(`Internal 404: ${report.internalLinks.broken404.length}`);
  console.log(`Internal redirects: ${report.internalLinks.redirects.length}`);
  console.log(`Report: ${reportPath}`);

  if (report.errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
