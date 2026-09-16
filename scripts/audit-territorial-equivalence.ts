import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { getZonaBySlug } from "../lib/zonas-detalle";
import { getSeoRouteBySlug, buildSeoH1, buildSeoRouteContent } from "../lib/seo-territorial";
import { mantaguaCanonicalPaths, territorialCanonicalPaths } from "../lib/territorial-canonical";

// Guard the manually reviewed map; never infer redirects from similar slugs.
const zones = Object.entries(territorialCanonicalPaths).map(([source, destination]) => {
  const zone = getZonaBySlug(source.slice("/zona/".length));
  const route = getSeoRouteBySlug(destination.slice(1));
  assert(zone && route, `Missing equivalent: ${source} -> ${destination}`);
  assert.equal(route.service.slug, "destape-alcantarillado");
  return {
    source,
    destination,
    locationBefore: `${zone.nombre}, ${zone.comuna}`,
    locationAfter: `${route.sector}, ${route.comuna.comuna}`,
    legacyContext: [zone.contextNote, zone.networkNote, zone.clientNote],
    destinationH1: buildSeoH1(route),
    destinationContext: buildSeoRouteContent(route).introParagraphs,
  };
});

const mantagua = Object.entries(mantaguaCanonicalPaths).map(([source, destination]) => {
  const route = getSeoRouteBySlug(destination.slice(1));
  assert(route, `Missing Mantagua destination: ${destination}`);
  assert.equal(route.sector, "Mantagua");
  assert.equal(route.comuna.slug, "quintero");
  assert.equal(source, `/${route.service.slug}-mantagua-concon`);
  assert.equal(getSeoRouteBySlug(source.slice(1)), undefined, "Retired route still generated");
  return { source, destination, service: route.service.nombre };
});

mkdirSync("reports", { recursive: true });
writeFileSync("reports/territorial-equivalence.json", JSON.stringify({ zones, mantagua }, null, 2));
console.log(`PASS: ${zones.length} equivalencias de zonas y ${mantagua.length} de Mantagua.`);
