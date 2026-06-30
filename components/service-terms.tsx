export const serviceTermsNotice =
  "Importante: el servicio contratado corresponde a una intervención técnica especializada. Existen fallas estructurales, colapsos, raíces, pérdidas de pendiente y daños internos de tuberías que pueden impedir una desobstrucción total. En tales casos, Hidrourgencias SpA entregará diagnóstico técnico y alternativas de solución. Los recursos técnicos, maquinaria, movilización, horas hombre y servicios ejecutados en terreno constituyen prestaciones efectivamente realizadas y sujetas a cobro.";

const serviceTermsNoticeSummary =
  "Servicio sujeto a diagnóstico técnico, condiciones reales de la red, accesibilidad, nivel de obstrucción y recursos requeridos.";

const serviceTerms = [
  "Hidrourgencias SpA presta servicios especializados de diagnóstico, limpieza, mantenimiento y desobstrucción de redes de alcantarillado y desagües mediante maquinaria eléctrica, sistema hidrojet, videoinspección sanitaria y otros procedimientos técnicos aplicables según cada caso.",
  "La contratación de nuestros servicios corresponde a una intervención técnica especializada destinada a identificar, diagnosticar y solucionar obstrucciones o anomalías presentes en redes sanitarias.",
  "Debido a que cada instalación posee condiciones particulares, Hidrourgencias SpA no puede garantizar resultados absolutos cuando existan daños estructurales, fallas constructivas, colapsos, roturas, raíces invasivas, pérdidas de pendiente, deformaciones, obstrucciones externas o cualquier otra condición que impida técnicamente la normal operación del sistema.",
  "El cliente reconoce que la movilización, asistencia técnica, inspección, diagnóstico, utilización de maquinaria, hidrojet, videoinspección, horas hombre, pruebas operativas, informes técnicos y demás recursos desplegados constituyen servicios efectivamente prestados y ejecutados, independientemente del resultado final obtenido.",
  "Hidrourgencias SpA se obliga a emplear todos los medios técnicos razonablemente disponibles para resolver la incidencia reportada. Sin embargo, la contratación no constituye una garantía absoluta de eliminación de la falla cuando existan causas ajenas al procedimiento de destape convencional.",
  "La efectividad del servicio puede verse limitada por tuberías colapsadas o quebradas, presencia de raíces, pérdida o inversión de pendiente, materiales sólidos no removibles mediante procedimientos convencionales, redes sanitarias con defectos de construcción, daños ocultos, obstrucciones ubicadas en infraestructura pública o de terceros.",
  "Cuando durante la ejecución se detecten condiciones no visibles previamente, Hidrourgencias SpA podrá recomendar procedimientos adicionales. Ningún trabajo adicional será ejecutado sin autorización previa del cliente, salvo situaciones que impliquen riesgo sanitario inminente para las personas o la propiedad.",
  "La garantía aplica únicamente sobre la intervención realizada y exclusivamente cuando la causa de la obstrucción corresponda al mismo punto tratado. La garantía no será aplicable cuando existan daños estructurales, mal uso de la red sanitaria, ingreso de objetos extraños, acumulación de grasas posterior al servicio, raíces o cualquier condición ajena a la intervención efectuada.",
  "La prestación de servicios técnicos ejecutados en terreno genera la obligación de pago correspondiente, independientemente de que posteriormente se determine la existencia de daños estructurales o condiciones que requieran reparaciones adicionales.",
  "Al solicitar una visita técnica, cotización, llamada telefónica, contacto vía WhatsApp, formulario web o contratación de servicios, el cliente declara haber leído y aceptado los presentes términos y condiciones.",
];

type ServiceTermsNoticeProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function ServiceTermsNotice({ tone = "light", className = "" }: ServiceTermsNoticeProps) {
  void tone;
  void className;

  return null;
}

export function ServiceTermsSection() {
  return (
    <section id="terminos-servicio" className="border-b border-sky-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Antes de solicitar atención</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
              Términos y condiciones del servicio
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {serviceTermsNoticeSummary}{" "}
              <a href="#terminos-servicio-detalle" className="font-bold text-sky-800 underline-offset-4 hover:underline">
                Ver términos del servicio.
              </a>
            </p>
          </div>
          <details id="terminos-servicio-detalle" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <summary className="cursor-pointer list-none text-base font-extrabold text-slate-950 marker:hidden">
              Leer condiciones comerciales y técnicas
            </summary>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              {serviceTerms.map((term) => (
                <p key={term}>{term}</p>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
