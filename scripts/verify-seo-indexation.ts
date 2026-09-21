import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import nextConfig from "../next.config";
import { getAllComunaLandings, getPrimaryTerritorialLandings } from "../lib/comuna-landings";
import { getAllSeoRoutes } from "../lib/seo-territorial";
import { mantaguaCanonicalPaths, territorialCanonicalPaths } from "../lib/territorial-canonical";

async function main() {
  const base = process.env.AUDIT_BASE_URL ?? "http://localhost:3110";
  const origin = "https://hidrourgencias.cl";
  const errors: string[] = [];
  const results: Record<string, unknown>[] = [];
  const check = (condition: unknown, message: string) => { if (!condition) errors.push(message); };
  const redirects = await nextConfig.redirects!();
  const redirectSources = new Set(redirects.map((r) => r.source));
  async function request(path: string) {
    const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(60000) });
    const html = await response.text();
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)].map((m) => m[1]);
    const robots = [...html.matchAll(/<meta\b[^>]*name="(?:robots|googlebot)"[^>]*content="([^"]+)"/g)].map((m) => m[1]);
    const xRobots = response.headers.get("x-robots-tag") ?? "";
    return { path, status: response.status, location: response.headers.get("location"), canonicals, robots, xRobots, html, link: response.headers.get("link") };
  }
  async function pool<T>(items: T[], action: (item: T) => Promise<void>) {
    let cursor = 0;
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (cursor < items.length) {
        const item = items[cursor++];
        try { await action(item); } catch (error) { errors.push(`${String(item)}: ${String(error)}`); }
      }
    }));
  }
  const sitemap = await request("/sitemap.xml");
  const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(sitemap.status === 200 && urls.length > 0, "Sitemap missing or non-200");
  check(new Set(urls).size === urls.length, "Duplicate sitemap entries");
  for (const url of urls) {
    const parsed = new URL(url);
    check(parsed.origin === origin && !parsed.search && !parsed.hash, `Noncanonical sitemap URL: ${url}`);
    check(!redirectSources.has(parsed.pathname), `Redirect in sitemap: ${url}`);
    check(parsed.pathname !== "/acceso-administradores-empresas" && !parsed.pathname.startsWith("/admin"), `Portal in sitemap: ${url}`);
  }
  const paths = new Set([...urls.map((u) => new URL(u).pathname), ...Object.values(territorialCanonicalPaths)]);
  if (process.env.AUDIT_ALL_ROUTES === "1") for (const route of getAllSeoRoutes()) paths.add(`/${route.slug}`);
  await pool([...paths], async (path) => {
    const result = await request(path);
    check(result.status === 200, `${path}: HTTP ${result.status}`);
    check(result.canonicals.length === 1 && result.canonicals[0] === origin + path, `${path}: canonical ${result.canonicals}`);
    check(![...result.robots, result.xRobots].some((r) => /noindex|none/i.test(r)), `${path}: noindex`);
    check(!result.link || !/rel=["']?canonical/i.test(result.link), `${path}: review HTTP canonical header ${result.link}`);
    for (const match of result.html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const target = new URL(match[1].replaceAll("&amp;", "&"), origin);
      if (target.origin === origin) check(!redirectSources.has(target.pathname), `${path}: internal redirect link ${target.pathname}`);
    }
    const visible = result.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
    check(!/15 a(?:ñ|n)os|SEC gas clase 3|T[eé]cnicos certificados SEC|Evidencia reciente/i.test(visible), `${path}: old editorial phrase`);
    const { html: _html, ...signals } = result;
    void _html;
    results.push(signals);
  });
  const contact = await request("/contacto");
  const mainMetadata = (html: string) => [html.match(/<title>([^<]+)<\/title>/)?.[1], html.match(/<meta name="description" content="([^"]+)"/)?.[1]];
  for (const query of ["?origen=prueba", "?origen=cualquier-valor", "?origen=uno&origen=dos", "?utm_source=google&gclid=prueba&fbclid=prueba", "?origen=prueba&otro=valor"]) {
    const result = await request(`/contacto${query}`);
    check(result.status === 200 && result.canonicals.length === 1 && result.canonicals[0] === `${origin}/contacto`, `Contact query canonical: ${query}`);
    check(JSON.stringify(mainMetadata(result.html)) === JSON.stringify(mainMetadata(contact.html)) && JSON.stringify(result.robots) === JSON.stringify(contact.robots), `Contact query changes metadata: ${query}`);
    check(result.html.includes('id="whatsapp-solicitud"') && result.html.includes("<form"), `Contact form absent: ${query}`);
  }
  const primaryLandings = getPrimaryTerritorialLandings();
  check(
    primaryLandings.length === new Set(primaryLandings.map((landing) => landing.comuna)).size,
    "Territorial coverage data contains duplicate municipalities",
  );
  check(
    getAllComunaLandings().some((landing) => landing.slug === "mantencion-desagues-quilpue") &&
      getAllComunaLandings().some((landing) => landing.slug === "urgencias-sanitarias-villa-alemana"),
    "Specialised Quilpue or Villa Alemana landing was removed",
  );
  const coverage = await request("/cobertura");
  const buildings = await request("/servicios/destape-edificios");
  for (const result of [coverage, buildings]) {
    check(!result.html.includes('href="/mantencion-desagues-quilpue"'), `${result.path}: Quilpue service landing used as territorial entry`);
    check(!result.html.includes('href="/urgencias-sanitarias-villa-alemana"'), `${result.path}: Villa Alemana service landing used as territorial entry`);
  }
  const portal = await request("/acceso-administradores-empresas");
  check(portal.status === 200 && portal.robots.some((r) => /noindex, follow/.test(r)), "Portal must be 200 noindex, follow");
  const robots = await request("/robots.txt");
  check(robots.status === 200 && robots.html.includes(`Sitemap: ${origin}/sitemap.xml`) && !/^Disallow:\s*\//im.test(robots.html), "Robots crawl/sitemap mismatch");
  const zoneRedirects = redirects.filter((r) => r.source.startsWith("/zona/") || mantaguaCanonicalPaths[r.source]);
  await pool(zoneRedirects, async (redirect) => {
    const first = await request(redirect.source);
    const destination = new URL(redirect.destination, origin);
    check(first.status === 301 && first.location === destination.href, `${redirect.source}: expected direct 301 to ${destination.href}, got ${first.status} ${first.location}`);
    const final = await request(destination.pathname);
    check(final.status === 200 && final.canonicals[0] === destination.href, `${redirect.source}: destination not canonical 200`);
    results.push({ path: redirect.source, status: first.status, destination: first.location, finalStatus: final.status });
  });
  const tracked = await request("/zona/concon-centro?origen=prueba&utm_source=google");
  check(tracked.status === 301 && tracked.location?.includes("origen=prueba") && tracked.location?.includes("utm_source=google"), "Redirect loses attribution query");
  mkdirSync("reports", { recursive: true });
  const report = { date: new Date().toISOString(), base, sitemapUrls: urls.length, checkedPages: paths.size, redirects: zoneRedirects.length, errors: [...new Set(errors)], results };
  writeFileSync(`reports/seo-runtime-${base.includes("localhost") ? "local" : "production"}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
  assert.equal(errors.length, 0, "SEO runtime verification failed");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
