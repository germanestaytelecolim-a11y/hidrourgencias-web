export const zonas = {
  vinaDelMar: [
    "Reñaca",
    "Gómez Carreño",
    "Forestal",
    "Recreo",
    "Chorrillos",
    "Miraflores",
    "Achupallas"
  ],
  valparaiso: [
    "Cerro Placeres",
    "Cerro Barón",
    "Cerro Alegre",
    "Playa Ancha"
  ],
  concon: [
    "Concón Centro",
    "Bosques de Montemar"
  ],
  quilpue: [
    "Centro Quilpué",
    "Belloto Norte",
    "Belloto Sur"
  ],
  villaAlemana: [
    "Centro Villa Alemana",
    "Peñablanca"
  ]
};

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

const zonasPorSlug: Record<string, readonly string[]> = {
  "destape-alcantarillado-vina-del-mar": zonas.vinaDelMar,
  "destape-alcantarillado-valparaiso": zonas.valparaiso,
  "hidrojet-concon": zonas.concon,
  "destape-alcantarillado-villa-alemana": zonas.villaAlemana,
  "destape-alcantarillado-quilpue": zonas.quilpue,
};

export function getZonasByLandingSlug(slug: string): readonly string[] {
  return zonasPorSlug[slug] ?? [];
}

export function getZonasHyperlocales() {
  return zonasHyperlocales;
}

export function getZonaHyperlocalBySlug(slug: string) {
  void slug;
  return null;
}
