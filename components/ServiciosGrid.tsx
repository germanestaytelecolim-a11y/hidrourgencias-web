import { ArrowRight, Building2, Camera, Droplets, Gauge, Home, Layers3, Shield, Wrench } from "@/components/icons";
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
    title: "Recuperación de espacios e higienización técnica",
    description: "Limpieza profunda, control de olores y recuperación higiénico-sanitaria posterior a rebalses o recambios.",
    href: "/servicios/limpieza-domicilios-recuperacion-espacios",
    accent: "#0e5f86",
  },
];

const groupedServiceAreas = [
  {
    title: "Urgencias Sanitarias y Destapes Técnicos",
    description:
      "Respuesta técnica para obstrucciones activas, rebalses, cámaras colapsadas, retornos de aguas servidas y fallas de evacuación en viviendas, edificios, locales comerciales y redes privadas.",
    serviceHrefs: [
      "/servicios/destape-alcantarillado",
      "/servicios/destape-verticales",
      "/servicios/destape-artefactos-sanitarios",
      "/servicios/hidrojet",
      "/servicios/motobombas-extraccion-aguas",
    ],
    services: [
      "Destape de redes interiores y exteriores",
      "Destape vertical en edificios",
      "Despeje de WC, urinarios y lavaplatos con RIDGID K-50/K-1500 o equivalente",
      "Destape y lavado con hidrojet",
      "Control de inundaciones sanitarias con motobombas, bomba sumergible, aspiradora industrial y sanitización posterior cuando corresponda",
    ],
  },
  {
    title: "Mantenimiento y Continuidad Operativa",
    description:
      "Planes preventivos para reducir emergencias, evitar rebalses, controlar acumulación de grasa y mantener la continuidad sanitaria de edificios, condominios, empresas y locales gastronómicos.",
    serviceHrefs: ["/servicios/mantencion-preventiva-redes", "/servicios/hidrojet", "/servicios/motobombas-extraccion-aguas"],
    services: [
      "Lavado técnico con hidrojet",
      "Planes preventivos mensuales, bimensuales, trimestrales o semestrales",
      "Manejo de aguas lluvias y acumulaciones cuando comprometen continuidad sanitaria",
    ],
  },
  {
    title: "Diagnóstico, Ingeniería y Respaldo Técnico",
    description:
      "Evaluación técnica para identificar fallas sanitarias recurrentes, revisar redes ocultas y evitar intervenciones invasivas sin diagnóstico.",
    serviceHrefs: [
      "/servicios/destape-camaras-inspeccion",
      "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
      "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
    ],
    services: [
      "Videoinspección sanitaria CCTV",
      "Informes técnicos formales",
      "Asesoría técnica especializada",
      "Asesoramiento precompra, preventa y arriendo mediante videoinspección sanitaria CCTV",
    ],
    note:
      "Antes de comprar, vender o arrendar una propiedad, revise lo que no se ve. Evaluamos redes de alcantarillado y desagüe para detectar obstrucciones, raíces, roturas, contrapedientes, grasa adherida, sedimentos o fallas de evacuación.",
  },
  {
    title: "Recuperación de Espacios e Higienización",
    description:
      "Servicio orientado a recuperar condiciones de uso, higiene y habitabilidad en departamentos, residenciales, oficinas, bodegas y zonas afectadas por recambio de ocupantes, inundaciones, olores persistentes o intervenciones sanitarias.",
    serviceHrefs: [
      "/servicios/limpieza-higienizacion-sanitizacion",
      "/servicios/limpieza-domicilios-recuperacion-espacios",
      "/servicios/motobombas-extraccion-aguas",
    ],
    services: [
      "Limpieza profunda por cambio de residentes o recambio de veraneantes",
      "Recuperación posterior a inundaciones",
      "Tratamiento de olores persistentes",
      "Sanitización con amonio cuaternario posterior a rebalses o trabajos sanitarios",
      "Servicios programados u ocasionales",
    ],
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
  const serviceByHref = new Map(visibleServices.map((service) => [service.href, service] as const));

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

        <div className="grid gap-6 lg:grid-cols-2">
          {groupedServiceAreas.map((area, areaIndex) => {
            const AreaIcon = [Droplets, Shield, Camera, Home][areaIndex];

            return (
              <article key={area.title} className="brand-card rounded-3xl p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                    <AreaIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black leading-8 text-[#08385f]">{area.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{area.description}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  {area.services.map((item) => (
                    <p key={item} className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                      {item}
                    </p>
                  ))}
                </div>

                {area.note ? <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-7 text-slate-700">{area.note}</p> : null}

                <div className="mt-6 flex flex-wrap gap-2">
                  {area.serviceHrefs.map((href) => {
                    const servicio = serviceByHref.get(href) ?? servicios.find((item) => item.href === href);

                    if (!servicio) {
                      return null;
                    }

                    return (
                      <a
                        key={`${area.title}-${href}`}
                        href={href}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-800 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white"
                      >
                        {servicio.title}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
