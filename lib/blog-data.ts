import type { Metadata } from "next";

import { blogProblemas } from "@/lib/blog-problemas";
import { getCmsBlogEntries, type CmsBlogEntry } from "@/lib/cms-content";
import { buildCanonicalUrl, siteConfig } from "@/lib/site-config";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroSummary: string;
  ctaMessage: string;
  keywords: string[];
  relatedServiceLinks: Array<{ href: string; label: string }>;
  relatedComunaLinks?: Array<{ href: string; label: string }>;
  relatedZonaLinks?: Array<{ href: string; label: string }>;
  faq?: Array<{ question: string; answer: string }>;
  image?: string;
  imageAlt?: string;
  sections: BlogSection[];
};

type Blueprint = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroSummary: string;
  ctaMessage: string;
  keywords: string[];
  focusSentence: string;
  technicalSentence: string;
  businessSentence: string;
  preventionSentence: string;
  commonMistakes: string[];
  actionPlan: string[];
  relatedServiceLinks: Array<{ href: string; label: string }>;
  faq?: Array<{ question: string; answer: string }>;
};

function createBlogFaq(post: Pick<BlogPost, "keywords" | "h1" | "ctaMessage">): Array<{ question: string; answer: string }> {
  const primary = post.keywords[0] ?? "urgencia sanitaria";
  const secondary = post.keywords[1] ?? "destape de alcantarillado";

  return [
    {
      question: `Cuando debo pedir ayuda profesional por ${primary}?`,
      answer:
        "Debes pedir apoyo cuando exista rebalse, retorno de aguas servidas, mal olor persistente, drenaje lento en varios puntos o reincidencia luego de soluciones caseras.",
    },
    {
      question: `El hidrojet sirve para resolver ${secondary}?`,
      answer:
        "Sirve cuando hay grasa, sarro, sedimentos o residuos adheridos en la tuberia. La decision final depende del diagnostico del tramo y del acceso disponible.",
    },
    {
      question: "Que informacion conviene enviar por WhatsApp?",
      answer:
        "Comuna, sector, direccion o referencia, fotos del punto afectado, si hay aguas servidas expuestas y desde cuando ocurre el problema.",
    },
    {
      question: "Como evitar que el problema vuelva a repetirse?",
      answer:
        "Lo recomendable es validar flujo despues del servicio, registrar puntos recurrentes y definir mantencion preventiva segun carga de uso de la red.",
    },
    {
      question: "Atienden edificios, comercios y comunidades?",
      answer:
        "Si. Hidrourgencias trabaja con viviendas, administradores, comunidades, empresas y locales comerciales que requieren continuidad sanitaria.",
    },
  ];
}

function createSections(blueprint: Blueprint): BlogSection[] {
  const k1 = blueprint.keywords[0];
  const k2 = blueprint.keywords[1];
  const k3 = blueprint.keywords[2];

  return [
    {
      heading: "Panorama real de la urgencia sanitaria en Chile",
      paragraphs: [
        `Cuando una persona busca ${k1}, normalmente ya existe una presion operativa: rebalse activo, malos olores, drenaje lento o riesgo de paralizacion comercial. En ese momento, la diferencia entre una decision improvisada y una decision tecnica puede significar horas de perdida, reclamos de clientes y costos que se multiplican. ${blueprint.focusSentence} Por eso este articulo esta escrito para que tomes decisiones rapidas, pero con criterio profesional.`,
        `En la Region de Valparaiso, la demanda por ${k2} y ${k3} crece en comunidades, edificios y empresas que funcionan con alta carga sanitaria. El error mas comun es contratar solo por precio sin evaluar metodo ni capacidad operativa. A corto plazo parece una solucion, pero a mediano plazo reaparecen los sintomas, vuelve la emergencia y se termina pagando dos o tres veces por lo mismo.`,
        `Cuando se analiza el mercado con mirada estrategica, se ve una brecha clara entre proveedores que solo reaccionan y equipos que gestionan continuidad. Los primeros resuelven urgencias aisladas; los segundos construyen estabilidad sanitaria para que el cliente no dependa del azar. Esa diferencia se traduce en menor frecuencia de eventos, mejor control de presupuesto y mayor confianza de residentes, colaboradores o usuarios finales del inmueble.`,
      ],
    },
    {
      heading: "Causas tecnicas y sintomas que no debes ignorar",
      paragraphs: [
        `Las causas de fondo suelen combinar residuos adheridos, mala pendiente, falta de mantencion preventiva y decisiones correctivas incompletas. Cuando la red sanitaria opera con restricciones, la senal inicial no siempre es un rebalse evidente: muchas veces comienza con evacuacion lenta, ruidos de descarga, retorno ocasional o olor persistente en puntos especificos. Ignorar esas senales es abrir la puerta a una contingencia mayor en horario critico.`,
        `Una evaluacion tecnica seria distingue entre sintoma y causa raiz. No es lo mismo un bloqueo puntual en artefacto sanitario que una acumulacion estructural en tramo horizontal, una vertical con alta carga o un colector comprometido. ${blueprint.technicalSentence} Esa precision es la que permite resolver el evento actual y reducir la probabilidad de reincidencia en la misma semana.`,
        `Tambien es clave considerar el comportamiento del inmueble: numero de usuarios, horarios de maxima demanda, actividades que generan grasa o residuos, y trazado interno de la red. Sin esa lectura operacional, el diagnostico queda incompleto. Una intervencion profesional integra variables tecnicas y de uso para seleccionar la mejor combinacion entre destape, hidrojet, videoinspeccion y mantenimiento posterior.`,
      ],
      bullets: blueprint.commonMistakes,
    },
    {
      heading: "Impacto comercial para comunidades, edificios y empresas",
      paragraphs: [
        `En clientes corporativos, cada evento sanitario tiene un costo visible y otro invisible. El costo visible incluye reparacion, limpieza, horas hombre y eventual cierre parcial. El costo invisible afecta reputacion, confianza de residentes, experiencia de clientes y desgaste de administracion. ${blueprint.businessSentence} Por eso el enfoque correcto no es solo apagar incendios, sino proteger continuidad operativa.`,
        `Para administradores y jefaturas, la mejor defensa es trabajar con una metodologia repetible: triage rapido, diagnostico profesional, intervencion con tecnologia correcta y plan preventivo documentado. Esa secuencia reduce incertidumbre, ordena presupuesto y mejora la capacidad de rendir cuentas ante directorio, comite o gerencia.`,
        `La continuidad sanitaria ya no es un detalle tecnico secundario: hoy es un factor de competitividad. Un edificio con fallas recurrentes pierde valor percibido; un comercio con malos olores o banos fuera de servicio afecta ventas y reputacion digital. Por eso las decisiones sobre red sanitaria deben evaluarse como decisiones de negocio, no solo como gasto de mantencion.`,
      ],
    },
    {
      heading: "Como resolver bien: protocolo tecnico y decisiones clave",
      paragraphs: [
        `Un protocolo efectivo parte antes de llegar a terreno: recopilar datos correctos por WhatsApp (comuna, direccion, sintoma, evidencia visual y nivel de urgencia). Con eso se asigna mejor recurso tecnico y se acortan tiempos de solucion. Luego viene el diagnostico en sitio para decidir entre destape mecanico, hidrojet 4000 PSI, videoinspeccion o combinacion segun condicion de red.`,
        `Despues de la maniobra correctiva, la etapa mas subestimada es la validacion. Probar descarga, revisar puntos criticos y confirmar ausencia de retorno evita cierres prematuros que terminan en reclamo. ${blueprint.preventionSentence} Cuando el proveedor incluye recomendaciones accionables, el cliente deja de operar en modo emergencia permanente.`,
        `El protocolo tambien debe incluir comunicacion clara con el cliente: que se encontro, que se hizo, que riesgos siguen presentes y que acciones se recomiendan. Sin ese cierre profesional, la organizacion queda sin aprendizaje y repite decisiones incorrectas. La combinacion de ejecucion tecnica y claridad comercial es lo que realmente consolida resultados sostenibles.`,
      ],
      bullets: blueprint.actionPlan,
    },
    {
      heading: "Costo, precio y retorno de una decision bien tomada",
      paragraphs: [
        `Buscar informacion de precio es logico, pero comparar solo valores aislados puede salir caro. Un servicio barato que no corrige causa raiz dispara costos secundarios: nuevas visitas, sanitizacion repetida, horas improductivas y perdida de confianza. Una decision profesional considera alcance tecnico, trazabilidad de trabajo, tiempos de respuesta y capacidad de continuidad.`,
        `El retorno real aparece cuando la frecuencia de emergencias baja. Si un edificio pasa de tres contingencias al mes a una incidencia controlada en el trimestre, el ahorro operativo y reputacional es significativo. Por eso, evaluar correctamente ${k1} no es un gasto puntual: es una inversion en estabilidad sanitaria y continuidad comercial.`,
        `Otro punto critico es la previsibilidad. Cuando existe un proveedor con metodologia clara, la administracion puede presupuestar mejor, planificar mantenciones y reducir sorpresas. En cambio, cuando cada evento se resuelve con actores distintos y sin historial compartido, se pierde eficiencia tecnica y se incrementa la incertidumbre financiera.`,
      ],
    },
    {
      heading: "Cierre estrategico: de la urgencia a la gestion sanitaria inteligente",
      paragraphs: [
        `La ventaja competitiva no esta en reaccionar mas fuerte, sino en reaccionar mejor. Eso implica combinar urgencia 24/7 con un plan preventivo realista, validado por datos y adaptado al tipo de inmueble. Cuando el cliente cambia ese enfoque, deja de apagar fuegos y empieza a controlar su riesgo sanitario con indicadores concretos.`,
        `Si hoy tienes sintomas de obstruccion, rebalse o drenaje inestable, el mejor momento para actuar es ahora. Un primer diagnostico bien ejecutado evita escalamiento, protege continuidad y reduce costo total. Ese es el criterio que separa un servicio improvisado de un servicio tecnico de alto nivel.`,
        `En resumen, la estrategia ganadora para servicios sanitarios de urgencia combina tres capas: respuesta inmediata, solucion tecnica de causa raiz y plan preventivo continuo. Si una de esas capas falta, el problema vuelve. Si las tres estan presentes, la organizacion gana estabilidad, control de costos y tranquilidad operativa.`,
      ],
    },
  ];
}

function cleanMarkdownLine(value: string) {
  return value
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function createCmsSections(entry: CmsBlogEntry): BlogSection[] {
  const body = entry.body.trim();

  if (!body) {
    return [
      {
        heading: "Contenido técnico",
        paragraphs: [entry.heroSummary || entry.description],
      },
    ];
  }

  const chunks = body.split(/\n(?=##\s+)/g);
  const sections = chunks
    .map((chunk, index) => {
      const lines = chunk
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (!lines.length) {
        return null;
      }

      const firstLine = lines[0];
      const hasHeading = firstLine.startsWith("## ");
      const heading = hasHeading ? cleanMarkdownLine(firstLine) : index === 0 ? "Contenido técnico" : entry.h1;
      const contentLines = hasHeading ? lines.slice(1) : lines;
      const paragraphs = contentLines
        .join("\n")
        .split(/\n{2,}/)
        .map(cleanMarkdownLine)
        .filter(Boolean);

      return {
        heading,
        paragraphs: paragraphs.length ? paragraphs : [entry.description],
      };
    })
    .filter((section): section is BlogSection => section !== null);

  return sections.length ? sections : [{ heading: "Contenido técnico", paragraphs: [entry.description] }];
}

function createCmsBlogPost(entry: CmsBlogEntry): BlogPost {
  return {
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    h1: entry.h1,
    heroSummary: entry.heroSummary,
    ctaMessage: entry.ctaMessage,
    keywords: entry.keywords,
    image: entry.image,
    imageAlt: entry.alt,
    relatedServiceLinks: [
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/hidrojet", label: "hidrojet de alta presión" },
      { href: "/servicios/mantencion-preventiva-redes", label: "mantención preventiva de redes" },
    ],
    sections: createCmsSections(entry),
  };
}

const blueprints: Blueprint[] = [
  {
    slug: "por-que-se-tapa-el-alcantarillado",
    title: "Por que se tapa el alcantarillado: causas reales y como prevenir colapsos",
    description:
      "Guia tecnica y comercial para entender por que se tapa el alcantarillado, como prevenir rebalses y cuando activar destape profesional con hidrojet.",
    h1: "Por que se tapa el alcantarillado y como evitar rebalses costosos",
    heroSummary:
      "Explicamos causas tecnicas, errores de mantenimiento y decisiones clave para evitar contingencias sanitarias recurrentes en viviendas, edificios y empresas.",
    ctaMessage: "Hola, necesito evaluar por que se esta tapando mi alcantarillado y definir una solucion tecnica.",
    keywords: ["destape de alcantarillado", "urgencias sanitarias", "hidrojet"],
    focusSentence:
      "Entender por que se tapa el alcantarillado permite actuar antes del colapso y evitar medidas costosas de ultimo minuto.",
    technicalSentence:
      "Con hidrojet y diagnostico de tramos criticos se puede pasar de una solucion temporal a una correccion verdaderamente durable.",
    businessSentence:
      "En entornos comerciales, una red sanitaria inestable afecta ventas, experiencia de cliente y continuidad operacional.",
    preventionSentence:
      "Por eso la salida profesional siempre incluye pauta preventiva, frecuencia sugerida y criterios de alerta temprana.",
    commonMistakes: [
      "Esperar hasta que exista rebalse activo para solicitar soporte tecnico.",
      "Confundir drenaje lento con problema menor y postergar diagnostico.",
      "Elegir solo por precio sin validar metodologia de intervencion.",
      "No implementar mantencion preventiva en redes de alto uso.",
    ],
    actionPlan: [
      "Levantar sintomas y antecedentes del inmueble antes de intervenir.",
      "Realizar diagnostico de causa raiz y definir tecnologia adecuada.",
      "Ejecutar maniobra correctiva y validar flujo en puntos criticos.",
      "Implementar mantenimiento preventivo para reducir reincidencia.",
    ],
    relatedServiceLinks: [
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape de alcantarillado en Vina del Mar" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape de alcantarillado en Valparaiso" },
      { href: "/hidrojet-concon", label: "servicio hidrojet en Concon" },
    ],
  },
  {
    slug: "precio-destape-alcantarillado-chile",
    title: "Precio de destape de alcantarillado en Chile: que factores lo definen",
    description:
      "Analisis profesional sobre precio de destape de alcantarillado en Chile y como evaluar costo total, alcance tecnico y retorno operacional.",
    h1: "Precio de destape de alcantarillado en Chile: guia para decidir con criterio",
    heroSummary:
      "No mires solo el valor inicial. Aprende a comparar alcance tecnico, riesgos y costo total para elegir un servicio sanitario confiable.",
    ctaMessage: "Hola, necesito cotizar destape de alcantarillado y evaluar costo total de la intervencion.",
    keywords: ["precio destape alcantarillado", "destape de desagues", "mantencion preventiva"],
    focusSentence:
      "El precio del destape depende de complejidad de red, severidad de la obstruccion y tecnologia requerida para resolver bien.",
    technicalSentence:
      "Una cotizacion responsable contempla diagnostico, intervencion, validacion y recomendaciones de continuidad para evitar nuevas emergencias.",
    businessSentence:
      "La opcion mas barata no siempre es la mas economica cuando se incluyen costos por reincidencia y paralizacion de actividades.",
    preventionSentence:
      "La decision inteligente compara valor inicial con costo de no prevenir, especialmente en edificios y empresas de alto flujo.",
    commonMistakes: [
      "Comparar presupuestos sin revisar alcance tecnico real.",
      "No preguntar si la cotizacion incluye validacion posterior.",
      "Ignorar el historial de reincidencia del inmueble.",
      "No considerar costo de interrupcion operativa por rebalse.",
    ],
    actionPlan: [
      "Solicitar desglose del servicio: diagnostico, ejecucion y cierre.",
      "Confirmar tiempos de respuesta para urgencias 24/7.",
      "Evaluar opcion preventiva si hay recurrencia frecuente.",
      "Elegir proveedor con trazabilidad y soporte comercial.",
    ],
    relatedServiceLinks: [
      { href: "/mantencion-desagues-quilpue", label: "mantencion preventiva de desagues en Quilpue" },
      { href: "/urgencias-sanitarias-villa-alemana", label: "urgencias sanitarias en Villa Alemana" },
      { href: "/", label: "servicios sanitarios 24/7 en Region de Valparaiso" },
    ],
  },
  {
    slug: "como-evitar-rebalses-edificios",
    title: "Como evitar rebalses en edificios: protocolo preventivo para administradores",
    description:
      "Checklist tecnico-comercial para administradores y comites que necesitan evitar rebalses en edificios y reducir urgencias sanitarias.",
    h1: "Como evitar rebalses en edificios y proteger continuidad residencial",
    heroSummary:
      "Protocolo claro para administradores: diagnostico, control de riesgo, mantencion preventiva y reaccion profesional frente a sintomas tempranos.",
    ctaMessage: "Hola, necesito un plan para evitar rebalses en mi edificio y reducir urgencias sanitarias.",
    keywords: ["evitar rebalses en edificios", "mantencion de alcantarillado", "videoinspeccion sanitaria"],
    focusSentence:
      "Un edificio sin control preventivo termina dependiendo de urgencias, con costos altos y tension constante entre residentes y administracion.",
    technicalSentence:
      "La combinacion de videoinspeccion, hidrojet y mantencion programada permite anticipar fallas antes de que se transformen en colapso.",
    businessSentence:
      "Para administradores, prevenir rebalses mejora convivencia, baja reclamos y fortalece credibilidad frente al comite de copropietarios.",
    preventionSentence:
      "El exito depende de calendarizar tareas, medir resultados y activar soporte tecnico antes de perder control del problema.",
    commonMistakes: [
      "Actuar solo cuando hay quejas masivas de residentes.",
      "No mapear puntos criticos de red vertical y horizontal.",
      "Suspender mantencion por ahorro de corto plazo.",
      "No documentar intervenciones para seguimiento tecnico.",
    ],
    actionPlan: [
      "Definir inventario de puntos sanitarios criticos.",
      "Establecer frecuencia de limpieza y revision tecnica.",
      "Aplicar videoinspeccion en tramos de alta recurrencia.",
      "Mantener canal 24/7 para contingencias sanitarias severas.",
    ],
    relatedServiceLinks: [
      { href: "/mantencion-desagues-quilpue", label: "plan preventivo de desagues en Quilpue" },
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape de alcantarillado en Vina del Mar" },
      { href: "/destape-alcantarillado-quillota", label: "destape de alcantarillado en Quillota" },
    ],
  },
  {
    slug: "diferencia-hidrojet-vs-destape-mecanico",
    title: "Hidrojet vs destape mecanico: diferencias tecnicas y cuando usar cada uno",
    description:
      "Comparativa profesional entre hidrojet y destape mecanico para elegir metodo correcto segun tipo de obstruccion y objetivo sanitario.",
    h1: "Diferencia entre hidrojet y destape mecanico: guia para elegir bien",
    heroSummary:
      "Elegir la tecnica correcta evita retrabajos y baja reincidencia. Te explicamos cuando conviene hidrojet, cuando basta destape mecanico y cuando combinarlos.",
    ctaMessage: "Hola, necesito evaluacion para saber si mi caso requiere hidrojet o destape mecanico.",
    keywords: ["hidrojet", "destape mecanico", "destape de desagues"],
    focusSentence:
      "No toda obstruccion se resuelve igual: la eleccion de tecnologia determina efectividad, duracion del resultado y costo final.",
    technicalSentence:
      "El destape mecanico suele resolver bloqueos puntuales, mientras el hidrojet limpia en profundidad y elimina adherencias complejas.",
    businessSentence:
      "En entornos de alto uso, elegir una tecnica insuficiente aumenta la probabilidad de cierre y perdida de continuidad comercial.",
    preventionSentence:
      "La mejor practica es diagnosticar primero y aplicar la tecnica correcta con validacion de resultado, no por costumbre ni intuicion.",
    commonMistakes: [
      "Aplicar solo destape mecanico en redes con grasa adherida cronica.",
      "Usar hidrojet sin evaluar estado estructural de la red.",
      "No validar resultado posterior a la maniobra.",
      "Asumir que una sola tecnica sirve para todos los escenarios.",
    ],
    actionPlan: [
      "Diagnosticar causa real y tipo de residuo predominante.",
      "Elegir tecnica por efectividad esperada, no solo por costo.",
      "Confirmar recuperacion de flujo con pruebas de descarga.",
      "Definir mantencion para evitar retorno del problema.",
    ],
    relatedServiceLinks: [
      { href: "/hidrojet-concon", label: "servicio hidrojet en Concon" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape de alcantarillado en Valparaiso" },
      { href: "/destape-alcantarillado-puchuncavi", label: "destape de alcantarillado en Puchuncavi" },
    ],
  },
  {
    slug: "senales-obstruccion-desagues",
    title: "Senales de obstruccion en desagues: como detectarlas antes del rebalse",
    description:
      "Aprende a identificar senales tempranas de obstruccion en desagues y activar soporte tecnico antes de una urgencia sanitaria mayor.",
    h1: "Senales de obstruccion en desagues que no debes pasar por alto",
    heroSummary:
      "Detectar temprano evita emergencias caras. Revisamos sintomas criticos, errores comunes y acciones inmediatas para proteger tu red sanitaria.",
    ctaMessage: "Hola, detecte senales de obstruccion en mis desagues y necesito evaluacion tecnica.",
    keywords: ["obstruccion en desagues", "destape de desagues", "urgencias sanitarias 24/7"],
    focusSentence:
      "Detectar sintomas tempranos reduce impacto operativo y permite intervenir antes de que la red colapse en el peor momento.",
    technicalSentence:
      "Un diagnostico oportuno puede resolver con menor costo y menor tiempo de intervencion que una emergencia avanzada con rebalse.",
    businessSentence:
      "Para empresas y comunidades, anticipar obstrucciones evita interrupciones, reclamos y deterioro de la experiencia de usuarios.",
    preventionSentence:
      "La clave es convertir sintomas en decisiones: monitoreo, evaluacion tecnica y acciones correctivas antes del colapso.",
    commonMistakes: [
      "Normalizar olores persistentes sin investigar su origen.",
      "Postergar drenaje lento hasta que exista rebalse visible.",
      "Aplicar soluciones caseras repetidas en vez de diagnostico.",
      "No registrar patrones de recurrencia por sector o horario.",
    ],
    actionPlan: [
      "Registrar sintomas tempranos y ubicacion exacta.",
      "Solicitar evaluacion tecnica con evidencia visual.",
      "Aplicar correccion profesional segun diagnostico.",
      "Implementar control preventivo en puntos recurrentes.",
    ],
    relatedServiceLinks: [
      { href: "/urgencias-sanitarias-villa-alemana", label: "urgencias sanitarias en Villa Alemana" },
      { href: "/destape-alcantarillado-limache", label: "destape de alcantarillado en Limache" },
      { href: "/destape-alcantarillado-quintero", label: "destape de alcantarillado en Quintero" },
    ],
  },
  {
    slug: "mantencion-preventiva-clave-redes-sanitarias",
    title: "Mantencion preventiva de redes sanitarias: por que es clave para empresas y comunidades",
    description:
      "Descubre por que la mantencion preventiva de alcantarillado y desagues reduce urgencias, costos y riesgos operativos en edificios y empresas.",
    h1: "Mantencion preventiva: la clave para bajar urgencias sanitarias y costos",
    heroSummary:
      "Un plan preventivo bien disenado reduce rebalses, mejora continuidad y protege presupuesto anual frente a contingencias repetitivas.",
    ctaMessage: "Hola, quiero implementar un plan de mantencion preventiva para mi red sanitaria.",
    keywords: ["mantencion preventiva", "mantencion de alcantarillado", "videoinspeccion"],
    focusSentence:
      "La mantencion preventiva no es gasto accesorio: es la manera mas eficiente de bajar eventos de emergencia y estabilizar operacion.",
    technicalSentence:
      "Cuando se integra limpieza tecnica, hidrojet y videoinspeccion segun criticidad, la red mantiene desempeno y disminuye sorpresas operativas.",
    businessSentence:
      "En terminos comerciales, prevenir significa menos interrupciones, menos reclamos y mejor control presupuestario para administraciones y empresas.",
    preventionSentence:
      "La diferencia entre reaccionar y prevenir se refleja en frecuencia de fallas, costo total y confianza de usuarios del inmueble.",
    commonMistakes: [
      "Creer que no se necesita mantencion hasta que aparezca una urgencia.",
      "Aplicar calendarios genericos sin considerar carga real de uso.",
      "No medir resultados ni ajustar frecuencia de visitas.",
      "Separar mantencion de la estrategia de atencion 24/7.",
    ],
    actionPlan: [
      "Mapear criticidad de tramos y puntos de descarga.",
      "Definir frecuencia preventiva por tipo de inmueble.",
      "Agregar videoinspeccion en segmentos de alta recurrencia.",
      "Mantener soporte 24/7 para contingencias inevitables.",
    ],
    relatedServiceLinks: [
      { href: "/mantencion-desagues-quilpue", label: "mantencion preventiva de desagues en Quilpue" },
      { href: "/destape-alcantarillado-placilla-curauma", label: "destape de alcantarillado en Placilla de Curauma" },
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape de alcantarillado en Vina del Mar" },
    ],
  },
  {
    slug: "que-hacer-rebalse-alcantarillado-vivienda-edificio",
    title: "Que hacer cuando se rebalsa el alcantarillado en una vivienda o edificio",
    description:
      "Guia practica para actuar ante un rebalse de alcantarillado en viviendas, edificios y comunidades, minimizando danos mayores en la red.",
    h1: "Que hacer cuando se rebalsa el alcantarillado en una vivienda o edificio",
    heroSummary:
      "Aprende como actuar ante un rebalse sanitario, que errores evitar y cuando activar soporte tecnico profesional para proteger personas, infraestructura y continuidad operativa.",
    ctaMessage:
      "Hola, tengo un rebalse de alcantarillado y necesito una evaluacion tecnica urgente.",
    keywords: ["rebalse de alcantarillado", "destape de alcantarillado", "mantencion preventiva"],
    focusSentence:
      "Un rebalse de alcantarillado exige reaccion inmediata, pero tambien criterio tecnico para evitar que la emergencia se repita en poco tiempo.",
    technicalSentence:
      "El diagnostico correcto permite distinguir entre un bloqueo puntual y una falla mas profunda en la red horizontal, vertical o camaras de alcantarillado.",
    businessSentence:
      "En viviendas, edificios y locales comerciales, un rebalse afecta higiene, operacion, reputacion y costos de forma mucho mas rapida de lo que la mayoria anticipa.",
    preventionSentence:
      "La mejor salida no es solo contener la urgencia, sino dejar trazado un criterio preventivo para bajar el riesgo de nuevos eventos.",
    commonMistakes: [
      "Seguir usando agua en artefactos conectados a la red afectada.",
      "Aplicar quimicos corrosivos sin diagnostico tecnico.",
      "Pensar que limpiar solo el sintoma visible resuelve la causa raiz.",
      "Postergar la intervencion profesional hasta que el rebalse aumente.",
    ],
    actionPlan: [
      "Suspender el uso de agua en los puntos conectados al tramo afectado.",
      "Aislar el area comprometida para reducir riesgo sanitario.",
      "Solicitar evaluacion tecnica con evidencia del punto de rebalse.",
      "Ejecutar correccion profesional y definir plan preventivo posterior.",
    ],
    relatedServiceLinks: [
      { href: "/destape-alcantarillado-vina-del-mar", label: "destape de alcantarillado en Vina del Mar" },
      { href: "/destape-alcantarillado-valparaiso", label: "destape de alcantarillado en Valparaiso" },
      { href: "/urgencias-sanitarias-villa-alemana", label: "urgencias sanitarias en Villa Alemana" },
    ],
  },
];

const baseBlogPosts: BlogPost[] = blueprints.map((blueprint) => ({
  slug: blueprint.slug,
  title: blueprint.title,
  description: blueprint.description,
  h1: blueprint.h1,
  heroSummary: blueprint.heroSummary,
  ctaMessage: blueprint.ctaMessage,
  keywords: blueprint.keywords,
  relatedServiceLinks: blueprint.relatedServiceLinks,
  faq: blueprint.faq ?? createBlogFaq(blueprint),
  sections: createSections(blueprint),
}));

type NewServiceGuideBlueprint = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroSummary: string;
  ctaMessage: string;
  keywords: string[];
  serviceName: string;
  serviceHref: string;
  serviceLabel: string;
  focus: string;
  risks: string[];
  steps: string[];
  prevention: string;
  extraLinks?: Array<{ href: string; label: string }>;
};

function createNewServiceGuideFaq(guide: NewServiceGuideBlueprint): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Cuándo conviene solicitar ${guide.serviceName}?`,
      answer:
        "Conviene solicitarlo cuando el problema compromete higiene, continuidad de uso, seguridad del espacio o cuando una intervención simple ya no entrega un resultado estable.",
    },
    {
      question: "Qué información debo enviar por WhatsApp?",
      answer:
        "Comuna, tipo de propiedad, fotos o video del sector, extensión aproximada y si existe exposición a aguas servidas, humedad, malos olores o riesgo operativo.",
    },
    {
      question: "El servicio reemplaza una reparación estructural?",
      answer:
        "No necesariamente. La limpieza, extracción, hidrolavado o asesoría puede ser parte de una solución mayor si existen fallas de red, filtraciones o daños constructivos.",
    },
    {
      question: "Se puede programar para empresas, edificios o comunidades?",
      answer:
        "Sí. El servicio se puede coordinar para domicilios, administraciones, locales comerciales, empresas y comunidades según acceso, urgencia y alcance técnico.",
    },
  ];
}

function createNewServiceGuidePost(guide: NewServiceGuideBlueprint): BlogPost {
  return {
    slug: guide.slug,
    title: guide.title,
    description: guide.description,
    h1: guide.h1,
    heroSummary: guide.heroSummary,
    ctaMessage: guide.ctaMessage,
    keywords: guide.keywords,
    relatedServiceLinks: [
      { href: guide.serviceHref, label: guide.serviceLabel },
      ...(guide.extraLinks ?? []),
      { href: "/#servicios", label: "servicios sanitarios especializados" },
      { href: "/#contacto", label: "contacto directo con Hidrourgencias SpA" },
    ],
    faq: createNewServiceGuideFaq(guide),
    sections: [
      {
        heading: "Cuándo este servicio se vuelve necesario",
        paragraphs: [
          `${guide.focus} En la práctica, el momento correcto para solicitar apoyo técnico aparece cuando el problema deja de ser solo estético y empieza a afectar higiene, seguridad, continuidad de uso o confianza de quienes ocupan el espacio.`,
          `La decisión no debe tomarse únicamente por urgencia visible. También importan el origen del problema, el tipo de superficie o red involucrada, la presencia de malos olores, la exposición sanitaria y la probabilidad de que el evento se repita si solo se limpia la señal superficial.`,
          `Hidrourgencias SpA aborda estos requerimientos con criterio operativo: primero se levantan antecedentes, luego se dimensiona el alcance y finalmente se define la intervención adecuada para reducir improvisación y retrabajos.`,
        ],
      },
      {
        heading: "Riesgos habituales si se posterga la intervención",
        paragraphs: [
          `Postergar una limpieza técnica, extracción de agua, hidrolavado o asesoría preventiva suele encarecer el problema. El deterioro avanza, los olores se fijan, el agua afecta materiales y las redes sanitarias siguen operando sin control sobre su causa real.`,
          `En domicilios, comunidades y empresas, estos eventos también generan costos indirectos: pérdida de uso del espacio, reclamos de usuarios, daño reputacional y necesidad de actuar con mayor urgencia cuando la situación ya escaló.`,
        ],
        bullets: guide.risks,
      },
      {
        heading: "Cómo se aborda con criterio técnico",
        paragraphs: [
          `Un servicio bien ejecutado no comienza con la herramienta, sino con el diagnóstico. Antes de intervenir se revisa el contexto: comuna, acceso, tipo de propiedad, extensión, condición sanitaria y objetivo del cliente.`,
          `Luego se define una secuencia de trabajo proporcional al riesgo. Esa secuencia evita aplicar presión donde no corresponde, extraer agua sin descarga segura, limpiar sin control de residuos o diseñar mantenimiento sin entender los puntos críticos.`,
        ],
        bullets: guide.steps,
      },
      {
        heading: "Prevención y continuidad después del servicio",
        paragraphs: [
          guide.prevention,
          `Después de la intervención conviene registrar lo ocurrido, conservar fotos del antes y después, identificar la causa probable y definir una frecuencia de revisión cuando el inmueble tiene alto uso o antecedentes repetidos.`,
          `La meta no es solo resolver el evento puntual, sino recuperar control: saber qué pasó, qué se hizo, qué señales observar y cuándo volver a pedir soporte profesional antes de que el problema se transforme en urgencia.`,
        ],
      },
      {
        heading: "Qué enviar al solicitar atención",
        paragraphs: [
          `Para acelerar la respuesta por WhatsApp, envía comuna, dirección o referencia, fotos del sector, tipo de inmueble y descripción clara del problema. Si existe agua acumulada, indica profundidad aproximada y si el agua es limpia, lluvia, servida o mezclada.`,
          `Si se trata de limpieza o recuperación de espacios, agrega información sobre olores, humedad, residuos y accesos. Si se trata de asesoría, resume el historial de fallas y las mantenciones anteriores que recuerdes.`,
          `Con esos antecedentes, el equipo puede orientar mejor el recurso técnico, el alcance esperado y los cuidados previos antes de la visita.`,
        ],
      },
    ],
  };
}

const newServiceGuideBlueprints: NewServiceGuideBlueprint[] = [
  {
    slug: "limpieza-domicilios-post-emergencia-sanitaria",
    title: "Limpieza de domicilios post emergencia sanitaria: qué considerar",
    description:
      "Guía para solicitar limpieza técnica de domicilios después de rebalses, malos olores, humedad o exposición sanitaria.",
    h1: "Limpieza de domicilios post emergencia sanitaria",
    heroSummary:
      "Criterios para recuperar espacios domiciliarios afectados por eventos sanitarios sin improvisar el alcance de limpieza.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de domicilios y recuperación de espacios de Hidrourgencias SpA. Indico comuna, tipo de espacio y antecedentes del caso.",
    keywords: ["limpieza de domicilios", "emergencia sanitaria", "recuperación de espacios"],
    serviceName: "limpieza de domicilios y recuperación de espacios",
    serviceHref: "/servicios/limpieza-domicilios-recuperacion-espacios",
    serviceLabel: "limpieza de domicilios y recuperación de espacios",
    focus:
      "Después de un rebalse, acumulación de residuos, humedad o exposición a malos olores, la limpieza domiciliaria necesita un enfoque más cuidadoso que un aseo común.",
    risks: [
      "Persistencia de malos olores por limpieza superficial.",
      "Exposición sanitaria en baños, bodegas, patios o habitaciones.",
      "Pérdida de habitabilidad si no se priorizan zonas críticas.",
      "Repetición del problema si no se identifica el origen.",
    ],
    steps: [
      "Evaluar sector afectado, accesos y tipo de residuo.",
      "Separar limpieza, retiro, higienización y control de olor.",
      "Priorizar superficies expuestas a aguas servidas o humedad.",
      "Entregar recomendaciones para conservar el espacio recuperado.",
    ],
    prevention:
      "La prevención parte por corregir el origen sanitario del evento y mantener ventilación, limpieza periódica y monitoreo de olores o humedad en los días posteriores.",
  },
  {
    slug: "como-recuperar-espacios-afectados-por-malos-olores",
    title: "Cómo recuperar espacios afectados por malos olores",
    description:
      "Aprende qué revisar cuando un espacio mantiene malos olores por humedad, residuos, drenajes o exposición sanitaria.",
    h1: "Cómo recuperar espacios afectados por malos olores",
    heroSummary:
      "Los malos olores suelen indicar humedad, residuos o fallas sanitarias. Esta guía explica cómo abordar el problema con criterio técnico.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de domicilios y recuperación de espacios de Hidrourgencias SpA. Indico comuna, tipo de espacio y antecedentes del caso.",
    keywords: ["malos olores", "recuperación de espacios", "limpieza sanitaria"],
    serviceName: "limpieza de domicilios y recuperación de espacios",
    serviceHref: "/servicios/limpieza-domicilios-recuperacion-espacios",
    serviceLabel: "recuperación de espacios con malos olores",
    focus:
      "Un espacio con olor persistente puede tener residuos ocultos, humedad, ventilación deficiente o una causa sanitaria activa que requiere revisión.",
    risks: [
      "Aplicar aromatizantes sin retirar la causa del olor.",
      "Ocultar humedad que deteriora superficies y mobiliario.",
      "No revisar drenajes, cámaras o artefactos cercanos.",
      "Normalizar olores que anticipan rebalse o retorno sanitario.",
    ],
    steps: [
      "Identificar origen probable del olor y zonas de mayor intensidad.",
      "Revisar humedad, residuos, ventilación y puntos sanitarios cercanos.",
      "Limpiar e higienizar superficies comprometidas.",
      "Definir si corresponde destape, sanitización o mantención adicional.",
    ],
    prevention:
      "Para prevenir recurrencia, el espacio debe quedar seco, ventilado y sin residuos; si el olor proviene de red sanitaria, también se debe revisar el sistema de desagüe.",
  },
  {
    slug: "limpieza-tecnica-domicilios-despues-rebalse-alcantarillado",
    title: "Limpieza técnica de domicilios después de un rebalse de alcantarillado",
    description:
      "Qué hacer después de un rebalse de alcantarillado en un domicilio y cuándo solicitar limpieza técnica o sanitización.",
    h1: "Limpieza técnica después de un rebalse de alcantarillado",
    heroSummary:
      "Un rebalse no termina cuando baja el agua. Hay que limpiar, higienizar y prevenir exposición sanitaria en el espacio afectado.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de domicilios y recuperación de espacios de Hidrourgencias SpA. Indico comuna, tipo de espacio y antecedentes del caso.",
    keywords: ["rebalse de alcantarillado", "limpieza técnica", "aguas servidas"],
    serviceName: "limpieza de domicilios y recuperación de espacios",
    serviceHref: "/servicios/limpieza-domicilios-recuperacion-espacios",
    serviceLabel: "limpieza técnica post rebalse",
    focus:
      "Cuando hubo contacto con aguas servidas, residuos o humedad sanitaria, el domicilio requiere limpieza técnica y revisión de la causa del rebalse.",
    risks: [
      "Quedar con superficies contaminadas después de retirar solo el agua visible.",
      "Mantener humedad en zócalos, pisos o bodegas.",
      "Reabrir el espacio sin ventilación ni control de olores.",
      "No corregir la obstrucción que produjo el evento.",
    ],
    steps: [
      "Detener uso de agua en puntos conectados al tramo afectado.",
      "Retirar agua o residuos visibles con resguardo sanitario.",
      "Limpiar, higienizar y ventilar el sector comprometido.",
      "Validar que la red sanitaria no mantenga retorno activo.",
    ],
    prevention:
      "Después de un rebalse conviene documentar el punto afectado y solicitar revisión preventiva si hubo eventos similares en el mismo sector.",
  },
  {
    slug: "hidrolavado-fachadas-cuando-conviene",
    title: "Hidrolavado de fachadas: cuándo conviene solicitarlo",
    description:
      "Guía para saber cuándo una fachada, muro, acceso o superficie exterior requiere hidrolavado profesional.",
    h1: "Hidrolavado de fachadas: cuándo conviene",
    heroSummary:
      "El hidrolavado permite remover suciedad adherida, pero debe aplicarse con presión correcta según superficie y estado del material.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de fachadas e hidrolavado de superficies de Hidrourgencias SpA. Indico comuna, tipo de superficie y extensión aproximada.",
    keywords: ["hidrolavado de fachadas", "limpieza de fachadas", "hidrolavado profesional"],
    serviceName: "limpieza de fachadas e hidrolavado de superficies",
    serviceHref: "/servicios/limpieza-fachadas-hidrolavado-superficies",
    serviceLabel: "hidrolavado de fachadas",
    focus:
      "Una fachada con suciedad adherida, manchas por escurrimiento o pérdida de presentación puede requerir hidrolavado profesional.",
    risks: [
      "Usar presión excesiva sobre superficies delicadas.",
      "No controlar escurrimientos hacia accesos o drenajes.",
      "Limpiar solo zonas visibles y dejar manchas de borde.",
      "No considerar altura, acceso ni seguridad del área.",
    ],
    steps: [
      "Evaluar material, estado y adherencias.",
      "Probar presión en área controlada cuando corresponde.",
      "Trabajar por paños o sectores para uniformidad.",
      "Revisar escurrimientos y acabado final.",
    ],
    prevention:
      "La frecuencia depende de exposición a polvo, humedad, tránsito y cercanía a zonas con grasa o barro; registrar el resultado ayuda a programar limpiezas futuras.",
  },
  {
    slug: "limpieza-superficies-con-hidrolavado-beneficios",
    title: "Limpieza de superficies con hidrolavado: beneficios y cuidados",
    description:
      "Conoce beneficios, límites y cuidados del hidrolavado en pisos, patios, accesos, muros y superficies exteriores.",
    h1: "Limpieza de superficies con hidrolavado",
    heroSummary:
      "El hidrolavado mejora limpieza profunda en exteriores cuando se aplica con técnica, presión y control de área.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de fachadas e hidrolavado de superficies de Hidrourgencias SpA. Indico comuna, tipo de superficie y extensión aproximada.",
    keywords: ["hidrolavado de superficies", "limpieza de pisos", "limpieza exterior"],
    serviceName: "limpieza de fachadas e hidrolavado de superficies",
    serviceHref: "/servicios/limpieza-fachadas-hidrolavado-superficies",
    serviceLabel: "hidrolavado de superficies",
    focus:
      "Pisos, patios, accesos y muros exteriores acumulan barro, grasa, polvo y residuos que no siempre se remueven con limpieza manual.",
    risks: [
      "Desplazar suciedad hacia desagües sin control.",
      "Dañar juntas, pinturas o revestimientos por presión mal aplicada.",
      "No señalizar zonas húmedas durante la intervención.",
      "Dejar superficies resbaladizas sin revisión final.",
    ],
    steps: [
      "Definir tipo de superficie y suciedad predominante.",
      "Seleccionar boquilla, presión y sentido de avance.",
      "Controlar descarga de agua y residuos desprendidos.",
      "Revisar condición final y puntos que requieren segunda pasada.",
    ],
    prevention:
      "Para conservar el resultado, conviene mantener drenajes libres, retirar residuos sólidos y programar limpieza según tráfico y exposición ambiental.",
  },
  {
    slug: "errores-comunes-limpieza-fachadas-sin-equipo-profesional",
    title: "Errores comunes al limpiar fachadas sin equipo profesional",
    description:
      "Errores frecuentes al limpiar fachadas o superficies exteriores sin equipo adecuado, y cómo evitarlos.",
    h1: "Errores comunes en limpieza de fachadas sin equipo profesional",
    heroSummary:
      "La limpieza exterior parece simple, pero presión incorrecta, mala técnica o falta de seguridad pueden causar daños y retrabajo.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de fachadas e hidrolavado de superficies de Hidrourgencias SpA. Indico comuna, tipo de superficie y extensión aproximada.",
    keywords: ["limpieza de fachadas", "errores hidrolavado", "hidrolavado de muros"],
    serviceName: "limpieza de fachadas e hidrolavado de superficies",
    serviceHref: "/servicios/limpieza-fachadas-hidrolavado-superficies",
    serviceLabel: "limpieza profesional de fachadas",
    focus:
      "Limpiar fachadas sin evaluar material, presión y acceso puede generar manchas, desprendimientos o un resultado irregular.",
    risks: [
      "Aplicar presión directa sobre juntas, sellos o pintura debilitada.",
      "Trabajar sin control de altura o accesos seguros.",
      "Usar productos incompatibles con el material.",
      "No proteger áreas cercanas ni coordinar horarios de uso.",
    ],
    steps: [
      "Revisar estado de superficie antes de aplicar agua a presión.",
      "Definir zonas sensibles que requieren menor intensidad.",
      "Trabajar por etapas con control visual del avance.",
      "Coordinar cierre o señalización de accesos cuando corresponde.",
    ],
    prevention:
      "El mejor resultado se logra con evaluación previa y limpieza programada, evitando esperar a que la suciedad esté demasiado adherida.",
  },
  {
    slug: "extraccion-aguas-estanques-cuando-solicitar-servicio",
    title: "Extracción de aguas en estanques: cuándo solicitar servicio",
    description:
      "Cuándo conviene solicitar extracción de aguas en estanques, recintos anegados o acumulaciones difíciles de evacuar.",
    h1: "Extracción de aguas en estanques: cuándo solicitar servicio",
    heroSummary:
      "La extracción con motobombas requiere evaluar volumen, tipo de agua, descarga y seguridad del sector.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de extracción de aguas en estanques, piscinas o espacios anegados de Hidrourgencias SpA. Indico comuna, tipo de agua y volumen aproximado.",
    keywords: ["extracción de aguas", "estanques", "motobombas"],
    serviceName: "extracción de aguas en estanques, piscinas o espacios anegados",
    serviceHref: "/servicios/extraccion-aguas-estanques-piscinas",
    serviceLabel: "extracción de aguas en estanques",
    focus:
      "Un estanque o recinto con agua acumulada necesita extracción profesional cuando el volumen, acceso o descarga exceden una solución manual.",
    risks: [
      "Descargar agua hacia zonas no habilitadas.",
      "No identificar si el agua contiene residuos o contaminación.",
      "Dañar equipos o superficies por mantener anegamiento.",
      "No corregir el origen de la acumulación.",
    ],
    steps: [
      "Identificar tipo de agua y volumen aproximado.",
      "Definir punto de descarga seguro.",
      "Instalar motobomba y mangueras según caudal requerido.",
      "Monitorear nivel y cerrar con recomendaciones preventivas.",
    ],
    prevention:
      "Después de extraer agua, conviene revisar drenajes, filtraciones, pendientes y causas que puedan producir una nueva acumulación.",
  },
  {
    slug: "vaciado-piscinas-espacios-anegados-cuidados",
    title: "Vaciado de piscinas y espacios anegados: cuidados clave",
    description:
      "Cuidados técnicos al vaciar piscinas, patios, subterráneos o espacios anegados con apoyo de motobombas.",
    h1: "Vaciado de piscinas y espacios anegados: cuidados clave",
    heroSummary:
      "No todo vaciado es igual: el tipo de agua, el volumen, la descarga y el entorno definen la estrategia correcta.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de extracción de aguas en estanques, piscinas o espacios anegados de Hidrourgencias SpA. Indico comuna, tipo de agua y volumen aproximado.",
    keywords: ["vaciado de piscinas", "espacios anegados", "extracción de agua"],
    serviceName: "extracción de aguas en estanques, piscinas o espacios anegados",
    serviceHref: "/servicios/extraccion-aguas-estanques-piscinas",
    serviceLabel: "vaciado de piscinas y espacios anegados",
    focus:
      "Piscinas, patios y subterráneos pueden requerir vaciado controlado para limpieza, mantenimiento o recuperación posterior a lluvia o rebalse.",
    risks: [
      "No medir profundidad ni volumen antes de coordinar el equipo.",
      "Evacuar agua hacia zonas con riesgo de retorno.",
      "No separar agua lluvia, limpia, servida o mezclada.",
      "Ignorar riesgos eléctricos o de acceso en espacios anegados.",
    ],
    steps: [
      "Informar profundidad aproximada y tipo de agua.",
      "Revisar accesos para mangueras y equipos.",
      "Definir ruta de descarga y resguardos del área.",
      "Realizar extracción gradual y verificar condiciones finales.",
    ],
    prevention:
      "Cuando el anegamiento no es puntual, se debe revisar drenaje, pendientes y capacidad de evacuación para evitar depender solo de extracciones correctivas.",
  },
  {
    slug: "motobombas-extraccion-aguas-uso-correcto",
    title: "Motobombas para extracción de aguas: uso correcto",
    description:
      "Cómo se usan correctamente las motobombas para extracción de aguas y qué antecedentes enviar antes del servicio.",
    h1: "Motobombas para extracción de aguas: uso correcto",
    heroSummary:
      "La motobomba correcta depende del caudal, tipo de agua, altura de descarga, acceso y urgencia del caso.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de extracción de aguas en estanques, piscinas o espacios anegados de Hidrourgencias SpA. Indico comuna, tipo de agua y volumen aproximado.",
    keywords: ["motobombas", "extracción de aguas", "control de inundaciones"],
    serviceName: "extracción de aguas en estanques, piscinas o espacios anegados",
    serviceHref: "/servicios/extraccion-aguas-estanques-piscinas",
    serviceLabel: "motobombas para extracción de aguas",
    focus:
      "Las motobombas permiten recuperar áreas anegadas, pero su uso exige definir caudal, descarga y condiciones de seguridad.",
    risks: [
      "Usar equipo insuficiente para el volumen real.",
      "Instalar descarga sin verificar destino del agua.",
      "Operar cerca de energía eléctrica sin resguardos.",
      "No monitorear variaciones de nivel durante la extracción.",
    ],
    steps: [
      "Evaluar profundidad, superficie y tipo de agua.",
      "Seleccionar motobomba y manguera según alcance.",
      "Controlar descarga y estabilidad del área.",
      "Finalizar con revisión de humedad o necesidad de limpieza.",
    ],
    prevention:
      "La extracción debe acompañarse de revisión de la causa: lluvia, filtración, rebalse, pendiente deficiente o drenaje bloqueado.",
  },
  {
    slug: "mantenimiento-integral-redes-sanitarias-empresas",
    title: "Mantenimiento integral de redes sanitarias para empresas",
    description:
      "Cómo una empresa puede ordenar el mantenimiento integral de redes sanitarias para reducir urgencias y proteger continuidad.",
    h1: "Mantenimiento integral de redes sanitarias para empresas",
    heroSummary:
      "Las empresas necesitan continuidad sanitaria: diagnóstico, frecuencia, trazabilidad y respuesta ante puntos críticos.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de asesoría en mantenimiento integral de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y objetivo de la asesoría.",
    keywords: ["mantenimiento integral redes sanitarias", "empresas", "mantención preventiva"],
    serviceName: "asesoría en mantenimiento integral de redes sanitarias",
    serviceHref: "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
    serviceLabel: "asesoría en mantenimiento integral",
    focus:
      "Una empresa con baños, cocinas, bodegas o áreas de alto tránsito necesita mantener su red sanitaria con planificación, no solo con urgencias.",
    risks: [
      "Paralización parcial por rebalse o mal olor.",
      "Gastos correctivos repetidos sin causa documentada.",
      "Falta de historial para tomar decisiones de inversión.",
      "Reclamos de clientes o colaboradores por servicios fuera de uso.",
    ],
    steps: [
      "Levantar puntos sanitarios y criticidad por área.",
      "Definir frecuencia preventiva según carga de uso.",
      "Priorizar cámaras, colectores, artefactos y drenajes críticos.",
      "Mantener canal de urgencia para contingencias inevitables.",
    ],
    prevention:
      "La continuidad mejora cuando cada intervención deja registro, recomendaciones y una frecuencia ajustada al comportamiento real del inmueble.",
  },
  {
    slug: "como-planificar-mantencion-redes-sanitarias-edificios",
    title: "Cómo planificar mantención de redes sanitarias en edificios",
    description:
      "Guía para administradores que necesitan planificar mantención sanitaria en edificios, comunidades y condominios.",
    h1: "Cómo planificar mantención de redes sanitarias en edificios",
    heroSummary:
      "Una planificación clara reduce rebalses, reclamos y decisiones reactivas en comunidades de alto uso.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de asesoría en mantenimiento integral de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y objetivo de la asesoría.",
    keywords: ["mantención redes sanitarias edificios", "administración de edificios", "prevención de rebalses"],
    serviceName: "asesoría en mantenimiento integral de redes sanitarias",
    serviceHref: "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
    serviceLabel: "planificación de mantención sanitaria",
    focus:
      "Los edificios combinan verticales, horizontales, cámaras y áreas comunes; por eso la mantención debe priorizar puntos críticos.",
    risks: [
      "Responder solo cuando hay reclamos masivos.",
      "No distinguir fallas de vertical, horizontal o artefacto.",
      "Perder historial de intervenciones por falta de registro.",
      "Suspender mantención preventiva para ahorrar en el corto plazo.",
    ],
    steps: [
      "Mapear cámaras, verticales y tramos horizontales.",
      "Registrar eventos previos y sectores afectados.",
      "Definir calendario por criticidad y temporada.",
      "Comunicar recomendaciones a administración y residentes cuando corresponde.",
    ],
    prevention:
      "Una comunidad reduce riesgo cuando mantiene registro técnico y revisa la frecuencia preventiva después de cada evento relevante.",
  },
  {
    slug: "asesoria-sanitaria-preventiva-evitar-urgencias",
    title: "Asesoría sanitaria preventiva para evitar urgencias",
    description:
      "Cuándo pedir asesoría sanitaria preventiva y cómo ayuda a evitar rebalses, malos olores y contingencias repetitivas.",
    h1: "Asesoría sanitaria preventiva para evitar urgencias",
    heroSummary:
      "La asesoría preventiva permite ordenar causas, prioridades y acciones antes de que el problema llegue a emergencia.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de asesoría en mantenimiento integral de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y objetivo de la asesoría.",
    keywords: ["asesoría sanitaria preventiva", "evitar urgencias sanitarias", "mantenimiento sanitario"],
    serviceName: "asesoría en mantenimiento integral de redes sanitarias",
    serviceHref: "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
    serviceLabel: "asesoría sanitaria preventiva",
    focus:
      "La asesoría sanitaria preventiva sirve cuando hay señales repetidas, dudas sobre prioridades o necesidad de ordenar mantenimiento con criterio técnico.",
    risks: [
      "Invertir en acciones aisladas sin causa raíz.",
      "No priorizar puntos que generan mayor riesgo operativo.",
      "Reaccionar tarde ante malos olores, drenaje lento o cámaras saturadas.",
      "No tener una ruta de acción clara para urgencias 24/7.",
    ],
    steps: [
      "Reunir antecedentes y síntomas recurrentes.",
      "Identificar puntos críticos y nivel de riesgo.",
      "Definir acciones correctivas, preventivas y de monitoreo.",
      "Ajustar el plan según nuevos eventos o cambios de uso.",
    ],
    prevention:
      "La asesoría tiene más valor cuando se transforma en calendario, responsables, criterios de alerta y revisión periódica de resultados.",
  },
  {
    slug: "que-revisar-alcantarillado-antes-comprar-propiedad",
    title: "Qué revisar en la red de alcantarillado antes de comprar una propiedad",
    description:
      "Guía técnica para revisar alcantarillado, desagües, cámaras y señales sanitarias antes de comprar, arrendar o recibir una propiedad.",
    h1: "Qué revisar en la red de alcantarillado antes de comprar una propiedad",
    heroSummary:
      "Una propiedad puede verse impecable, pero esconder problemas sanitarios bajo pisos, cámaras, ductos o colectores privados.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    keywords: ["alcantarillado antes de comprar propiedad", "análisis técnico de propiedad", "redes sanitarias"],
    serviceName: "análisis técnico de propiedad y redes sanitarias",
    serviceHref: "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    serviceLabel: "análisis técnico de propiedad y redes sanitarias",
    focus:
      "Antes de comprar, arrendar o recibir una propiedad conviene revisar si la red de alcantarillado funciona correctamente, si las cámaras están operativas y si existen señales de obstrucción, retorno o falta de mantención.",
    risks: [
      "Comprar una propiedad con desagües lentos o cámaras saturadas.",
      "Asumir gastos de hidrojet, destape o reparación que no estaban considerados.",
      "No detectar malos olores, retorno de aguas servidas o pérdida de pendiente antes de firmar.",
      "Confundir una propiedad limpia visualmente con una red sanitaria en buen estado.",
    ],
    steps: [
      "Revisar cámaras de inspección, niveles de agua y presencia de sedimentos.",
      "Probar descarga en baños, cocina, lavaderos y puntos de alto uso.",
      "Evaluar olores, humedad, filtraciones visibles y antecedentes de mantención.",
      "Solicitar videoinspección sanitaria si existen dudas sobre raíces, fisuras o contrapendientes.",
    ],
    prevention:
      "La mejor prevención es evaluar la red antes de tomar la decisión económica. Si aparecen señales de alerta, se puede exigir información, negociar reparaciones o definir un plan técnico antes de asumir el inmueble.",
    extraLinks: [
      { href: "/servicios/destape-camaras-inspeccion", label: "videoinspección sanitaria" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/hidrojet", label: "hidrojet de alta presión" },
      { href: "/servicios/mantencion-preventiva-redes", label: "mantención preventiva de redes" },
    ],
  },
  {
    slug: "vicios-ocultos-sanitarios-alcantarillado-desagues",
    title: "Vicios ocultos sanitarios: señales de alerta en alcantarillado y desagües",
    description:
      "Señales de alerta para identificar posibles vicios ocultos sanitarios en alcantarillado, desagües, cámaras y redes privadas.",
    h1: "Vicios ocultos sanitarios: señales de alerta en alcantarillado y desagües",
    heroSummary:
      "Los vicios ocultos sanitarios pueden aparecer como olores, drenaje lento, cámaras deficientes o retorno intermitente de aguas servidas.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    keywords: ["vicios ocultos sanitarios", "alcantarillado", "desagües"],
    serviceName: "análisis técnico de propiedad y redes sanitarias",
    serviceHref: "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    serviceLabel: "detección de vicios ocultos sanitarios",
    focus:
      "Un vicio oculto sanitario no siempre se ve durante una visita comercial. Puede esconderse en cámaras deficientes, redes sin mantención, ductos con raíces o tramos con pendiente incorrecta.",
    risks: [
      "Olores persistentes que se atribuyen erróneamente a falta de aseo.",
      "Cámaras de inspección con nivel alto, grasa o sedimento acumulado.",
      "Desagües lentos en varios puntos de la propiedad.",
      "Retorno ocasional que anticipa una obstrucción más seria.",
    ],
    steps: [
      "Levantar síntomas visibles y antecedentes entregados por propietario, corredor o administración.",
      "Revisar cámaras, artefactos y puntos de descarga para distinguir síntomas de causas probables.",
      "Evaluar si corresponde destape, hidrojet, mantención preventiva o videoinspección.",
      "Entregar recomendaciones técnicas para tomar una decisión informada.",
    ],
    prevention:
      "Cuando existen señales de alerta, conviene pedir una evaluación sanitaria antes de comprometer compra, arriendo o recepción. Esa revisión puede reducir gastos inesperados y ordenar responsabilidades.",
    extraLinks: [
      { href: "/servicios/destape-camaras-inspeccion", label: "videoinspección sanitaria" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/hidrojet", label: "hidrojet de alta presión" },
      { href: "/servicios/mantencion-preventiva-redes", label: "mantención preventiva de redes" },
    ],
  },
  {
    slug: "videoinspeccion-sanitaria-antes-invertir-propiedad",
    title: "Por qué solicitar videoinspección sanitaria antes de invertir en una propiedad",
    description:
      "Conoce por qué la videoinspección sanitaria ayuda a detectar raíces, fisuras, contrapendientes, colapsos y obstrucciones antes de invertir.",
    h1: "Por qué solicitar videoinspección sanitaria antes de invertir en una propiedad",
    heroSummary:
      "La videoinspección sanitaria permite observar el interior de la red cuando una simple revisión visual no basta para evaluar el riesgo.",
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    keywords: ["videoinspección sanitaria", "invertir en propiedad", "redes sanitarias"],
    serviceName: "análisis técnico de propiedad y redes sanitarias",
    serviceHref: "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    serviceLabel: "análisis técnico con videoinspección sanitaria",
    focus:
      "Cuando una propiedad representa una inversión relevante, la videoinspección sanitaria puede entregar evidencia técnica sobre el estado de ductos, colectores y tramos no visibles.",
    risks: [
      "Invertir sin detectar raíces, fisuras, deformaciones o colapsos parciales.",
      "No identificar contrapendientes o pérdida de capacidad hidráulica.",
      "Asumir que una cámara limpia descarta fallas aguas arriba o aguas abajo.",
      "Descubrir después de la compra que la red requiere reparación o mantención mayor.",
    ],
    steps: [
      "Definir puntos de acceso y tramos que justifican inspección.",
      "Registrar hallazgos relevantes como raíces, fisuras, sedimentos o pérdida de pendiente.",
      "Relacionar la evidencia con posibles acciones: hidrojet, destape, reparación o mantención.",
      "Usar la información técnica como respaldo antes de decidir compra, arriendo o inversión.",
    ],
    prevention:
      "La videoinspección no reemplaza todas las evaluaciones de una propiedad, pero puede ser decisiva cuando hay antecedentes sanitarios dudosos, redes antiguas o inversión de alto impacto.",
    extraLinks: [
      { href: "/servicios/destape-camaras-inspeccion", label: "videoinspección sanitaria" },
      { href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" },
      { href: "/servicios/hidrojet", label: "hidrojet de alta presión" },
      { href: "/servicios/mantencion-preventiva-redes", label: "mantención preventiva de redes" },
    ],
  },
];

const newServiceBlogPosts = newServiceGuideBlueprints.map(createNewServiceGuidePost);
const cmsBlogPosts = getCmsBlogEntries().map(createCmsBlogPost);

const blogPosts: BlogPost[] = Array.from(
  new Map([...baseBlogPosts, ...newServiceBlogPosts, ...blogProblemas, ...cmsBlogPosts].map((post) => [post.slug, post] as const)).values(),
);

const blogMap = new Map(blogPosts.map((post) => [post.slug, post] as const));

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogMap.get(slug);
}

export function getBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostFaq(post: BlogPost): Array<{ question: string; answer: string }> {
  return post.faq?.length ? post.faq : createBlogFaq(post);
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const image = post.image ?? "/images/hero-mantencion.jpg";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: buildCanonicalUrl(`/blog/${post.slug}`),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.description,
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.imageAlt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${siteConfig.name}`,
      description: post.description,
      images: [image],
    },
  };
}
