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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatUbicacionPrincipal(sector?: string, comuna?: string) {
  if (sector && comuna && normalizeText(sector) !== normalizeText(comuna)) {
    return `${sector}, ${comuna}`;
  }

  return sector || comuna || "";
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

const servicePhraseVariants = {
  "destape-alcantarillado": [
    "servicio sanitario de urgencia",
    "liberacion de redes obstruidas",
    "normalizacion del escurrimiento",
    "recuperacion del flujo sanitario",
    "intervencion de camaras y colectores",
    "atencion de rebalses y obstrucciones",
  ],
  hidrojet: [
    "limpieza hidrodinamica de redes",
    "lavado tecnico de tuberias",
    "remocion de grasa, sarro y sedimentos",
    "recuperacion de capacidad hidraulica",
    "intervencion con alta presion",
  ],
  "mantencion-preventiva-redes": [
    "limpieza programada de redes",
    "control preventivo de obstrucciones",
    "reduccion de riesgo de rebalses",
    "mantenimiento sanitario periodico",
    "continuidad operativa de la red",
  ],
} as const;

function getServicePhrase(route: SeoRoute, seed: number) {
  const variants = servicePhraseVariants[route.service.slug as keyof typeof servicePhraseVariants];

  return variants ? pick(variants, seed) : route.service.nombre.toLowerCase();
}

function applyExclusiveContent(route: SeoRoute, content: SeoLandingContent): SeoLandingContent {
  switch (route.slug) {
    case "destape-horizontales-cerro-bellavista-valparaiso":
      return {
        ...content,
        introParagraphs: [
          "El destape de horizontales en Cerro Bellavista se concentra en colectores, ramales tendidos entre recintos y camaras que conectan la descarga del inmueble. La evaluacion identifica desde que acceso conviene trabajar y que tramo comparte los puntos afectados.",
          "En redes emplazadas sobre pendiente, despejar una camara aislada no basta para confirmar la recuperacion del colector. El servicio sigue el recorrido horizontal, ejecuta la maniobra compatible con el diametro y comprueba la descarga aguas abajo.",
        ],
        localHeading: "Colectores y ramales horizontales en Cerro Bellavista",
        localParagraphs: [
          "Los inmuebles de Cerro Bellavista pueden combinar trazados antiguos, cambios de nivel y accesos interiores reducidos. Antes de intervenir se comparan las camaras disponibles, la direccion del flujo y los artefactos conectados al mismo ramal.",
          "Cuando el nivel sube en una camara y el punto siguiente no recibe caudal, el diagnostico se orienta al tramo horizontal intermedio. Esa lectura evita trabajar sobre una bajada vertical o un artefacto que no explica la falla compartida.",
        ],
        problemHeading: "Como reconocer una falla en la red horizontal de Cerro Bellavista",
        problemIntro:
          "La senal relevante es la relacion entre varias descargas y las camaras del recorrido, no una lista generica de sintomas. El levantamiento busca delimitar el colector o ramal horizontal que perdio continuidad hidraulica.",
        whenToRequestHeading: "Cuando pedir diagnostico de un colector horizontal",
        whenToRequestItems: [
          "Solicita revision cuando dos recintos conectados al mismo ramal dejan de evacuar de forma coordinada.",
          "Pide evaluacion si una camara recibe caudal pero la siguiente permanece sin descarga observable.",
          "Coordina acceso cuando la obstruccion reaparece despues de limpiar solamente un artefacto interior.",
          "Informa la ubicacion de las camaras para preparar equipos compatibles con el trazado de Cerro Bellavista.",
        ],
        procedureHeading: "Diagnostico y despeje de horizontales entre camaras",
        procedureIntro:
          "La intervencion registra accesos, sentido de escurrimiento y tramo probable; luego trabaja el colector con equipo mecanico o hidrojet segun el residuo y termina con una prueba comparada entre camaras.",
        equipmentHeading: "Equipos para colectores y ramales de Cerro Bellavista",
        equipmentIntro:
          "RIDGID K-1500A permite trabajar obstrucciones severas en colectores accesibles, mientras el hidrojet se reserva para material adherido y sedimento distribuido. La eleccion depende del diametro, el acceso y la condicion observada.",
        equipmentRecommendation:
          "Para la red horizontal de Cerro Bellavista se recomienda confirmar primero el recorrido entre camaras y seleccionar la maniobra despues de ubicar el tramo comprometido.",
        preventionHeading: "Control preventivo de colectores en Cerro Bellavista",
        preventionParagraphs: [
          "Conviene registrar que camaras reciben mayor carga y en que tramo se repite la obstruccion. Ese historial permite programar limpieza del colector completo en vez de repetir destapes parciales.",
          "La frecuencia preventiva debe responder al uso del inmueble, al material extraido y a la recuperacion observada durante la prueba de flujo. Una comunidad puede incorporar esos datos a su plan de mantencion.",
        ],
        ctaHeading: "Solicitar diagnostico de red horizontal",
        ctaParagraph:
          "Envia la ubicacion de Cerro Bellavista, los puntos conectados y las camaras disponibles. Con esos antecedentes se prepara la evaluacion del colector o ramal horizontal.",
        faq: [
          {
            question: "Que diferencia un destape horizontal de un destape de artefacto?",
            answer:
              "El destape horizontal trabaja un tramo compartido entre accesos o camaras; el destape de artefacto se limita al ramal inmediato de un punto sanitario.",
          },
          {
            question: "Necesitan acceder a las camaras de Cerro Bellavista?",
            answer:
              "Siempre que existan, las camaras ayudan a delimitar el colector, elegir el sentido de trabajo y comparar el flujo antes y despues de la maniobra.",
          },
          {
            question: "Cuando usan hidrojet en un colector horizontal?",
            answer:
              "Se evalua hidrojet cuando el tramo admite agua a presion y presenta grasa, sarro o sedimento adherido que reduce su seccion util.",
          },
          {
            question: "Como confirman que el tramo horizontal quedo operativo?",
            answer:
              "La validacion compara la entrada y salida de agua entre puntos de inspeccion, ademas del comportamiento de los artefactos conectados.",
          },
          {
            question: "Pueden dejar una pauta para la comunidad?",
            answer:
              "Si. El cierre puede registrar camaras revisadas, tramo intervenido y criterios para decidir una futura limpieza preventiva del colector.",
          },
        ],
      };

    case "mantencion-preventiva-redes-cerro-bellavista-valparaiso":
      return {
        ...content,
        introParagraphs: [
          "La mantencion preventiva en Cerro Bellavista organiza limpiezas y controles antes de que una red sanitaria interrumpa la operacion del inmueble. El programa se define para comunidades, edificios y comercios segun carga de uso, puntos criticos e historial disponible.",
          "Una visita planificada no replica el protocolo de una urgencia. Primero se acuerdan accesos, horarios y sectores prioritarios; despues se documentan los trabajos y la condicion observada para ajustar la siguiente frecuencia.",
        ],
        localHeading: "Plan sanitario preventivo para inmuebles de Cerro Bellavista",
        localParagraphs: [
          "La pendiente y la diversidad de trazados del cerro vuelven especialmente valioso un inventario simple de camaras, ramales y zonas de mayor carga. Ese mapa permite distribuir el mantenimiento sin detener innecesariamente todo el edificio o comercio.",
          "El programa puede separar controles visuales, limpieza hidrodinamica y videoinspeccion segun la criticidad de cada punto. No se prescribe la misma tecnologia ni la misma frecuencia para toda la red.",
        ],
        problemHeading: "Indicadores para planificar mantencion en Cerro Bellavista",
        problemIntro:
          "La planificacion utiliza recurrencia, residuos encontrados, intensidad de uso y costo operativo de una interrupcion. Esos indicadores permiten priorizar sectores sin convertir una lista de sintomas en un diagnostico automatico.",
        whenToRequestHeading: "Cuando estructurar un programa preventivo",
        whenToRequestItems: [
          "Programa una revision si la comunidad acumula servicios correctivos sin registro del tramo intervenido.",
          "Define frecuencia cuando cocinas, banos comunes o locales sostienen una carga sanitaria alta durante toda la semana.",
          "Coordina una pauta antes de temporadas de mayor ocupacion o actividades que no admiten cierres sanitarios.",
          "Solicita documentacion cuando la administracion necesita comparar hallazgos y decisiones entre visitas sucesivas.",
        ],
        procedureHeading: "Diseno y ejecucion de la mantencion programada",
        procedureIntro:
          "El trabajo comienza con catastro de puntos, criticidad y ventanas de acceso; continua con las tareas acordadas y termina con registro de hallazgos, prueba de flujo y fecha de revision sugerida.",
        equipmentHeading: "Tecnologia seleccionada por punto de control",
        equipmentIntro:
          "Hidrojet, videoinspeccion y equipos mecanicos se asignan segun el objetivo de cada tramo. La planificacion evita aplicar una herramienta unica a camaras, ramales y redes con condiciones distintas.",
        equipmentRecommendation:
          "Para Cerro Bellavista conviene vincular cada equipo con una tarea documentada, un punto de acceso y un resultado que pueda compararse en la siguiente visita.",
        preventionHeading: "Frecuencias y registros para continuidad sanitaria",
        preventionParagraphs: [
          "La periodicidad se ajusta con evidencia del material extraido, la velocidad de acumulacion y la carga real del inmueble. Un calendario fijo sin revision puede atender demasiado tarde o gastar recursos donde no existe riesgo equivalente.",
          "El registro preventivo entrega a la administracion una base para coordinar presupuestos, accesos y comunicaciones internas. Tambien permite identificar cuando un problema requiere diagnostico estructural fuera de la limpieza rutinaria.",
        ],
        ctaHeading: "Programar mantencion preventiva",
        ctaParagraph:
          "Indica el tipo de inmueble en Cerro Bellavista, los puntos disponibles y el historial de intervenciones. Con esa informacion se propone un alcance y una frecuencia inicial.",
        faq: [
          {
            question: "La mantencion preventiva reemplaza una reparacion de tuberia?",
            answer:
              "No. La limpieza y el control ayudan a conservar capacidad, pero una fisura, deformacion o contrapendiente requiere evaluacion y solucion especifica.",
          },
          {
            question: "Como definen la frecuencia para una comunidad?",
            answer:
              "Se consideran ocupacion, carga de cocinas y banos, historial de residuos, recurrencia y consecuencias operativas de una interrupcion sanitaria.",
          },
          {
            question: "Se puede trabajar por etapas en Cerro Bellavista?",
            answer:
              "Si. El plan puede dividir camaras, ramales o sectores para respetar ventanas de acceso y mantener disponibles otras areas del inmueble.",
          },
          {
            question: "Que documentacion recibe la administracion?",
            answer:
              "El alcance puede incluir puntos atendidos, hallazgos relevantes, prueba realizada y recomendacion para la siguiente fecha de control.",
          },
          {
            question: "Incluyen hidrojet en todas las visitas preventivas?",
            answer:
              "No necesariamente. El hidrojet se programa cuando el tipo de red y el material acumulado justifican una limpieza hidrodinamica.",
          },
        ],
      };

    case "hidrojet-playa-ancha-valparaiso":
      return {
        ...content,
        introParagraphs: [
          "El servicio de hidrojet en Playa Ancha limpia el interior de tuberias mediante agua a presion y boquillas seleccionadas para el tramo. Su objetivo es desprender grasa, sarro y sedimentos adheridos que un despeje puntual puede dejar sobre las paredes de la red.",
          "Antes de presurizar se revisan acceso, diametro, material y destino del agua movilizada. La maniobra avanza por el conducto, arrastra los residuos hacia un punto controlado y termina con una comprobacion de caudal.",
        ],
        localHeading: "Limpieza hidrodinamica de redes en Playa Ancha",
        localParagraphs: [
          "En Playa Ancha existen redes residenciales, comerciales e institucionales con longitudes y accesos muy distintos. La evaluacion previa determina si el tramo es compatible con hidrojet y desde que camara conviene introducir la manguera.",
          "La presion no se selecciona como un valor aislado. Se combina con boquilla, caudal, avance y naturaleza del residuo para limpiar sin tratar todas las tuberias de la misma forma.",
        ],
        problemHeading: "Residuos adheridos que justifican hidrojet en Playa Ancha",
        problemIntro:
          "El hidrojet se orienta a acumulaciones distribuidas de grasa, sarro, lodo o sedimento que reducen la seccion util del conducto. La evaluacion descarta primero condiciones estructurales que no se resuelven con limpieza a presion.",
        whenToRequestHeading: "Cuando coordinar una limpieza hidrodinamica",
        whenToRequestItems: [
          "Coordina hidrojet cuando una red mantiene adherencias internas despues de retirar una obstruccion puntual.",
          "Solicita evaluacion si las camaras muestran grasa o sedimento distribuido a lo largo del tramo.",
          "Programa limpieza antes de periodos de alta carga en cocinas, comunidades o instalaciones de uso continuo.",
          "Informa material y diametro conocidos para seleccionar una boquilla compatible con la red de Playa Ancha.",
        ],
        procedureHeading: "Secuencia de limpieza con agua a presion",
        procedureIntro:
          "La faena delimita el tramo, protege el punto de descarga, selecciona boquilla y presion, ejecuta pasadas controladas y verifica la recuperacion mediante flujo observable entre accesos.",
        equipmentHeading: "Hidrojet y boquillas para la condicion del conducto",
        equipmentIntro:
          "El equipo hidrodinamico se configura segun diametro, longitud, material adherido y capacidad de recibir el agua desplazada. La videoinspeccion puede complementar el trabajo si persisten dudas internas.",
        equipmentRecommendation:
          "En Playa Ancha se recomienda definir acceso y salida del residuo antes de iniciar la limpieza, porque el resultado depende tanto de la presion como del control del material removido.",
        preventionHeading: "Frecuencia de hidrojet segun carga de la red",
        preventionParagraphs: [
          "Una red gastronomica o comunitaria puede requerir limpieza periodica si la acumulacion reaparece con un ritmo previsible. La frecuencia se ajusta con observaciones del tramo y no solo con una fecha fija.",
          "Registrar boquilla, accesos y material removido facilita preparar la siguiente visita en Playa Ancha. Ese antecedente tambien ayuda a detectar cambios que ameritan videoinspeccion o reparacion.",
        ],
        ctaHeading: "Coordinar limpieza con hidrojet",
        ctaParagraph:
          "Envia la ubicacion en Playa Ancha, el tipo de red, el acceso disponible y cualquier antecedente de limpieza. Con esos datos se evalua la factibilidad del hidrojet.",
        faq: [
          {
            question: "El hidrojet es igual a un destape mecanico?",
            answer:
              "No. El hidrojet usa agua a presion para limpiar material adherido; el equipo mecanico puede perforar o extraer una obstruccion puntual segun el caso.",
          },
          {
            question: "Que residuos puede remover el hidrojet en Playa Ancha?",
            answer:
              "Puede desprender grasa, sarro, lodo y sedimentos compatibles con la limpieza hidrodinamica, sujeto a la evaluacion del conducto.",
          },
          {
            question: "Necesitan una camara de inspeccion para trabajar?",
            answer:
              "Se requiere un acceso tecnico apropiado; una camara suele facilitar el ingreso, el control del residuo y la comprobacion del tramo.",
          },
          {
            question: "La presion puede danar una tuberia antigua?",
            answer:
              "Por eso se revisan material, condicion y acceso antes de configurar la maniobra. Una red fragil puede requerir otra tecnica o evaluacion adicional.",
          },
          {
            question: "Como verifican el resultado del hidrojet?",
            answer:
              "Se observa el flujo entre puntos accesibles y, cuando aporta valor, se complementa con videoinspeccion del tramo limpiado.",
          },
        ],
      };

    case "destape-desagues-playa-ancha-valparaiso":
      return {
        ...content,
        introParagraphs: [
          "El destape de desagues en Playa Ancha evalua obstrucciones localizadas en lavaplatos, lavamanos, duchas, WC y sus ramales inmediatos. El primer objetivo es distinguir un punto aislado de una falla compartida en la red del inmueble.",
          "La intervencion sigue el recorrido corto del artefacto, revisa sifon y acceso disponible, y selecciona una herramienta compatible con el diametro. Si varios puntos fallan juntos, el caso se deriva al tramo comun que realmente explica la descarga.",
        ],
        localHeading: "Ramales interiores y artefactos de Playa Ancha",
        localParagraphs: [
          "Viviendas, comercios e instalaciones de Playa Ancha presentan configuraciones interiores distintas, por lo que la ubicacion exacta del artefacto orienta el diagnostico. Fotografias y antecedentes sobre puntos cercanos ayudan a delimitar el ramal.",
          "Un lavaplatos con grasa requiere una lectura diferente de un WC con un objeto atrapado o una ducha con cabello acumulado. La tecnica se elige segun el punto y no mediante una receta comun para toda la red.",
        ],
        problemHeading: "Obstrucciones localizadas en artefactos y ramales interiores",
        problemIntro:
          "Esta landing se limita a bloqueos cercanos al artefacto o a su ramal de descarga. Cuando la evidencia muestra una camara o colector comprometido, corresponde evaluar otro alcance tecnico.",
        whenToRequestHeading: "Cuando evaluar un desague obstruido",
        whenToRequestItems: [
          "Solicita evaluacion cuando un solo artefacto pierde descarga y los puntos vecinos funcionan con normalidad.",
          "Informa si el bloqueo aparecio despues de ingresar grasa, residuos u objetos al ramal interior.",
          "Pide diagnostico del tramo comun cuando dos artefactos cercanos comienzan a fallar al mismo tiempo.",
          "Evita mezclar productos corrosivos antes de la visita porque pueden aumentar el riesgo durante la maniobra.",
        ],
        procedureHeading: "Revision del artefacto y su ramal inmediato",
        procedureIntro:
          "El tecnico confirma los puntos afectados, revisa el acceso, interviene con equipo compacto y prueba la descarga del artefacto. Si la falla excede el ramal, informa el cambio de alcance antes de continuar.",
        equipmentHeading: "Equipo compacto para desagues interiores",
        equipmentIntro:
          "RIDGID K-50 y herramientas de desobstruccion permiten trabajar diametros interiores con control del avance. La seleccion depende del artefacto, la longitud probable y el tipo de residuo.",
        equipmentRecommendation:
          "Para un desague de Playa Ancha conviene confirmar primero si la falla es puntual; esa distincion evita intervenir una camara o colector sin evidencia suficiente.",
        preventionHeading: "Cuidados posteriores para el ramal intervenido",
        preventionParagraphs: [
          "La recomendacion posterior cambia segun el residuo encontrado y el uso del artefacto. Cocinas, duchas y banos no comparten las mismas causas ni requieren la misma pauta.",
          "Si el bloqueo se repite en el mismo punto, conviene registrar intervalos y considerar una inspeccion mas amplia. La recurrencia puede indicar una condicion que excede la limpieza localizada.",
        ],
        ctaHeading: "Evaluar desague obstruido",
        ctaParagraph:
          "Indica el sector de Playa Ancha, el artefacto afectado y si otros puntos descargan normalmente. Esa comparacion permite preparar una evaluacion localizada.",
        faq: [
          {
            question: "Que artefactos incluye el destape de desagues?",
            answer:
              "Puede considerar lavaplatos, lavamanos, duchas, tinas, WC y ramales interiores, siempre segun el acceso y el diagnostico del punto.",
          },
          {
            question: "Como saben si el problema esta en el ramal?",
            answer:
              "Se compara el artefacto afectado con puntos cercanos y se revisa hasta donde comparten descarga dentro del inmueble.",
          },
          {
            question: "Usan hidrojet dentro de cualquier desague?",
            answer:
              "No. En ramales interiores suele utilizarse equipo compacto; el hidrojet requiere condiciones de acceso, diametro y evacuacion compatibles.",
          },
          {
            question: "Que informacion envio desde Playa Ancha?",
            answer:
              "Envia direccion, tipo de artefacto, momento de la falla, puntos cercanos afectados y una imagen del acceso disponible.",
          },
          {
            question: "Que ocurre si el bloqueo esta en el colector?",
            answer:
              "Se informa que el alcance dejo de ser localizado y se propone evaluar la red compartida con el equipo correspondiente.",
          },
        ],
      };

    default:
      return content;
  }
}

export function createSeoLandingContent(route: SeoRoute): SeoLandingContent {
  const seed = stableHash(route.slug);
  const servicio = route.service.nombre.toLowerCase();
  const servicioCapitalizado = sentenceCase(route.service.nombre);
  const ubicacion = formatUbicacionPrincipal(route.sector, route.comuna.comuna);
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
  const routeContext = `${servicio} en ${ubicacion}`;
  const supportContext = `${getServicePhrase(route, seed + 31)} en ${ubicacion}`;
  const localAction = getServicePhrase(route, seed + 37);
  const diagnosticContext = `${getServicePhrase(route, seed + 41)} para ${route.sector}`;
  const operationalContext = `${getServicePhrase(route, seed + 43)} en ${route.comuna.comuna}`;
  const preventiveContext = `${getServicePhrase(route, seed + 47)} segun el tramo revisado`;

  const content: SeoLandingContent = {
    introParagraphs: [
      `En ${ubicacion}, Hidrourgencias SpA atiende ${servicio} 24/7 para redes sanitarias que presentan ${incident}, descarga irregular, olor persistente o perdida de rendimiento hidraulico. El trabajo de ${routeContext} se aborda con diagnostico inicial, seleccion de equipo profesional y verificacion de flujo segun el inmueble afectado.`,
      `Cada solicitud de ${supportContext} tiene una condicion operativa propia. La atencion en ${route.sector} considera ${route.networkType}, tipo de cliente ${route.clientType} y sintomas probables como ${route.probableIssue}. Con una lectura tecnica del tramo de ${route.comuna.comuna} definimos si corresponde destape mecanico RIDGID, hidrojet de alta presion, limpieza de camara o apoyo con videoinspeccion.`,
      `La meta de esta intervencion en ${route.sector} no se limita a liberar una obstruccion. En ${route.comuna.comuna} buscamos restituir capacidad de evacuacion, bajar el riesgo sanitario y entregar una recomendacion tecnica estable. La pauta combina el contexto local de ${ubicacion} con una decision practica sobre la maniobra y el control posterior.`,
    ],
    localHeading: `${servicioCapitalizado}: diagnostico local en ${route.sector}`,
    localParagraphs: [
      `Cuando se solicita ${supportContext}, normalmente ya existe una senal clara en la descarga, los artefactos o las camaras. Para diagnosticar el caso en ${route.sector}, ${diagnosis}. El filtro inicial de ${route.comuna.comuna} permite movilizar equipos adecuados y acotar la exposicion al problema sanitario.`,
      `El contexto de ${diagnosticContext} exige una respuesta proporcional al riesgo y al uso del inmueble. Un comercio, una vivienda y una comunidad de ${ubicacion} requieren tolerancias operativas distintas. Por eso la maniobra se ajusta a ${network}, severidad de la obstruccion y puntos de acceso disponibles.`,
      `La recomendacion tecnica para ${route.sector} es ${route.recommendation}. Si la red muestra signos de ${secondaryIncident}, la evaluacion local debe adelantarse a una descarga fuera de control. Una decision temprana en ${route.comuna.comuna} reduce costos de limpieza, reclamos y danos sanitarios asociados.`,
    ],
    problemHeading: `Problemas frecuentes en ${route.sector} para ${servicio}`,
    problemIntro: `Los sintomas asociados a ${localAction} se relacionan con ${route.service.enfoque}. En ${route.sector} tambien se revisan grasa, sarro, sedimentos, residuos solidos y mantencion postergada. Si fallan varios puntos durante la visita en ${route.comuna.comuna}, el diagnostico debe ampliar la revision hacia el tramo comun de la red.`,
    whenToRequestHeading: `Cuando solicitar soporte sanitario en ${route.sector}`,
    whenToRequestItems: [
      `Solicita evaluacion de ${supportContext} ${firstUrgencyTrigger}, especialmente si el inmueble depende de banos, cocina o areas comunes operativas.`,
      `Activa atencion para ${operationalContext} si aparece ${route.probableIssue} o se pierde el uso de varios puntos sanitarios.`,
      `Pide diagnostico preventivo en ${route.sector} ${secondUrgencyTrigger}, porque ese patron puede anticipar una obstruccion mayor.`,
      `Coordina soporte tecnico de ${localAction} cuando el cliente es ${route.clientType} y la continuidad sanitaria condiciona su operacion.`,
    ],
    procedureHeading: `Procedimiento tecnico para ${servicio} en ${route.comuna.comuna}`,
    procedureIntro: `El procedimiento en ${route.sector} sigue una secuencia ordenada hasta verificar el resultado. Para ${route.comuna.comuna} se combinan diagnostico, acceso sanitario, equipo RIDGID o hidrojet segun servicio, prueba hidraulica y recomendacion documentada.`,
    equipmentHeading: `Equipos utilizados para ${servicioCapitalizado}`,
    equipmentIntro: `La seleccion de equipos para ${supportContext} depende del diametro, material, accesibilidad y tipo de residuo. Usamos ${route.service.equipo} y, cuando corresponde, videoinspeccion RIDGID para revisar fisuras, contrapendientes, raices, sedimento o deformaciones.`,
    equipmentRecommendation: `${sentenceCase(supportContext)}: ${equipmentRecommendation.charAt(0).toLowerCase()}${equipmentRecommendation.slice(1)}`,
    nearbyCoverageHeading: `Sectores cercanos con cobertura para ${servicio} en ${route.comuna.comuna}`,
    nearbyCoverageParagraph: `Desde ${route.sector} se enlazan sectores cercanos para mantener continuidad de cobertura, derivar al tecnico correcto y mostrar zonas proximas con servicio disponible.`,
    preventionHeading: `Recomendacion preventiva para ${route.sector}, ${route.comuna.comuna}`,
    preventionParagraphs: [
      `Despues del servicio en ${route.sector}, conviene establecer por que la red llego a esa condicion. Si aparecen reincidencia, grasa u olor constante en ${route.comuna.comuna}, la recomendacion es ${prevention}. La lectura preventiva transforma el evento de ${ubicacion} en un antecedente util para gestionar la red sanitaria.`,
      `En ${tertiaryNetwork}, ${preventiveContext} requiere considerar carga de uso, limpieza profunda y correcciones previas. Un plan asociado a ${supportContext} permite definir frecuencia, puntos de control y tecnologia apropiada. Para edificios o comercios de ${route.comuna.comuna}, este enfoque reduce cierres, reclamos y limpiezas de emergencia.`,
      `Para ${route.clientType}, la intervencion tambien protege la continuidad frente a usuarios y residentes. Durante una urgencia en ${route.sector}, un artefacto fuera de servicio o una camara saturada cambia la operacion diaria. La pauta posterior para ${ubicacion} evita que el cliente gestione la misma red solo mediante urgencias.`,
    ],
    ctaHeading: `Solicita atencion sanitaria en ${route.sector} ahora`,
    ctaParagraph: `Para solicitar ${supportContext}, indica direccion, sintomas, condicion de uso y fotos del punto afectado. Con esos datos preparamos el equipo para ${route.sector} y coordinamos la visita ${tone}.`,
    faq: [
      {
        question: `Atienden ${supportContext} durante la noche?`,
        answer: `Si. La cobertura en ${route.sector} opera 24/7 y prioriza la perdida de uso sanitario, la exposicion de aguas servidas y la continuidad del inmueble.`,
      },
      {
        question: `Que equipo usan para ${supportContext}?`,
        answer: `Seleccionamos ${route.service.equipo}. Si el estado interno de la red en ${route.sector} no es concluyente, la evaluacion puede complementarse con videoinspeccion RIDGID para ubicar puntos criticos.`,
      },
      {
        question: `Cuando conviene complementar ${localAction} en ${route.sector} con hidrojet?`,
        answer: `El hidrojet se evalua en ${route.comuna.comuna} cuando hay grasa adherida, sarro, sedimentos o perdida de seccion util en tramos compatibles con agua a presion.`,
      },
      {
        question: `Que datos debo enviar por WhatsApp desde ${route.sector}?`,
        answer: `Envia direccion en ${route.sector}, tipo de problema, fotos o video y confirma que artefactos o areas quedaron sin uso.`,
      },
      {
        question: `La atencion de ${supportContext} incluye recomendacion preventiva?`,
        answer: `Si. Al cerrar la visita en ${route.comuna.comuna}, la prueba hidraulica y la causa probable permiten proponer una accion preventiva acorde con la frecuencia de uso y la red revisada.`,
      },
    ],
  };

  return applyExclusiveContent(route, content);
}
