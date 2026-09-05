import {
  MessageCircle,
  ScanSearch,
  Wrench,
  CircleCheck,
  FileText,
} from "lucide-react";
const icons = [MessageCircle, ScanSearch, Wrench, CircleCheck, FileText];
const steps = [
  [
    "Coordinamos",
    "Por WhatsApp registramos ubicación, síntoma, instalación y urgencia.",
  ],
  [
    "Evaluamos",
    "Revisamos accesos y puntos afectados para definir alcance y equipo.",
  ],
  [
    "Intervenimos",
    "Aplicamos desobstrucción, lavado o diagnóstico según el caso.",
  ],
  ["Verificamos", "Comprobamos el escurrimiento y los puntos intervenidos."],
  [
    "Respaldamos",
    "Entregamos recomendaciones y evidencia o informe cuando corresponde.",
  ],
];
export function ProcesoOperativo() {
  return (
    <section
      id="proceso"
      className="home-section"
      aria-labelledby="home-process-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Proceso de atención</p>
        <h2 id="home-process-title">
          Información clara, desde el primer contacto
        </h2>
      </div>
      <ol className="home-process">
        {steps.map(([title, text], index) => {
          const Icon = icons[index];
          return (
            <li key={title}>
              <span className="home-step-icon" aria-hidden="true">
                <Icon size={23} />
                <small>0{index + 1}</small>
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
