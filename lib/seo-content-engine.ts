import type { SeoRoute } from "./seo-territorial";

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoLandingContent = {
  introParagraphs: string[];
  localHeading: string;
  localParagraphs: string[];
  problemHeading: string;
  problemIntro: string;
  whenToRequestHeading: string;
  whenToRequestItems: string[];
  procedureHeading: string;
  procedureIntro: string;
  equipmentHeading: string;
  equipmentIntro: string;
  equipmentRecommendation: string;
  nearbyCoverageHeading: string;
  nearbyCoverageParagraph: string;
  preventionHeading: string;
  preventionParagraphs: string[];
  ctaHeading: string;
  ctaParagraph: string;
  faq: SeoFaqItem[];
};

export function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function sentenceCase(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

const incidentNames = [
  "obstruccion sanitaria",
  "colapso de red",
  "retorno de aguas servidas",
  "perdida de capacidad hidraulica",
  "saturacion por grasa y sedimentos",
  "drenaje lento con riesgo de rebalse",
] as const;

const toneVariants = [
  "con foco en continuidad operativa y control de riesgo sanitario",
  "con lectura tecnica del tramo afectado y validacion posterior",
  "con criterio preventivo para reducir reincidencias en la misma red",
  "con coordinacion rapida para comunidades, comercios y viviendas",
] as const;

const diagnosisVariants = [
  "revisamos sintomas, punto de descarga, historial de eventos y accesibilidad a camaras antes de definir la maniobra",
  "ordenamos la informacion del caso para distinguir entre bloqueo puntual, falla de red horizontal o problema en vertical",
  "levantamos condicion de uso, nivel de urgencia y posibles puntos criticos antes de intervenir",
  "evaluamos caudal, retorno, olor, camaras disponibles y comportamiento de artefactos sanitarios",
] as const;

const networkVariants = [
  "redes domiciliarias con uso diario intensivo",
  "colectores de edificios y comunidades",
  "tramos horizontales entre camaras",
  "bajadas sanitarias y puntos interiores",
  "camaras de inspeccion con sedimento acumulado",
] as const;

const preventionVariants = [
  "programar limpieza tecnica por frecuencia de uso y no solo cuando aparece un rebalse visible",
  "registrar los puntos recurrentes para decidir si conviene hidrojet, videoinspeccion o mantencion calendarizada",
  "evitar soluciones quimicas agresivas cuando existe retorno de aguas servidas o camara saturada",
  "validar flujo al cierre del servicio y dejar una pauta preventiva simple para el administrador o propietario",
] as const;

const urgencyTriggers = [
  "cuando dos o mas artefactos descargan lento al mismo tiempo",
  "cuando aparece olor persistente en camaras, shaft, cocina o bano",
  "cuando el nivel de camara sube despues de cada descarga",
  "cuando existe retorno de aguas servidas por puntos bajos",
  "cuando la obstruccion vuelve pocos dias despues de una limpieza parcial",
] as const;

const equipmentRecommendationVariants = [
  "La recomendacion tecnica se define despues de revisar acceso, diametro, tipo de residuo y nivel de riesgo sanitario.",
  "La seleccion de equipo prioriza resolver la causa y no solo despejar momentaneamente el sintoma visible.",
  "La maniobra se ajusta al estado real de la red para evitar danos por presion o herramientas mal elegidas.",
  "El criterio operativo considera continuidad del cliente, trazabilidad y prueba de flujo antes de cerrar el caso.",
] as const;

export function createSeoLandingContent(route: SeoRoute): SeoLandingContent {
  const seed = stableHash(route.slug);
  const servicio = route.service.nombre.toLowerCase();
  const servicioCapitalizado = sentenceCase(route.service.nombre);
  const incident = pick(incidentNames, seed);
  const tone = pick(toneVariants, seed + 3);
  const diagnosis = pick(diagnosisVariants, seed + 5);
  const network = pick(networkVariants, seed + 7);
  const prevention = pick(preventionVariants, seed + 11);
  const secondaryIncident = pick(incidentNames, seed + 13);
  const tertiaryNetwork = pick(networkVariants, seed + 17);
  const firstUrgencyTrigger = pick(urgencyTriggers, seed + 19);
  const secondUrgencyTrigger = pick(urgencyTriggers, seed + 23);
  const equipmentRecommendation = pick(equipmentRecommendationVariants, seed + 29);

  return {
    introParagraphs: [
      `En ${route.sector}, ${route.comuna.comuna}, Hidrourgencias SpA atiende ${servicio} 24/7 para redes sanitarias que presentan ${incident}, retorno, drenaje lento o perdida de rendimiento hidraulico. El trabajo se aborda con diagnostico inicial, seleccion de equipo profesional y verificacion de flujo, evitando maniobras improvisadas cuando el problema compromete viviendas, edificios, locales comerciales o instalaciones con alta demanda sanitaria.`,
      `Cada sector tiene una condicion operativa distinta. En ${route.sector}, la atencion considera ${route.networkType}, tipo de cliente ${route.clientType} y sintomas probables como ${route.probableIssue}. Con esa lectura definimos si corresponde destape mecanico RIDGID, hidrojet de alta presion, limpieza de camara o apoyo con videoinspeccion para confirmar puntos criticos antes o despues de la intervencion.`,
      `La meta no es solo liberar una obstruccion. Buscamos restituir capacidad de evacuacion, bajar el riesgo sanitario inmediato y entregar una recomendacion tecnica estable para que el mismo evento no vuelva a repetirse en pocos dias. Por eso cada landing combina contexto local, servicio especifico y una pauta de decision practica para actuar con rapidez.`,
    ],
    localHeading: `${servicioCapitalizado} en ${route.sector}: diagnostico local y criterio tecnico`,
    localParagraphs: [
      `Cuando se solicita ${servicio} en ${route.sector}, normalmente ya existe una senal clara: agua que no evacua, olor persistente, artefactos con burbujeo, camara con nivel alto o retorno por WC. En ese escenario, ${diagnosis}. Este primer filtro permite movilizar equipos adecuados y reducir el tiempo de exposicion del cliente al problema sanitario.`,
      `El contexto de ${route.comuna.comuna} exige respuestas proporcionales al riesgo. Un local gastronomico no tiene la misma tolerancia a una cocina detenida que una vivienda con un bano bloqueado, y una comunidad no puede tratar una vertical saturada como si fuera un artefacto aislado. Por eso el servicio se ajusta a ${network}, severidad de la obstruccion y disponibilidad de puntos de acceso reales.`,
      `La recomendacion para este caso es ${route.recommendation}. Si el problema muestra signos de ${secondaryIncident}, conviene actuar antes de que el caudal encuentre salida por artefactos bajos o camaras interiores. Una decision temprana reduce costos de limpieza, reclamos y danos asociados a aguas servidas fuera de control.`,
    ],
    problemHeading: `Problemas frecuentes en ${route.sector} para ${servicio}`,
    problemIntro: `Los sintomas mas comunes en ${route.sector} se relacionan con ${route.service.enfoque}. Tambien aparecen escenarios por grasa, sarro, sedimentos, residuos solidos y mantencion postergada. Cuando dos o mas puntos fallan al mismo tiempo, la causa suele estar aguas abajo y requiere una lectura completa de la red.`,
    whenToRequestHeading: `Cuando solicitar ${servicio} en ${route.sector}`,
    whenToRequestItems: [
      `Solicita evaluacion ${firstUrgencyTrigger}, especialmente si el inmueble depende de banos, cocina o areas comunes operativas.`,
      `Activa atencion urgente si aparece ${route.probableIssue}, rebalse visible, retorno por WC o perdida de uso de varios puntos sanitarios.`,
      `Pide diagnostico preventivo ${secondUrgencyTrigger}, porque esos patrones suelen anticipar una obstruccion mayor en camara, tramo horizontal o vertical.`,
      `Coordina soporte tecnico cuando el cliente es ${route.clientType} y la continuidad sanitaria impacta habitabilidad, ventas, administracion o reputacion.`,
    ],
    procedureHeading: `Procedimiento tecnico para ${servicio} en ${route.comuna.comuna}`,
    procedureIntro: `Aplicamos una secuencia ordenada para no cerrar el caso antes de verificar resultado. El procedimiento combina diagnostico, acceso a camara o punto sanitario, desobstruccion con equipos RIDGID o hidrojet segun servicio, prueba hidraulica y recomendacion preventiva documentada para el cliente.`,
    equipmentHeading: `Equipos utilizados para ${servicioCapitalizado}`,
    equipmentIntro: `La seleccion de equipos depende del diametro, material, accesibilidad y tipo de residuo. Para ${route.service.nombre.toLowerCase()} usamos ${route.service.equipo}; cuando el caso lo requiere se complementa con videoinspeccion RIDGID para entender fisuras, contrapendientes, raices, sedimento o deformaciones.`,
    equipmentRecommendation,
    nearbyCoverageHeading: `Sectores cercanos con cobertura para ${servicio} en ${route.comuna.comuna}`,
    nearbyCoverageParagraph: `Desde ${route.sector} se revisan sectores cercanos de ${route.comuna.comuna} para mantener continuidad de cobertura, derivar al tecnico correcto y enlazar rutas territoriales utiles sin depender solo del sitemap.`,
    preventionHeading: `Recomendacion preventiva para ${route.sector}, ${route.comuna.comuna}`,
    preventionParagraphs: [
      `Despues de restituir el flujo, lo mas importante es entender por que la red llego a ese punto. Si existe reincidencia, camaras con grasa, olor constante o tramos con descarga lenta, la recomendacion es ${prevention}. Esta mirada preventiva convierte una urgencia puntual en un dato util para gestionar mejor la red sanitaria.`,
      `En ${tertiaryNetwork}, el riesgo aumenta cuando se mezclan alta carga de uso, ausencia de limpieza profunda y decisiones correctivas parciales. Un plan de mantencion preventiva permite definir frecuencia, puntos de control y tecnologia apropiada. En edificios o comercios, este enfoque baja costos indirectos porque evita cierres, reclamos y limpiezas de emergencia.`,
      `Para clientes de ${route.clientType}, la continuidad sanitaria tambien es una decision de reputacion. Un rebalse visible, un bano fuera de servicio o una camara saturada afecta la experiencia de usuarios y residentes. La respuesta inmediata resuelve el evento, pero la pauta tecnica posterior es la que evita operar permanentemente en modo urgencia.`,
    ],
    ctaHeading: `Solicita ${servicio} en ${route.sector} ahora`,
    ctaParagraph: `Indica sector, comuna, sintomas, si hay rebalse activo y fotos del punto afectado. Con esos datos podemos orientar la prioridad, preparar el equipo correcto y coordinar atencion 24/7 para ${route.sector}, ${route.comuna.comuna} ${tone}.`,
    faq: [
      {
        question: `Atienden ${servicio} en ${route.sector} durante la noche?`,
        answer: `Si. Hidrourgencias atiende urgencias sanitarias 24/7 en ${route.sector}, ${route.comuna.comuna}, especialmente cuando existe rebalse, retorno de aguas servidas o perdida de uso de banos y cocinas.`,
      },
      {
        question: `Que equipo usan para ${servicio} en este sector?`,
        answer: `Segun el diagnostico usamos ${route.service.equipo}. Si hay dudas sobre estado interno, se puede complementar con videoinspeccion RIDGID para ubicar puntos criticos.`,
      },
      {
        question: `Cuando conviene pedir hidrojet en ${route.sector}?`,
        answer: "Conviene cuando hay grasa adherida, sarro, sedimentos, recurrencia de obstrucciones o perdida de capacidad hidraulica en tramos horizontales, camaras o redes de alto uso.",
      },
      {
        question: `Que datos debo enviar por WhatsApp para una respuesta rapida?`,
        answer: `Envia direccion o referencia de ${route.sector}, comuna ${route.comuna.comuna}, tipo de problema, fotos o video, y confirma si hay aguas servidas expuestas o artefactos sin uso.`,
      },
      {
        question: `El servicio incluye recomendacion preventiva?`,
        answer: "Si. Al cierre se realiza prueba hidraulica y se recomienda una accion preventiva segun causa probable, tipo de red, frecuencia de uso y riesgo de reincidencia.",
      },
    ],
  };
}
