import { request } from "node:http";
import { gunzipSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

async function get(port, path, compressed = false) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port, path, headers: { "Accept-Encoding": compressed ? "gzip" : "identity" } }, res => {
      const chunks = []; res.on("data", chunk => chunks.push(chunk)); res.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve({ status: res.statusCode, bytes: body.length, mime: res.headers["content-type"], sha256: createHash("sha256").update(body).digest("hex"), encoding: res.headers["content-encoding"], text: (res.headers["content-encoding"] === "gzip" ? gunzipSync(body) : body).toString("utf8") });
      });
    }); req.on("error", reject); req.end();
  });
}
const port = Number(process.env.COMMERCIAL_PORT || 3132);
if (process.argv[2] === "--capture") {
  const pages = {};
  for (const path of ["/", "/destape-alcantarillado-quillota", "/contacto"]) pages[path] = await get(port, path);
  writeFileSync(process.argv[3], JSON.stringify({ pages, gzip: await get(port, "/", true) }));
  console.log("Línea base HTTP local conservada fuera de Git.");
  process.exit(0);
}
const fixture = process.env.COMMERCIAL_BASELINE ? JSON.parse(readFileSync(process.env.COMMERCIAL_BASELINE, "utf8")) : null;
const baseline = fixture?.pages["/"] || await get(3128, "/");
const current = await get(port, "/");
const data = html => /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? "";
assert.equal(current.status, 200);
assert.ok(data(current.text));
const baseProps = JSON.parse(data(baseline.text)).props;
const newProps = JSON.parse(data(current.text)).props;
assert.deepEqual(newProps, baseProps, "Los datos serializados comerciales no deben crecer");
const hrefs = html => [...html.matchAll(/href="([^"#?]+)"/g)].map(x => x[1]);
for (const route of new Set(hrefs(baseline.text).filter(x => /^\/(?:blog\/|casos-de-exito\/|destape-|hidrojet-|zona\/)/.test(x)))) assert.ok(hrefs(current.text).includes(route), `Enlace conservado: ${route}`);
const routes = ["/", "/servicios", "/cobertura", "/contacto", "/destape-alcantarillado-quillota", "/servicios/hidrojet", "/destape-alcantarillado-forestal-vina-del-mar", "/robots.txt", "/sitemap.xml", "/favicon.ico", "/apple-touch-icon.png"];
const statuses = [];
for (const path of routes) { const result = await get(port, path); assert.equal(result.status, 200, path); statuses.push({path, status:result.status}); }
for (const path of ["/", "/destape-alcantarillado-quillota", "/contacto"]) {
  const before = fixture?.pages[path] || await get(3128, path); const after = await get(port, path);
  const canonical = text => /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/.exec(text)?.[1];
  assert.ok(canonical(after.text), `Canonical presente: ${path}`);
  assert.equal(canonical(after.text), canonical(before.text), `Canonical: ${path}`);
}
const icon = await get(port, "/favicon.ico?v=hu-final-20261128");
const iconHash = createHash("sha256").update(readFileSync("app/favicon.ico")).digest("hex");
assert.equal(icon.sha256, iconHash);
const iconData = readFileSync("app/favicon.ico");
assert.equal(iconData.readUInt16LE(4), 3, "ICO con variantes 16, 32 y 48");
for (const path of ["/favicon-96.png", "/apple-touch-icon.png"]) {
  const result = await get(port, path);
  assert.equal(result.status, 200); assert.match(result.mime, /image\/png/);
  assert.equal(result.sha256, createHash("sha256").update(readFileSync(`public${path}`)).digest("hex"));
}
const iconPages = [];
for (const path of ["/", "/destape-alcantarillado-quillota", "/contacto", "/admin/login"]) {
  const result = await get(port, path);
  assert.equal(result.status, 200);
  assert.match(result.text, /favicon\.ico\?v=hu-final-20261128/);
  assert.match(result.text, /apple-touch-icon\.png\?v=hu-final-20261128/);
  iconPages.push(path);
}
const imageResults = [];
for (const size of [480, 768, 1254]) {
  const path = `/images/commercial/servicio-aprobado-${size}.webp`;
  const result = await get(port, path);
  assert.equal(result.status, 200); assert.match(result.mime, /image\/webp/); assert.equal(result.sha256, createHash("sha256").update(readFileSync(`public${path}`)).digest("hex"));
  imageResults.push({ path, bytes: result.bytes, sha256: result.sha256 });
}
const bzip = fixture?.gzip || await get(3128, "/", true); const azip = await get(port, "/", true);
const report = { base: fixture ? "3e205ce" : "7e9a238 (árbol de f87a476)", runtime: process.version, generatedAt: new Date().toISOString(), before: {html:baseline.bytes, nextData:Buffer.byteLength(data(baseline.text)), compressed:bzip.bytes, encoding:bzip.encoding}, after:{html:current.bytes, nextData:Buffer.byteLength(data(current.text)), compressed:azip.bytes, encoding:azip.encoding}, propsUnchanged:true, routes:statuses, iconPages, iconSha256: iconHash, imageResults };
writeFileSync("docs/COMMERCIAL_HTTP_EVIDENCE.json", JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
