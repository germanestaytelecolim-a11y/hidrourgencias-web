export type LeadType = "emergency" | "maintenance" | "diagnostic";

export type ConversionContext = {
  service?: string;
  commune?: string;
  sector?: string;
  sourcePath?: string;
};

export const leadTypeLabels: Record<LeadType, string> = {
  emergency: "Emergencia sanitaria",
  maintenance: "Mantención preventiva",
  diagnostic: "Diagnóstico y videoinspección",
};

const leadMessages: Record<LeadType, string> = {
  emergency: `Hola, necesito asistencia de Hidrourgencias.

Servicio o problema:
Comuna:
Dirección:
Tipo de inmueble:
Síntoma observado:
¿Existe rebalse o riesgo de inundación?:
Adjuntaré fotos o video:`,
  maintenance: `Hola, solicito evaluación para mantenimiento preventivo.

Comuna:
Dirección:
Tipo de inmueble:
Cantidad aproximada de cámaras, verticales o tramos:
Frecuencia de problemas:
Persona de contacto:`,
  diagnostic: `Hola, solicito evaluación de videoinspección o diagnóstico sanitario.

Comuna:
Dirección:
Tipo de inmueble:
Problema recurrente:
Tramo o artefacto afectado:
Adjuntaré antecedentes disponibles:`,
};

function contextLines(context: ConversionContext) {
  return [
    context.service ? `Servicio consultado: ${context.service}` : "",
    context.commune ? `Comuna: ${context.commune}` : "",
    context.sector ? `Sector: ${context.sector}` : "",
    context.sourcePath ? `Página de origen: ${context.sourcePath}` : "",
  ].filter(Boolean);
}

export function buildConversionMessage(type: LeadType, context: ConversionContext = {}) {
  const lines = contextLines(context);
  return lines.length ? `${leadMessages[type]}\n\n${lines.join("\n")}` : leadMessages[type];
}

export function createContextualWhatsAppUrl(type: LeadType, context: ConversionContext = {}) {
  return `https://wa.me/56940918672?text=${encodeURIComponent(buildConversionMessage(type, context))}`;
}

export function captureCampaignParams() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const campaign: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const value = params.get(key);
    if (value) campaign[key] = value;
  }
  if (Object.keys(campaign).length) {
    window.sessionStorage.setItem("hidrourgencias_campaign", JSON.stringify(campaign));
  }
}

export function trackCommercialEvent(
  event: string,
  properties: Record<string, string | undefined> = {},
) {
  if (typeof window === "undefined") return;
  const campaign = JSON.parse(window.sessionStorage.getItem("hidrourgencias_campaign") ?? "{}") as Record<string, string>;
  const payload = Object.fromEntries(
    Object.entries({ ...properties, ...campaign, page_path: window.location.pathname }).filter(([, value]) => value),
  );
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
  if (typeof window.gtag === "function") window.gtag("event", event, payload);
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}
