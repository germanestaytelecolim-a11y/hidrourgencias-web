import { CheckCircle, ClipboardCheck, FileText, Phone, Wrench } from "@/components/icons";

const pasos = [
  {
    icon: Phone,
    step: "01",
    title: "Recepción del requerimiento",
    description: "Recibimos llamada o WhatsApp, registramos comuna, síntoma, tipo de inmueble y nivel de urgencia.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Evaluación técnica inicial",
    description: "Identificamos señales de rebalse, retorno, cámara saturada o pérdida de flujo para definir prioridad.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Despliegue de equipo especializado",
    description: "Asignamos técnico, maquinaria RIDGID, hidrojet, motobombas o videoinspección según el caso.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Ejecución del destape, lavado o diagnóstico",
    description: "Intervenimos la red con maniobra controlada y verificamos flujo, cámaras o puntos afectados.",
  },
  {
    icon: FileText,
    step: "05",
    title: "Entrega de respaldo técnico",
    description: "Cerramos con evidencia, recomendaciones preventivas y próximos pasos si existe reincidencia o daño.",
  },
];

export function ProcesoOperativo() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[#00AEEF]">
            Metodología de Trabajo
          </span>
          <h2 className="mb-4 text-3xl font-bold text-[#0A2540] sm:text-4xl">Proceso Operativo en 5 Pasos</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Protocolo estandarizado que garantiza resultados efectivos y trazables en cada intervención.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-[#00AEEF] via-[#00C48C] to-[#00AEEF] lg:block" />

          <div className="grid gap-8 lg:grid-cols-5">
            {pasos.map((paso) => (
              <div key={paso.step} className="relative">
                <div className="h-full rounded-2xl border border-transparent bg-[#F5F7FA] p-6 transition-all duration-300 hover:border-[#00AEEF]/20 hover:bg-white hover:shadow-xl">
                  <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0A2540] lg:mx-0">
                    <span className="text-lg font-bold text-[#00AEEF]">{paso.step}</span>
                  </div>

                  <div className="text-center lg:text-left">
                    <paso.icon className="mx-auto mb-4 h-8 w-8 text-[#00AEEF] lg:mx-0" />
                    <h3 className="mb-3 text-lg font-bold text-[#0A2540]">{paso.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{paso.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
