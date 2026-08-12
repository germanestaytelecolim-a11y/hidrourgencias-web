import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

type ZoneSource = {
  slug: string;
  title: string;
};

type CommonsMetadataValue = {
  value?: string;
};

type CommonsPage = {
  title: string;
  imageinfo?: Array<{
    descriptionurl: string;
    thumburl: string;
    url: string;
    extmetadata: Record<string, CommonsMetadataValue>;
  }>;
};

const zoneSources: ZoneSource[] = [
  { slug: "casablanca", title: "File:Casablanca - panoramio (2).jpg" },
  { slug: "maitencillo-puchuncavi", title: "File:093-365 - Maitencillo - Flickr - -Gabriel-.jpg" },
  { slug: "curauma-valparaiso", title: "File:20250216 Curauma 01.jpg" },
  { slug: "placilla-valparaiso", title: "File:Placilla, Valparaíso, Región de Valparaíso, Chile - panoramio.jpg" },
  { slug: "renaca-vina-del-mar", title: "File:Playa Reñaca. Viña del Mar. Chile.jpg" },
  { slug: "recreo-vina-del-mar", title: "File:Chile, Viña del Mar, Recreo (46836308154).jpg" },
  { slug: "achupallas-vina-del-mar", title: "File:Achupallas nocturna.jpg" },
  { slug: "chorrillos-vina-del-mar", title: "File:Estación Chorrillos, Viña del Mar 20231002 04.jpg" },
  {
    slug: "forestal-vina-del-mar",
    title:
      "File:Conjunción planetaria cerrada entre Venus y Júpiter sobre la Loma Latorre de Santa Julia en Viña del Mar. Close planetary conjunction between Venus and Jupiter above Loma Latorre de Santa Julia, Viña del Mar.jpg",
  },
  { slug: "gomez-carreno-vina-del-mar", title: "File:Parque Natural Gómez Carreño.jpg" },
  { slug: "miraflores-vina-del-mar", title: "File:Campus Miraflores UVM, Viña del Mar 20231002 02.jpg" },
  { slug: "cerro-placeres-valparaiso", title: "File:Vista de calle en Cerro Placeres de Valparaíso.jpg" },
  { slug: "cerro-baron-valparaiso", title: "File:Ascensor Barón y Valparaíso.JPG" },
  { slug: "cerro-alegre-valparaiso", title: "File:Cerro Alegre Valparaiso.jpg" },
  { slug: "playa-ancha-valparaiso", title: "File:Acantilado, Playa Ancha , Valparaíso , Chile.jpg" },
  { slug: "concon-centro", title: "File:Rotonda de Concón, Concón 20211011 01.jpg" },
  {
    slug: "bosques-de-montemar-concon",
    title: "File:Chile, Concón, Bosques de Montemar (43470659892).jpg",
  },
  { slug: "centro-quilpue", title: "File:Centro de Quilpué.JPG" },
  { slug: "belloto-norte-quilpue", title: "File:20250118 Belloto del norte.jpg" },
  { slug: "belloto-sur-quilpue", title: "File:Vista de El Belloto.JPG" },
  { slug: "centro-villa-alemana", title: "File:Paseo Latorre, Villa Alemana 20211107.jpg" },
  { slug: "penablanca-villa-alemana", title: "File:Atardecer en Peñablanca, Villa Alemana.jpg" },
];

const allowedLicenses = ["CC BY", "CC BY-SA", "Public domain", "CC0"];
const maxImageBytes = 350 * 1024;
const outputDirectory = join(process.cwd(), "public", "images", "zonas");

function stripHtml(value: string | undefined) {
  return (value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetadata(page: CommonsPage, key: string) {
  return stripHtml(page.imageinfo?.[0]?.extmetadata[key]?.value);
}

async function main() {
  mkdirSync(outputDirectory, { recursive: true });

  const body = new URLSearchParams({
    action: "query",
    prop: "imageinfo",
    titles: zoneSources.map((source) => source.title).join("|"),
    iiprop: "url|extmetadata",
    iiurlwidth: "2200",
    format: "json",
    formatversion: "2",
    origin: "*",
  });
  const response = await fetch("https://commons.wikimedia.org/w/api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "HidrourgenciasVisualInventory/1.0 (https://hidrourgencias.cl)",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Wikimedia Commons API respondió ${response.status}.`);
  }

  const payload = (await response.json()) as { query?: { pages?: CommonsPage[] } };
  const pageMap = new Map((payload.query?.pages ?? []).map((page) => [page.title, page]));
  const attribution = [];

  for (const source of zoneSources) {
    const page = pageMap.get(source.title);
    const imageInfo = page?.imageinfo?.[0];
    if (!page || !imageInfo) {
      throw new Error(`No se encontró el recurso de Commons: ${source.title}`);
    }

    const license = getMetadata(page, "LicenseShortName");
    if (!allowedLicenses.some((allowed) => license.startsWith(allowed))) {
      throw new Error(`Licencia no permitida para ${source.title}: ${license || "sin licencia"}`);
    }

    const imageResponse = await fetch(imageInfo.thumburl, {
      headers: { "User-Agent": "HidrourgenciasVisualInventory/1.0 (https://hidrourgencias.cl)" },
    });
    if (!imageResponse.ok) {
      throw new Error(`No se pudo descargar ${source.title}: ${imageResponse.status}`);
    }

    const input = Buffer.from(await imageResponse.arrayBuffer());
    const outputPath = join(outputDirectory, `${source.slug}.webp`);
    let optimizedImage = await sharp(input)
      .rotate()
      .resize(1560, 1040, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 68, effort: 6 })
      .toBuffer();

    if (optimizedImage.byteLength > maxImageBytes) {
      optimizedImage = await sharp(input)
        .rotate()
        .resize(1440, 960, { fit: "cover", position: sharp.strategy.attention })
        .webp({ quality: 64, effort: 6 })
        .toBuffer();
    }

    writeFileSync(outputPath, optimizedImage);

    attribution.push({
      slug: source.slug,
      filename: `${source.slug}.webp`,
      file: `/images/zonas/${source.slug}.webp`,
      landing: `/zona/${source.slug}`,
      commonsTitle: page.title,
      sourceUrl: imageInfo.descriptionurl,
      originalUrl: imageInfo.url,
      author: getMetadata(page, "Artist"),
      license,
      licenseUrl: page.imageinfo?.[0]?.extmetadata.LicenseUrl?.value ?? null,
      description: getMetadata(page, "ImageDescription"),
      modifications: "Recorte 3:2, redimensionado y optimización WebP para uso web.",
      importedAt: new Date().toISOString(),
    });

    console.log(`Importada ${source.slug}: ${license}`);
  }

  writeFileSync(join(outputDirectory, "attribution.json"), `${JSON.stringify(attribution, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
