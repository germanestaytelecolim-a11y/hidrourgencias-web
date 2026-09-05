import type { LeadType } from "@/lib/conversion";

// Existing service routes; editorial labels distinguish an outlet from the shared network.
export const homeServices: Array<{
  id: string;
  title: string;
  selectorLabel?: string;
  href: string;
  seoSlug?: string;
  problem: string;
  method: string;
  type: LeadType;
}> = [
  {
    id: "desagues",
    title: "Destape de desagües domiciliarios",
    selectorLabel: "Destape urgente de desagüe",
    href: "/servicios/destape-artefactos-sanitarios",
    seoSlug: "destape-desagues",
    problem: "Lavaplatos, lavamanos, duchas o WC sin evacuación.",
    method:
      "Desobstrucción con máquina eléctrica y comprobación de descarga del punto afectado.",
    type: "emergency",
  },
  {
    id: "alcantarillado",
    title: "Destape de redes de alcantarillado",
    selectorLabel: "Destape urgente de alcantarillado",
    href: "/servicios/destape-alcantarillado",
    seoSlug: "destape-alcantarillado",
    problem: "Retorno de aguas servidas o varios puntos obstruidos.",
    method:
      "Diagnóstico de ramales y colectores; máquina eléctrica o hidrojet según la obstrucción.",
    type: "emergency",
  },
  {
    id: "hidrojet",
    title: "Hidrojet para redes de alcantarillado",
    selectorLabel: "Hidrojet y lavado de redes de alcantarillado",
    href: "/servicios/hidrojet",
    seoSlug: "hidrojet",
    problem: "Grasa, sedimentos y residuos adheridos a la tubería.",
    method:
      "Lavado hidrodinámico con boquilla y presión adecuadas al tramo y sus accesos.",
    type: "maintenance",
  },
  {
    id: "mantencion",
    title: "Mantención preventiva de redes sanitarias",
    selectorLabel: "Mantenimiento preventivo",
    href: "/servicios/mantencion-preventiva-redes",
    seoSlug: "mantencion-preventiva-redes",
    problem: "Obstrucciones recurrentes y riesgo de interrupción operativa.",
    method:
      "Revisión de puntos críticos, limpieza programada y recomendaciones para la instalación.",
    type: "maintenance",
  },
  {
    id: "video",
    title: "Videoinspección de redes sanitarias",
    selectorLabel: "Videoinspección sanitaria",
    href: "/servicios/destape-camaras-inspeccion",
    problem: "Fallas de origen incierto, raíces o daños internos.",
    method:
      "Inspección audiovisual y respaldo técnico según acceso y factibilidad.",
    type: "diagnostic",
  },
  {
    id: "camaras",
    title: "Limpieza de cámaras de alcantarillado",
    selectorLabel: "Cámaras de alcantarillado",
    href: "/servicios/destape-camaras-inspeccion",
    seoSlug: "destape-camaras-alcantarillado",
    problem:
      "Cámara de alcantarillado saturada o con pérdida de escurrimiento.",
    method:
      "Retiro de acumulaciones, limpieza y revisión de las conexiones accesibles.",
    type: "emergency",
  },
  {
    id: "propiedad",
    title: "Evaluación sanitaria de propiedades",
    selectorLabel: "Evaluación sanitaria de propiedad",
    href: "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    problem: "Dudas sobre la red antes de comprar, vender o arrendar.",
    method:
      "Evaluación técnica y videoinspección cuando sea factible, con antecedentes para decidir.",
    type: "diagnostic",
  },
  {
    id: "higienizacion",
    title: "Higienización posterior a aguas servidas",
    selectorLabel: "Limpieza e higienización por aguas servidas",
    href: "/servicios/limpieza-higienizacion-sanitizacion",
    problem: "Espacios afectados por rebalses, residuos y olores.",
    method: "Limpieza, higienización y sanitización según el alcance acordado.",
    type: "maintenance",
  },
  {
    id: "verticales",
    title: "Destape de redes verticales",
    href: "/servicios/destape-verticales",
    problem: "Bajadas sanitarias obstruidas en edificios y condominios.",
    method:
      "Intervención por tramo con máquina eléctrica y verificación de escurrimiento.",
    type: "emergency",
  },
  {
    id: "horizontales",
    title: "Destape de redes horizontales",
    href: "/servicios/destape-horizontales",
    problem: "Colectores y tramos entre cámaras de alcantarillado bloqueados.",
    method:
      "Desobstrucción y lavado según condición de la red, con prueba de flujo final.",
    type: "emergency",
  },
  {
    id: "extraccion",
    title: "Extracción de aguas servidas",
    href: "/servicios/motobombas-extraccion-aguas",
    problem: "Acumulación de aguas en subterráneos o espacios técnicos.",
    method: "Motobombas y manejo de descarga según las condiciones del lugar.",
    type: "emergency",
  },
];

export function homeLeadMessage(
  type: LeadType,
  service?: string,
  commune?: string,
  sector?: string,
) {
  const location = `Comuna: ${commune || "[comuna]"}${sector ? `\nSector: ${sector}` : ""}`;
  const detail = service ? `\nServicio: ${service}` : "";
  if (type === "emergency")
    return `Hola, necesito atención sanitaria. Soy de [empresa/comunidad/propiedad].\n${location}\nDirección: [dirección]\nSíntoma: [problema]\nPunto afectado: [desagüe/baño/cámara de alcantarillado/cocina/red/patio/estacionamiento]\nNombre y cargo del solicitante: [detalle]\nPuedo enviar fotos o videos para evaluación.${detail}`;
  return `Hola, necesito ${type === "maintenance" ? "cotizar mantención preventiva de redes sanitarias" : "solicitar una evaluación técnica sanitaria"}.\nTipo de instalación: [edificio/condominio/restaurante/empresa/institución/propiedad]\n${location}\nCantidad aproximada de cámaras de alcantarillado, verticales o redes: [detalle]\nFecha estimada: [fecha]\nNombre, cargo y contacto: [detalle]\nRequiero evaluación técnica, hidrojet, videoinspección o informe: [detalle]${detail}`;
}
