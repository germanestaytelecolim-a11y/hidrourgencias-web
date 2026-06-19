export const siteConfig = {
  name: "Hidrourgencias SpA",
  siteUrl: "https://hidrourgencias.cl",
  phone: "56940918672",
  phoneDisplay: "+56 9 4091 8672",
  phoneHref: "tel:+56940918672",
  email: "hidrourgencias@gmail.com",
  emailSubject: "Solicitud de servicio - Hidrourgencias SpA",
  emailBody: `Hola, necesito solicitar información o atención para un servicio.

Nombre:
Teléfono:
Comuna:
Dirección:
Tipo de requerimiento:
Detalle del problema:

Quedo atento a su respuesta.`,
  social: [
    { label: "Facebook", href: "https://www.facebook.com/HIDROURGENCIAsspa/" },
    { label: "Instagram", href: "https://www.instagram.com/hidrourgenciasspa/" },
    { label: "YouTube", href: "https://www.youtube.com/@DestapeHidrourgenciasspa" },
    { label: "TikTok", href: "https://www.tiktok.com/@destapeshidrourgencias" },
  ],
};

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=4ab3cf3b309b04c5&q=Destapes+de+alcantarillado+Vi%C3%B1a+del+Mar&sa=X&sqi=2&ved=2ahUKEwik-aSXqu-UAxUis5UCHViNGEwQ1QJ6BAgpEAE&biw=1280&bih=665&dpr=1.5#sv=CAESzQEKuQEStgEKd0FNbjMteVE5TG9uWmZWLTduU2ZPMnpUVjBRUklKRk8xeXJDZFN0S2RwVnRVUHJZbFJuTlJ3Z0RhakFRaDFKWTdEM2FsdW5OOFFvaEhOOFEzdnRNVWxVTXRwNDEzYTdDMXdLTU9xaEdFZlJpLTQyRk5mWkU4T0s0EhdSM3dpYXRtOU81bmMxc1FQLXVmM2dBYxoiQUpLTEZtSVNPUUI2SDJNNHRNbVplNnpQYl80dHBsZDQ0dxIEODA1MRoBMyoAMAA4AUAAGAAg1JbA1ARKAhAC";

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(message)}`;
}

export type ServiceCatalogItem = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  href?: string;
  linkLabel?: string;
  highlights?: string[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    title: "Destape de alcantarillado y desagües",
    description:
      "Atendemos obstrucciones en redes domiciliarias, verticales, horizontales y colectores con protocolo de diagnóstico, contención sanitaria y restitución de flujo para evitar rebalses reiterativos.",
    href: "/servicios/destape-alcantarillado",
    ctaLabel: "Solicitar destape",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de alcantarillado y desagües de Hidrourgencias SpA. Indico comuna, tipo de propiedad y síntomas del problema.",
    ),
  },
  {
    title: "Hidrojet de alta presión",
    description:
      "Aplicamos hidrolavado con hidrojet 4000 PSI para remover grasa, sarro, sedimento y residuos adheridos en redes de alta carga, mejorando sección útil de la tubería y continuidad operativa.",
    href: "/servicios/hidrojet",
    ctaLabel: "Solicitar hidrojet",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de hidrojet de alta presión de Hidrourgencias SpA. Indico comuna, tipo de red y antecedentes del problema.",
    ),
  },
  {
    title: "Destape de edificios",
    description:
      "Atención para edificios, comunidades y redes sanitarias compartidas con coordinación operativa, diagnóstico por zonas críticas y continuidad para residentes o usuarios.",
    href: "/servicios/destape-edificios",
    ctaLabel: "Solicitar atención edificio",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de edificios de Hidrourgencias SpA. Indico comuna, edificio o comunidad y descripción del problema.",
    ),
  },
  {
    title: "Mantención preventiva de redes",
    description:
      "Diseñamos planes preventivos para edificios, condominios, empresas y locales comerciales con calendario, trazabilidad por visita y recomendaciones para reducir contingencias sanitarias graves.",
    href: "/servicios/mantencion-preventiva-redes",
    ctaLabel: "Solicitar mantención",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de mantención preventiva de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y frecuencia requerida.",
    ),
  },
  {
    title: "Destape de verticales",
    description:
      "Intervenimos bajadas sanitarias y ductos verticales en edificios con lectura por pisos, equipos RIDGID y pruebas de descarga para reducir retornos en niveles inferiores.",
    href: "/servicios/destape-verticales",
    ctaLabel: "Solicitar destape vertical",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de verticales sanitarias de Hidrourgencias SpA. Indico comuna, edificio y pisos o sectores afectados.",
    ),
  },
  {
    title: "Motobombas para extracción de aguas",
    description:
      "Extracción de aguas acumuladas en subterráneos, patios, salas técnicas y espacios anegados con evaluación de caudal, trazado de descarga y control de riesgo sanitario.",
    href: "/servicios/motobombas-extraccion-aguas",
    ctaLabel: "Solicitar extracción",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de motobombas para extracción de aguas de Hidrourgencias SpA. Indico comuna, volumen aproximado y sector afectado.",
    ),
  },
  {
    title: "Reparación de tuberías HDPE",
    description:
      "Reparación técnica de tuberías HDPE para agua potable y aguas servidas, con evaluación del tramo, control de estanqueidad y recomendaciones de mantención.",
    href: "/servicios/reparacion-tuberias-hdpe",
    ctaLabel: "Solicitar reparación",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de reparación de tuberías HDPE de Hidrourgencias SpA. Indico comuna, tipo de red y antecedentes de la falla.",
    ),
  },
  {
    title: "Destape de cámaras de inspección",
    description:
      "Limpieza y destape de cámaras de inspección colapsadas por grasas, sedimentos o residuos, con apoyo de hidrojet y videoinspección cuando corresponde.",
    href: "/servicios/destape-camaras-inspeccion",
    ctaLabel: "Solicitar destape cámara",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de cámaras de inspección de Hidrourgencias SpA. Indico comuna, tipo de cámara y síntomas observados.",
    ),
  },
  {
    title: "Destape de artefactos sanitarios",
    description:
      "Resolución de obstrucciones en WC, lavamanos, lavaplatos, duchas y urinarios con maniobras técnicas seguras y validación de descarga posterior.",
    href: "/servicios/destape-artefactos-sanitarios",
    ctaLabel: "Solicitar destape sanitario",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de artefactos sanitarios de Hidrourgencias SpA. Indico comuna, artefacto afectado y urgencia.",
    ),
  },
  {
    title: "Destape de horizontales",
    description:
      "Destape de tramos horizontales y colectores entre cámaras mediante diagnóstico, equipos mecánicos, hidrojet y pruebas hidráulicas de continuidad.",
    href: "/servicios/destape-horizontales",
    ctaLabel: "Solicitar destape horizontal",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de destape de horizontales sanitarias de Hidrourgencias SpA. Indico comuna, cámaras o tramos afectados y síntomas.",
    ),
  },
  {
    title: "Videoinspección sanitaria",
    description:
      "Utilizamos cámaras técnicas para identificar fisuras, contrapendientes, puntos de colapso y obstrucción persistente. El objetivo es decidir la solución correcta con evidencia real.",
    href: "/servicios/destape-camaras-inspeccion",
    ctaLabel: "Solicitar videoinspección",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de videoinspección sanitaria de Hidrourgencias SpA. Indico comuna, tipo de red y motivo de la inspección.",
    ),
  },
  {
    title: "Limpieza, higienización y sanitización",
    description:
      "Limpieza, higienización y sanitización para espacios afectados por residuos, malos olores, aguas servidas o contaminación sanitaria. Servicio orientado a particulares, empresas y comercio.",
    href: "/servicios/limpieza-higienizacion-sanitizacion",
    ctaLabel: "Solicitar sanitización",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de limpieza, higienización y sanitización de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes del sector afectado.",
    ),
  },
  {
    title: "Limpieza de domicilios y recuperación de espacios",
    description:
      "Limpieza técnica de espacios domiciliarios afectados por acumulación, malos olores, residuos, humedad o eventos sanitarios, priorizando recuperación de uso e higiene.",
    href: "/servicios/limpieza-domicilios-recuperacion-espacios",
    ctaLabel: "Solicitar limpieza domicilio",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de limpieza de domicilios y recuperación de espacios de Hidrourgencias SpA. Indico comuna, tipo de espacio y antecedentes del caso.",
    ),
  },
  {
    title: "Limpieza de fachadas e hidrolavado de superficies",
    description:
      "Hidrolavado de fachadas, accesos, muros, pisos y superficies exteriores con selección de presión según material y nivel de adherencia.",
    href: "/servicios/limpieza-fachadas-hidrolavado-superficies",
    ctaLabel: "Solicitar hidrolavado",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de limpieza de fachadas e hidrolavado de superficies de Hidrourgencias SpA. Indico comuna, tipo de superficie y extensión aproximada.",
    ),
  },
  {
    title: "Extracción de aguas en estanques, piscinas y espacios anegados",
    description:
      "Extracción controlada de aguas en estanques, piscinas, patios, subterráneos y recintos anegados, con apoyo de motobombas y descarga planificada.",
    href: "/servicios/extraccion-aguas-estanques-piscinas",
    ctaLabel: "Solicitar extracción de aguas",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de extracción de aguas en estanques, piscinas o espacios anegados de Hidrourgencias SpA. Indico comuna, tipo de agua y volumen aproximado.",
    ),
  },
  {
    title: "Asesoría en mantenimiento integral de redes sanitarias",
    description:
      "Asesoría técnica para diagnosticar, priorizar y planificar mantenimiento integral de redes sanitarias en edificios, empresas, comunidades y recintos de alto uso.",
    href: "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
    ctaLabel: "Solicitar asesoría",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de asesoría en mantenimiento integral de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y objetivo de la asesoría.",
    ),
  },
  {
    title: "Análisis técnico de propiedad y redes sanitarias",
    description:
      "Análisis técnico exhaustivo de redes de alcantarillado y desagües para detectar vicios ocultos, obstrucciones, contrapendientes, raíces, fisuras, colapsos, filtraciones sanitarias visibles, cámaras deficientes o condiciones que puedan generar gastos imprevistos antes de comprar, arrendar o recibir una propiedad.",
    href: "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    ctaLabel: "Solicitar análisis sanitario",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    ),
  },
  {
    title: "Urgencias sanitarias 24/7",
    description:
      "Respuesta prioritaria para rebalses activos, retorno de aguas servidas, obstrucciones críticas, inundaciones sanitarias, olores severos y pérdida de continuidad operativa.",
    href: "/#servicios",
    linkLabel: "Ver servicios",
    ctaLabel: "Solicitar asistencia de urgencia",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar asistencia de urgencia sanitaria 24/7 con Hidrourgencias SpA. Indico comuna, dirección, tipo de problema y nivel de urgencia.",
    ),
    highlights: [
      "Rebalses de alcantarillado y retorno de aguas servidas",
      "WC, cámaras, verticales y horizontales colapsadas",
      "Extracción de aguas acumuladas con motobombas",
      "Limpieza post emergencia sanitaria y control de olores",
      "Análisis técnico de propiedad y redes sanitarias",
      "Coordinación para edificios, comunidades, empresas y domicilios",
    ],
  },
];

export function createMailToUrl() {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(siteConfig.emailSubject)}&body=${encodeURIComponent(siteConfig.emailBody)}`;
}

export function normalizeCanonicalPath(path: string) {
  const normalized = path
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\/{2,}/g, "/")
    .toLowerCase();

  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;

  if (withLeadingSlash !== "/" && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
}

export function buildCanonicalUrl(path: string) {
  return `${siteConfig.siteUrl}${normalizeCanonicalPath(path)}`;
}
