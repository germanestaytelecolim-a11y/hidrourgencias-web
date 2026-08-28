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

export type ComunaLandingPresentation = {
  serviceName: string;
  schemaServiceType: string;
  problemHeading: string;
  servicesHeading: string;
  servicesIntro: string;
  technicalHeading: string;
  coverageServiceName: string;
  closingHeading: string;
  closingParagraph: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  finalCtaLabel: string;
};

export type ComunaLandingVisual = {
  treatment: "port" | "coastal" | "hydrojet" | "residential" | "operations";
  image: string;
  alt: string;
  accent: string;
  imagePosition: string;
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
  presentation: ComunaLandingPresentation;
  parentLandingSlug?: string;
  visual?: ComunaLandingVisual;
};

const territorialVisuals: Record<string, ComunaLandingVisual> = {
  "destape-alcantarillado-casablanca": {
    treatment: "residential",
    image: "/images/zonas/casablanca.webp",
    alt: "Panorama urbano y entorno de Casablanca en la Región de Valparaíso",
    accent: "#d49a2a",
    imagePosition: "center center",
  },
  "destape-alcantarillado-maitencillo-puchuncavi": {
    treatment: "coastal",
    image: "/images/zonas/maitencillo-puchuncavi.webp",
    alt: "Costa rocosa y viviendas costeras de Maitencillo, Puchuncaví",
    accent: "#13b8c4",
    imagePosition: "center 58%",
  },
  "destape-alcantarillado-valparaiso": {
    treatment: "port",
    image: "/images/servicios/heroes/destape-camaras-inspeccion.webp",
    alt: "Intervención técnica en cámara sanitaria de Valparaíso",
    accent: "#d49a2a",
    imagePosition: "68% center",
  },
  "destape-alcantarillado-vina-del-mar": {
    treatment: "coastal",
    image: "/images/servicios/heroes/destape-edificios.webp",
    alt: "Trabajo sanitario técnico para edificios de Viña del Mar",
    accent: "#18b8c9",
    imagePosition: "42% center",
  },
  "hidrojet-concon": {
    treatment: "hydrojet",
    image: "/images/servicios/heroes/hidrojet.webp",
    alt: "Equipo hidrojet de alta presión operando en Concón",
    accent: "#20c6a4",
    imagePosition: "62% center",
  },
  "destape-alcantarillado-villa-alemana": {
    treatment: "residential",
    image: "/images/servicios/heroes/destape-artefactos-sanitarios.webp",
    alt: "Destape técnico de artefactos sanitarios en Villa Alemana",
    accent: "#e2a14a",
    imagePosition: "62% center",
  },
  "destape-alcantarillado-quilpue": {
    treatment: "operations",
    image: "/images/servicios/heroes/destape-horizontales.webp",
    alt: "Equipo técnico interviniendo una red horizontal en Quilpué",
    accent: "#2a9b8f",
    imagePosition: "58% center",
  },
};

const comunaProfiles: ComunaProfile[] = [
  {
    slug: "destape-alcantarillado-vina-del-mar",
    comuna: "Vina del Mar",
    nearbyZones: ["Centro", "Avenida Libertad", "Recreo", "Forestal", "Miraflores", "Achupallas", "Renaca", "Gomez Carreno"],
    localContext:
      "una red sanitaria exigida por edificios en altura, restaurantes, comunidades, Avenida Libertad, centro, Renaca, Gomez Carreno, Forestal y comercio con flujo continuo de clientes",
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
    comuna: "Valpara\u00edso",
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
    comuna: "Conc\u00f3n",
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
      "El plan tecnico en Conc\u00f3n prioriza limpieza profunda con hidrojet, confirmacion de resultado y pauta preventiva ajustada al uso real.",
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
    slug: "destape-alcantarillado-casablanca",
    comuna: "Casablanca",
    nearbyZones: ["Centro de Casablanca", "Lo Vásquez", "Las Dichas", "Lagunillas", "Quintay"],
    localContext:
      "un territorio urbano y rural con viviendas, comercio local, parcelas y redes privadas cuya operación cambia según el uso del inmueble",
    riskDrivers: [
      "sedimentos y residuos en cámaras de redes privadas",
      "raíces que ingresan por uniones o tramos exteriores",
      "variaciones de carga entre viviendas, comercio y parcelas",
    ],
    urgentScenarios: [
      "rebalse en viviendas y recintos comerciales",
      "drenaje lento en baños, cocinas y cámaras exteriores",
      "retorno de aguas servidas en redes privadas",
      "obstrucciones recurrentes que requieren videoinspección",
    ],
    clientFocus: ["viviendas", "parcelas", "comercios", "administradores de recintos privados"],
    operationNote:
      "En Casablanca la evaluación distingue redes domiciliarias, cámaras exteriores y tramos privados antes de definir destape mecánico, hidrojet o inspección.",
  },
  {
    slug: "destape-alcantarillado-maitencillo-puchuncavi",
    comuna: "Maitencillo",
    nearbyZones: ["Puchuncaví", "Cachagua", "Zapallar", "Horcón", "Ventanas"],
    localContext:
      "un balneario residencial con viviendas costeras, condominios, restaurantes y ocupación estacional que modifica la carga sanitaria",
    riskDrivers: [
      "grasas y residuos en cocinas de restaurantes y casas de temporada",
      "arena y sedimentos movilizados hacia cámaras y descargas exteriores",
      "aumento de uso en fines de semana y periodos de alta ocupación",
    ],
    urgentScenarios: [
      "rebalse en condominios y viviendas de temporada",
      "drenaje lento en restaurantes y cocinas residenciales",
      "olores sanitarios por estancamiento en redes horizontales",
      "obstrucciones en cámaras que requieren coordinación con administración",
    ],
    clientFocus: ["viviendas costeras", "condominios", "restaurantes", "administraciones residenciales"],
    operationNote:
      "En Maitencillo la coordinación considera accesos, ocupación del inmueble y control del material removido para sostener la continuidad sanitaria.",
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

function buildPresentation(profile: ComunaProfile): ComunaLandingPresentation {
  if (profile.slug === "hidrojet-concon") {
    return {
      serviceName: "Hidrojet en Conc\u00f3n",
      schemaServiceType: "Limpieza hidrodinámica de redes sanitarias",
      problemHeading: "Cuando una red de Conc\u00f3n necesita limpieza hidrodinámica",
      servicesHeading: "Hidrojet para redes sanitarias de Conc\u00f3n",
      servicesIntro:
        "La atencion se concentra en limpieza interna con agua a presión, selección de boquilla, control del residuo removido y verificación de caudal en redes compatibles.",
      technicalHeading: "Agua a presión, boquillas y control de flujo",
      coverageServiceName: "hidrojet",
      closingHeading: "Solicita servicio hidrojet en Conc\u00f3n",
      closingParagraph:
        "Indica el tipo de red, el acceso disponible y el material que se ha acumulado. Con esos antecedentes evaluamos la factibilidad y preparamos la limpieza hidrodinámica.",
      primaryCtaLabel: "Solicitar servicio hidrojet en Conc\u00f3n",
      secondaryCtaLabel: "Coordinar limpieza hidrodinámica",
      finalCtaLabel: "Solicitar servicio hidrojet",
    };
  }

  if (profile.slug === "mantencion-desagues-quilpue") {
    return {
      serviceName: "Mantencion de desagues en Quilpue",
      schemaServiceType: "Mantencion preventiva de desagues",
      problemHeading: "Senales para programar mantencion de desagues en Quilpue",
      servicesHeading: "Mantencion tecnica de desagues en Quilpue",
      servicesIntro:
        "La atencion combina revision de puntos recurrentes, limpieza programada y recomendaciones segun la carga real de la red sanitaria.",
      technicalHeading: "Equipos para mantencion y control de desagues",
      coverageServiceName: "mantencion de desagues",
      closingHeading: "Programa mantencion de desagues en Quilpue",
      closingParagraph:
        "Comparte el tipo de inmueble, los puntos criticos y el historial disponible para definir un alcance preventivo adecuado.",
      primaryCtaLabel: "Solicitar mantencion de desagues",
      secondaryCtaLabel: "Cotizar plan preventivo",
      finalCtaLabel: "Programar mantencion",
    };
  }

  if (profile.slug === "urgencias-sanitarias-villa-alemana") {
    return {
      serviceName: "Urgencias sanitarias en Villa Alemana",
      schemaServiceType: "Atencion de urgencias sanitarias",
      problemHeading: "Contingencias sanitarias urgentes en Villa Alemana",
      servicesHeading: "Respuesta tecnica para urgencias en Villa Alemana",
      servicesIntro:
        "La atencion prioriza la contencion del riesgo, el diagnostico del punto afectado y la recuperacion de la continuidad sanitaria.",
      technicalHeading: "Equipos para contingencias sanitarias",
      coverageServiceName: "urgencias sanitarias",
      closingHeading: "Reporta una urgencia sanitaria en Villa Alemana",
      closingParagraph:
        "Indica la ubicacion, el punto afectado y si existe exposicion sanitaria para clasificar correctamente la prioridad de respuesta.",
      primaryCtaLabel: "Reportar urgencia sanitaria",
      secondaryCtaLabel: "Solicitar evaluacion tecnica",
      finalCtaLabel: "Contactar atencion 24/7",
    };
  }

  return {
    serviceName: `Destape de alcantarillado en ${profile.comuna}`,
    schemaServiceType: "Destape de alcantarillado y urgencias sanitarias",
    problemHeading: `Problemas de alcantarillado que requieren diagnostico en ${profile.comuna}`,
    servicesHeading: `Destape de alcantarillado y apoyo sanitario en ${profile.comuna}`,
    servicesIntro:
      "La atencion integra diagnostico, destape mecanico, hidrojet cuando corresponde, verificacion de flujo y una recomendacion preventiva acorde con la red.",
    technicalHeading: "Hidrojet, equipos RIDGID y diagnostico profesional",
    coverageServiceName: "destape de alcantarillado",
    closingHeading: `Respuesta tecnica para alcantarillado en ${profile.comuna}`,
    closingParagraph:
      "Describe el punto afectado, la condicion de uso y los accesos disponibles para preparar una evaluacion tecnica proporcionada al caso.",
    primaryCtaLabel: "Solicitar destape de alcantarillado",
    secondaryCtaLabel: "Cotizar mantencion preventiva",
    finalCtaLabel: "Contactar atencion 24/7",
  };
}

function buildProcedure(profile: ComunaProfile, serviceName: string): ProcedureStep[] {
  const scope = `${serviceName.toLowerCase()} en ${profile.comuna}`;

  return [
    {
      title: "1. Levantamiento inicial y triage de urgencia",
      description: `Para ${scope}, recibimos datos del caso y definimos una respuesta proporcional al impacto operativo del cliente.`,
    },
    {
      title: "2. Diagnostico en terreno con criterio tecnico",
      description: `Durante ${scope}, inspeccionamos puntos de descarga, artefactos y trazado para identificar la causa principal.`,
    },
    {
      title: "3. Ejecucion tecnica segun diagnostico",
      description: `En ${scope}, aplicamos la tecnologia compatible con el diagnostico, el acceso y la seguridad sanitaria.`,
    },
    {
      title: "4. Verificacion de flujo y estabilidad",
      description: `Al cerrar ${scope}, realizamos pruebas de descarga y confirmamos la recuperacion observada en los puntos revisados.`,
    },
    {
      title: "5. Plan de continuidad preventiva",
      description: `La entrega de ${scope} incluye recomendaciones sobre frecuencia, puntos de control y criterios de seguimiento.`,
    },
  ];
}

function buildFaq(profile: ComunaProfile): FaqItem[] {
  const presentation = buildPresentation(profile);
  const scope = presentation.serviceName.toLowerCase();

  return [
    {
      question: `Atienden ${scope} durante las 24 horas?`,
      answer: `Si. La cobertura de ${scope} prioriza escenarios que comprometen habitabilidad o continuidad del inmueble.`,
    },
    {
      question: `Como seleccionan los equipos para ${scope}?`,
      answer: `En ${scope}, el diagnostico define si corresponde equipo mecanico, hidrojet, videoinspeccion o una combinacion tecnica.`,
    },
    {
      question: `Puedo pedir una pauta preventiva despues de ${scope}?`,
      answer: `Si. El cierre de ${scope} puede incluir frecuencia sugerida y puntos de control segun el uso real de la red.`,
    },
    {
      question: `Que datos envio por WhatsApp para ${scope}?`,
      answer: `Para coordinar ${scope}, envia direccion, punto afectado, condicion de uso, accesos disponibles y evidencia visual.`,
    },
    {
      question: `Atienden administraciones y empresas que requieren ${scope}?`,
      answer: `Si. La atencion de ${scope} puede coordinar accesos, responsables y trazabilidad para comunidades o clientes corporativos.`,
    },
  ];
}

function buildLandingData(profile: ComunaProfile): ComunaLandingData {
  const presentation = buildPresentation(profile);
  const scope = presentation.serviceName.toLowerCase();
  const isHidrojetConcon = profile.slug === "hidrojet-concon";
  const isMaintenanceQuilpue = profile.slug === "mantencion-desagues-quilpue";
  const isUrgencyVillaAlemana = profile.slug === "urgencias-sanitarias-villa-alemana";
  const h1 = isHidrojetConcon
    ? "Hidrojet en Conc\u00f3n | Limpieza hidrodinámica de redes"
    : isMaintenanceQuilpue
      ? "Mantencion de desagues en Quilpue | Plan preventivo"
      : isUrgencyVillaAlemana
        ? "Urgencias sanitarias en Villa Alemana | Atencion 24/7"
        : `Destape de Alcantarillado en ${profile.comuna} | Urgencias 24/7`;
  const metaTitle = isHidrojetConcon
    ? "Hidrojet en Conc\u00f3n | Limpieza hidrodinámica de redes | Hidrourgencias SpA"
    : isMaintenanceQuilpue
      ? "Mantencion de desagues en Quilpue | Plan preventivo"
      : isUrgencyVillaAlemana
        ? "Urgencias sanitarias en Villa Alemana | Atencion 24/7"
        : `Destape de Alcantarillado en ${profile.comuna} | Urgencias 24/7`;
  const metaDescription = isHidrojetConcon
    ? "Servicio profesional de hidrojet en Conc\u00f3n para limpieza hidrodinámica de redes sanitarias, eliminación de grasa, sarro, sedimentos y obstrucciones complejas. Atención técnica en Conc\u00f3n y sectores cercanos."
    : isMaintenanceQuilpue
      ? "Mantencion de desagues en Quilpue para comunidades, empresas y comercios. Revision de puntos criticos, limpieza programada y pauta preventiva."
      : isUrgencyVillaAlemana
        ? "Atencion de urgencias sanitarias en Villa Alemana con diagnostico tecnico, contencion del riesgo y respuesta disponible durante las 24 horas."
        : `Servicio profesional de destape de alcantarillado en ${profile.comuna}, con diagnostico tecnico, equipos RIDGID, hidrojet cuando corresponde y atencion 24/7.`;
  const riskList = profile.riskDrivers.join(", ");
  const nearby = profile.nearbyZones.join(", ");
  const scenarios = profile.urgentScenarios.join("; ");
  const clients = profile.clientFocus.join(", ");

  if (isHidrojetConcon) {
    return {
      slug: profile.slug,
      comuna: profile.comuna,
      h1,
      metaTitle,
      metaDescription,
      heroParagraphs: [
        "El servicio de hidrojet en Conc\u00f3n ejecuta limpieza hidrodinámica en redes que han perdido sección útil por grasa, sarro o sedimentos adheridos. La maniobra utiliza agua a presión y una boquilla seleccionada después de revisar acceso, diámetro y material del conducto.",
        "Condominios, restaurantes y comercios de Conc\u00f3n necesitan controlar tanto el desprendimiento como el destino del residuo removido. Por eso la faena delimita el tramo, protege el punto de descarga y comprueba el caudal entre accesos al finalizar.",
        "El hidrojet no reemplaza una reparacion estructural ni se aplica automaticamente a toda obstruccion. Si la red presenta una condicion incompatible con agua a presion, el diagnostico orienta otra tecnica o una inspeccion adicional.",
      ],
      problemBullets: [
        "grasa adherida en redes de cocinas comerciales",
        "sarro que reduce la seccion interior del conducto",
        "sedimentos distribuidos entre camaras de condominios",
        "lodo acumulado en tramos de baja velocidad",
        "recurrencia despues de despejes que no limpiaron las paredes",
        "necesidad de preparar la red antes de periodos de alta carga",
      ],
      problemSummary:
        "La indicación principal para hidrojet es una acumulación adherida o distribuida que puede movilizarse con limpieza hidrodinámica. La evaluación en Conc\u00f3n verifica que el conducto, el acceso y el punto de descarga permitan trabajar con control.",
      technicalParagraphs: [
        "La configuración del hidrojet en Conc\u00f3n combina presión, caudal, boquilla y velocidad de avance. Esas variables se ajustan al diámetro y al residuo; una cifra de presión por si sola no describe la calidad ni la seguridad de la limpieza.",
        "Cuando aporta evidencia, la videoinspeccion permite comparar la condicion interna y detectar fisuras, deformaciones o contrapendientes que la limpieza no corrige. El cierre se apoya en una prueba de flujo y en el registro del tramo atendido.",
      ],
      procedureSteps: [
        {
          title: "1. Revision de acceso y factibilidad",
          description:
            "En Conc\u00f3n se identifica el tramo, su material, diámetro y capacidad para recibir una maniobra hidrodinámica controlada.",
        },
        {
          title: "2. Seleccion de boquilla y punto de descarga",
          description:
            "La configuracion considera el residuo esperado y el lugar donde se controlara el material desplazado por el agua.",
        },
        {
          title: "3. Pasadas de limpieza hidrodinamica",
          description:
            "El avance del hidrojet desprende adherencias y arrastra residuos sin tratar todos los tramos con una única configuración.",
        },
        {
          title: "4. Control del material removido",
          description:
            "La faena revisa la salida del residuo para evitar que la acumulacion simplemente cambie de ubicacion dentro de la red.",
        },
        {
          title: "5. Verificacion de caudal",
          description:
            "El servicio hidrojet en Conc\u00f3n termina comparando el flujo y dejando una recomendacion segun la carga observada.",
        },
      ],
      nearbyZones: profile.nearbyZones,
      coverageParagraphs: [
        `La cobertura de hidrojet considera ${nearby}, con coordinacion previa de accesos y puntos de descarga para redes residenciales o comerciales.`,
        "Los servicios en distintos sectores de Conc\u00f3n se programan segun factibilidad tecnica, longitud del tramo y condiciones de operacion del inmueble.",
      ],
      clientParagraph:
        "El hidrojet en Conc\u00f3n esta orientado a condominios, administraciones, restaurantes y empresas que necesitan recuperar capacidad y documentar la limpieza de sus redes.",
      clientList: profile.clientFocus.map((item) => item),
      faq: [
        {
          question: "Que limpia el hidrojet dentro de una tuberia?",
          answer:
            "El agua a presion puede desprender grasa, sarro, lodo y sedimentos compatibles con la condicion del conducto y el acceso disponible.",
        },
        {
          question: "El hidrojet sirve para cualquier red de Conc\u00f3n?",
          answer:
            "No. Antes de trabajar se revisan material, diametro, estado, acceso y capacidad para controlar el agua y los residuos removidos.",
        },
        {
          question: "Como seleccionan la presion y la boquilla?",
          answer:
            "La configuracion responde al residuo, la longitud, el diametro y el material del tramo; la presion no se decide de forma aislada.",
        },
        {
          question: "Pueden atender restaurantes y condominios?",
          answer:
            "Si. La visita puede coordinar ventanas de trabajo, accesos tecnicos y continuidad operativa para redes comerciales o comunitarias.",
        },
        {
          question: "Como verifican el resultado de la limpieza?",
          answer:
            "Se controla el material extraido y se compara el flujo entre puntos accesibles; la videoinspeccion puede complementar la validacion.",
        },
      ],
      ctaPrimaryMessage:
        "Hola, necesito solicitar servicio de hidrojet en Conc\u00f3n. Puedo indicar tipo de red, acceso y material acumulado.",
      ctaMidMessage:
        "Hola, quiero coordinar una limpieza hidrodinámica con hidrojet en Conc\u00f3n.",
      ctaFinalMessage:
        "Hola, solicito evaluar la factibilidad de hidrojet para una red sanitaria en Conc\u00f3n.",
      presentation,
    };
  }

  return {
    slug: profile.slug,
    comuna: profile.comuna,
    h1,
    metaTitle,
    metaDescription,
    heroParagraphs: [
      `La atencion de ${scope} considera ${profile.localContext}. Para ${scope} se combinan diagnostico, tecnologia compatible y verificacion de flujo segun la condicion observada. La coordinacion de ${scope} busca recuperar continuidad sin ampliar innecesariamente el alcance.`,
      `En ${scope}, los principales factores locales son ${riskList}. El diagnostico de ${scope} relaciona esos antecedentes con la red y el uso del inmueble. La decision tecnica de ${scope} se toma despues de identificar el punto o tramo que explica la falla.`,
      `${profile.operationNote} Desde el primer contacto de ${scope} se solicitan datos suficientes para preparar la visita. El cierre de ${scope} deja una recomendacion vinculada con la causa probable y la prueba realizada.`,
    ],
    problemBullets: profile.urgentScenarios.map((scenario) => scenario),
    problemSummary: `Los escenarios considerados para ${scope} incluyen ${scenarios}. La prioridad de ${scope} se define con la exposicion sanitaria, los puntos sin uso y el impacto operativo del inmueble. La respuesta de ${scope} comienza con clasificacion, continua con diagnostico y termina con una recomendacion asociada al hallazgo.`,
    technicalParagraphs: [
      `El bloque tecnico de ${scope} puede utilizar hidrojet para adherencias y equipos RIDGID para obstrucciones compatibles con trabajo mecanico. La seleccion para ${scope} depende del acceso, diametro, residuo y estado probable del tramo. La prueba posterior de ${scope} confirma el comportamiento observado antes del cierre.`,
      `El diagnostico de ${scope} considera estado de red, historial, descarga y uso del inmueble. Con esa base, ${scope} distingue una accion correctiva puntual de una necesidad preventiva o de inspeccion. La recomendacion final de ${scope} queda vinculada con esa distincion.`,
    ],
    procedureSteps: buildProcedure(profile, presentation.serviceName),
    nearbyZones: profile.nearbyZones,
    coverageParagraphs: [
      `La cobertura de ${scope} considera sectores cercanos como ${nearby}. La coordinacion territorial de ${scope} ayuda a preparar accesos, equipos y prioridad antes del desplazamiento.`,
      `Si una operacion requiere ${scope} en varias sedes, la programacion puede unificar responsables y antecedentes tecnicos. El orden documental de ${scope} facilita comparar intervenciones sin confundir redes ni alcances entre ubicaciones.`,
    ],
    clientParagraph: `La atencion de ${scope} esta orientada a ${clients}. Para clientes de ${scope}, la coordinacion de accesos y la trazabilidad tecnica son parte del resultado esperado.`,
    clientList: profile.clientFocus.map((item) => item),
    faq: buildFaq(profile),
    ctaPrimaryMessage: `Hola, necesito solicitar ${scope}. Puedo indicar punto afectado y accesos disponibles.`,
    ctaMidMessage: `Hola, quiero cotizar una pauta preventiva asociada a ${scope}.`,
    ctaFinalMessage: `Hola, necesito coordinar ${scope} y compartir antecedentes del caso.`,
    presentation,
  };
}

const landingData = comunaProfiles.map((profile) => ({
  ...buildLandingData(profile),
  ...(profile.slug === "destape-alcantarillado-maitencillo-puchuncavi"
    ? { parentLandingSlug: "destape-alcantarillado-puchuncavi" }
    : {}),
  visual: territorialVisuals[profile.slug],
}));
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
  const isHidrojetConcon = data.slug === "hidrojet-concon";
  const socialTitle = data.metaTitle;
  const socialDescription = isHidrojetConcon
    ? "Servicio profesional de hidrojet en Conc\u00f3n para limpieza de redes sanitarias, eliminación de grasa, sarro, sedimentos y obstrucciones complejas."
    : data.metaDescription;

  return {
    title: isHidrojetConcon ? { absolute: data.metaTitle } : data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: buildCanonicalUrl(`/${data.slug}`),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: `${siteConfig.siteUrl}/${data.slug}`,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: data.visual?.image ?? "/images/hero-urgencia.jpg",
          width: 1200,
          height: 630,
          alt: `Servicio sanitario tecnico en ${data.comuna}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [data.visual?.image ?? "/images/hero-urgencia.jpg"],
    },
  };
}
