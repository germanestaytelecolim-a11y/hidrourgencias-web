import type { WorkCase } from "@/lib/admin/types";

export const communeLandingPathByName: Record<string, string> = {
  "Viña del Mar": "/destape-alcantarillado-vina-del-mar",
  Vina: "/destape-alcantarillado-vina-del-mar",
  Valparaíso: "/destape-alcantarillado-valparaiso",
  Valparaiso: "/destape-alcantarillado-valparaiso",
  Concón: "/hidrojet-concon",
  Concon: "/hidrojet-concon",
  Quilpué: "/destape-alcantarillado-quilpue",
  Quilpue: "/destape-alcantarillado-quilpue",
  "Villa Alemana": "/destape-alcantarillado-villa-alemana",
  Limache: "/destape-alcantarillado-limache",
  Quillota: "/destape-alcantarillado-quillota",
  Casablanca: "/destape-alcantarillado-casablanca",
  Puchuncaví: "/destape-alcantarillado-puchuncavi",
  Puchuncavi: "/destape-alcantarillado-puchuncavi",
  Quintero: "/destape-alcantarillado-quintero",
  Placilla: "/destape-alcantarillado-placilla-curauma",
  Curauma: "/destape-alcantarillado-placilla-curauma",
  Maitencillo: "/destape-alcantarillado-maitencillo-puchuncavi",
};

export const servicePathByName: Record<string, string> = {
  "Destape de alcantarillado": "/servicios/destape-alcantarillado",
  Hidrojet: "/servicios/hidrojet",
  "Destape de vertical": "/servicios/destape-verticales",
  "Destape de horizontal": "/servicios/destape-horizontales",
  "Cámara de alcantarillado": "/servicios/destape-camaras-inspeccion",
  Videoinspección: "/servicios/destape-camaras-inspeccion",
  "Mantención preventiva": "/servicios/mantencion-preventiva-redes",
  "Extracción de aguas": "/servicios/motobombas-extraccion-aguas",
  Higienización: "/servicios/limpieza-higienizacion-sanitizacion",
};

export function getPublicDistributionPaths(
  workCase: Pick<WorkCase, "commune" | "propertyType" | "services" | "showInCases" | "showInCommune" | "showInServices" | "showOnHome">,
) {
  const paths = new Set<string>();

  if (workCase.showInCases) paths.add("/casos-de-exito");
  if (workCase.showOnHome) paths.add("/");

  if (workCase.showInCommune) {
    const communePath = communeLandingPathByName[workCase.commune];
    if (communePath) paths.add(communePath);
  }

  if (workCase.showInServices) {
    for (const service of workCase.services) {
      const servicePath = servicePathByName[service];
      if (servicePath) paths.add(servicePath);
    }

    if (workCase.propertyType === "Edificio") {
      paths.add("/servicios/destape-edificios");
    }
  }

  return Array.from(paths);
}
