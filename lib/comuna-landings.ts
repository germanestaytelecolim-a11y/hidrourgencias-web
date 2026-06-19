import type { Metadata } from "next";

import { buildCanonicalUrl, siteConfig } from "@/lib/site-config";

export type ComunaProfile = {
  slug: string;
  comuna: string;
  nearbyZones: string[];
  localContext: string;
  riskDrivers: string[];
  urgentScenarios: string[];
  clientFocus: string[];
  operationNote: string;
};

export type ProcedureStep = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ComunaLandingData = {
  slug: string;
  comuna: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroParagraphs: string[];
  problemBullets: string[];
  problemSummary: string;
  technicalParagraphs: string[];
  procedureSteps: ProcedureStep[];
  nearbyZones: string[];
  coverageParagraphs: string[];
  clientParagraph: string;
  clientList: string[];
  faq: FaqItem[];
  ctaPrimaryMessage: string;
  ctaMidMessage: string;
  ctaFinalMessage: string;
};

const comunaProfiles: ComunaProfile[] = [
  {
    slug: "destape-alcantarillado-vina-del-mar",
    comuna: "Vina del Mar",
    nearbyZones: ["Recreo", "Forestal", "Miraflores", "Achupallas", "Renaca", "Gomez Carreno"],
    localContext:
      "una red sanitaria exigida por alta densidad residencial, edificios en altura, gastronomia y comercios con flujo continuo de clientes",
    riskDrivers: [
      "acumulacion de grasa y sedimentos en cocinas de alto uso",
      "sobrecarga en redes verticales de edificios con alta ocupacion",
      "obstruccion por residuos en tramos horizontales poco mantenidos",
    ],
    urgentScenarios: [
      "rebalse activo por WC o lavamanos en horas punta",
      "malos olores persistentes en areas comunes y shafts",
      "drenaje lento que compromete operacion de cocina y banos",
      "retorno de aguas servidas en recintos con publico",
    ],
    clientFocus: [
      "administradores de edificios",
      "comunidades y condominios",
      "empresas con operacion continua",
      "locales comerciales y gastronomicos",
    ],
    operationNote:
      "La prioridad operativa se centra en contener riesgo sanitario inmediato, estabilizar la red y dejar trazabilidad para continuidad preventiva.",
  },
  {
    slug: "destape-alcantarillado-valparaiso",
    comuna: "Valparaiso",
    nearbyZones: ["Cerro Alegre", "Cerro Baron", "Placilla", "Playa Ancha", "Avenida Argentina", "Puerto"],
    localContext:
      "una comuna con topografia compleja, infraestructura heterogenea y zonas comerciales con alta dependencia de redes sanitarias",
    riskDrivers: [
      "pendientes irregulares que afectan evacuacion constante",
      "tramos antiguos con mantenimiento insuficiente",
      "cambios de carga operacional segun horario y sector",
    ],
    urgentScenarios: [
      "rebalses en niveles bajos por saturacion de colectores",
      "retorno de aguas servidas en edificios de uso mixto",
      "olores criticos en zonas de alto trafico peatonal",
      "interrupcion de servicios sanitarios en comercios",
    ],
    clientFocus: [
      "administradores de comunidades",
      "empresas de servicios",
      "restaurantes y locales de atencion masiva",
      "comites de mantencion de edificios",
    ],
    operationNote:
      "Trabajamos con triage tecnico-comercial para priorizar contingencias de alto impacto y evitar cadenas de fallas sanitarias.",
  },
  {
    slug: "hidrojet-concon",
    comuna: "Concon",
    nearbyZones: ["Bosques de Montemar", "Costa de Montemar", "Avenida Borgono", "Lomas de Montemar", "Higuerillas"],
    localContext:
      "un entorno residencial y gastronomico con alta carga organica en desagues y demanda continua de continuidad comercial",
    riskDrivers: [
      "acumulacion de grasa en cocinas comerciales",
      "residuos adheridos en redes horizontales de condominios",
      "falta de limpieza profunda en tramos criticos",
    ],
    urgentScenarios: [
      "rebalse en sector cocina durante horario de servicio",
      "baja evacuacion en redes sanitarias de edificio",
      "olores persistentes que impactan experiencia de clientes",
      "desbordes por obstruccion en puntos de descarga",
    ],
    clientFocus: [
      "condominios de alta densidad",
      "administraciones residenciales premium",
      "restaurantes y locales gastronomicos",
      "empresas con exigencia de continuidad",
    ],
    operationNote:
      "El plan tecnico en Concon prioriza limpieza profunda con hidrojet, confirmacion de resultado y pauta preventiva ajustada al uso real.",
  },
  {
    slug: "mantencion-desagues-quilpue",
    comuna: "Quilpue",
    nearbyZones: ["El Belloto", "Canal Chacao", "Valencia", "Los Pinos", "Troncos Viejos"],
    localContext:
      "una zona residencial-comercial con crecimiento sostenido donde la ausencia de mantenimiento genera recurrencia de emergencias",
    riskDrivers: [
      "falta de mantencion preventiva programada",
      "uso intensivo de artefactos sanitarios en horarios concentrados",
      "obstrucciones progresivas no detectadas tempranamente",
    ],
    urgentScenarios: [
      "rebalse en edificios sin historial de control tecnico",
      "bloqueo de desagues en cocinas y banos comunitarios",
      "mal olor persistente por estancamiento parcial",
      "urgencias nocturnas con afectacion de residentes",
    ],
    clientFocus: [
      "comunidades y condominios",
      "administradores y comites",
      "empresas de servicios",
      "locales comerciales de alto flujo",
    ],
    operationNote:
      "En Quilpue combinamos respuesta 24/7 con estrategia preventiva para disminuir reincidencia y costo operativo anual.",
  },
  {
    slug: "urgencias-sanitarias-villa-alemana",
    comuna: "Villa Alemana",
    nearbyZones: ["Penablanca", "Las Americas", "Troncos Viejos", "Sector Norte", "Centro"],
    localContext:
      "una comuna de uso residencial intenso y comercio de barrio donde las contingencias sanitarias deben resolverse sin demoras",
    riskDrivers: [
      "sobrecarga en redes domiciliarias por uso simultaneo",
      "obstruccion progresiva en desagues de cocinas y banos",
      "mantencion reactiva en lugar de preventiva",
    ],
    urgentScenarios: [
      "retorno de aguas servidas por artefactos sanitarios",
      "rebalse que compromete habitabilidad de viviendas",
      "drenaje lento con riesgo de colapso en horas de alta carga",
      "contingencia sanitaria en local comercial activo",
    ],
    clientFocus: [
      "edificios y comunidades",
      "familias en condominios",
      "empresas con sedes operativas",
      "locales de servicios y retail",
    ],
    operationNote:
      "La gestion de urgencias en Villa Alemana prioriza respuesta inmediata, diagnostico de causa y continuidad tecnica para evitar recurrencia.",
  },
  {
    slug: "destape-alcantarillado-villa-alemana",
    comuna: "Villa Alemana",
    nearbyZones: ["Penablanca", "Las Americas", "Troncos Viejos", "Villa Alemana Oriente", "El Sauce", "San Enrique"],
    localContext:
      "una comuna residencial con condominios y alto uso de redes domiciliarias donde los rebalses deben resolverse con criterio tecnico inmediato",
    riskDrivers: [
      "acumulacion de residuos en desagues de uso diario",
      "redes verticales con mantencion reactiva",
      "obstrucciones recurrentes en tramos horizontales domiciliarios",
    ],
    urgentScenarios: [
      "rebalse por WC en viviendas y departamentos",
      "drenaje lento en banos y cocinas familiares",
      "retorno de aguas servidas en zonas comunes",
      "olores sanitarios persistentes en pasillos y patios",
    ],
    clientFocus: [
      "administradores de condominios",
      "comunidades residenciales",
      "clientes particulares",
      "locales comerciales de barrio",
    ],
    operationNote:
      "En Villa Alemana priorizamos destape rapido con evaluacion tecnica para corregir la causa raiz y reducir reincidencias.",
  },
  {
    slug: "destape-alcantarillado-quilpue",
    comuna: "Quilpue",
    nearbyZones: ["Centro Quilpue", "El Belloto Norte", "El Belloto Sur", "Los Pinos", "Valencia", "Canal Chacao"],
    localContext:
      "una comuna mixta residencial y comercial donde las redes sanitarias requieren control continuo por alta carga en horarios punta",
    riskDrivers: [
      "acumulacion de grasas y sedimentos en redes domesticas",
      "camaras domiciliarias con mantenimiento insuficiente",
      "obstrucciones progresivas en desagues de uso comercial",
    ],
    urgentScenarios: [
      "rebalses en cocinas y banos de viviendas",
      "colapso sanitario en locales de alto flujo",
      "retorno de aguas servidas en comunidades",
      "desagues lentos con riesgo de emergencia nocturna",
    ],
    clientFocus: [
      "viviendas y condominios",
      "administradores de edificios",
      "empresas de servicios",
      "comercios locales",
    ],
    operationNote:
      "En Quilpue intervenimos con metodologia de destape, hidrojet y control preventivo para sostener continuidad operativa.",
  },
  {
    slug: "destape-alcantarillado-puchuncavi",
    comuna: "Puchuncavi",
    nearbyZones: ["Ventanas", "La Greda", "Maitencillo", "Horcon", "Campiche"],
    localContext:
      "una comuna con sectores residenciales, costeros e industriales que exige criterio tecnico adaptable a escenarios diversos",
    riskDrivers: [
      "mantenimiento irregular en redes de uso mixto",
      "obstrucciones por residuos en periodos de alta demanda",
      "diagnosticos incompletos que dejan fallas de base",
    ],
    urgentScenarios: [
      "rebalse en condominios de temporada",
      "retorno sanitario en viviendas de uso permanente",
      "desagues lentos en instalaciones comerciales",
      "mal olor severo asociado a bloqueo parcial",
    ],
    clientFocus: [
      "viviendas y condominios",
      "empresas y servicios",
      "administradores de activos",
      "locales comerciales",
    ],
    operationNote:
      "En Puchuncavi trabajamos con protocolos escalables para resolver urgencias y construir continuidad sanitaria sostenible.",
  },
  {
    slug: "destape-alcantarillado-quintero",
    comuna: "Quintero",
    nearbyZones: ["Loncura", "Mantagua", "Ritoque", "Santa Adela", "Poblacion El Cobre"],
    localContext:
      "una comuna costera con actividad residencial y comercial donde la continuidad sanitaria impacta directamente calidad de servicio",
    riskDrivers: [
      "acumulacion de residuos en redes de uso intermitente",
      "falta de limpieza profunda en ductos criticos",
      "sobrecarga por estacionalidad y horas punta",
    ],
    urgentScenarios: [
      "rebalse en banos de uso masivo",
      "retorno de aguas servidas en recintos de servicio",
      "drenaje lento en cocinas de atencion al publico",
      "olores persistentes en instalaciones compartidas",
    ],
    clientFocus: [
      "comunidades y condominios",
      "empresas de servicios",
      "locales comerciales",
      "administradores multisede",
    ],
    operationNote:
      "La estrategia en Quintero combina reaccion rapida con evidencia tecnica para que cada accion correctiva tenga continuidad preventiva.",
  },
  {
    slug: "destape-alcantarillado-limache",
    comuna: "Limache",
    nearbyZones: ["San Francisco de Limache", "Olmue", "Tabolango", "Quebrada Escobares", "Los Laureles"],
    localContext:
      "un territorio con uso residencial y productivo donde los eventos sanitarios pueden escalar rapidamente por falta de control preventivo",
    riskDrivers: [
      "obstrucciones graduales que no se detectan a tiempo",
      "uso intensivo en periodos concentrados",
      "historial de acciones correctivas sin seguimiento",
    ],
    urgentScenarios: [
      "rebalse en instalaciones residenciales",
      "falla de evacuacion en recintos productivos",
      "mal olor y drenaje lento en cocinas de servicio",
      "contingencias fuera de horario habil",
    ],
    clientFocus: [
      "comunidades residenciales",
      "empresas y bodegas",
      "locales comerciales",
      "administradores de recintos mixtos",
    ],
    operationNote:
      "En Limache aplicamos control tecnico desde la primera visita para reducir recurrencia y sostener continuidad operacional.",
  },
  {
    slug: "destape-alcantarillado-quillota",
    comuna: "Quillota",
    nearbyZones: ["San Pedro", "Boco", "La Palma", "Pocochay", "La Cruz"],
    localContext:
      "una comuna con actividad urbana y empresarial donde las fallas sanitarias afectan productividad, habitabilidad e imagen comercial",
    riskDrivers: [
      "acumulacion de residuos en redes de alto uso",
      "mantenimiento reactivo sin plan documentado",
      "diagnosticos parciales que no identifican causa raiz",
    ],
    urgentScenarios: [
      "rebalse en edificios y condominios",
      "retorno por artefactos sanitarios en comercios",
      "drenaje lento en instalaciones de alta carga",
      "interrupcion operativa por colapso sanitario",
    ],
    clientFocus: [
      "edificios y condominios",
      "empresas de servicios",
      "locales comerciales",
      "administraciones tecnicas",
    ],
    operationNote:
      "La operacion en Quillota prioriza respuestas precisas y seguimiento preventivo para disminuir costos por urgencias reiteradas.",
  },
  {
    slug: "destape-alcantarillado-placilla-curauma",
    comuna: "Placilla de Curauma",
    nearbyZones: ["Curauma", "Placilla Oriente", "Ruta 68", "Lago Penuelas", "Pasaje Vial"],
    localContext:
      "una zona residencial y comercial en expansion, con condominios y alto uso de redes sanitarias compartidas",
    riskDrivers: [
      "carga variable por crecimiento de la zona",
      "obstrucciones en redes compartidas de condominios",
      "insuficiente control de puntos criticos de descarga",
    ],
    urgentScenarios: [
      "rebalse en areas comunes y estacionamientos",
      "retorno en banos de departamentos y casas",
      "drenaje lento en comercio de cercania",
      "mal olor constante en ductos y shafts",
    ],
    clientFocus: [
      "condominios y edificios residenciales",
      "empresas de servicios locales",
      "comercios con atencion diaria",
      "administradores de comunidades",
    ],
    operationNote:
      "En Placilla de Curauma enfocamos la intervencion en continuidad y control preventivo para evitar eventos repetitivos de alto impacto.",
  },
];

function buildProcedure(comuna: string): ProcedureStep[] {
  return [
    {
      title: "1. Levantamiento inicial y triage de urgencia",
      description: `Recibimos datos clave del caso en ${comuna}, clasificamos nivel de riesgo sanitario y definimos una respuesta proporcional al impacto operativo del cliente.`,
    },
    {
      title: "2. Diagnostico en terreno con criterio tecnico",
      description:
        "Inspeccionamos puntos de descarga, artefactos y trazado de red para identificar la causa principal y evitar intervenciones superficiales.",
    },
    {
      title: "3. Ejecucion tecnica segun diagnostico",
      description:
        "Aplicamos destape mecanico, hidrojet 4000 PSI y apoyo de inspeccion RIDGID cuando corresponde, priorizando efectividad y seguridad sanitaria.",
    },
    {
      title: "4. Verificacion de flujo y estabilidad",
      description:
        "Realizamos pruebas de descarga y confirmamos que no exista retorno de aguas servidas ni sintomas residuales al cierre del servicio.",
    },
    {
      title: "5. Plan de continuidad preventiva",
      description:
        "Entregamos recomendaciones operativas para reducir reincidencia: frecuencia de mantencion, puntos de control y criterios para activar urgencia temprana.",
    },
  ];
}

function buildFaq(profile: ComunaProfile): FaqItem[] {
  return [
    {
      question: `Atienden urgencias sanitarias 24/7 en ${profile.comuna}?`,
      answer:
        "Si. Operamos con prioridad para rebalses activos, retorno de aguas servidas y escenarios que comprometen habitabilidad o continuidad comercial.",
    },
    {
      question: `El servicio en ${profile.comuna} incluye hidrojet y videoinspeccion?`,
      answer:
        "Si. Evaluamos cada caso y definimos si corresponde destape mecanico, hidrojet 4000 PSI, videoinspeccion sanitaria o una combinacion de tecnologias.",
    },
    {
      question: "Puedo solicitar cotizacion de mantencion preventiva?",
      answer:
        "Si. Disenamos planes preventivos para comunidades, edificios, empresas y locales comerciales con frecuencia adaptada al uso real de la red.",
    },
    {
      question: "Que datos debo enviar por WhatsApp para una atencion mas rapida?",
      answer:
        "Comuna, direccion, tipo de sintoma, si existe rebalse activo y evidencia visual. Con esos datos asignamos mejor el recurso tecnico.",
    },
    {
      question: "Trabajan con clientes corporativos y administradores?",
      answer:
        "Si. Operamos con enfoque comercial-profesional para clientes exigentes que necesitan trazabilidad, continuidad y respaldo tecnico real.",
    },
  ];
}

function buildLandingData(profile: ComunaProfile): ComunaLandingData {
  const h1 = `Destape de Alcantarillado en ${profile.comuna} | Urgencias 24/7`;
  const metaTitle = `Destape de Alcantarillado en ${profile.comuna} | Urgencias 24/7 | Hidrourgencias`;
  const metaDescription = `Servicio profesional de destape de alcantarillado en ${profile.comuna}, desagues y emergencias sanitarias. Hidrojet, diagnostico tecnico y respuesta inmediata 24/7.`;
  const riskList = profile.riskDrivers.join(", ");
  const nearby = profile.nearbyZones.join(", ");
  const scenarios = profile.urgentScenarios.join("; ");
  const clients = profile.clientFocus.join(", ");

  return {
    slug: profile.slug,
    comuna: profile.comuna,
    h1,
    metaTitle,
    metaDescription,
    heroParagraphs: [
      `En ${profile.comuna}, Hidrourgencias SpA trabaja sobre ${profile.localContext}. Nuestro enfoque es integral: destape de alcantarillado, destape de desagues, hidrojet, videoinspeccion, mantencion preventiva y urgencias sanitarias 24/7. Este esquema permite resolver contingencias reales sin perder continuidad operativa.`,
      `La experiencia de terreno muestra que en ${profile.comuna} los principales detonantes son ${riskList}. Cuando una red sanitaria se satura, el impacto no es solo tecnico: afecta reputacion, habitabilidad, continuidad comercial y costos de administracion. Por eso intervenimos con criterio sanitario, lectura comercial y metodologia operativa clara.`,
      `${profile.operationNote} Desde el primer contacto buscamos una evaluacion precisa para decidir la maniobra correcta y evitar retrabajos. La meta es que cada intervencion entregue resultado inmediato y, al mismo tiempo, reduzca la probabilidad de urgencias repetidas.`,
    ],
    problemBullets: profile.urgentScenarios.map((scenario) => scenario),
    problemSummary: `Los problemas frecuentes en ${profile.comuna} incluyen ${scenarios}. En todos estos casos, esperar suele aumentar el dano y el costo total del servicio. Por eso ejecutamos una estrategia de respuesta que parte con triage tecnico-comercial, continua con diagnostico profesional y termina con recomendaciones preventivas accionables para el cliente.`,
    technicalParagraphs: [
      `El bloque tecnico se ejecuta con hidrojet 4000 PSI para remover grasa, sarro y sedimentos adheridos en redes de alto uso. Complementamos con equipos RIDGID para diagnostico de tramos criticos y validacion de resultados. Esta combinacion entrega mayor precision y reduce la probabilidad de que la obstruccion reaparezca en pocos dias.`,
      `El diagnostico profesional considera estado de la red, historial de fallas, comportamiento de descarga y contexto de uso del inmueble. Con esa base definimos si basta una accion correctiva puntual o si corresponde establecer un plan de mantencion preventiva con videoinspeccion sanitaria y control de puntos recurrentes.`,
    ],
    procedureSteps: buildProcedure(profile.comuna),
    nearbyZones: profile.nearbyZones,
    coverageParagraphs: [
      `La cobertura en ${profile.comuna} considera sectores de alta demanda sanitaria y zonas cercanas como ${nearby}. Esto permite responder con mayor eficiencia, sobre todo en urgencias con rebalse activo o compromiso de continuidad comercial.`,
      `Si tu operacion esta distribuida en varias comunas, podemos coordinar una malla de atencion regional con criterios unificados de destape, hidrojet, mantencion preventiva y respuesta 24/7. Asi obtienes control tecnico y administrativo desde una sola contraparte.`,
    ],
    clientParagraph: `Este servicio esta orientado a ${clients}. La propuesta combina velocidad de respuesta, metodologia tecnica y trazabilidad comercial, factores clave para clientes que no pueden aceptar improvisacion en contingencias sanitarias.`,
    clientList: profile.clientFocus.map((item) => item),
    faq: buildFaq(profile),
    ctaPrimaryMessage: `Hola, necesito destape de alcantarillado en ${profile.comuna} con respuesta tecnica inmediata.`,
    ctaMidMessage: `Hola, quiero cotizar mantencion preventiva, hidrojet y videoinspeccion en ${profile.comuna}.`,
    ctaFinalMessage: `Hola, reporto urgencia sanitaria 24/7 en ${profile.comuna} por rebalse o retorno de aguas servidas.`,
  };
}

const landingData = comunaProfiles.map((profile) => buildLandingData(profile));
const landingMap = new Map(landingData.map((item) => [item.slug, item]));

export function getComunaLandingBySlug(slug: string) {
  return landingMap.get(slug);
}

export function requireComunaLanding(slug: string): ComunaLandingData {
  const landing = landingMap.get(slug);
  if (!landing) {
    throw new Error(`Landing data missing for ${slug}`);
  }
  return landing;
}

export function getAllComunaLandings() {
  return landingData;
}

export function getComunaPaths() {
  return landingData.map((item) => item.slug);
}

export function buildComunaMetadata(data: ComunaLandingData): Metadata {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: buildCanonicalUrl(`/${data.slug}`),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${data.h1} | ${siteConfig.name}`,
      description: data.metaDescription,
      url: `${siteConfig.siteUrl}/${data.slug}`,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: "/images/hero-urgencia.jpg",
          width: 1200,
          height: 630,
          alt: `Servicio sanitario tecnico en ${data.comuna}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.h1} | ${siteConfig.name}`,
      description: data.metaDescription,
      images: ["/images/hero-urgencia.jpg"],
    },
  };
}
