export type BlogProblemaSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogProblemaPost = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroSummary: string;
  ctaMessage: string;
  keywords: string[];
  relatedServiceLinks: Array<{ href: string; label: string }>;
  relatedComunaLinks: Array<{ href: string; label: string }>;
  relatedZonaLinks: Array<{ href: string; label: string }>;
  sections: BlogProblemaSection[];
};

export const blogProblemas: BlogProblemaPost[] = [
  {
    slug: "rebalse-alcantarillado-edificio",
    title: "Rebalse de alcantarillado en edificio: causas, riesgos y solucion urgente",
    description:
      "Guia tecnica para administrar un rebalse de alcantarillado en edificio, con enfoque sanitario, continuidad operativa y respuesta 24/7.",
    h1: "Que hacer ante un rebalse de alcantarillado en un edificio",
    heroSummary:
      "Un rebalse en edificio requiere contencion inmediata, diagnostico real y ejecucion tecnica para evitar dano sanitario recurrente en espacios comunes.",
    ctaMessage:
      "Hola, reporto rebalse de alcantarillado en edificio y necesito atencion inmediata con evaluacion tecnica.",
    keywords: ["rebalse de alcantarillado", "urgencias sanitarias", "destape de alcantarillado en edificio"],
    relatedServiceLinks: [
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado y desagues" },
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras de inspeccion" },
      { href: "/servicios/motobombas-extraccion-aguas", label: "motobombas para extraccion de aguas" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape de alcantarillado en Vina del Mar" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape de alcantarillado en Valparaiso" },
      { href: "/destape-alcantarillado-quilpue", label: "destape de alcantarillado en Quilpue" },
    ],
    relatedZonaLinks: [
      { href: "/zona/recreo-vina-del-mar", label: "destape en Recreo, Vina del Mar" },
      { href: "/zona/cerro-alegre-valparaiso", label: "destape en Cerro Alegre, Valparaiso" },
      { href: "/zona/belloto-quilpue", label: "destape en El Belloto, Quilpue" },
    ],
    sections: [
      {
        heading: "Como identificar una emergencia sanitaria real",
        paragraphs: [
          "Un rebalse de alcantarillado en edificio se vuelve critico cuando afecta circulacion, ascensores, shafts, salas tecnicas o zonas de alto flujo de residentes.",
          "La primera medida es contener el uso de agua en sectores conectados al tramo comprometido y activar evaluacion tecnica para evitar una sobrecarga mayor.",
        ],
      },
      {
        heading: "Causas mas frecuentes en edificios y condominios",
        paragraphs: [
          "Las causas mas comunes son acumulacion de grasas, sedimentos, residuos no sanitarios y mantencion reactiva sin trazabilidad de puntos criticos.",
          "En redes verticales con alta ocupacion, un bloqueo parcial puede escalar rapidamente a retorno de aguas servidas en distintos pisos.",
        ],
        bullets: [
          "Falta de limpieza preventiva en camaras y colectores",
          "Uso incorrecto de artefactos sanitarios",
          "Ausencia de videoinspeccion en tramos con recurrencia",
          "Respuesta tardia cuando aparecen sintomas iniciales",
        ],
      },
      {
        heading: "Protocolo tecnico recomendado para controlar el rebalse",
        paragraphs: [
          "El protocolo profesional parte con triage de urgencia, continua con diagnostico de causa raiz y luego define si corresponde destape mecanico, hidrojet 4000 PSI o combinacion de tecnicas.",
          "La intervencion debe cerrar con validacion de flujo, control sanitario del area y recomendaciones concretas para reducir reincidencia.",
        ],
      },
      {
        heading: "Como disminuir reclamos y costos operativos",
        paragraphs: [
          "Cuando la administracion trabaja con un plan preventivo trimestral y un canal 24/7, baja la frecuencia de eventos y mejora la continuidad operativa del edificio.",
          "La clave es no tratar el rebalse como evento aislado: debe convertirse en insumo para un plan de mantencion por criticidad.",
        ],
      },
    ],
  },
  {
    slug: "agua-servida-retrocede-bano",
    title: "Agua servida retrocede en bano: por que ocurre y como actuar",
    description:
      "Explicacion tecnica y practica para cuando el agua servida retrocede en WC o ducha, con medidas de contencion y solucion sanitaria urgente.",
    h1: "Agua servida retrocede en el bano: causas y solucion inmediata",
    heroSummary:
      "El retorno de aguas servidas en bano indica una obstruccion relevante en la red sanitaria y debe tratarse como urgencia tecnica para evitar riesgos de salud.",
    ctaMessage:
      "Hola, el agua servida esta retrocediendo en mi bano y necesito destape urgente con evaluacion tecnica.",
    keywords: ["agua servida retrocede", "destape de bano", "urgencias sanitarias 24/7"],
    relatedServiceLinks: [
      { href: "/servicios/destape-artefactos-sanitarios", label: "destape de artefactos sanitarios" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado y desagues" },
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras de inspeccion" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-villa-alemana", label: "destape de alcantarillado en Villa Alemana" },
      { href: "/destape-alcantarillado-quilpue", label: "destape de alcantarillado en Quilpue" },
      { href: "/destape-alcantarillado-limache", label: "destape de alcantarillado en Limache" },
    ],
    relatedZonaLinks: [
      { href: "/zona/penablanca-villa-alemana", label: "destape en Penablanca, Villa Alemana" },
      { href: "/zona/centro-quilpue", label: "destape en Centro Quilpue" },
      { href: "/zona/forestal-vina-del-mar", label: "destape en Forestal, Vina del Mar" },
    ],
    sections: [
      {
        heading: "Por que el agua servida vuelve por el WC o la ducha",
        paragraphs: [
          "Cuando el agua servida retrocede, normalmente existe una obstruccion en un tramo compartido de la red que impide evacuacion normal.",
          "El retorno puede aparecer primero en pisos bajos, banos de uso intensivo o artefactos con menor altura hidraulica.",
        ],
      },
      {
        heading: "Riesgos sanitarios y operativos si no se actua rapido",
        paragraphs: [
          "Ademas del mal olor, el retorno de aguas servidas eleva el riesgo sanitario para residentes y trabajadores por contacto con contaminantes.",
          "En comercios y edificios, la tardanza en intervenir impacta reputacion, continuidad de uso y costos de limpieza correctiva.",
        ],
      },
      {
        heading: "Intervencion tecnica recomendada",
        paragraphs: [
          "La atencion profesional incluye evaluacion de red vertical y horizontal, descarte de bloqueo en camaras y seleccion de tecnica segun severidad.",
          "Cuando hay sedimento adherido o grasa compactada, el hidrojet permite recuperar seccion util y reducir el riesgo de retorno inmediato.",
        ],
      },
      {
        heading: "Senales de que necesitas mantenimiento preventivo",
        paragraphs: [
          "Si el WC borbotea, el lavamanos drena lento o hay retorno intermitente, es momento de programar mantencion y diagnostico antes del colapso.",
          "Un plan preventivo evita emergencias repetidas y reduce gasto total anual en atenciones de urgencia.",
        ],
      },
    ],
  },
  {
    slug: "desague-lento-cocina",
    title: "Desague lento en cocina: causas, errores comunes y solucion tecnica",
    description:
      "Guia para resolver desague lento en cocina en viviendas, restaurantes y locales comerciales, con enfoque en grasa, sedimentos y continuidad operativa.",
    h1: "Desague lento en cocina: cuando es sintoma de obstruccion mayor",
    heroSummary:
      "El drenaje lento en cocina no es un detalle menor. Es la fase inicial de una obstruccion que puede terminar en rebalse y cierre operativo.",
    ctaMessage:
      "Hola, tengo desague lento en cocina y necesito evaluacion tecnica para evitar rebalse.",
    keywords: ["desague lento cocina", "destape de desagues", "servicio hidrojet"],
    relatedServiceLinks: [
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado y desagues" },
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras de inspeccion" },
      { href: "/servicios/motobombas-extraccion-aguas", label: "motobombas para inundaciones y extraccion" },
    ],
    relatedComunaLinks: [
      { href: "/hidrojet-concon", label: "servicio hidrojet en Concon" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape de alcantarillado en Valparaiso" },
      { href: "/destape-alcantarillado-quintero", label: "destape de alcantarillado en Quintero" },
    ],
    relatedZonaLinks: [
      { href: "/zona/costa-de-montemar-concon", label: "destape en Costa de Montemar, Concon" },
      { href: "/zona/centro-concon", label: "destape en Centro Concon" },
      { href: "/zona/cerro-placeres-valparaiso", label: "destape en Cerro Placeres, Valparaiso" },
    ],
    sections: [
      {
        heading: "Por que la cocina es un punto critico en redes sanitarias",
        paragraphs: [
          "La cocina concentra grasa, restos organicos y detergentes que, con el tiempo, forman capas adheridas dentro del ducto.",
          "En locales gastronomicos, la recurrencia aumenta por carga continua y falta de limpiezas profundas planificadas.",
        ],
      },
      {
        heading: "Errores comunes que agravan el drenaje lento",
        paragraphs: [
          "Usar soluciones caseras repetidas sin diagnostico puede mover el problema, pero no eliminarlo de forma estructural.",
          "Tambien es frecuente subestimar sintomas iniciales y activar soporte tecnico recien cuando existe rebalse activo.",
        ],
        bullets: [
          "No retirar grasas antes de lavar utensilios",
          "Falta de limpieza preventiva en camara o trampa de grasa",
          "Ausencia de videoinspeccion en tramos de alta recurrencia",
          "No contar con protocolo de urgencia 24/7",
        ],
      },
      {
        heading: "Cuando conviene aplicar hidrojet",
        paragraphs: [
          "El hidrojet se recomienda cuando hay adherencia fuerte en paredes internas del ducto o bloqueo repetitivo en corto plazo.",
          "Su ventaja es que limpia en profundidad y mejora la evacuacion en redes exigidas por alto flujo de descarga.",
        ],
      },
      {
        heading: "Plan de control para evitar cierres operativos",
        paragraphs: [
          "La cocina debe tener monitoreo preventivo por frecuencia de uso, tipo de actividad y historial de eventos sanitarios.",
          "Con calendario tecnico y control de puntos criticos, la operacion mantiene continuidad y reduce costos por urgencia.",
        ],
      },
    ],
  },
  {
    slug: "camara-saturada-grasa",
    title: "Camara saturada por grasa: como resolver el colapso sanitario",
    description:
      "Contenido tecnico para detectar y resolver camaras de alcantarillado saturadas por grasa, con criterios de limpieza profunda y prevencion.",
    h1: "Camara saturada por grasa: diagnostico y solucion con enfoque tecnico",
    heroSummary:
      "Cuando una camara de alcantarillado se satura por grasa, el riesgo de rebalse y retorno sanitario aumenta de forma inmediata.",
    ctaMessage:
      "Hola, necesito limpieza y destape de camara saturada por grasa con atencion urgente.",
    keywords: ["camara saturada grasa", "destape de camaras", "hidrojet 4000 PSI"],
    relatedServiceLinks: [
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras de inspeccion" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado y desagues" },
      { href: "/servicios/reparacion-tuberias-hdpe", label: "reparacion de tuberias HDPE" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-puchuncavi", label: "destape de alcantarillado en Puchuncavi" },
      { href: "/destape-alcantarillado-quillota", label: "destape de alcantarillado en Quillota" },
      { href: "/destape-alcantarillado-placilla-curauma", label: "destape de alcantarillado en Placilla de Curauma" },
    ],
    relatedZonaLinks: [
      { href: "/zona/colmo-concon", label: "destape en Colmo, Concon" },
      { href: "/zona/centro-villa-alemana", label: "destape en Centro Villa Alemana" },
      { href: "/zona/paso-hondo-quilpue", label: "destape en Paso Hondo, Quilpue" },
    ],
    sections: [
      {
        heading: "Como se forma una saturacion por grasa en camara",
        paragraphs: [
          "La grasa no se elimina por completo con descarga normal: se adhiere a paredes y mezcla con sedimentos hasta reducir el paso hidraulico.",
          "Cuando la camara pierde capacidad util, aparecen malos olores, retorno intermitente y finalmente rebalse sanitario.",
        ],
      },
      {
        heading: "Indicadores de que la camara esta al limite",
        paragraphs: [
          "Si hay evacuacion irregular, burbujeo en artefactos o presencia constante de olor, la camara requiere revision tecnica inmediata.",
          "En edificios y comercio, estos sintomas suelen escalar en horarios punta o periodos de alta ocupacion.",
        ],
        bullets: [
          "Descarga lenta en varios puntos al mismo tiempo",
          "Olor sanitario persistente cerca de camaras",
          "Retorno de aguas servidas en pisos bajos",
          "Historial de destapes frecuentes sin solucion durable",
        ],
      },
      {
        heading: "Solucion tecnica recomendada",
        paragraphs: [
          "La limpieza con hidrojet 4000 PSI permite remover capas adheridas, recuperar seccion util y reducir riesgo de rebalse inmediato.",
          "El cierre profesional debe incluir revision del tramo conectado para asegurar que no queden cuellos de botella activos.",
        ],
      },
      {
        heading: "Prevencion para no volver al mismo problema",
        paragraphs: [
          "El control de grasa debe integrarse en un plan preventivo con frecuencia definida segun carga de uso y tipo de inmueble.",
          "La combinacion entre limpieza programada, diagnostico tecnico y respuesta 24/7 es la base para estabilidad sanitaria sostenida.",
        ],
      },
    ],
  },
  {
    slug: "mal-olor-alcantarillado",
    title: "Mal olor en alcantarillado: causas reales y como eliminarlo",
    description:
      "Guia tecnica para entender el mal olor en alcantarillado, detectar obstrucciones ocultas y decidir cuando pedir diagnostico profesional.",
    h1: "Mal olor en alcantarillado: senales, riesgos y solucion tecnica",
    heroSummary:
      "El olor sanitario persistente casi nunca es normal. Puede anticipar camaras saturadas, desagues lentos o perdida de sello hidraulico.",
    ctaMessage: "Hola, tengo mal olor en alcantarillado y necesito diagnostico tecnico.",
    keywords: ["mal olor en alcantarillado", "destape de alcantarillado", "videoinspeccion sanitaria"],
    relatedServiceLinks: [
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras de inspeccion" },
      { href: "/servicios/hidrojet", label: "hidrojet para limpieza sanitaria" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape en Vina del Mar" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape en Valparaiso" },
      { href: "/destape-alcantarillado-quilpue", label: "destape en Quilpue" },
    ],
    relatedZonaLinks: [
      { href: "/destape-alcantarillado-recreo-vina-del-mar", label: "destape en Recreo" },
      { href: "/destape-desagues-centro-quilpue-quilpue", label: "destape de desagues en Centro Quilpue" },
      { href: "/hidrojet-costa-de-montemar-concon", label: "hidrojet en Costa de Montemar" },
    ],
    sections: [
      {
        heading: "Por que aparece olor sanitario persistente",
        paragraphs: [
          "El mal olor puede aparecer por camaras con nivel alto, desagues con grasa adherida, sellos hidraulicos secos o tramos con ventilacion deficiente.",
          "Cuando el olor vuelve despues de limpiar superficialmente, conviene revisar la red y no solo perfumar el ambiente afectado.",
        ],
      },
      {
        heading: "Senales que indican riesgo de obstruccion",
        paragraphs: [
          "Si el olor se suma a drenaje lento, burbujeo o retorno ocasional, existe probabilidad de restriccion hidraulica en un tramo compartido.",
          "En edificios y locales comerciales, esta senal debe tratarse temprano para evitar rebalses en horario de mayor uso.",
        ],
        bullets: ["Olor cerca de camaras", "Borboteo en WC", "Descarga lenta", "Historial de destapes frecuentes"],
      },
      {
        heading: "Diagnostico y solucion recomendada",
        paragraphs: [
          "El primer paso es revisar puntos de acceso, camaras y artefactos conectados para separar un problema de sello de una obstruccion real.",
          "Cuando hay grasa, sedimento o sarro, el hidrojet permite recuperar la seccion util y disminuir el olor asociado al estancamiento.",
        ],
      },
      {
        heading: "Prevencion para comunidades y empresas",
        paragraphs: [
          "La prevencion combina limpieza programada, registro de puntos criticos y monitoreo de sintomas antes de que la red colapse.",
          "Una pauta de mantencion bien definida reduce olores, reclamos y costos por urgencias repetidas.",
        ],
      },
    ],
  },
  {
    slug: "grasa-redes-sanitarias",
    title: "Grasa en redes sanitarias: como afecta tuberias, camaras y desagues",
    description:
      "Explicacion tecnica sobre acumulacion de grasa en redes sanitarias, cuando usar hidrojet y como prevenir rebalses en cocinas y edificios.",
    h1: "Grasa en redes sanitarias: el bloqueo silencioso que termina en rebalse",
    heroSummary:
      "La grasa se adhiere a tuberias y camaras hasta reducir capacidad hidraulica. Detectarla temprano evita urgencias sanitarias costosas.",
    ctaMessage: "Hola, necesito limpieza de grasa en redes sanitarias con hidrojet.",
    keywords: ["grasa en redes sanitarias", "hidrojet", "destape de desagues"],
    relatedServiceLinks: [
      { href: "/servicios/hidrojet", label: "servicio hidrojet" },
      { href: "/servicios/mantencion-preventiva-redes", label: "mantencion preventiva de redes" },
      { href: "/servicios/destape-camaras-inspeccion", label: "destape de camaras" },
    ],
    relatedComunaLinks: [
      { href: "/hidrojet-concon", label: "hidrojet en Concon" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape en Valparaiso" },
      { href: "/destape-alcantarillado-puchuncavi", label: "destape en Puchuncavi" },
    ],
    relatedZonaLinks: [
      { href: "/hidrojet-bosques-de-montemar-concon", label: "hidrojet en Bosques de Montemar" },
      { href: "/destape-camaras-alcantarillado-la-boca-concon", label: "destape de camaras en La Boca" },
      { href: "/mantencion-preventiva-redes-centro-villa-alemana-villa-alemana", label: "mantencion en Villa Alemana" },
    ],
    sections: [
      {
        heading: "Como se acumula la grasa dentro de una red",
        paragraphs: [
          "La grasa no desaparece con agua caliente. Se enfria, se adhiere a paredes internas y captura sedimentos hasta formar una capa cada vez mas dura.",
          "En cocinas comerciales y edificios con alto uso, esta acumulacion reduce el diametro util y vuelve lenta la evacuacion.",
        ],
      },
      {
        heading: "Sintomas antes del colapso",
        paragraphs: [
          "El primer sintoma suele ser drenaje lento o mal olor. Luego aparecen camaras con nivel alto, burbujeo y retorno por puntos bajos.",
          "Si el problema se repite despues de un destape simple, probablemente la red necesita limpieza profunda y no solo perforar el bloqueo.",
        ],
        bullets: ["Desague lento de cocina", "Olor a grasa", "Camara con costra", "Rebalse en horario punta"],
      },
      {
        heading: "Cuando aplicar hidrojet",
        paragraphs: [
          "El hidrojet es recomendable cuando la obstruccion esta adherida, cuando hay recurrencia o cuando se requiere recuperar capacidad de flujo.",
          "Tambien ayuda a mantener redes de restaurantes, comunidades y locales comerciales con menor riesgo de cierre operativo.",
        ],
      },
      {
        heading: "Plan preventivo recomendado",
        paragraphs: [
          "La frecuencia depende del volumen de uso, tipo de actividad y antecedentes de rebalse. No todos los inmuebles necesitan el mismo calendario.",
          "Registrar hallazgos por visita permite ajustar la mantencion y justificar decisiones ante administracion o gerencia.",
        ],
      },
    ],
  },
  {
    slug: "raices-en-tuberias-alcantarillado",
    title: "Raices en tuberias de alcantarillado: sintomas y alternativas de solucion",
    description:
      "Guia para detectar raices en tuberias de alcantarillado, confirmar con videoinspeccion y elegir destape o reparacion segun severidad.",
    h1: "Raices en tuberias de alcantarillado: como detectarlas y actuar",
    heroSummary:
      "Las raices pueden ingresar por uniones o fisuras, atrapar residuos y causar obstrucciones repetidas que requieren diagnostico visual.",
    ctaMessage: "Hola, sospecho raices en tuberias y necesito videoinspeccion o destape tecnico.",
    keywords: ["raices en tuberias", "videoinspeccion", "destape de alcantarillado"],
    relatedServiceLinks: [
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/reparacion-tuberias-hdpe", label: "reparacion de tuberias" },
      { href: "/servicios/destape-horizontales", label: "destape de horizontales" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-limache", label: "destape en Limache" },
      { href: "/destape-alcantarillado-quillota", label: "destape en Quillota" },
      { href: "/destape-alcantarillado-placilla-curauma", label: "destape en Placilla Curauma" },
    ],
    relatedZonaLinks: [
      { href: "/destape-horizontales-los-laureles-limache", label: "destape de horizontales en Los Laureles" },
      { href: "/destape-alcantarillado-boco-quillota", label: "destape en Boco" },
      { href: "/hidrojet-placilla-placilla-curauma", label: "hidrojet en Placilla" },
    ],
    sections: [
      {
        heading: "Por que las raices entran a una tuberia",
        paragraphs: [
          "Las raices buscan humedad e ingresan por fisuras, uniones abiertas o tramos deformados. Una vez dentro, retienen papel, grasa y sedimentos.",
          "El resultado suele ser una obstruccion repetida que mejora por poco tiempo y luego vuelve en el mismo tramo.",
        ],
      },
      {
        heading: "Sintomas de alerta",
        paragraphs: [
          "La senal mas clara es la reincidencia: destapes frecuentes, camaras con residuos similares y drenaje lento aunque se haya limpiado la red.",
          "Cuando hay sospecha de dano estructural, la videoinspeccion ayuda a decidir si basta destape o si se requiere reparacion.",
        ],
        bullets: ["Bloqueos repetidos", "Raices visibles en camara", "Tramo con flujo irregular", "Fisuras o deformaciones"],
      },
      {
        heading: "Destape, hidrojet o reparacion",
        paragraphs: [
          "El destape puede liberar el flujo, pero si la raiz sigue ingresando el evento vuelve. Por eso el diagnostico visual es clave.",
          "Segun severidad, se puede recomendar limpieza, corte de raices, hidrojet o reparacion del tramo comprometido.",
        ],
      },
      {
        heading: "Como reducir reincidencia",
        paragraphs: [
          "La prevencion requiere ubicar el punto exacto, documentar el hallazgo y revisar el entorno para evitar nuevas entradas de raices.",
          "En redes antiguas, la mantencion periodica puede ser necesaria mientras se programa una correccion definitiva.",
        ],
      },
    ],
  },
  {
    slug: "inundacion-aguas-servidas",
    title: "Inundacion por aguas servidas: medidas inmediatas y solucion sanitaria",
    description:
      "Que hacer frente a una inundacion por aguas servidas, como contener el riesgo y cuando activar motobombas, destape e higienizacion.",
    h1: "Inundacion por aguas servidas: que hacer y como resolver sin improvisar",
    heroSummary:
      "Una inundacion con aguas servidas requiere contencion, extraccion, destape de causa raiz y pauta sanitaria para recuperar el area afectada.",
    ctaMessage: "Hola, tengo inundacion por aguas servidas y necesito atencion urgente.",
    keywords: ["inundacion por aguas servidas", "motobombas", "urgencias sanitarias"],
    relatedServiceLinks: [
      { href: "/servicios/motobombas-extraccion-aguas", label: "motobombas para extraccion de aguas" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/destape-edificios", label: "destape para edificios" },
    ],
    relatedComunaLinks: [
      { href: "/destape-alcantarillado-vina-del-mar", label: "urgencia en Vina del Mar" },
      { href: "/destape-alcantarillado-valparaiso", label: "urgencia en Valparaiso" },
      { href: "/destape-alcantarillado-villa-alemana", label: "urgencia en Villa Alemana" },
    ],
    relatedZonaLinks: [
      { href: "/destape-edificios-recreo-vina-del-mar", label: "destape de edificios en Recreo" },
      { href: "/destape-alcantarillado-cerro-baron-valparaiso", label: "destape en Cerro Baron" },
      { href: "/destape-camaras-alcantarillado-penablanca-villa-alemana", label: "destape de camaras en Penablanca" },
    ],
    sections: [
      {
        heading: "Primeras medidas de contencion",
        paragraphs: [
          "La prioridad es suspender el uso de agua conectada al tramo afectado, aislar el area y evitar contacto directo con aguas servidas.",
          "Si el nivel de agua sube, se debe evaluar extraccion con motobombas y buscar la causa del rebalse para que el evento no continue.",
        ],
      },
      {
        heading: "Causas probables de la inundacion",
        paragraphs: [
          "Puede existir camara saturada, colector bloqueado, retorno desde red compartida o falta de capacidad en tramos horizontales.",
          "Resolver solo la acumulacion visible no basta si no se corrige la obstruccion o restriccion hidraulica que provoco el evento.",
        ],
        bullets: ["Camara colapsada", "Colector obstruido", "Retorno por pisos bajos", "Aguas servidas en sala tecnica"],
      },
      {
        heading: "Intervencion tecnica completa",
        paragraphs: [
          "La respuesta combina extraccion, destape, hidrojet si corresponde, prueba de flujo y recomendaciones de higienizacion posterior.",
          "En edificios y empresas, tambien se requiere comunicar medidas de uso para no sobrecargar la red durante la intervencion.",
        ],
      },
      {
        heading: "Recuperacion y prevencion posterior",
        paragraphs: [
          "Una vez controlada la urgencia, conviene registrar el punto de origen y definir mantencion preventiva si hay riesgo de repeticion.",
          "El seguimiento evita que una inundacion puntual se transforme en un patron recurrente de alto costo.",
        ],
      },
    ],
  },
];
