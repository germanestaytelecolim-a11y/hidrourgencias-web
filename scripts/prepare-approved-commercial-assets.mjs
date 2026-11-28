import sharp from "sharp";
import { mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";

// Local preparation only. Source PNGs stay outside the repository.
const [iconSource, heroSource] = process.argv.slice(2);
if (!iconSource || !heroSource) throw new Error("Indica las rutas del icono y la imagen aprobados, en ese orden.");
mkdirSync("public/images/commercial", { recursive: true });
const entries = [];
const hash = file => createHash("sha256").update(readFileSync(file)).digest("hex");
for (const size of [16, 32, 48, 96, 180]) {
  const png = await sharp(iconSource).rotate().resize(size, size, { fit: "contain", background: "#eef2f6" }).png().toBuffer();
  if (size <= 48) entries.push({ size, png });
  if (size === 96) writeFileSync("public/favicon-96.png", png);
  if (size === 180) writeFileSync("public/apple-touch-icon.png", png);
}
const header = Buffer.alloc(6 + entries.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = header.length;
for (const [i, { size, png }] of entries.entries()) {
  const position = 6 + i * 16;
  header[position] = size; header[position + 1] = size;
  header.writeUInt16LE(1, position + 4); header.writeUInt16LE(32, position + 6);
  header.writeUInt32LE(png.length, position + 8); header.writeUInt32LE(offset, position + 12);
  offset += png.length;
}
writeFileSync("app/favicon.ico", Buffer.concat([header, ...entries.map(entry => entry.png)]));
const variants = [];
for (const width of [480, 768, 1254]) {
  const file = `public/images/commercial/servicio-aprobado-${width}.webp`;
  await sharp(heroSource).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(file);
  const metadata = await sharp(file).metadata();
  variants.push({ file, width: metadata.width, height: metadata.height, bytes: statSync(file).size, sha256: hash(file) });
}
const report = { generatedAt: new Date().toISOString(), iconSourceSha256: hash(iconSource), heroSourceSha256: hash(heroSource), originalHeroBytes: statSync(heroSource).size, variants, iconSizes: [16, 32, 48, 96, 180] };
writeFileSync("docs/APPROVED_COMMERCIAL_ASSETS.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
