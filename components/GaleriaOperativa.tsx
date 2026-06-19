import { StaticPicture } from "@/components/static-picture";
import type { CmsEquipmentItem, CmsGalleryEntry } from "@/lib/cms-content";
import { createWhatsAppUrl } from "@/lib/site-config";

const equipos = [
  {
    src: "/images/PRINCIPAL/WhatsApp Image 2026-05-19 at 3.36.38 PM.jpeg",
    nombre: "RIDGID K-50",
    sirve: "Destape compacto para redes interiores, desagües, WC, lavamanos, lavaplatos y urinarios.",
    beneficios: "Permite trabajar en espacios reducidos con precisión y menor intervención.",
    cuando: "Ideal para obstrucciones domiciliarias, comerciales o tramos de menor diámetro.",
  },
  {
    src: "/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.30.50 AM.jpeg",
    nombre: "RIDGID K-1500",
    sirve: "Destape profesional de colectores principales, cámaras y redes horizontales.",
    beneficios: "Entrega fuerza mecánica para obstrucciones severas, sólidos y redes de mayor diámetro.",
    cuando: "Solicítalo ante cámaras saturadas, colectores sin flujo o rebalses en tramos principales.",
  },
  {
    src: "/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.54.35 AM.jpeg",
    nombre: "Hidrojet de alta presión",
    sirve: "Limpieza hidrodinámica de redes con grasa, sarro, sedimentos y residuos adheridos.",
    beneficios: "Recupera capacidad hidráulica y reduce obstrucciones recurrentes.",
    cuando: "Recomendado para mantención preventiva, redes colapsadas o tramos con baja evacuación.",
  },
  {
    src: "/images/PRINCIPAL/WhatsApp Image 2026-05-15 at 10.19.09 PM.jpeg",
    nombre: "Videoinspección sanitaria",
    sirve: "Diagnóstico visual de fisuras, contrapendientes, raíces, sedimentos y deformaciones.",
    beneficios: "Permite decidir con evidencia antes o después del destape.",
    cuando: "Solicítala si el problema es recurrente, incierto o requiere respaldo técnico.",
  },
  {
    src: "/images/hero-motobomba.jpg",
    nombre: "Motobombas",
    sirve: "Extracción de aguas acumuladas en emergencias sanitarias, cámaras, subterráneos y espacios técnicos.",
    beneficios: "Ayuda a contener inundaciones y recuperar condiciones operativas con mayor rapidez.",
    cuando: "Útil ante rebalses, lluvias, cámaras colapsadas o acumulación crítica de aguas.",
  },
  {
    src: "/images/trabajo-3.jpg",
    nombre: "Herramientas de diagnóstico",
    sirve: "Revisión técnica de puntos sanitarios, cámaras, artefactos y tramos con pérdida de flujo.",
    beneficios: "Reduce intervenciones innecesarias y orienta la maniobra correcta.",
    cuando: "Recomendado antes de trabajos complejos o cuando hay reincidencia del problema.",
  },
  {
    src: "/images/servicios/default (2).jpg",
    nombre: "Sanitización e higienización",
    sirve: "Limpieza, control de olores y recuperación de espacios afectados por aguas servidas o residuos.",
    beneficios: "Protege habitabilidad, operación y continuidad posterior a una contingencia sanitaria.",
    cuando: "Necesario después de rebalses, inundaciones o exposición a residuos sanitarios.",
  },
];

type GaleriaOperativaProps = {
  equipmentItems?: CmsEquipmentItem[];
  galleryItems?: CmsGalleryEntry[];
};

export function GaleriaOperativa({ equipmentItems, galleryItems = [] }: GaleriaOperativaProps) {
  const visibleEquipment = (equipmentItems?.length ? equipmentItems : equipos).map((item, index) => {
    const fallback = equipos[index % equipos.length];

    if ("image" in item) {
      return {
        src: item.image,
        nombre: item.title,
        sirve: item.description,
        beneficios: fallback.beneficios,
        cuando: fallback.cuando,
        alt: item.alt,
      };
    }

    return {
      ...item,
      alt: `${item.nombre} para destape de alcantarillado y urgencias sanitarias`,
    };
  });

  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl">
          <span className="inline-block text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
            Tecnologia y equipamiento
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Herramientas profesionales para diagnosticar, destapar y prevenir
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Trabajamos con equipos RIDGID, hidrojet, videoinspección, motobombas y herramientas de diagnóstico para
            elegir la maniobra correcta según red, severidad del bloqueo y continuidad operativa del cliente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {visibleEquipment.map((equipo) => (
            <article
              key={equipo.nombre}
              className="group overflow-hidden rounded-2xl border border-sky-500/35 bg-slate-900 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-slate-900/80"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                <StaticPicture
                  src={equipo.src}
                  alt={equipo.alt}
                  width={640}
                  height={480}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-extrabold tracking-tight text-white">{equipo.nombre}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{equipo.sirve}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-sky-100">{equipo.beneficios}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{equipo.cuando}</p>
                <a
                  href={createWhatsAppUrl(`Hola, necesito evaluar uso de ${equipo.nombre} para una red sanitaria.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        {galleryItems.length > 0 && (
          <div className="mt-14 border-t border-white/10 pt-10">
            <div className="mb-7 max-w-3xl">
              <span className="inline-block text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                Galería operativa
              </span>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Registros recientes de trabajos reales
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {galleryItems.slice(0, 6).map((item) => (
                <article
                  key={item.slug}
                  className="group overflow-hidden rounded-2xl border border-sky-500/35 bg-slate-900 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-sky-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                    <StaticPicture
                      src={item.image}
                      alt={item.alt}
                      width={640}
                      height={480}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-extrabold tracking-tight text-white">{item.title}</h4>
                    {item.description && <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>}
                    {(item.service || item.commune) && (
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                        {[item.service, item.commune].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
