import { createWhatsAppUrl } from "@/lib/site-config";

export type CasoExito = {
  servicio: string;
  titulo: string;
  problema: string;
  procedimiento: string;
  resultado: string;
  recomendacion: string;
  ctaLabel: string;
  ctaHref: string;
};

function casoWhatsApp(servicio: string) {
  return createWhatsAppUrl(
    `Hola, necesito orientación por un caso similar relacionado con ${servicio} de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes del problema.`,
  );
}

export const casosExito: CasoExito[] = [
  {
    servicio: "Destape de alcantarillado y desagües",
    titulo: "Caso referencial de red con rebalse y retorno sanitario",
    problema: "Una red presenta descarga lenta en varios puntos, cámara con nivel alto y riesgo de rebalse hacia zonas de uso frecuente.",
    procedimiento: "Se prioriza contención, revisión de cámaras, destape técnico y prueba de flujo para confirmar continuidad de evacuación.",
    resultado: "El sistema recupera capacidad operativa y queda con recomendación preventiva para disminuir reincidencias.",
    recomendacion: "Solicitar evaluación apenas aparezcan malos olores, retorno o descarga lenta en más de un punto.",
    ctaLabel: "Consultar destape",
    ctaHref: casoWhatsApp("destape de alcantarillado y desagües"),
  },
  {
    servicio: "Hidrojet de alta presión",
    titulo: "Caso referencial de red con grasa y sedimento adherido",
    problema: "Un tramo mantiene obstrucciones recurrentes por acumulación de grasa, sarro o sedimentos que reducen la sección útil.",
    procedimiento: "Se evalúa acceso, se selecciona presión y boquilla, y se ejecuta limpieza hidrodinámica con validación de descarga.",
    resultado: "La red mejora su capacidad hidráulica y queda con pauta de frecuencia preventiva según carga de uso.",
    recomendacion: "Usar hidrojet cuando el problema no es solo un bloqueo puntual, sino acumulación interna persistente.",
    ctaLabel: "Consultar hidrojet",
    ctaHref: casoWhatsApp("hidrojet de alta presión"),
  },
  {
    servicio: "Destape de edificios",
    titulo: "Caso referencial de comunidad con red sanitaria compartida",
    problema: "Una comunidad experimenta retorno en zonas comunes o unidades, con necesidad de coordinar intervención sin afectar toda la operación.",
    procedimiento: "Se ordena diagnóstico por cámaras, verticales y horizontales; luego se ejecuta destape con comunicación operativa a administración.",
    resultado: "La red compartida recupera continuidad y se entrega criterio preventivo para puntos críticos.",
    recomendacion: "Registrar sectores afectados y horarios de mayor carga antes de solicitar la intervención.",
    ctaLabel: "Consultar edificio",
    ctaHref: casoWhatsApp("destape de edificios"),
  },
  {
    servicio: "Mantención preventiva de redes",
    titulo: "Caso referencial de inmueble con urgencias repetidas",
    problema: "Un edificio o empresa repite contingencias sanitarias por falta de calendario, trazabilidad y limpieza técnica periódica.",
    procedimiento: "Se levantan puntos críticos, frecuencia de uso y antecedentes para definir plan de mantención con tareas verificables.",
    resultado: "La administración obtiene un esquema preventivo para bajar urgencias y ordenar presupuesto de mantenimiento.",
    recomendacion: "Programar mantención antes de temporadas de alta carga o cuando ya existe historial de rebalses.",
    ctaLabel: "Consultar mantención",
    ctaHref: casoWhatsApp("mantención preventiva de redes sanitarias"),
  },
  {
    servicio: "Destape de verticales",
    titulo: "Caso referencial de bajada sanitaria con retorno por pisos",
    problema: "Una vertical sanitaria presenta retorno o descarga lenta en niveles específicos, especialmente en horarios de alta demanda.",
    procedimiento: "Se identifican pisos afectados, tramo probable y acceso técnico para destape con pruebas de descarga posteriores.",
    resultado: "La bajada recupera flujo y se recomienda seguimiento para evitar nuevos eventos en pisos inferiores.",
    recomendacion: "No intervenir solo el artefacto si el síntoma se repite en varios departamentos o niveles.",
    ctaLabel: "Consultar vertical",
    ctaHref: casoWhatsApp("destape de verticales sanitarias"),
  },
  {
    servicio: "Motobombas para extracción de aguas",
    titulo: "Caso referencial de espacio anegado con riesgo operativo",
    problema: "Un patio, subterráneo o sala técnica acumula agua y amenaza equipos, circulación o continuidad de uso.",
    procedimiento: "Se estima volumen, se define descarga segura y se instalan motobombas con monitoreo de nivel.",
    resultado: "El sector reduce nivel de agua y queda disponible para limpieza, revisión o acciones correctivas posteriores.",
    recomendacion: "Informar tipo de agua, profundidad aproximada y punto posible de descarga antes de coordinar salida.",
    ctaLabel: "Consultar extracción",
    ctaHref: casoWhatsApp("motobombas para extracción de aguas"),
  },
  {
    servicio: "Revisión técnica de tramos HDPE sanitarios",
    titulo: "Caso referencial de tramo HDPE con pérdida de continuidad sanitaria",
    problema: "Un tramo HDPE evidencia deformación, unión comprometida o pérdida de estanqueidad sanitaria visible que afecta continuidad de evacuación.",
    procedimiento: "Se revisa condición del tramo, accesibilidad, síntomas asociados y factibilidad de diagnóstico complementario con verificación posterior.",
    resultado: "La red queda con criterio técnico documentado y recomendaciones para definir acciones correctivas especializadas.",
    recomendacion: "Evitar intervenciones improvisadas cuando la red sostiene evacuación sanitaria o continuidad crítica.",
    ctaLabel: "Consultar revisión técnica",
    ctaHref: casoWhatsApp("revisión técnica de tramos HDPE sanitarios"),
  },
  {
    servicio: "Destape de cámaras de inspección",
    titulo: "Caso referencial de cámara saturada por sedimentos o grasas",
    problema: "Una cámara presenta nivel alto, residuos visibles o estancamiento que puede derivar en rebalse sanitario.",
    procedimiento: "Se abre, evalúa y limpia la cámara; si corresponde, se apoya con hidrojet o videoinspección del tramo asociado.",
    resultado: "La cámara recupera lectura operacional y permite identificar si existe un tramo crítico adicional.",
    recomendacion: "Revisar cámaras cuando hay olor persistente, nivel alto o retorno en puntos cercanos.",
    ctaLabel: "Consultar cámara",
    ctaHref: casoWhatsApp("destape de cámaras de inspección"),
  },
  {
    servicio: "Destape de artefactos sanitarios",
    titulo: "Caso referencial de WC, lavamanos o lavaplatos obstruido",
    problema: "Un artefacto descarga lento, retorna agua o deja fuera de uso un baño, cocina o punto sanitario clave.",
    procedimiento: "Se evalúa si el bloqueo es puntual o parte de una red mayor, se ejecuta destape y se prueba descarga final.",
    resultado: "El artefacto recupera uso normal y el cliente recibe recomendaciones para disminuir nuevas obstrucciones.",
    recomendacion: "Pedir soporte técnico si el problema reaparece o afecta más de un artefacto.",
    ctaLabel: "Consultar artefacto",
    ctaHref: casoWhatsApp("destape de artefactos sanitarios"),
  },
  {
    servicio: "Destape de horizontales",
    titulo: "Caso referencial de colector horizontal con pérdida de flujo",
    problema: "Un tramo entre cámaras presenta nivel alto aguas arriba, sedimentos o obstrucción que limita evacuación.",
    procedimiento: "Se identifica tramo comprometido, se define técnica mecánica o hidrojet, y se valida flujo por prueba hidráulica.",
    resultado: "El colector recupera continuidad y queda con recomendación de monitoreo o limpieza programada.",
    recomendacion: "Intervenir el tramo completo cuando la obstrucción aparece entre cámaras, no solo el punto visible.",
    ctaLabel: "Consultar horizontal",
    ctaHref: casoWhatsApp("destape de horizontales"),
  },
  {
    servicio: "Videoinspección sanitaria",
    titulo: "Caso referencial de obstrucción recurrente sin causa visible",
    problema: "La red se tapa de manera repetida, pero no existe claridad sobre fisuras, contrapendientes, raíces o colapso parcial.",
    procedimiento: "Se realiza inspección con cámara para registrar el tramo y orientar la decisión técnica correcta.",
    resultado: "El cliente obtiene evidencia para definir si corresponde destape, hidrojet, reparación o plan preventivo.",
    recomendacion: "Usar videoinspección cuando ya hubo intervenciones y el síntoma vuelve sin causa clara.",
    ctaLabel: "Consultar inspección",
    ctaHref: casoWhatsApp("videoinspección sanitaria"),
  },
  {
    servicio: "Limpieza, higienización y sanitización",
    titulo: "Caso referencial de espacio afectado por aguas servidas u olores",
    problema: "Un sector queda expuesto a residuos, humedad o malos olores después de una contingencia sanitaria.",
    procedimiento: "Se evalúa exposición, se limpia el área afectada y se aplican medidas de higienización o sanitización según riesgo.",
    resultado: "El espacio recupera mejores condiciones de uso y se entregan recomendaciones de ventilación y prevención.",
    recomendacion: "No limitar el trabajo al destape si hubo aguas servidas o residuos sobre superficies habitables.",
    ctaLabel: "Consultar sanitización",
    ctaHref: casoWhatsApp("limpieza, higienización y sanitización"),
  },
  {
    servicio: "Limpieza de domicilios y recuperación de espacios",
    titulo: "Caso referencial de domicilio con pérdida de habitabilidad",
    problema: "Una habitación, bodega o vivienda requiere limpieza técnica por acumulación, humedad, residuos o malos olores.",
    procedimiento: "Se definen zonas, prioridades y retiro ordenado; luego se realiza limpieza e higienización del espacio.",
    resultado: "El área queda en mejores condiciones de uso y con una pauta básica de mantención posterior.",
    recomendacion: "Describir tipo de espacio, accesos y nivel de acumulación para dimensionar el servicio.",
    ctaLabel: "Consultar limpieza",
    ctaHref: casoWhatsApp("limpieza de domicilios y recuperación de espacios"),
  },
  {
    servicio: "Limpieza de fachadas e hidrolavado de superficies",
    titulo: "Caso referencial de fachada o acceso con suciedad adherida",
    problema: "Una superficie exterior acumula barro, grasa, polvo o manchas por escurrimiento que afectan presentación y seguridad.",
    procedimiento: "Se evalúa material y se aplica hidrolavado por sectores con presión adecuada y control de escurrimiento.",
    resultado: "La superficie mejora su condición visible y queda con recomendación de frecuencia según exposición.",
    recomendacion: "Informar material, altura, acceso y extensión aproximada antes de solicitar el servicio.",
    ctaLabel: "Consultar hidrolavado",
    ctaHref: casoWhatsApp("limpieza de fachadas e hidrolavado de superficies"),
  },
  {
    servicio: "Extracción de aguas en estanques, piscinas y espacios anegados",
    titulo: "Caso referencial de estanque, piscina o recinto con agua acumulada",
    problema: "Un volumen de agua requiere extracción controlada por limpieza, mantenimiento, anegamiento o recuperación del área.",
    procedimiento: "Se evalúa tipo de agua, volumen y descarga; luego se extrae con motobombas y monitoreo de nivel.",
    resultado: "El espacio queda preparado para limpieza, revisión o mantenimiento posterior.",
    recomendacion: "Indicar si el agua es limpia, lluvia, servida o mezclada para definir resguardos operativos.",
    ctaLabel: "Consultar extracción",
    ctaHref: casoWhatsApp("extracción de aguas en estanques, piscinas o espacios anegados"),
  },
  {
    servicio: "Asesoría en mantenimiento integral de redes sanitarias",
    titulo: "Caso referencial de administración que necesita ordenar mantenimiento",
    problema: "Una comunidad o empresa acumula eventos sanitarios sin historial técnico, prioridades claras ni calendario preventivo.",
    procedimiento: "Se levanta información, se identifican puntos críticos y se propone pauta de mantenimiento por criticidad.",
    resultado: "La organización obtiene una hoja de ruta para tomar decisiones técnicas y presupuestarias con mayor claridad.",
    recomendacion: "Solicitar asesoría cuando las urgencias se repiten o no existe trazabilidad de mantenciones anteriores.",
    ctaLabel: "Consultar asesoría",
    ctaHref: casoWhatsApp("asesoría en mantenimiento integral de redes sanitarias"),
  },
  {
    servicio: "Análisis técnico de propiedad y redes sanitarias",
    titulo: "Evaluación preventiva de red sanitaria antes de asumir una propiedad",
    problema: "Riesgo de obstrucción, desagües lentos o condición sanitaria no visible inicialmente.",
    procedimiento:
      "Revisión de cámaras, evaluación operativa de desagües, diagnóstico técnico y recomendación de acciones preventivas.",
    resultado:
      "El cliente recibe antecedentes técnicos para tomar una decisión informada y evitar gastos sanitarios imprevistos.",
    recomendacion: "Solicitar inspección sanitaria antes de comprar, arrendar o recibir una propiedad.",
    ctaLabel: "Solicitar análisis sanitario",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar información por el servicio de análisis técnico de propiedad y redes sanitarias de Hidrourgencias SpA. Indico comuna, tipo de propiedad y antecedentes de la evaluación que necesito realizar.",
    ),
  },
  {
    servicio: "Urgencias sanitarias 24/7",
    titulo: "Caso referencial de urgencia fuera de horario",
    problema: "Un rebalse, retorno o anegamiento ocurre en horario crítico y requiere priorización rápida para reducir daño.",
    procedimiento: "Se recopila información por WhatsApp, se clasifica nivel de urgencia y se coordina el recurso técnico adecuado.",
    resultado: "El cliente recibe una ruta de acción inmediata y una intervención orientada a recuperar continuidad sanitaria.",
    recomendacion: "Enviar comuna, dirección, fotos, tipo de agua y nivel de exposición sanitaria desde el primer contacto.",
    ctaLabel: "Consultar urgencia",
    ctaHref: createWhatsAppUrl(
      "Hola, necesito solicitar asistencia de urgencia sanitaria 24/7 con Hidrourgencias SpA. Indico comuna, dirección, tipo de problema y nivel de urgencia.",
    ),
  },
];
