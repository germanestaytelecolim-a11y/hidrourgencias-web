import type { Metadata } from "next";

import { buildCanonicalUrl, siteConfig } from "@/lib/site-config";

export type ServicioPageData = {
  slug: string;
  navLabel: string;
  h1: string;
  summary: string;
  image: string;
  methodology: string[];
  equipment: string[];
  benefits: string[];
  whenToRequest: string[];
  obstructionTypes: string[];
  ctaMessage: string;
  metadataTitle?: string;
  metadataDescription?: string;
  keywords?: string[];
};

const servicios: ServicioPageData[] = [
  {
    slug: "reparacion-tuberias-hdpe",
    navLabel: "Revision tecnica de tramos HDPE sanitarios",
    h1: "Revision tecnica de tramos HDPE asociados a redes sanitarias",
    summary:
      "Evaluamos tramos HDPE asociados a evacuacion sanitaria, aguas servidas y continuidad operativa para identificar deformaciones, uniones comprometidas, perdida de estanqueidad sanitaria visible o condiciones que requieren accion correctiva especializada.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Levantamiento tecnico del tramo comprometido y condicion sanitaria del sistema.",
      "Revision de accesibilidad, continuidad de evacuacion y sintomas asociados a la red.",
      "Diagnostico visual y operativo para definir si corresponde destape, hidrojet, videoinspeccion o derivacion correctiva.",
      "Informe tecnico de cierre con recomendaciones de continuidad preventiva.",
    ],
    equipment: ["Equipos RIDGID para diagnostico", "Videoinspeccion sanitaria cuando corresponde", "Herramientas de revision tecnica"],
    benefits: ["Criterio sanitario antes de intervenir", "Mejor decision sobre acciones correctivas", "Trazabilidad para administradores y empresas"],
    whenToRequest: ["Red sanitaria HDPE con comportamiento anomalo", "Tramo deformado o fatigado", "Evacuacion irregular", "Reincidencia despues de destapes"],
    obstructionTypes: ["Uniones comprometidas", "Perdida de estanqueidad sanitaria visible", "Deformaciones por sobrecarga", "Fallas de continuidad de evacuacion"],
    ctaMessage: "Necesito revision tecnica de tramos HDPE sanitarios y evaluacion en terreno.",
    metadataTitle: "Revision tecnica de tramos HDPE sanitarios",
    metadataDescription:
      "Evaluacion tecnica de tramos HDPE asociados a redes sanitarias, aguas servidas y continuidad de evacuacion en la Region de Valparaiso.",
  },
  {
    slug: "motobombas-extraccion-aguas",
    navLabel: "Motobombas para extraccion de aguas",
    h1: "Motobombas para extraccion de aguas y control de inundaciones",
    summary:
      "Activamos equipos de motobomba para extraccion rapida de aguas acumuladas en subterraneos, patios, salas tecnicas y recintos con riesgo de dano operativo por inundacion.",
    image: "/images/hero-motobomba.jpg",
    methodology: [
      "Evaluacion del volumen de agua y nivel de riesgo para infraestructura y personas.",
      "Implementacion de motobombas con trazado seguro de descarga.",
      "Control continuo de extraccion y monitoreo de estabilidad del sector.",
      "Cierre tecnico con recomendaciones para evitar nuevos eventos.",
    ],
    equipment: ["Motobombas de alto caudal", "Mangueras de descarga reforzadas", "Equipamiento de apoyo para contencion"],
    benefits: ["Reduccion de dano por anegamiento", "Recuperacion mas rapida del area afectada", "Soporte para emergencias sanitarias severas"],
    whenToRequest: ["Inundacion en subterraneo", "Aguas servidas acumuladas", "Patios o salas tecnicas anegadas", "Rebalse fuera de control"],
    obstructionTypes: ["Inundacion por rebalse", "Acumulacion por drenaje insuficiente", "Aniego en salas tecnicas", "Colapso parcial de evacuacion"],
    ctaMessage: "Necesito motobombas para extraccion de aguas con atencion inmediata.",
  },
  {
    slug: "destape-alcantarillado",
    navLabel: "Destape de alcantarillado y desagues",
    h1: "Destape de alcantarillado y desagues con respuesta 24/7",
    summary:
      "Atendemos obstrucciones en redes domiciliarias, verticales, horizontales y colectores con protocolo tecnico de diagnostico, contencion sanitaria y restitucion de flujo para evitar rebalses reiterativos.",
    image: "/images/hero-urgencia.jpg",
    methodology: [
      "Triage operativo del caso y levantamiento de sintomas criticos.",
      "Diagnostico de causa raiz en terreno para evitar soluciones parciales.",
      "Destape mecanico o hidrojet segun condicion de la red.",
      "Validacion de flujo final y plan de continuidad preventiva.",
    ],
    equipment: ["RIDGID K-1500A", "RIDGID K-50", "Hidrojet RIDGID KJ-3100", "Videoinspeccion RIDGID"],
    benefits: ["Respuesta 24/7", "Menor reincidencia", "Control de rebalse y retorno sanitario"],
    whenToRequest: ["Retorno por WC", "Camara saturada", "Desague lento en varios puntos", "Rebalse de aguas servidas"],
    obstructionTypes: ["Acumulacion de grasas", "Sedimentos adheridos", "Residuos solidos", "Colapsos en puntos criticos"],
    ctaMessage: "Necesito destape de alcantarillado y desagues con urgencia 24/7.",
  },
  {
    slug: "destape-artefactos-sanitarios",
    navLabel: "Destape de artefactos sanitarios",
    h1: "Destape de artefactos sanitarios: WC, lavamanos y lavaplatos",
    summary:
      "Resolvemos obstrucciones en artefactos sanitarios con maniobras tecnicas seguras para recuperar flujo normal y evitar rebalses que afecten habitabilidad o continuidad comercial.",
    image: "/images/servicios/default (1).jpg",
    methodology: [
      "Evaluacion de artefacto comprometido y tipo de bloqueo.",
      "Destape con equipos adecuados segun material y severidad.",
      "Comprobacion de descarga estable y limpieza tecnica del sector.",
      "Recomendaciones de uso para disminuir reincidencia.",
    ],
    equipment: ["RIDGID K-50", "Herramientas de precision", "Aspiradoras de apoyo"],
    benefits: ["Recuperacion rapida del artefacto", "Menor riesgo de dano por intervencion incorrecta", "Recomendaciones de uso preventivo"],
    whenToRequest: ["WC tapado", "Lavamanos lento", "Lavaplatos con retorno", "Urinario o ducha con mal olor"],
    obstructionTypes: ["Bloqueo de WC", "Obstruccion en lavamanos", "Retorno en lavaplatos", "Drenaje lento en inodoros"],
    ctaMessage: "Necesito destape de artefactos sanitarios con respuesta inmediata.",
  },
  {
    slug: "destape-camaras-inspeccion",
    navLabel: "Destape de camaras de inspeccion",
    h1: "Destape de camaras de inspeccion y alcantarillado",
    summary:
      "Intervenimos camaras de inspeccion colapsadas por sedimentos, grasas o residuos solidos, restableciendo continuidad de evacuacion y reduciendo riesgo de rebalse en comunidades y empresas.",
    image: "/images/servicios/default (2).jpg",
    methodology: [
      "Inspeccion inicial de camara y trazado asociado.",
      "Destape y limpieza profunda con hidrojet cuando corresponde.",
      "Control de evacuacion y verificacion de estabilidad del sistema.",
      "Informe tecnico con acciones preventivas por punto critico.",
    ],
    equipment: ["RIDGID K-1500A", "Hidrojet de alta presion", "Herramientas de extraccion", "Videoinspeccion RIDGID"],
    benefits: ["Recuperacion de capacidad de camara", "Reduccion de rebalses", "Mejor lectura de puntos criticos"],
    whenToRequest: ["Camara con nivel alto", "Grasa visible", "Aguas servidas expuestas", "Rebalse en patio o sala tecnica"],
    obstructionTypes: ["Acumulacion de sedimentos", "Bloqueo por residuos solidos", "Colapso por grasas", "Estancamiento en camaras comunitarias"],
    ctaMessage: "Necesito destape de camaras de inspeccion con diagnostico tecnico.",
  },
  {
    slug: "hidrojet",
    navLabel: "Hidrojet de alta presion",
    h1: "Servicio de hidrojet para limpieza profunda de redes sanitarias",
    summary:
      "Aplicamos hidrojet de alta presion para remover grasa, sarro, sedimentos y residuos adheridos en tuberias, camaras y colectores con perdida de capacidad hidraulica.",
    image: "/images/hero-hidrojet.jpg",
    methodology: [
      "Evaluacion del tramo y factibilidad de acceso seguro.",
      "Seleccion de presion y boquilla segun residuo predominante.",
      "Limpieza hidrodinamica controlada hasta recuperar seccion util.",
      "Prueba de descarga y recomendacion de frecuencia preventiva.",
    ],
    equipment: ["Hidrojet RIDGID KJ-3100", "Boquillas de limpieza", "Videoinspeccion RIDGID"],
    benefits: ["Remueve adherencias profundas", "Mejora capacidad de evacuacion", "Ideal para mantencion preventiva"],
    whenToRequest: ["Grasa en redes", "Sarro y sedimento", "Obstrucciones recurrentes", "Mantenimiento de edificios o comercio"],
    obstructionTypes: ["Grasa compactada", "Sarro adherido", "Sedimentos en colectores", "Perdida de capacidad hidraulica"],
    ctaMessage: "Necesito servicio hidrojet para limpiar una red sanitaria.",
  },
  {
    slug: "destape-verticales",
    navLabel: "Destape de verticales",
    h1: "Destape de verticales sanitarias en edificios y comunidades",
    summary:
      "Atendemos obstrucciones en bajadas sanitarias, ductos verticales y redes de edificios con diagnostico por pisos, control de descarga y equipos RIDGID.",
    image: "/images/servicios/default (3).jpg",
    methodology: [
      "Levantamiento de pisos o artefactos afectados.",
      "Identificacion de tramo vertical comprometido.",
      "Destape mecanico con RIDGID y apoyo hidrojet cuando es factible.",
      "Pruebas de descarga por niveles y recomendaciones a administracion.",
    ],
    equipment: ["RIDGID K-50", "RIDGID K-1500A", "Hidrojet segun factibilidad", "Videoinspeccion RIDGID"],
    benefits: ["Reduce retorno en pisos bajos", "Ordena la respuesta en edificios", "Permite pautas preventivas por vertical"],
    whenToRequest: ["Retorno simultaneo", "Olor en shaft", "Bajadas lentas", "Rebalse en pisos inferiores"],
    obstructionTypes: ["Vertical saturada", "Residuos en bajada sanitaria", "Retorno por carga simultanea", "Obstruccion en ducto"],
    ctaMessage: "Necesito destape de verticales sanitarias en edificio.",
  },
  {
    slug: "destape-horizontales",
    navLabel: "Destape de horizontales",
    h1: "Destape de horizontales y colectores entre camaras",
    summary:
      "Restituimos flujo en redes horizontales, tramos entre camaras y colectores principales usando RIDGID K-1500A, hidrojet y prueba hidraulica posterior.",
    image: "/images/servicios/default (4).jpg",
    methodology: [
      "Apertura y evaluacion de camaras de inspeccion.",
      "Identificacion del tramo horizontal con perdida de flujo.",
      "Destape mecanico o hidrojet segun sedimento y diametro.",
      "Prueba hidraulica, limpieza de camara y cierre preventivo.",
    ],
    equipment: ["RIDGID K-1500A", "Hidrojet RIDGID KJ-3100", "Videoinspeccion RIDGID"],
    benefits: ["Recupera colectores criticos", "Reduce rebalses por pendiente o sedimento", "Soporta redes de mayor diametro"],
    whenToRequest: ["Camaras con nivel alto", "Rebalse aguas abajo", "Colector con sedimentos", "Tramo entre camaras sin flujo"],
    obstructionTypes: ["Sedimentos compactados", "Residuos solidos", "Raices", "Perdida de seccion hidraulica"],
    ctaMessage: "Necesito destape de horizontales y colectores entre camaras.",
  },
  {
    slug: "destape-edificios",
    navLabel: "Destape de edificios",
    h1: "Destape de edificios, comunidades y redes sanitarias compartidas",
    summary:
      "Servicio especializado para comunidades, edificios, salas de basura, camaras y colectores con continuidad operativa, trazabilidad y respuesta 24/7.",
    image: "/images/hero-urgencia.jpg",
    methodology: [
      "Coordinacion con administracion y levantamiento de zonas afectadas.",
      "Diagnostico de verticales, horizontales, camaras y salas tecnicas.",
      "Desobstruccion con RIDGID, hidrojet, motobombas o videoinspeccion segun caso.",
      "Cierre con pauta preventiva y recomendaciones de comunicacion interna.",
    ],
    equipment: ["RIDGID K-1500A", "RIDGID K-50", "Hidrojet RIDGID KJ-3100", "Motobombas", "Videoinspeccion RIDGID"],
    benefits: ["Menos reclamos de residentes", "Continuidad para areas comunes", "Documentacion util para comites"],
    whenToRequest: ["Rebalse en sala de basura", "Retorno en varios departamentos", "Camara comunitaria saturada", "Emergencia nocturna"],
    obstructionTypes: ["Verticales saturadas", "Camaras comunitarias", "Colectores horizontales", "Rebalse por alta carga"],
    ctaMessage: "Necesito destape sanitario para edificio o comunidad.",
  },
  {
    slug: "mantencion-preventiva-redes",
    navLabel: "Mantencion preventiva de redes",
    h1: "Mantencion preventiva de redes sanitarias para evitar rebalses",
    summary:
      "Disenamos planes de limpieza programada, hidrojet y videoinspeccion para prevenir rebalses, sostener continuidad operativa y reducir urgencias repetidas.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Mapeo de puntos criticos y frecuencia de uso del inmueble.",
      "Definicion de calendario de limpieza, hidrojet o inspeccion.",
      "Ejecucion documentada por visita y validacion de flujo.",
      "Ajuste de frecuencia segun hallazgos y eventos del periodo.",
    ],
    equipment: ["Hidrojet RIDGID KJ-3100", "Videoinspeccion RIDGID", "RIDGID K-1500A"],
    benefits: ["Menos urgencias", "Mayor control de presupuesto", "Mejor continuidad para edificios y empresas"],
    whenToRequest: ["Eventos repetidos", "Camaras con grasa", "Edificio de alto uso", "Comercio con cocinas o banos exigidos"],
    obstructionTypes: ["Grasa recurrente", "Sedimentos por falta de limpieza", "Perdida de capacidad", "Puntos criticos sin trazabilidad"],
    ctaMessage: "Necesito implementar mantencion preventiva de redes sanitarias.",
  },
  {
    slug: "limpieza-higienizacion-sanitizacion",
    navLabel: "Limpieza, higienización y sanitización",
    h1: "Limpieza, higienización y sanitización para particulares, empresas y comercio",
    summary:
      "Servicio especializado de limpieza, higienización y sanitización para particulares, empresas, locales comerciales, comunidades, oficinas, establecimientos privados y espacios con exposición a residuos orgánicos, malos olores o contaminación sanitaria.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Evaluación del sector afectado, tipo de residuo, exposición sanitaria y condiciones de seguridad.",
      "Retiro, limpieza e higienización de superficies expuestas a aguas servidas, residuos orgánicos o malos olores.",
      "Aplicación de procedimientos de sanitización preventiva o correctiva según el nivel de contaminación.",
      "Recomendaciones de ventilación, control de olores y prevención de recurrencia para el cliente.",
    ],
    equipment: ["Equipos de limpieza sanitaria", "Insumos de higienización", "Elementos de protección personal", "Apoyo hidrojet cuando corresponde"],
    benefits: [
      "Recupera condiciones de higiene y uso",
      "Reduce malos olores y exposición sanitaria",
      "Aplica para domicilios, empresas y comercio",
    ],
    whenToRequest: [
      "Rebalse de alcantarillado",
      "Aguas servidas en baños o salas de basura",
      "Malos olores persistentes",
      "Limpieza post emergencia sanitaria",
      "Locales comerciales, cocinas, bodegas u oficinas afectadas",
    ],
    obstructionTypes: [
      "Sectores afectados por aguas servidas",
      "Baños, cocinas y salas de basura",
      "Domicilios particulares",
      "Restaurantes y locales comerciales",
      "Comunidades, edificios, oficinas y bodegas",
      "Zonas con residuos orgánicos o contaminación sanitaria",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza, higienización y sanitización de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes del sector afectado.",
    metadataTitle: "Limpieza, higienización y sanitización",
    metadataDescription:
      "Servicio de limpieza, higienización y sanitización para particulares, empresas, comercio, comunidades y espacios afectados por aguas servidas, malos olores o contaminación sanitaria.",
    keywords: [
      "limpieza sanitaria",
      "higienización",
      "sanitización",
      "aguas servidas",
      "malos olores",
      "rebalse de alcantarillado",
      "limpieza post emergencia sanitaria",
      "sanitización Viña del Mar",
      "sanitización Valparaíso",
      "sanitización Quilpué",
      "sanitización Villa Alemana",
    ],
  },
  {
    slug: "limpieza-domicilios-recuperacion-espacios",
    navLabel: "Limpieza de domicilios y recuperación de espacios",
    h1: "Limpieza de domicilios y recuperación de espacios afectados",
    summary:
      "Servicio técnico de limpieza para domicilios, departamentos, bodegas y espacios afectados por acumulación, humedad, malos olores, residuos o eventos sanitarios. El objetivo es recuperar condiciones de uso, higiene y seguridad sin intervenir la estructura comercial o estética del inmueble.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Evaluación inicial del espacio, nivel de acumulación, presencia de humedad, residuos y condiciones de ventilación.",
      "Definición de zonas de trabajo, prioridades de retiro, limpieza y recuperación según riesgo sanitario.",
      "Limpieza técnica de superficies, control de olores y retiro ordenado de residuos compatibles con el alcance del servicio.",
      "Recomendaciones de mantenimiento, ventilación y prevención para conservar el espacio recuperado.",
    ],
    equipment: [
      "Equipos de limpieza sanitaria",
      "Herramientas de retiro y apoyo operativo",
      "Insumos de higienización",
      "Elementos de protección personal",
    ],
    benefits: [
      "Recupera habitabilidad y condiciones de uso",
      "Ordena espacios afectados por acumulación o malos olores",
      "Apoya a familias, administradores y responsables de propiedad",
    ],
    whenToRequest: [
      "Domicilios con acumulación de residuos o humedad",
      "Espacios afectados por rebalse sanitario",
      "Bodegas, patios o habitaciones con malos olores",
      "Recuperación previa a arriendo, venta o uso regular",
    ],
    obstructionTypes: [
      "Acumulación de residuos domiciliarios",
      "Humedad y olores persistentes",
      "Superficies afectadas por aguas servidas",
      "Espacios con pérdida de uso por falta de limpieza técnica",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de domicilios y recuperación de espacios de Hidrourgencias SpA. Indico comuna, tipo de espacio y antecedentes del caso.",
    metadataTitle: "Limpieza de domicilios y recuperación de espacios",
    metadataDescription:
      "Limpieza técnica de domicilios y recuperación de espacios afectados por acumulación, malos olores, humedad o eventos sanitarios en la Región de Valparaíso.",
    keywords: [
      "limpieza de domicilios",
      "recuperación de espacios",
      "limpieza post emergencia sanitaria",
      "malos olores",
      "limpieza sanitaria Valparaíso",
    ],
  },
  {
    slug: "limpieza-fachadas-hidrolavado-superficies",
    navLabel: "Limpieza de fachadas e hidrolavado",
    h1: "Limpieza de fachadas e hidrolavado de superficies",
    summary:
      "Servicio de hidrolavado para fachadas, muros, accesos, pisos, patios y superficies exteriores con presión ajustada según material, nivel de suciedad y condición de adherencias.",
    image: "/images/hero-hidrojet.jpg",
    methodology: [
      "Evaluación del material, acceso, pendiente, drenaje y nivel de adherencia sobre la superficie.",
      "Selección de presión, boquilla y secuencia de limpieza para evitar daños por aplicación incorrecta.",
      "Hidrolavado por paños o sectores con control de escurrimiento y seguridad del área.",
      "Revisión final de superficie y recomendaciones de frecuencia preventiva.",
    ],
    equipment: ["Hidrojet de alta presión", "Boquillas de limpieza", "Mangueras reforzadas", "Elementos de seguridad en terreno"],
    benefits: [
      "Mejora presentación de fachadas y accesos",
      "Remueve suciedad adherida con criterio técnico",
      "Ayuda a prevenir acumulación de grasa, barro y residuos",
    ],
    whenToRequest: [
      "Fachadas con suciedad adherida",
      "Pisos exteriores con grasa o barro",
      "Accesos comerciales o comunitarios con alto tránsito",
      "Superficies que requieren limpieza profunda sin obra civil",
    ],
    obstructionTypes: [
      "Suciedad adherida en muros",
      "Grasa o barro en pisos",
      "Manchas por escurrimiento",
      "Acumulación de residuos en accesos y patios",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de limpieza de fachadas e hidrolavado de superficies de Hidrourgencias SpA. Indico comuna, tipo de superficie y extensión aproximada.",
    metadataTitle: "Limpieza de fachadas e hidrolavado de superficies",
    metadataDescription:
      "Hidrolavado y limpieza de fachadas, muros, pisos, patios y superficies exteriores para domicilios, comercio, comunidades y empresas.",
    keywords: [
      "limpieza de fachadas",
      "hidrolavado de superficies",
      "hidrolavado fachadas",
      "limpieza de patios",
      "hidrolavado Valparaíso",
    ],
  },
  {
    slug: "extraccion-aguas-estanques-piscinas",
    navLabel: "Extracción de aguas en estanques y piscinas",
    h1: "Extracción de aguas en estanques, piscinas y espacios anegados",
    summary:
      "Extraemos aguas acumuladas en estanques, piscinas, patios, subterráneos, salas técnicas y recintos anegados mediante motobombas, evaluación de descarga y control del área afectada.",
    image: "/images/hero-motobomba.jpg",
    methodology: [
      "Evaluación del tipo de agua, volumen aproximado, accesos y punto seguro de descarga.",
      "Instalación de motobombas y mangueras de descarga según caudal requerido.",
      "Extracción controlada con monitoreo del nivel de agua y estabilidad del entorno.",
      "Cierre con recomendaciones para drenaje, mantención o prevención de nuevos anegamientos.",
    ],
    equipment: ["Motobombas de alto caudal", "Mangueras de descarga", "Equipamiento de contención", "Herramientas de apoyo operativo"],
    benefits: [
      "Reduce daño por anegamiento",
      "Permite recuperar uso del área afectada",
      "Aplica para estanques, piscinas, subterráneos y patios",
    ],
    whenToRequest: [
      "Piscinas o estanques que requieren vaciado",
      "Subterráneos o patios anegados",
      "Agua acumulada por lluvia, filtración o rebalse",
      "Salas técnicas con riesgo de daño operativo",
    ],
    obstructionTypes: [
      "Agua acumulada sin evacuación",
      "Anegamiento por rebalse o lluvia",
      "Estanques o piscinas con necesidad de vaciado",
      "Espacios con drenaje insuficiente",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de extracción de aguas en estanques, piscinas o espacios anegados de Hidrourgencias SpA. Indico comuna, tipo de agua y volumen aproximado.",
    metadataTitle: "Extracción de aguas en estanques, piscinas y espacios anegados",
    metadataDescription:
      "Servicio de extracción de aguas con motobombas para estanques, piscinas, patios, subterráneos y espacios anegados en la Región de Valparaíso.",
    keywords: [
      "extracción de aguas",
      "vaciado de piscinas",
      "extracción de agua con motobomba",
      "espacios anegados",
      "motobombas Valparaíso",
    ],
  },
  {
    slug: "asesoria-mantenimiento-integral-redes-sanitarias",
    navLabel: "Asesoría en mantenimiento integral",
    h1: "Asesoría en mantenimiento integral de redes sanitarias",
    summary:
      "Asesoramos a administradores, comunidades, empresas y responsables de inmuebles en diagnóstico, priorización y planificación de mantenimiento integral de redes sanitarias para reducir urgencias repetitivas.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Levantamiento de antecedentes, historial de fallas, puntos críticos y uso del inmueble.",
      "Evaluación técnica de riesgos por red vertical, horizontal, cámaras, artefactos y drenajes.",
      "Priorización de acciones correctivas, preventivas y de monitoreo según criticidad.",
      "Entrega de pauta de mantenimiento, frecuencia sugerida y recomendaciones de continuidad operativa.",
    ],
    equipment: [
      "Criterio técnico sanitario",
      "Videoinspección cuando corresponde",
      "Revisión de cámaras y puntos críticos",
      "Planificación de mantención preventiva",
    ],
    benefits: [
      "Ordena decisiones técnicas y presupuestarias",
      "Reduce reincidencia de urgencias sanitarias",
      "Entrega una hoja de ruta para edificios, empresas y comunidades",
    ],
    whenToRequest: [
      "Fallas sanitarias recurrentes",
      "Edificios sin plan preventivo claro",
      "Comunidades que necesitan priorizar inversiones",
      "Empresas que requieren continuidad operativa sanitaria",
    ],
    obstructionTypes: [
      "Redes sin trazabilidad de mantención",
      "Puntos críticos con eventos repetidos",
      "Cámaras o colectores sin frecuencia definida",
      "Decisiones correctivas sin diagnóstico integral",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de asesoría en mantenimiento integral de redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y objetivo de la asesoría.",
    metadataTitle: "Asesoría en mantenimiento integral de redes sanitarias",
    metadataDescription:
      "Asesoría técnica para planificar mantenimiento integral de redes sanitarias en edificios, empresas, comunidades y recintos de alto uso.",
    keywords: [
      "asesoría mantenimiento sanitario",
      "mantenimiento integral redes sanitarias",
      "mantención preventiva alcantarillado",
      "plan de mantenimiento sanitario",
      "redes sanitarias edificios",
    ],
  },
  {
    slug: "analisis-tecnico-propiedad-redes-sanitarias",
    navLabel: "Análisis técnico de propiedad y redes sanitarias",
    h1: "Análisis técnico de propiedad y redes sanitarias",
    summary:
      "Hidrourgencias SpA realiza análisis técnico de redes sanitarias en propiedades residenciales, comerciales, edificios, locales, oficinas y comunidades para detectar oportunamente condiciones ocultas que puedan transformarse en gastos imprevistos antes de comprar, arrendar, vender, recibir o evaluar una propiedad.",
    image: "/images/hero-mantencion.jpg",
    methodology: [
      "Levantamiento de antecedentes de la propiedad, tipo de uso, puntos sanitarios y motivo de la evaluación.",
      "Revisión técnica de cámaras, desagües, artefactos, olores, retorno de aguas servidas y síntomas operativos visibles.",
      "Pruebas operativas de descarga y evaluación de continuidad hidráulica en puntos críticos de la red.",
      "Videoinspección sanitaria cuando corresponde para detectar raíces, fisuras, colapsos, deformaciones o pérdida de pendiente.",
      "Recomendación técnica de acciones preventivas, destape, hidrojet, reparación o mantención según hallazgos.",
    ],
    equipment: [
      "Criterio técnico sanitario",
      "Videoinspección sanitaria cuando corresponde",
      "Revisión de cámaras de inspección",
      "Pruebas operativas de desagües",
      "Equipos RIDGID de apoyo diagnóstico",
    ],
    benefits: [
      "Permite tomar decisiones con respaldo técnico antes de comprar o arrendar",
      "Ayuda a detectar vicios ocultos sanitarios y gastos imprevistos",
      "Orienta acciones preventivas antes de asumir responsabilidad económica",
      "Aplica para viviendas, oficinas, locales, comunidades y edificios",
    ],
    whenToRequest: [
      "Antes de comprar una vivienda o local comercial",
      "Antes de arrendar una propiedad de alto uso sanitario",
      "Antes de recibir una propiedad nueva o usada",
      "Cuando existen malos olores, desagües lentos o antecedentes sanitarios dudosos",
      "Cuando un inversionista, corredor o administrador necesita respaldo técnico previo",
    ],
    obstructionTypes: [
      "Obstrucciones parciales",
      "Desagües lentos",
      "Cámaras de inspección saturadas",
      "Retorno de aguas servidas",
      "Raíces en la red",
      "Tuberías fisuradas o deformadas",
      "Pérdida de pendiente y contrapendientes",
      "Conexiones deficientes",
      "Redes sin mantención",
      "Riesgo de rebalse sanitario",
      "Malos olores asociados a red sanitaria",
      "Condiciones que podrían requerir hidrojet, destape, reparación o mantenimiento preventivo",
    ],
    ctaMessage:
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    metadataTitle: "Análisis técnico de propiedad y redes sanitarias",
    metadataDescription:
      "Servicio de inspección técnica para detectar vicios ocultos en redes de alcantarillado y desagües antes de comprar, arrendar o recibir una propiedad.",
    keywords: [
      "análisis técnico de propiedad",
      "vicios ocultos sanitarios",
      "inspección sanitaria preventiva",
      "videoinspección sanitaria",
      "redes sanitarias propiedad",
      "alcantarillado antes de comprar propiedad",
      "desagües lentos",
      "cámaras de inspección",
    ],
  },
];

const servicioMap = new Map(servicios.map((item) => [item.slug, item] as const));

export function getAllServicios() {
  return servicios;
}

export function getServicioBySlug(slug: string) {
  return servicioMap.get(slug);
}

export function getServicioSlugs() {
  return servicios.map((item) => item.slug);
}

export function buildServicioMetadata(servicio: ServicioPageData): Metadata {
  const title = servicio.metadataTitle ?? `${servicio.h1} | Hidrourgencias`;
  const description =
    servicio.metadataDescription ?? `${servicio.summary} Atención 24/7 en la Región de Valparaíso.`;
  const canonicalPath = `/servicios/${servicio.slug}`;
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  return {
    title,
    description,
    keywords: servicio.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: servicio.image,
          width: 1200,
          height: 630,
          alt: servicio.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [servicio.image],
    },
  };
}
