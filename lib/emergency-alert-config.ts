import { serviceTerms, serviceTermsNoticeSummary } from "@/components/service-terms";
import { createWhatsAppUrl, siteConfig } from "@/lib/site-config";

const emergencyWhatsAppMessage = `Hola Hidrourgencias. Tengo una urgencia sanitaria y necesito solicitar asistencia técnica.
Dirección/comuna:
Tipo de propiedad:
Problema que presenta la red:
Adjunto fotografías o videos para evaluación.`;

export const emergencyAlertModalConfig = {
  enabled: true,
  sessionStorageKey: "hidrourgencias_emergency_gateway_2026",
  issuedAt: "2026",
  excludedPathPrefixes: ["/admin", "/cms", "/api"],
  excludedExactPaths: ["/acceso-administradores-empresas"],
  content: {
    logoSrc: "/images/logo-hidrourgencias.webp",
    logoAlt: "Hidrourgencias SpA",
    eyebrow: "Atención prioritaria",
    title: "¿TIENES UNA URGENCIA SANITARIA?",
    intro:
      "Si existe rebalse de alcantarillado, retorno de aguas servidas, cámara colapsada u otra obstrucción sanitaria crítica, comunícate directamente con nuestro equipo.",
    guidanceTitle: "Para gestionar tu solicitud más rápido",
    guidanceLabel: "Envíanos:",
    guidanceItems: "Dirección y comuna · Tipo de propiedad · Descripción del problema · Fotografías o videos",
    guidanceText:
      "Con esta información evaluaremos el nivel de criticidad y podremos coordinar la asignación de un móvil técnico de acuerdo con nuestra disponibilidad operacional.",
    whatsappLabel: "Enviar urgencia por WhatsApp",
    callLabel: "Llamar ahora",
    continueLabel: "No es una urgencia — Ir al sitio",
    closeLabel: "Cerrar pantalla de urgencias",
    footerText: "Hidrourgencias SpA · Urgencias sanitarias · Región de Valparaíso",
  },
  legal: {
    summary: serviceTermsNoticeSummary,
    terms: serviceTerms,
  },
  contact: {
    whatsappHref: createWhatsAppUrl(emergencyWhatsAppMessage),
    whatsappHrefBase: createWhatsAppUrl(""),
    phoneHref: siteConfig.phoneHref,
  },
  colors: {
    overlay: "rgba(2, 6, 23, 0.88)",
    modalBackground: "#061827",
    modalBorder: "rgba(125, 211, 252, 0.22)",
    cardBackground: "rgba(255, 255, 255, 0.06)",
    corporateBlue: "#0b74a5",
    corporateBlueHover: "#0e8bc4",
    lightBlue: "#7dd3fc",
    emergencyRed: "#f04444",
    emergencyRedDark: "rgba(240, 68, 68, 0.12)",
    whatsappGreen: "#06c286",
    whatsappGreenHover: "#05a976",
    white: "#f8fbff",
    mutedText: "#d8e9f7",
    subduedText: "#a9c2d6",
  },
} as const;
