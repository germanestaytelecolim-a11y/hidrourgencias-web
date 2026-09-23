import { getTerritoryComuna } from "@/lib/territory";

// Compatibility shape for legacy landing components. The source remains
// lib/territory.ts; this module contains no territorial records of its own.
export const zonas = {
  vinaDelMar: getTerritoryComuna("vina-del-mar")!.sectores.filter((sector) => sector.publishedZone).map((sector) => sector.name),
  valparaiso: getTerritoryComuna("valparaiso")!.sectores.filter((sector) => sector.publishedZone).map((sector) => sector.name),
  concon: getTerritoryComuna("concon")!.sectores.filter((sector) => sector.publishedZone).map((sector) => sector.name),
  quilpue: getTerritoryComuna("quilpue")!.sectores.filter((sector) => sector.publishedZone).map((sector) => sector.name),
  villaAlemana: getTerritoryComuna("villa-alemana")!.sectores.filter((sector) => sector.publishedZone).map((sector) => sector.name),
} as const;

// Legacy exports for backward compatibility
export type ZonaHyperlocal = {
  slug: string;
  nombre: string;
  comuna: string;
  descripcionBase: string;
  tipoServicio: string;
  zonasCercanas: string[];
};

export const zonasHyperlocales: ZonaHyperlocal[] = [];

const zonasPorSlug = new Map([
  ["destape-alcantarillado-vina-del-mar", zonas.vinaDelMar],
  ["destape-alcantarillado-valparaiso", zonas.valparaiso],
  ["hidrojet-concon", zonas.concon],
  ["destape-alcantarillado-villa-alemana", zonas.villaAlemana],
  ["destape-alcantarillado-quilpue", zonas.quilpue],
]);

export function getZonasByLandingSlug(slug: string): readonly string[] {
  return zonasPorSlug.get(slug) ?? [];
}

export function getZonasHyperlocales() {
  return zonasHyperlocales;
}

export function getZonaHyperlocalBySlug(slug: string) {
  void slug;
  return null;
}
