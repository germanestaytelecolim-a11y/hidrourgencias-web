export function generateContenidoZona(zona: string, comuna: string) {
  
  const problemas = [
    "rebalse de aguas servidas",
    "desagüe lento",
    "retorno de aguas",
    "obstrucción en red sanitaria",
    "colapso de alcantarillado"
  ];

  const metodos = [
    "equipo hidrojet de alta presión",
    "maquinaria eléctrica especializada",
    "diagnóstico técnico en terreno",
    "inspección con cámara",
    "procedimientos de desobstrucción controlada"
  ];

  const objetivos = [
    "restablecer el flujo normal",
    "eliminar obstrucciones persistentes",
    "evitar recurrencias",
    "recuperar la operatividad del sistema",
    "prevenir rebalses futuros"
  ];

  // Generar variación por índice (evita duplicación simple)
  const index = zona.length % problemas.length;

  const problema = problemas[index];
  const metodo = metodos[(index + 1) % metodos.length];
  const objetivo = objetivos[(index + 2) % objetivos.length];

  return {
    titulo: `Destape de alcantarillado en ${zona}, ${comuna}`,

    parrafo1: `En el sector de ${zona}, es frecuente enfrentar situaciones como ${problema}, lo que requiere una intervención técnica oportuna para evitar daños mayores en la red sanitaria.`,

    parrafo2: `Nuestro equipo opera en ${comuna} utilizando ${metodo}, permitiendo abordar obstrucciones en redes domiciliarias, verticales y colectores con precisión y seguridad.`,

    parrafo3: `El objetivo de cada intervención es ${objetivo}, asegurando continuidad operativa y reduciendo el riesgo de emergencias recurrentes.`,

    cta: `Solicitar destape en ${zona}` 
  };
}
