import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3110";
const routes = [
  "/",
  "/servicios/destape-alcantarillado",
  "/servicios/hidrojet",
  "/destape-alcantarillado-vina-del-mar",
  "/destape-alcantarillado-valparaiso",
  "/hidrojet-concon",
  "/destape-alcantarillado-quilpue",
  "/destape-alcantarillado-villa-alemana",
  "/destape-alcantarillado-casablanca",
  "/destape-alcantarillado-maitencillo-puchuncavi",
];

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function matches(value: string, expression: RegExp) {
  return value.match(expression)?.length ?? 0;
}

function firstMatch(value: string, expression: RegExp) {
  return expression.exec(value)?.[1] ?? "";
}

async function main() {
  const results = [];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const title = stripTags(firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
    const description = firstMatch(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    const canonical = firstMatch(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
    const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1]));
    const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => stripTags(match[1]));
    const links = [...html.matchAll(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
      href: match[1],
      text: stripTags(match[2]),
    }));
    const imageAlts = [...html.matchAll(/<img[^>]+alt="([^"]*)"[^>]*>/gi)].map((match) => match[1]);
    const text = stripTags(html);
    const ctaLinks = links.filter((link) => /whatsapp|llamar|solicitar|evaluaci|contact|opinion|reseñ/i.test(link.text));

    results.push({
      route,
      status: response.status,
      title,
      description,
      canonical,
      h1,
      headings,
      initialValue: text.slice(0, 500),
      ctaVisibleWithoutScroll: ctaLinks.slice(0, 10),
      ctaCount: ctaLinks.length,
      whatsappCount: links.filter((link) => link.href.includes("wa.me")).length,
      callCount: links.filter((link) => link.href.startsWith("tel:")).length,
      proofSignals: matches(text, /RIDGID|Google|15 anos|24\/7|certific|cliente/gi),
      technicalEvidence: matches(text, /hidrojet|videoinspecci|motobomba|camara|diagnost/gi),
      coverageSignals: matches(text, /cobertura|comuna|sector/gi),
      faqCount: matches(html, /<h[23][^>]*>[^<]*(FAQ|preguntas|frecuentes)/gi),
      sectionCount: matches(html, /<section\b/gi),
      imageCount: imageAlts.length,
      imageAlts: imageAlts.slice(0, 12),
      htmlBytes: html.length,
      duplicateTextRisk: matches(text, /Hidrourgencias/gi),
      eventsExisting: matches(html, /data-[a-z-]*event|gtag\(|dataLayer|fbq\(/gi),
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routes: results,
    analyticsSource:
      "No se detectaron IDs ni proveedores de GA4, GTM, Google Ads o Meta Pixel en el codigo auditado; existe GoogleAdsConversionTracking y enlaces sociales, pero no una capa de eventos comerciales.",
    scope: "10 rutas piloto, sin cambios de contenido ni metadata en la linea base",
  };

  await mkdir("reports", { recursive: true });
  await writeFile(process.env.OUTPUT_FILE ?? "reports/conversion-audit-before.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ routes: results.length, statuses: results.map((result) => [result.route, result.status]) }));
}

void main();
