import { createHash } from "node:crypto";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

import sitemap from "../app/sitemap";

const DEFAULT_BASE_URL = "http://127.0.0.1:3100";
const DEFAULT_OUTPUT_PATH = join(process.cwd(), "reports", "landing-visual-baseline.json");

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function getAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`\\s${attribute}=["']([^"']*)["']`, "i"));
  return match ? decodeHtml(match[1]) : null;
}

function getTagByAttribute(html: string, tagName: string, attribute: string, value: string) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  return tags.find((tag) => getAttribute(tag, attribute)?.toLowerCase() === value.toLowerCase()) ?? null;
}

function getCanonical(html: string) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonical = links.find((tag) => getAttribute(tag, "rel")?.split(/\s+/).includes("canonical"));
  return canonical ? getAttribute(canonical, "href") : null;
}

function getMainHtml(html: string) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
}

function getHeroImage(mainHtml: string) {
  const images = mainHtml.match(/<img\b[^>]*>/gi) ?? [];
  const image = images.find((tag) => getAttribute(tag, "data-nimg") !== null) ?? images[0];
  if (!image) {
    return { src: null, alt: null };
  }

  const rawSrc = getAttribute(image, "src");
  if (!rawSrc) {
    return { src: null, alt: getAttribute(image, "alt") };
  }

  const src = rawSrc.startsWith("/_next/image")
    ? new URL(rawSrc, "https://hidrourgencias.cl").searchParams.get("url")
    : rawSrc;

  return { src, alt: getAttribute(image, "alt") };
}

async function getImageDetails(src: string | null) {
  if (!src?.startsWith("/")) {
    return { bytes: null, width: null, height: null };
  }

  const filePath = join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    return { bytes: null, width: null, height: null };
  }

  const metadata = await sharp(filePath).metadata();
  return {
    bytes: statSync(filePath).size,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  };
}

function hashValues(values: string[]) {
  return createHash("sha256").update(JSON.stringify(values)).digest("hex");
}

async function main() {
  const baseUrl = process.env.LANDING_BASE_URL ?? DEFAULT_BASE_URL;
  const outputPath = process.env.LANDING_BASELINE_OUTPUT ?? DEFAULT_OUTPUT_PATH;
  const routePaths = (await sitemap())
    .map((entry) => new URL(entry.url).pathname)
    .filter((path) => path.startsWith("/zona/") || path.startsWith("/servicios/"))
    .sort();

  const routes = [];
  for (const path of routePaths) {
    const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
    const html = await response.text();
    const mainHtml = getMainHtml(html);
    const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const h1Values = Array.from(mainHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi), (match) => stripTags(match[1]));
    const descriptionTag = getTagByAttribute(html, "meta", "name", "description");
    const robotsTag = getTagByAttribute(html, "meta", "name", "robots");
    const heroImage = getHeroImage(mainHtml);
    const imageDetails = await getImageDetails(heroImage.src);
    const schemaValues = Array.from(
      html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
      (match) => decodeHtml(match[1]).trim(),
    );
    const internalLinks = Array.from(mainHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi), (match) =>
      decodeHtml(match[1]),
    )
      .filter((href) => href.startsWith("/"))
      .sort();

    routes.push({
      url: new URL(path, "https://hidrourgencias.cl").toString(),
      source: path.startsWith("/zona/") ? "app/zona/[slug]/page.tsx" : "app/servicios/[slug]/page.tsx",
      family: path.startsWith("/zona/") ? "zona" : "servicio",
      status: response.status,
      title,
      description: descriptionTag ? getAttribute(descriptionTag, "content") : null,
      canonical: getCanonical(html),
      robots: robotsTag ? getAttribute(robotsTag, "content") : null,
      h1: h1Values[0] ?? null,
      h1Count: h1Values.length,
      image: heroImage.src,
      imageAlt: heroImage.alt,
      imageBytes: imageDetails.bytes,
      imageWidth: imageDetails.width,
      imageHeight: imageDetails.height,
      visualVariant: path.startsWith("/zona/") ? "gradient-without-hero-image" : "split-hero",
      schemaCount: schemaValues.length,
      schemaHash: hashValues(schemaValues),
      internalLinksHash: hashValues(internalLinks),
      internalLinkCount: internalLinks.length,
    });
  }

  mkdirSync(join(process.cwd(), "reports"), { recursive: true });
  writeFileSync(
    outputPath,
    `${JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, routeCount: routes.length, routes }, null, 2)}\n`,
  );
  console.log(`Baseline guardada: ${outputPath}`);
  console.log(`Landings auditadas: ${routes.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
