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
  diagnostic: "Diagnóstico o videoinspección",
};

const leadMessages: Record<LeadType, string> = {
  emergency: "Hola, necesito atención de Hidrourgencias por una emergencia sanitaria.",
  maintenance: "Hola, necesito solicitar una evaluación de mantención preventiva.",
  diagnostic: "Hola, necesito solicitar una evaluación de diagnóstico o videoinspección sanitaria.",
};

function contextLines(type: LeadType, context: ConversionContext) {
  return [
    `Tipo de solicitud: ${leadTypeLabels[type]}`,
    context.service ? `Servicio: ${context.service}` : "",
    context.commune ? `Comuna: ${context.commune}` : "",
    context.sector ? `Sector: ${context.sector}` : "",
    context.sourcePath ? `URL: https://hidrourgencias.cl${context.sourcePath}` : "",
  ].filter(Boolean);
}

export function buildConversionMessage(type: LeadType, context: ConversionContext = {}) {
  const lines = contextLines(type, context);
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
