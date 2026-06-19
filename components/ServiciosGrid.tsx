import { ArrowRight, Building2, Camera, Droplets, Gauge, Home, Layers3, Shield, Wrench } from "@/components/icons";
import { StaticPicture } from "@/components/static-picture";
import type { CmsFeaturedService } from "@/lib/cms-content";

const servicios = [
  {
    icon: Droplets,
    title: "Destape de alcantarillado y desagües",
    description: "Eliminación de obstrucciones en redes sanitarias, desagües y alcantarillado con equipos profesionales.",
    href: "/servicios/destape-alcantarillado",
    accent: "#00aeef",
  },
  {
    icon: Gauge,
    title: "Hidrojet de alta presión",
    description: "Lavado técnico para remover grasa, sarro, sedimentos y residuos adheridos en tuberías sanitarias.",
    href: "/servicios/hidrojet",
    accent: "#06c286",
  },
  {
    icon: Building2,
    title: "Destape de edificios",
    description: "Respuesta para comunidades, salas técnicas, cámaras y redes compartidas con trazabilidad operativa.",
    href: "/servicios/destape-edificios",
    accent: "#0e5f86",
  },
  {
    icon: Layers3,
    title: "Destape de verticales",
    description: "Intervención de bajadas sanitarias, shaft y ductos verticales con control por tramo.",
    href: "/servicios/destape-verticales",
    accent: "#00aeef",
  },
  {
    icon: Wrench,
    title: "Destape de horizontales",
    description: "Recuperación de colectores, tramos entre cámaras y redes principales con prueba de flujo final.",
    href: "/servicios/destape-horizontales",
    accent: "#06c286",
  },
  {
    icon: Shield,
    title: "Mantención preventiva de redes",
    description: "Planes programados para reducir rebalses, reincidencias y costos por urgencias repetidas.",
    href: "/servicios/mantencion-preventiva-redes",
    accent: "#0e5f86",
  },
  {
    icon: Camera,
    title: "Destape de cámaras de inspección",
    description: "Limpieza de cámaras saturadas, grasa, sedimentos y puntos críticos de alcantarillado.",
    href: "/servicios/destape-camaras-inspeccion",
    accent: "#00aeef",
  },
  {
    icon: Home,
    title: "Destape de artefactos sanitarios",
    description: "Solución para WC, lavamanos, lavaplatos, urinarios y desagües interiores con mínima intervención.",
    href: "/servicios/destape-artefactos-sanitarios",
    accent: "#06c286",
  },
  {
    icon: Camera,
    title: "Videoinspección sanitaria",
    description: "Diagnóstico visual de fisuras, contrapendientes, raíces, sedimentos y deformaciones internas.",
    href: "/servicios/destape-camaras-inspeccion",
    accent: "#0e5f86",
  },
  {
    icon: Droplets,
    title: "Motobombas para extracción de aguas",
    description: "Extracción de aguas acumuladas en emergencias, inundaciones, cámaras y espacios técnicos.",
    href: "/servicios/motobombas-extraccion-aguas",
    accent: "#00aeef",
  },
  {
    icon: Shield,
    title: "Limpieza, higienización y sanitización",
    description: "Recuperación de higiene, control de olores y sanitización tras rebalses o aguas servidas.",
    href: "/servicios/limpieza-higienizacion-sanitizacion",
    accent: "#06c286",
  },
  {
    icon: Wrench,
    title: "Reparación de tuberías HDPE",
    description: "Reparaciones técnicas en redes HDPE para recuperar continuidad sanitaria y reducir filtraciones.",
    href: "/servicios/reparacion-tuberias-hdpe",
    accent: "#0e5f86",
  },
];

type ServiciosGridProps = {
  services?: CmsFeaturedService[];
};

export function ServiciosGrid({ services }: ServiciosGridProps) {
  const visibleServices = (services?.length ? services : servicios).map((service, index) => {
    const fallback = servicios[index % servicios.length];

    return {
      ...fallback,
      ...service,
      href: "url" in service ? service.url : fallback.href,
      image: "image" in service ? service.image : undefined,
      alt: "alt" in service ? service.alt : fallback.title,
    };
  });

  return (
    <section id="servicios" className="brand-section py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
            Servicios sanitarios especializados
          </span>
          <h2 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-[#08385f] sm:text-4xl">
            Servicios sanitarios especializados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Soluciones técnicas para urgencias, mantención y continuidad operativa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {visibleServices.map((servicio) => (
            <a
              key={servicio.href + servicio.title}
              href={servicio.href}
              className="brand-card group flex h-full flex-col rounded-3xl p-6 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-lg transition group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${servicio.accent}22, #ffffff)`,
                    color: servicio.accent,
                  }}
                >
                  {servicio.image && (
                    <>
                      <StaticPicture
                        src={servicio.image}
                        alt={servicio.alt}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-white/75" aria-hidden="true" />
                    </>
                  )}
                  <servicio.icon className="relative h-7 w-7" />
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-[#06c286] shadow-[0_0_18px_rgba(6,194,134,0.7)]" />
              </div>

              <h3 className="mt-5 text-xl font-black leading-7 text-[#08385f] transition group-hover:text-sky-700">
                {servicio.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{servicio.description}</p>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition group-hover:translate-x-1 group-hover:text-[#0e5f86]">
                Cotizar servicio
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
