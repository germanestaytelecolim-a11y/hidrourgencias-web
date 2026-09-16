// Reviewed by location, service and audience; this is not a slug-similarity rule.
// See docs/seo-indexation-audit.md for the pre-change equivalence matrix.
export const territorialCanonicalPaths: Record<string, string> = {
  "/zona/renaca-vina-del-mar": "/destape-alcantarillado-renaca-vina-del-mar",
  "/zona/gomez-carreno-vina-del-mar": "/destape-alcantarillado-gomez-carreno-vina-del-mar",
  "/zona/forestal-vina-del-mar": "/destape-alcantarillado-forestal-vina-del-mar",
  "/zona/recreo-vina-del-mar": "/destape-alcantarillado-recreo-vina-del-mar",
  "/zona/chorrillos-vina-del-mar": "/destape-alcantarillado-chorrillos-vina-del-mar",
  "/zona/miraflores-vina-del-mar": "/destape-alcantarillado-miraflores-vina-del-mar",
  "/zona/achupallas-vina-del-mar": "/destape-alcantarillado-achupallas-vina-del-mar",
  "/zona/cerro-placeres-valparaiso": "/destape-alcantarillado-cerro-placeres-valparaiso",
  "/zona/cerro-baron-valparaiso": "/destape-alcantarillado-cerro-baron-valparaiso",
  "/zona/cerro-alegre-valparaiso": "/destape-alcantarillado-cerro-alegre-valparaiso",
  "/zona/playa-ancha-valparaiso": "/destape-alcantarillado-playa-ancha-valparaiso",
  "/zona/curauma-valparaiso": "/destape-alcantarillado-curauma-placilla-curauma",
  "/zona/placilla-valparaiso": "/destape-alcantarillado-placilla-placilla-curauma",
  "/zona/concon-centro": "/destape-alcantarillado-centro-concon-concon",
  "/zona/bosques-de-montemar-concon": "/destape-alcantarillado-bosques-de-montemar-concon",
  "/zona/centro-quilpue": "/destape-alcantarillado-centro-quilpue-quilpue",
  "/zona/belloto-norte-quilpue": "/destape-alcantarillado-el-belloto-norte-quilpue",
  "/zona/belloto-sur-quilpue": "/destape-alcantarillado-el-belloto-sur-quilpue",
  "/zona/centro-villa-alemana": "/destape-alcantarillado-centro-villa-alemana-villa-alemana",
  "/zona/penablanca-villa-alemana": "/destape-alcantarillado-penablanca-villa-alemana",
};

export const mantaguaCanonicalPaths: Record<string, string> = {
  "/destape-alcantarillado-mantagua-concon": "/destape-alcantarillado-mantagua-quintero",
  "/destape-desagues-mantagua-concon": "/destape-desagues-mantagua-quintero",
  "/hidrojet-mantagua-concon": "/hidrojet-mantagua-quintero",
  "/destape-verticales-mantagua-concon": "/destape-verticales-mantagua-quintero",
  "/destape-horizontales-mantagua-concon": "/destape-horizontales-mantagua-quintero",
  "/destape-edificios-mantagua-concon": "/destape-edificios-mantagua-quintero",
  "/destape-camaras-alcantarillado-mantagua-concon": "/destape-camaras-alcantarillado-mantagua-quintero",
  "/mantencion-preventiva-redes-mantagua-concon": "/mantencion-preventiva-redes-mantagua-quintero",
};

export function resolveTerritorialPath(path: string): string {
  return territorialCanonicalPaths[path] ?? mantaguaCanonicalPaths[path] ?? path;
}

export function getZonaPath(slug: string): string {
  return resolveTerritorialPath(`/zona/${slug}`);
}
