import { request } from "node:http";
import { gunzipSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";

async function get(port, path, compressed = false) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port, path, headers: { "Accept-Encoding": compressed ? "gzip" : "identity" } }, res => {
      const chunks = []; res.on("data", chunk => chunks.push(chunk)); res.on("end", () => {
        const body = Buffer.concat(chunks);
        resolve({ status: res.statusCode, bytes: body.length, encoding: res.headers["content-encoding"], text: (res.headers["content-encoding"] === "gzip" ? gunzipSync(body) : body).toString("utf8") });
      });
    }); req.on("error", reject); req.end();
  });
}
const baseline = await get(3128, "/");
const current = await get(3131, "/");
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
for (const path of routes) { const result = await get(3131, path); assert.equal(result.status, 200, path); statuses.push({path, status:result.status}); }
for (const path of ["/", "/destape-alcantarillado-quillota", "/contacto"]) {
  const before = await get(3128, path); const after = await get(3131, path);
  const canonical = text => /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/.exec(text)?.[1];
  assert.equal(canonical(after.text), canonical(before.text), `Canonical: ${path}`);
}
const bzip = await get(3128, "/", true); const azip = await get(3131, "/", true);
const report = { base: "7e9a238 (árbol de f87a476)", runtime: process.version, generatedAt: new Date().toISOString(), before: {html:baseline.bytes, nextData:Buffer.byteLength(data(baseline.text)), compressed:bzip.bytes, encoding:bzip.encoding}, after:{html:current.bytes, nextData:Buffer.byteLength(data(current.text)), compressed:azip.bytes, encoding:azip.encoding}, propsUnchanged:true, routes:statuses };
writeFileSync("docs/COMMERCIAL_HTTP_EVIDENCE.json", JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
