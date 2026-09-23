import assert from "node:assert/strict";
import test from "node:test";

import { getSitemapRouteSpecs } from "../app/sitemap";
import { navigationCoverage } from "../lib/navigation";
import { territorialCoverage } from "../lib/territory";
import { resolveTerritorialPath } from "../lib/territorial-canonical";

const forbiddenVisibleAliases = ["Centro Concón", "El Belloto Norte", "El Belloto Sur"];

function duplicate<T>(values: readonly T[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

test("territorial catalogue has unique canonical municipalities, sectors and paths", () => {
  assert.deepEqual(duplicate(territorialCoverage.map((comuna) => comuna.slug)), []);
  assert.deepEqual(duplicate(territorialCoverage.map((comuna) => comuna.canonicalPath)), []);

  for (const comuna of territorialCoverage) {
    assert.deepEqual(duplicate(comuna.sectores.map((sector) => sector.slug)), [], `${comuna.slug}: duplicated sector slug`);
    assert.deepEqual(duplicate(comuna.sectores.map((sector) => sector.name)), [], `${comuna.slug}: duplicated visible sector`);
    for (const sector of comuna.sectores) {
      assert.ok(!forbiddenVisibleAliases.includes(sector.name), `${sector.name} is an alias, not a visible entity`);
      for (const alias of sector.aliases) assert.notEqual(alias, sector.name, `${sector.name}: alias duplicates its label`);
    }
  }
});

test("navigation renders one canonical destination and no legacy alias", () => {
  assert.deepEqual(duplicate(navigationCoverage.map((comuna) => comuna.landingPath)), []);
  for (const comuna of navigationCoverage) {
    assert.deepEqual(duplicate(comuna.sectors.map((sector) => sector.href)), [], `${comuna.comuna}: duplicated canonicalPath`);
    assert.deepEqual(duplicate(comuna.sectors.map((sector) => sector.label)), [], `${comuna.comuna}: repeated visible sector`);
    for (const sector of comuna.sectors) assert.ok(!forbiddenVisibleAliases.includes(sector.label));
  }
});

test("sitemap contains each canonical location once and never a redirect alias", () => {
  const paths = getSitemapRouteSpecs().map((route) => route.path);
  assert.deepEqual(duplicate(paths), []);
  for (const path of paths) assert.equal(resolveTerritorialPath(path), path, `${path} is a redirect alias`);
});
