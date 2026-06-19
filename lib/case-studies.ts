import type { Metadata } from "next";

import { getCmsCaseEntries, getCmsHighlightedClients, getCmsWorkEntries, type CmsCaseEntry } from "@/lib/cms-content";
import { buildCanonicalUrl, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

export const caseStudyCategoryFilters = [
  "Edificios",
  "Hoteles",
  "Restaurantes",
  "Instituciones Públicas",
  "Universidades",
  "Condominios",
  "Empresas",
  "Viviendas",
] as const;

export const caseStudyServiceFilters = [
  "Destape de alcantarillado",
  "Hidrojet",
  "Destape de verticales",
  "Destape de horizontales",
  "Destape de edificios",
  "Mantención preventiva",
  "Videoinspección",
  "Reparación HDPE",
  "Motobombas",
] as const;

export type CaseStudyCategory = (typeof caseStudyCategoryFilters)[number];
export type CaseStudyServiceFilter = (typeof caseStudyServiceFilters)[number];

export type CaseStudyLogo = {
  src: string;
  alt: string;
};

export type CaseStudyClient = {
  name: string;
  slug: string;
  city: string;
  categories: CaseStudyCategory[];
  logo?: CaseStudyLogo;
};

export type CaseStudyFaq = {
  question: string;
  answer: string;
};

export type CaseStudy = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  client: CaseStudyClient;
  city: string;
  serviceType: string;
  serviceFilter: CaseStudyServiceFilter;
  serviceDateLabel: string;
  featuredImage: string;
  summary: string;
  background: string;
  problem: string;
  diagnosis: string;
  equipment: string[];
  methodology: string[];
  intervention: string[];
  result: string;
  recommendations: string[];
  conclusions: string;
  gallery: Array<{ src: string; alt: string }>;
  faq: CaseStudyFaq[];
  ctaMessage: string;
  keywords: string[];
};

const logoNotice =
  "El presente caso de éxito describe un servicio efectivamente ejecutado por Hidrourgencias SpA. La inclusión del logotipo tiene fines exclusivamente referenciales para identificar la entidad o instalación donde se desarrolló el trabajo y no implica patrocinio, representación ni asociación comercial permanente.";

export const clientLogoLegalNotice = logoNotice;

const clients: Record<string, CaseStudyClient> = {
  boulevardDelSol: {
    name: "Boulevard del Sol",
    slug: "boulevard-del-sol",
    city: "Viña del Mar",
    categories: ["Edificios", "Condominios"],
  },
  sheratonHotel: {
    name: "Sheraton Hotel",
    slug: "sheraton-hotel",
    city: "Viña del Mar",
    categories: ["Hoteles", "Empresas"],
  },
  kfc: {
    name: "KFC",
    slug: "kfc",
    city: "Región de Valparaíso",
    categories: ["Restaurantes", "Empresas"],
    logo: {
      src: "/logos/kfc.webp",
      alt: "Mantención sanitaria realizada por Hidrourgencias en KFC",
    },
  },
  mesitaGrande: {
    name: "Mesita Grande",
    slug: "mesita-grande",
    city: "Región de Valparaíso",
    categories: ["Restaurantes", "Empresas"],
    logo: {
      src: "/logos/mesita-grande.webp",
      alt: "Servicio sanitario preventivo realizado por Hidrourgencias en Mesita Grande",
    },
  },
  universidadPlayaAncha: {
    name: "Universidad de Playa Ancha",
    slug: "universidad-playa-ancha",
    city: "Valparaíso",
    categories: ["Universidades", "Instituciones Públicas"],
  },
  bomberos: {
    name: "Cuerpo de Bomberos de Viña del Mar",
    slug: "bomberos-vina-del-mar",
    city: "Viña del Mar",
    categories: ["Instituciones Públicas"],
  },
  carabineros: {
    name: "Carabineros de Chile",
    slug: "carabineros-de-chile",
    city: "Región de Valparaíso",
    categories: ["Instituciones Públicas"],
    logo: {
      src: "/logos/carabineros.webp",
      alt: "Servicio de destape de alcantarillado ejecutado por Hidrourgencias para Carabineros de Chile",
    },
  },
};

type CaseSeed = {
  clientKey: keyof typeof clients;
  title: string;
  serviceType: string;
  serviceFilter: CaseStudyServiceFilter;
  image: string;
  equipment: string[];
  problemFocus: string;
  resultFocus: string;
};

const galleryImages = [
  "/galeria/destape-alcantarillado-vina-del-mar-1.jpg",
  "/galeria/destape-alcantarillado-vina-del-mar-6.jpg",
  "/images/trabajo-1.jpg",
];

const serviceLinks = [
  { href: "/servicios/destape-alcantarillado", label: "Destape de alcantarillado" },
  { href: "/servicios/hidrojet", label: "Hidrojet" },
  { href: "/servicios/destape-edificios", label: "Destape de edificios" },
  { href: "/servicios/videoinspeccion", label: "Videoinspección sanitaria" },
  { href: "/servicios/mantencion-preventiva", label: "Mantención preventiva" },
];

const blogLinks = [
  { href: "/blog/rebalse-alcantarillado-edificio", label: "Rebalse de alcantarillado en edificio" },
  { href: "/blog/desague-lento-cocina", label: "Desagüe lento en cocina" },
  { href: "/blog/mantencion-preventiva", label: "Mantención preventiva sanitaria" },
];

export const caseStudyServiceLinks = serviceLinks;
export const caseStudyBlogLinks = blogLinks;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildFaq(caseStudy: Pick<CaseStudy, "client" | "serviceType" | "serviceFilter">): CaseStudyFaq[] {
  return [
    {
      question: `¿Qué objetivo tuvo el servicio de ${caseStudy.serviceType.toLowerCase()}?`,
      answer:
        "El objetivo fue recuperar continuidad sanitaria, reducir riesgo de reincidencia y dejar recomendaciones técnicas claras para la operación del inmueble.",
    },
    {
      question: "¿Qué información se debe enviar para solicitar un servicio similar?",
      answer:
        "Comuna, tipo de propiedad, síntoma principal, fotos o videos del punto afectado y si existe retorno de aguas servidas, mal olor o rebalse activo.",
    },
    {
      question: `¿Este tipo de caso aplica para ${caseStudy.client.categories[0].toLowerCase()}?`,
      answer:
        "Sí. Hidrourgencias adapta metodología, equipos y comunicación según el tipo de inmueble, nivel de urgencia y continuidad operativa requerida.",
    },
    {
      question: "¿Cuándo conviene pasar de urgencia a mantención preventiva?",
      answer:
        "Cuando el problema se repite, existe alta carga sanitaria o se detectan puntos críticos en cámaras, verticales, horizontales o redes de cocina.",
    },
  ];
}

function createCaseStudy(seed: CaseSeed): CaseStudy {
  const client = clients[seed.clientKey];
  const slug = `${client.slug}-${slugify(seed.title)}`;
  const ctaMessage = `Hola, necesito solicitar un servicio similar al caso ${seed.title} realizado para ${client.name}. Indico comuna, tipo de propiedad y antecedentes del problema.`;
  const h1 = `Caso de Éxito: ${seed.title} en ${client.name}${client.city === "Región de Valparaíso" ? "" : ` de ${client.city}`}`;
  const description = `${seed.serviceType} ejecutado por Hidrourgencias SpA para ${client.name}. Caso SEO con resumen técnico, metodología, equipamiento y recomendaciones sanitarias.`;

  return {
    slug,
    h1,
    title: seed.title,
    description,
    client,
    city: client.city,
    serviceType: seed.serviceType,
    serviceFilter: seed.serviceFilter,
    serviceDateLabel: "Fecha no publicada",
    featuredImage: seed.image,
    summary: `Caso de éxito asociado a ${seed.serviceType.toLowerCase()} para ${client.name}, con enfoque en continuidad sanitaria, diagnóstico técnico y reducción de riesgo operativo.`,
    background: `${client.name} requiere continuidad sanitaria y respuesta técnica confiable. En este caso, Hidrourgencias SpA abordó el requerimiento con metodología de diagnóstico, equipamiento profesional y comunicación orientada a la toma de decisiones.`,
    problem: seed.problemFocus,
    diagnosis: `El diagnóstico técnico consideró síntomas reportados, revisión de puntos sanitarios críticos, lectura de cámaras o desagües y definición de la maniobra adecuada según el tipo de red. La evaluación se realizó sin exponer datos internos del cliente ni antecedentes no públicos.`,
    equipment: seed.equipment,
    methodology: [
      "Levantamiento inicial del requerimiento y nivel de urgencia.",
      "Revisión de accesos, cámaras, artefactos o tramos comprometidos.",
      "Selección de equipos según diámetro, residuo predominante y continuidad operativa requerida.",
      "Ejecución controlada de la intervención y validación operativa posterior.",
    ],
    intervention: [
      "Coordinación con el responsable del inmueble para ordenar accesos y puntos de trabajo.",
      "Aplicación de maniobras de destape, hidrojet, videoinspección, reparación o extracción según el servicio ejecutado.",
      "Pruebas de flujo, revisión de retorno y cierre con recomendaciones preventivas.",
    ],
    result: seed.resultFocus,
    recommendations: [
      "Registrar puntos críticos y síntomas recurrentes para definir frecuencia preventiva.",
      "Solicitar evaluación técnica cuando aparezcan malos olores, descarga lenta o retorno de aguas servidas.",
      "Complementar destape con hidrojet o videoinspección cuando exista reincidencia.",
      "Mantener comunicación preventiva con administradores, jefaturas o responsables del inmueble.",
    ],
    conclusions: `Este caso refuerza la importancia de resolver contingencias sanitarias con criterio técnico y no solo con una acción reactiva. Hidrourgencias SpA combina respuesta, diagnóstico y recomendaciones para proteger continuidad en Viña del Mar, Valparaíso, Concón, Quilpué, Villa Alemana y la Región de Valparaíso.`,
    gallery: galleryImages.map((src, index) => ({
      src,
      alt: `Registro operativo referencial ${index + 1} de ${seed.serviceType.toLowerCase()} realizado por Hidrourgencias SpA`,
    })),
    faq: buildFaq({ client, serviceType: seed.serviceType, serviceFilter: seed.serviceFilter }),
    ctaMessage,
    keywords: [seed.serviceFilter, seed.serviceType, client.name, client.city, "Hidrourgencias SpA"],
  };
}

function mapCmsServiceFilter(service: string): CaseStudyServiceFilter {
  const normalized = service
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("hidrojet")) return "Hidrojet";
  if (normalized.includes("vertical")) return "Destape de verticales";
  if (normalized.includes("horizontal")) return "Destape de horizontales";
  if (normalized.includes("edificio")) return "Destape de edificios";
  if (normalized.includes("mantencion")) return "Mantención preventiva";
  if (normalized.includes("video")) return "Videoinspección";
  if (normalized.includes("hdpe") || normalized.includes("reparacion")) return "Reparación HDPE";
  if (normalized.includes("motobomba") || normalized.includes("extraccion")) return "Motobombas";

  return "Destape de alcantarillado";
}

function formatCaseDateLabel(value: string | undefined) {
  if (!value) {
    return "Fecha no publicada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no publicada";
  }

  return new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(date);
}

function createCmsCaseStudy(entry: CmsCaseEntry, kind: "case" | "work"): CaseStudy {
  const clientName = entry.client || "Cliente Hidrourgencias";
  const clientSlug = slugify(clientName || entry.slug);
  const serviceFilter = mapCmsServiceFilter(entry.service);
  const h1Prefix = kind === "case" ? "Caso de Éxito" : "Trabajo Real";
  const h1 = `${h1Prefix}: ${entry.title} en ${entry.commune}`;
  const ctaMessage = `Hola, necesito solicitar un servicio similar a ${entry.title} realizado por Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes del problema.`;
  const client: CaseStudyClient = {
    name: clientName,
    slug: clientSlug,
    city: entry.commune,
    categories: ["Empresas"],
  };
  const bodyText = entry.body || entry.description;
  const gallery = entry.gallery.length
    ? entry.gallery.map((image) => ({ src: image.image, alt: image.alt }))
    : [{ src: entry.image, alt: entry.alt }];

  return {
    slug: entry.slug,
    h1,
    title: entry.title,
    description: entry.description,
    client,
    city: entry.commune,
    serviceType: entry.service,
    serviceFilter,
    serviceDateLabel: formatCaseDateLabel(entry.date),
    featuredImage: entry.image,
    summary: entry.description,
    background: entry.subtitle || `Servicio solicitado en ${entry.commune} con requerimiento asociado a ${entry.service.toLowerCase()}.`,
    problem: bodyText,
    diagnosis:
      "El equipo técnico evaluó síntomas, accesos, puntos sanitarios comprometidos y condiciones de la red antes de definir la maniobra de trabajo.",
    equipment: [entry.service, "Equipamiento técnico Hidrourgencias SpA"],
    methodology: [
      "Levantamiento inicial del requerimiento y nivel de urgencia.",
      "Revisión de accesos, cámaras, artefactos o tramos comprometidos.",
      "Selección de equipos según diámetro, residuo predominante y continuidad operativa requerida.",
      "Validación operativa posterior a la intervención.",
    ],
    intervention: [
      "Coordinación del punto de trabajo con el responsable del inmueble.",
      "Aplicación de la maniobra técnica correspondiente al servicio solicitado.",
      "Pruebas de flujo, revisión de retorno y cierre con recomendaciones preventivas.",
    ],
    result: `Servicio de ${entry.service.toLowerCase()} ejecutado por Hidrourgencias SpA en ${entry.commune}.`,
    recommendations: [
      "Registrar puntos críticos y síntomas recurrentes para definir frecuencia preventiva.",
      "Solicitar evaluación técnica cuando aparezcan malos olores, descarga lenta o retorno de aguas servidas.",
      "Complementar destape con hidrojet o videoinspección cuando exista reincidencia.",
      "Mantener comunicación preventiva con administradores, jefaturas o responsables del inmueble.",
    ],
    conclusions:
      "Este registro refuerza la importancia de resolver contingencias sanitarias con criterio técnico, evidencia operativa y recomendaciones claras.",
    gallery,
    faq: buildFaq({ client, serviceType: entry.service, serviceFilter }),
    ctaMessage,
    keywords: [serviceFilter, entry.service, entry.commune, "Hidrourgencias SpA"],
  };
}

const caseSeeds: CaseSeed[] = [
  {
    clientKey: "boulevardDelSol",
    title: "Destape de verticales en edificio",
    serviceType: "Destape de verticales en edificio",
    serviceFilter: "Destape de verticales",
    image: "/images/servicios/default (3).jpg",
    equipment: ["RIDGID K-50", "RIDGID K-1500", "Videoinspección sanitaria"],
    problemFocus: "Se abordó una condición de descarga lenta o retorno asociado a red vertical en edificio, con necesidad de ordenar diagnóstico por niveles y reducir riesgo de rebalse.",
    resultFocus: "La intervención permitió recuperar continuidad operativa en la vertical comprometida y dejar recomendaciones preventivas para administración.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Destape de horizontales",
    serviceType: "Destape de horizontales",
    serviceFilter: "Destape de horizontales",
    image: "/images/servicios/default (4).jpg",
    equipment: ["RIDGID K-1500", "Hidrojet 4000 PSI", "Prueba hidráulica"],
    problemFocus: "Se revisó un tramo horizontal con pérdida de flujo, sedimentos o acumulación que podía afectar cámaras y colectores privados.",
    resultFocus: "El tramo recuperó capacidad de evacuación y quedó con recomendaciones para monitorear puntos críticos entre cámaras.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Mantención preventiva semestral",
    serviceType: "Mantención preventiva semestral",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-1500", "Revisión de cámaras"],
    problemFocus: "El inmueble requería una pauta preventiva para disminuir contingencias repetitivas y ordenar limpieza de redes sanitarias compartidas.",
    resultFocus: "La mantención permitió mejorar control operativo y dejar una frecuencia sugerida para reducir urgencias futuras.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Emergencia sanitaria nocturna",
    serviceType: "Emergencia sanitaria nocturna",
    serviceFilter: "Destape de edificios",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-1500", "Motobombas", "Hidrojet 4000 PSI"],
    problemFocus: "Se atendió un evento fuera de horario con riesgo de rebalse o pérdida de continuidad sanitaria en edificio.",
    resultFocus: "La respuesta prioritaria permitió contener el evento y orientar acciones preventivas para la administración.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Limpieza con hidrojet",
    serviceType: "Limpieza con hidrojet",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas de limpieza", "Videoinspección sanitaria"],
    problemFocus: "La red presentaba acumulación de residuos adheridos, grasa o sedimentos que requerían limpieza hidrodinámica.",
    resultFocus: "El hidrojet recuperó mejor sección útil de la red y redujo la probabilidad de obstrucciones recurrentes.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Diagnóstico técnico de red",
    serviceType: "Diagnóstico técnico de red sanitaria",
    serviceFilter: "Videoinspección",
    image: "/images/trabajo-2.jpg",
    equipment: ["Videoinspección sanitaria", "Revisión de cámaras", "Pruebas operativas"],
    problemFocus: "Se requería identificar causa probable de síntomas sanitarios sin comprometer decisiones solo por observación superficial.",
    resultFocus: "El diagnóstico entregó antecedentes técnicos para decidir si correspondía limpieza, destape, hidrojet o mantención preventiva.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Destape de cámaras",
    serviceType: "Destape de cámaras",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/servicios/default (2).jpg",
    equipment: ["RIDGID K-1500", "Hidrojet 4000 PSI", "Herramientas de extracción"],
    problemFocus: "Se revisaron cámaras con nivel alto, sedimento o acumulación que podía derivar en rebalse sanitario.",
    resultFocus: "Las cámaras recuperaron lectura operativa y se definieron recomendaciones para seguimiento preventivo.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Rebalse de alcantarillado",
    serviceType: "Control de rebalse de alcantarillado",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-1500", "Motobombas", "Hidrojet 4000 PSI"],
    problemFocus: "Se abordó riesgo de rebalse o retorno de aguas servidas con necesidad de respuesta técnica y contención sanitaria.",
    resultFocus: "El sistema recuperó evacuación y el cliente recibió recomendaciones para disminuir exposición sanitaria futura.",
  },
  {
    clientKey: "boulevardDelSol",
    title: "Videoinspección sanitaria",
    serviceType: "Videoinspección sanitaria",
    serviceFilter: "Videoinspección",
    image: "/images/trabajo-3.jpg",
    equipment: ["Videoinspección sanitaria", "RIDGID", "Registro técnico de tramo"],
    problemFocus: "Se necesitaba revisar el interior de la red para identificar fisuras, raíces, contrapendientes o acumulaciones no visibles.",
    resultFocus: "La inspección aportó evidencia para orientar la acción técnica correcta y evitar intervenciones a ciegas.",
  },
  {
    clientKey: "sheratonHotel",
    title: "Destape de horizontal",
    serviceType: "Destape de horizontal hotelero",
    serviceFilter: "Destape de horizontales",
    image: "/images/servicios/default (4).jpg",
    equipment: ["RIDGID K-1500", "Hidrojet 4000 PSI", "Prueba hidráulica"],
    problemFocus: "Se atendió un tramo horizontal con pérdida de flujo en contexto hotelero, donde la continuidad sanitaria es crítica.",
    resultFocus: "El servicio permitió recuperar evacuación y proteger continuidad de operación del recinto.",
  },
  {
    clientKey: "sheratonHotel",
    title: "Mantención sanitaria hotelera",
    serviceType: "Mantención sanitaria hotelera",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "Revisión de cámaras", "RIDGID K-1500"],
    problemFocus: "Se requería mantener redes sanitarias de alto uso con enfoque preventivo y continuidad operacional.",
    resultFocus: "La mantención aportó control preventivo y recomendaciones para disminuir contingencias en periodos de alta demanda.",
  },
  {
    clientKey: "sheratonHotel",
    title: "Limpieza preventiva de alcantarillado",
    serviceType: "Limpieza preventiva de alcantarillado",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas de limpieza", "Revisión de cámaras"],
    problemFocus: "Se realizó limpieza preventiva para evitar acumulación de residuos y proteger redes de uso intensivo.",
    resultFocus: "La red quedó con mejor capacidad hidráulica y pauta preventiva para continuidad hotelera.",
  },
  {
    clientKey: "sheratonHotel",
    title: "Diagnóstico de red sanitaria",
    serviceType: "Diagnóstico de red sanitaria",
    serviceFilter: "Videoinspección",
    image: "/images/trabajo-2.jpg",
    equipment: ["Videoinspección sanitaria", "Pruebas operativas", "Revisión de cámaras"],
    problemFocus: "Se evaluó una red sanitaria para distinguir entre obstrucción puntual, acumulación interna o condición preventiva.",
    resultFocus: "El diagnóstico permitió ordenar acciones correctivas y preventivas con mejor respaldo técnico.",
  },
  {
    clientKey: "kfc",
    title: "Limpieza de desagües de cocina industrial",
    serviceType: "Limpieza de desagües de cocina industrial",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/servicios/default (1).jpg",
    equipment: ["RIDGID K-50", "Hidrojet 4000 PSI", "Herramientas de limpieza"],
    problemFocus: "Se atendieron desagües de cocina industrial con residuos orgánicos, grasa y riesgo de drenaje lento.",
    resultFocus: "Los desagües recuperaron flujo y se recomendaron rutinas preventivas para operación comercial.",
  },
  {
    clientKey: "kfc",
    title: "Eliminación de grasas",
    serviceType: "Eliminación de grasas en red sanitaria",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas desincrustantes", "Revisión de cámara desengrasadora"],
    problemFocus: "La red presentaba acumulación de grasa asociada a operación de cocina, con riesgo de obstrucción recurrente.",
    resultFocus: "La limpieza redujo adherencias internas y permitió definir frecuencia preventiva para el recinto.",
  },
  {
    clientKey: "kfc",
    title: "Hidrojet preventivo",
    serviceType: "Hidrojet preventivo",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas de arrastre", "Prueba de descarga"],
    problemFocus: "Se solicitó hidrojet preventivo para mantener capacidad de evacuación en redes expuestas a grasa y alta carga.",
    resultFocus: "La red quedó con limpieza profunda y recomendaciones para prevenir saturación de cámaras o desagües.",
  },
  {
    clientKey: "kfc",
    title: "Mantención sanitaria programada",
    serviceType: "Mantención sanitaria programada",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-50", "Revisión de cámaras"],
    problemFocus: "El local requería mantención programada para evitar interrupciones sanitarias en horario comercial.",
    resultFocus: "La programación permitió ordenar controles y reducir probabilidad de urgencias por grasa acumulada.",
  },
  {
    clientKey: "kfc",
    title: "Atención de emergencia fuera de horario",
    serviceType: "Atención de emergencia fuera de horario",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-50", "RIDGID K-1500", "Hidrojet 4000 PSI"],
    problemFocus: "Se respondió fuera de horario ante síntoma sanitario crítico que podía afectar continuidad comercial.",
    resultFocus: "La atención permitió recuperar funcionamiento y cerrar con recomendaciones preventivas para cocina industrial.",
  },
  {
    clientKey: "mesitaGrande",
    title: "Mantención preventiva de alcantarillado",
    serviceType: "Mantención preventiva de alcantarillado",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-1500", "Revisión de cámaras"],
    problemFocus: "Se implementó mantención preventiva en red de restaurante para reducir obstrucciones por residuos y grasa.",
    resultFocus: "El servicio ayudó a estabilizar operación sanitaria y definir una pauta preventiva.",
  },
  {
    clientKey: "mesitaGrande",
    title: "Limpieza de cámara desengrasadora",
    serviceType: "Limpieza de cámara desengrasadora",
    serviceFilter: "Hidrojet",
    image: "/images/servicios/default (2).jpg",
    equipment: ["Hidrojet 4000 PSI", "Herramientas de extracción", "Revisión de cámara"],
    problemFocus: "Se abordó acumulación en cámara desengrasadora, una condición crítica en restaurantes y cocinas de alto uso.",
    resultFocus: "La cámara quedó en mejores condiciones operativas y con recomendación de frecuencia preventiva.",
  },
  {
    clientKey: "mesitaGrande",
    title: "Hidrojet para grasas acumuladas",
    serviceType: "Hidrojet para grasas acumuladas",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas de limpieza", "Prueba de descarga"],
    problemFocus: "Se trató acumulación de grasa adherida en red sanitaria vinculada a operación gastronómica.",
    resultFocus: "La limpieza hidrodinámica mejoró evacuación y redujo el riesgo de bloqueo por grasa.",
  },
  {
    clientKey: "mesitaGrande",
    title: "Emergencia sanitaria en restaurante",
    serviceType: "Emergencia sanitaria en restaurante",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-50", "Hidrojet 4000 PSI", "Revisión de cámara"],
    problemFocus: "Se atendió una urgencia sanitaria con potencial impacto en la operación del restaurante.",
    resultFocus: "La respuesta técnica permitió recuperar continuidad y orientar medidas de prevención.",
  },
  {
    clientKey: "mesitaGrande",
    title: "Programa preventivo mensual",
    serviceType: "Programa preventivo mensual",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "Revisión de cámaras", "Control de desagües"],
    problemFocus: "Se definió programa preventivo para controlar acumulación de grasa y síntomas repetitivos.",
    resultFocus: "El programa permitió ordenar mantenciones y disminuir riesgo de eventos sanitarios en horario crítico.",
  },
  {
    clientKey: "universidadPlayaAncha",
    title: "Reparación HDPE",
    serviceType: "Reparación HDPE",
    serviceFilter: "Reparación HDPE",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Herramientas de reparación HDPE", "Instrumentos de presión", "Revisión técnica"],
    problemFocus: "Se evaluó una condición de tubería HDPE con necesidad de intervención técnica y verificación posterior.",
    resultFocus: "La reparación permitió recuperar continuidad y entregar recomendaciones para evitar falla recurrente.",
  },
  {
    clientKey: "universidadPlayaAncha",
    title: "Diagnóstico sanitario",
    serviceType: "Diagnóstico sanitario",
    serviceFilter: "Videoinspección",
    image: "/images/trabajo-2.jpg",
    equipment: ["Videoinspección sanitaria", "Revisión de cámaras", "Pruebas operativas"],
    problemFocus: "Se realizó diagnóstico sanitario para orientar decisiones sobre redes de uso institucional.",
    resultFocus: "El diagnóstico permitió identificar acciones preventivas o correctivas según criticidad.",
  },
  {
    clientKey: "universidadPlayaAncha",
    title: "Mantención preventiva",
    serviceType: "Mantención preventiva institucional",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-1500", "Revisión de cámaras"],
    problemFocus: "Se abordó mantención preventiva en redes institucionales con alto flujo de usuarios.",
    resultFocus: "La mantención apoyó continuidad sanitaria y mejor control de puntos críticos.",
  },
  {
    clientKey: "universidadPlayaAncha",
    title: "Evaluación técnica de redes",
    serviceType: "Evaluación técnica de redes sanitarias",
    serviceFilter: "Videoinspección",
    image: "/images/trabajo-3.jpg",
    equipment: ["Videoinspección sanitaria", "Revisión de cámaras", "Pruebas de descarga"],
    problemFocus: "Se necesitaba evaluar el estado de redes sanitarias para definir prioridades de intervención.",
    resultFocus: "La evaluación entregó antecedentes técnicos para planificar acciones de mantenimiento o reparación.",
  },
  {
    clientKey: "bomberos",
    title: "Limpieza con hidrojet",
    serviceType: "Limpieza con hidrojet",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Boquillas de limpieza", "Revisión de cámaras"],
    problemFocus: "Se realizó limpieza hidrodinámica para proteger continuidad sanitaria de una institución operativa.",
    resultFocus: "La red mejoró capacidad de evacuación y quedó con recomendaciones preventivas.",
  },
  {
    clientKey: "bomberos",
    title: "Mantención de redes sanitarias",
    serviceType: "Mantención de redes sanitarias",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-1500", "Pruebas operativas"],
    problemFocus: "Se abordó mantención de red sanitaria institucional para reducir riesgo de interrupción.",
    resultFocus: "La mantención permitió ordenar puntos críticos y fortalecer prevención.",
  },
  {
    clientKey: "bomberos",
    title: "Prevención de obstrucciones",
    serviceType: "Prevención de obstrucciones",
    serviceFilter: "Mantención preventiva",
    image: "/images/servicios/default (2).jpg",
    equipment: ["Revisión de cámaras", "Hidrojet 4000 PSI", "RIDGID K-1500"],
    problemFocus: "Se trabajó sobre puntos de riesgo para prevenir obstrucciones en red sanitaria institucional.",
    resultFocus: "El servicio permitió disminuir probabilidad de eventos repetitivos y ordenar acciones preventivas.",
  },
  {
    clientKey: "bomberos",
    title: "Respuesta de emergencia",
    serviceType: "Respuesta de emergencia sanitaria",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-1500", "Motobombas", "Hidrojet 4000 PSI"],
    problemFocus: "Se atendió una urgencia sanitaria con necesidad de respuesta rápida y recuperación operativa.",
    resultFocus: "La intervención permitió contener el evento y dejar recomendaciones para futuras contingencias.",
  },
  {
    clientKey: "carabineros",
    title: "Destape de alcantarillado",
    serviceType: "Destape de alcantarillado",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-1500", "Hidrojet 4000 PSI", "Revisión de cámaras"],
    problemFocus: "Se abordó obstrucción o pérdida de flujo en red de alcantarillado con necesidad de recuperación sanitaria.",
    resultFocus: "La red recuperó evacuación y se recomendaron acciones preventivas para reducir reincidencia.",
  },
  {
    clientKey: "carabineros",
    title: "Emergencia sanitaria",
    serviceType: "Emergencia sanitaria",
    serviceFilter: "Destape de alcantarillado",
    image: "/images/hero-urgencia.jpg",
    equipment: ["RIDGID K-1500", "Motobombas", "Hidrojet 4000 PSI"],
    problemFocus: "Se respondió a una contingencia sanitaria con riesgo de rebalse o pérdida de uso de instalaciones.",
    resultFocus: "La atención permitió controlar la urgencia y orientar el cierre técnico del evento.",
  },
  {
    clientKey: "carabineros",
    title: "Limpieza sanitaria",
    serviceType: "Limpieza sanitaria",
    serviceFilter: "Hidrojet",
    image: "/images/hero-hidrojet.jpg",
    equipment: ["Hidrojet 4000 PSI", "Revisión de cámaras", "Herramientas de limpieza"],
    problemFocus: "Se ejecutó limpieza sanitaria para recuperar condiciones de flujo y reducir residuos en red.",
    resultFocus: "La intervención mejoró condición operativa y dejó recomendaciones de seguimiento.",
  },
  {
    clientKey: "carabineros",
    title: "Mantención preventiva",
    serviceType: "Mantención preventiva",
    serviceFilter: "Mantención preventiva",
    image: "/images/hero-mantencion.jpg",
    equipment: ["Hidrojet 4000 PSI", "RIDGID K-1500", "Revisión de cámaras"],
    problemFocus: "Se realizó mantención preventiva para disminuir eventos sanitarios y controlar puntos críticos.",
    resultFocus: "La mantención aportó trazabilidad y recomendaciones para continuidad operativa.",
  },
];

const staticCaseStudies = caseSeeds.map(createCaseStudy);
const cmsCaseStudies = [
  ...getCmsCaseEntries().map((entry) => createCmsCaseStudy(entry, "case")),
  ...getCmsWorkEntries().map((entry) => createCmsCaseStudy(entry, "work")),
];
const caseStudies = Array.from(new Map([...staticCaseStudies, ...cmsCaseStudies].map((caseStudy) => [caseStudy.slug, caseStudy] as const)).values());
const caseStudyMap = new Map(caseStudies.map((caseStudy) => [caseStudy.slug, caseStudy] as const));

export function getAllCaseStudies() {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudyMap.get(slug);
}

export function getCaseStudySlugs() {
  return caseStudies.map((caseStudy) => caseStudy.slug);
}

export function getRelatedCaseStudies(current: CaseStudy, limit = 3) {
  return caseStudies
    .filter((caseStudy) => caseStudy.slug !== current.slug)
    .sort((a, b) => {
      const aScore =
        (a.client.slug === current.client.slug ? 3 : 0) +
        (a.serviceFilter === current.serviceFilter ? 2 : 0) +
        (a.client.categories.some((category) => current.client.categories.includes(category)) ? 1 : 0);
      const bScore =
        (b.client.slug === current.client.slug ? 3 : 0) +
        (b.serviceFilter === current.serviceFilter ? 2 : 0) +
        (b.client.categories.some((category) => current.client.categories.includes(category)) ? 1 : 0);

      return bScore - aScore;
    })
    .slice(0, limit);
}

export function getCaseStudyTrustLogos() {
  const staticClients = Object.values(clients).filter((client): client is CaseStudyClient & { logo: CaseStudyLogo } => Boolean(client.logo));
  const cmsClients = getCmsHighlightedClients()
    .filter((client) => Boolean(client.logo))
    .map<CaseStudyClient & { logo: CaseStudyLogo }>((client) => ({
      name: client.name,
      slug: client.slug,
      city: "Región de Valparaíso",
      categories: ["Empresas"],
      logo: {
        src: client.logo ?? "",
        alt: client.alt,
      },
    }));

  return Array.from(new Map([...staticClients, ...cmsClients].map((client) => [client.slug, client] as const)).values());
}

export function buildCaseStudyMetadata(caseStudy: CaseStudy): Metadata {
  const title = `${caseStudy.h1} | Hidrourgencias SpA`;
  const canonicalPath = `/casos-de-exito/${caseStudy.slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  return {
    title,
    description: caseStudy.description,
    keywords: caseStudy.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description: caseStudy.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: caseStudy.featuredImage,
          width: 1200,
          height: 630,
          alt: caseStudy.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: caseStudy.description,
      images: [caseStudy.featuredImage],
    },
  };
}

export function buildCaseStudySchemas(caseStudy: CaseStudy) {
  const url = buildCanonicalUrl(`/casos-de-exito/${caseStudy.slug}`);
  const faqEntities = caseStudy.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: caseStudy.h1,
        description: caseStudy.description,
        image: buildCanonicalUrl(caseStudy.featuredImage),
        author: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
        },
        mainEntityOfPage: url,
      },
      {
        "@type": "Service",
        name: caseStudy.serviceType,
        provider: {
          "@type": "LocalBusiness",
          name: siteConfig.name,
          telephone: siteConfig.phoneDisplay,
          url: siteConfig.siteUrl,
        },
        areaServed: ["Viña del Mar", "Valparaíso", "Concón", "Quilpué", "Villa Alemana"],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: siteConfig.siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Casos de éxito",
            item: buildCanonicalUrl("/casos-de-exito"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: caseStudy.h1,
            item: url,
          },
        ],
      },
      {
        "@type": "LocalBusiness",
        name: siteConfig.name,
        telephone: siteConfig.phoneDisplay,
        url: siteConfig.siteUrl,
        areaServed: ["Viña del Mar", "Valparaíso", "Concón", "Quilpué", "Villa Alemana"],
      },
    ],
  }).replace(/</g, "\\u003c");
}

export function getCaseStudyWhatsAppUrl(message: string) {
  return createWhatsAppUrl(message);
}
