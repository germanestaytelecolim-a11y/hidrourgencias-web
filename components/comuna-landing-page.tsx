import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  AlarmClock,
  BadgeCheck,
  ChevronDown,
  Camera,
  ChevronRight,
  Droplets,
  ExternalLink,
  Gauge,
  Mail,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Galeria } from "@/components/Galeria";
import { PublicAdminCasesForPath } from "@/components/admin/PublicAdminCasesForPath";
import { ConversionExperience } from "@/components/conversion-experience";
import { ServiceTermsNotice } from "@/components/service-terms";
import { TerritorialLandingHero } from "@/components/territorial-landing-hero";
import type { ComunaLandingData } from "@/lib/comuna-landings";
import {
  GOOGLE_REVIEWS_URL,
  createMailToUrl,
  createWhatsAppUrl,
  serviceCatalog,
  siteConfig,
  type ServiceCatalogItem,
} from "@/lib/site-config";
import { getAllServicios } from "@/lib/servicios";
import { getZonasByLandingSlug as getZonasDetalleByLandingSlug } from "@/lib/zonas-detalle";

type Props = {
  landing: ComunaLandingData;
  allLandings: ComunaLandingData[];
};

const serviceIcons: LucideIcon[] = [Droplets, Gauge, ShieldCheck, Camera, AlarmClock, Wrench];
const mailButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-black shadow-sm shadow-slate-900/10 transition hover:border-slate-400 hover:bg-slate-50";
const groupedServiceLandingSlugs = new Set([
  "destape-alcantarillado-vina-del-mar",
  "destape-alcantarillado-valparaiso",
  "destape-alcantarillado-quilpue",
  "destape-alcantarillado-villa-alemana",
  "destape-alcantarillado-quintero",
  "destape-alcantarillado-puchuncavi",
  "destape-alcantarillado-limache",
  "destape-alcantarillado-placilla-curauma",
]);

const compactServiceGroups = [
  {
    title: "Destapes e hidrojet",
    hrefs: [
      "/servicios/destape-alcantarillado",
      "/servicios/hidrojet",
      "/servicios/destape-artefactos-sanitarios",
      "/servicios/destape-camaras-inspeccion",
      "/servicios/destape-verticales",
      "/servicios/destape-horizontales",
      "/servicios/destape-edificios",
    ],
  },
  {
    title: "Mantenimiento y prevención",
    hrefs: [
      "/servicios/mantencion-preventiva-redes",
      "/servicios/asesoria-mantenimiento-integral-redes-sanitarias",
      "/servicios/limpieza-higienizacion-sanitizacion",
      "/servicios/limpieza-domicilios-recuperacion-espacios",
      "/servicios/limpieza-fachadas-hidrolavado-superficies",
    ],
  },
  {
    title: "Diagnóstico y apoyo técnico",
    hrefs: [
      "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
      "/servicios/motobombas-extraccion-aguas",
      "/servicios/extraccion-aguas-estanques-piscinas",
      "/servicios/reparacion-tuberias-hdpe",
    ],
  },
] as const;

function CompactServiceGroups({ services }: { services: ServiceCatalogItem[] }) {
  const servicesByHref = new Map(services.filter((service) => service.href).map((service) => [service.href, service]));

  return (
    <div className="mt-6 grid gap-3">
      {compactServiceGroups.map((group, index) => {
        const groupServices = group.hrefs.map((href) => servicesByHref.get(href)).filter(Boolean) as ServiceCatalogItem[];

        return (
          <details
            key={group.title}
            open={index === 0}
            className="group rounded-2xl border border-sky-100 bg-white shadow-sm shadow-slate-900/5"
          >
            <summary className="brand-focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-lg font-extrabold text-slate-950">{group.title}</span>
                <span className="mt-1 block text-sm font-semibold text-slate-600">{groupServices.length} servicios</span>
              </span>
              <ChevronDown className="h-5 w-5 flex-none text-sky-800 transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="border-t border-sky-100 px-4 pb-4 pt-3">
              <ul className="grid gap-2 sm:grid-cols-2">
                {groupServices.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href ?? "#"}
                      className="brand-focus-ring flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 transition hover:border-sky-300 hover:bg-white hover:text-sky-900"
                    >
                      <span>{service.title}</span>
                      <ChevronRight className="h-4 w-4 flex-none text-sky-800" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        );
      })}
    </div>
  );
}

export function ComunaLandingPage({ landing, allLandings }: Props) {
  const { presentation } = landing;
  const linksToOtherCommunes = allLandings.filter((item) => item.slug !== landing.slug).slice(0, 7);
  const linkedServices = getAllServicios();
  const displayedServices =
    landing.slug === "hidrojet-concon"
      ? serviceCatalog.filter((service) => service.href === "/servicios/hidrojet")
      : serviceCatalog;
  const shouldGroupServices = groupedServiceLandingSlugs.has(landing.slug);
  const showSeoGallery =
    landing.slug === "destape-alcantarillado-vina-del-mar" || landing.slug === "destape-alcantarillado-valparaiso";
  const zoneCoverageTargets = getZonasDetalleByLandingSlug(landing.slug);
  const hasProgrammaticZones = zoneCoverageTargets.length > 0;
  const coverageZones = zoneCoverageTargets.length > 0 ? zoneCoverageTargets.map((zone) => zone.nombre) : landing.nearbyZones;
  const mainLandingHref = `/${landing.slug}`;
  const coverageServiceLabel = `${presentation.coverageServiceName.charAt(0).toUpperCase()}${presentation.coverageServiceName.slice(1)}`;
  const isPilotLanding = [
    "destape-alcantarillado-vina-del-mar",
    "destape-alcantarillado-valparaiso",
    "hidrojet-concon",
    "destape-alcantarillado-quilpue",
    "destape-alcantarillado-villa-alemana",
    "destape-alcantarillado-casablanca",
    "destape-alcantarillado-maitencillo-puchuncavi",
  ].includes(landing.slug);

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }).replace(/</g, "\\u003c");

  const serviceSchemaPayload =
    landing.slug === "hidrojet-concon"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Hidrojet en Concón",
          serviceType: "Limpieza hidrodinámica de redes sanitarias",
          areaServed: {
            "@type": "City",
            name: "Concón",
          },
          provider: {
            "@type": "LocalBusiness",
            name: siteConfig.name,
            telephone: siteConfig.phoneDisplay,
            url: siteConfig.siteUrl,
          },
          url: `${siteConfig.siteUrl}/${landing.slug}`,
          description: landing.metaDescription,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: presentation.schemaServiceType,
          areaServed: [landing.comuna, ...coverageZones],
          provider: {
            "@type": "LocalBusiness",
            name: siteConfig.name,
            areaServed: landing.comuna,
            telephone: siteConfig.phoneDisplay,
            url: `${siteConfig.siteUrl}/${landing.slug}`,
          },
          description: landing.metaDescription,
        };

  const serviceSchema = JSON.stringify(serviceSchemaPayload).replace(/</g, "\\u003c");

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteConfig.siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: presentation.serviceName,
        item: `${siteConfig.siteUrl}/${landing.slug}`,
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Script id={`${landing.slug}-faq-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <Script id={`${landing.slug}-service-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceSchema }} />
      <Script id={`${landing.slug}-breadcrumb-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

      <nav aria-label="Migas de pan" className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <span className="font-semibold text-slate-700">{presentation.serviceName}</span>
      </nav>
      {landing.parentLandingSlug ? (
        <p className="mb-5 text-sm text-slate-600">
          Esta cobertura territorial forma parte de la comuna de Puchuncaví. {" "}
          <Link href={`/${landing.parentLandingSlug}`} className="font-semibold text-sky-700 underline underline-offset-2">
            Ver destape de alcantarillado en Puchuncaví
          </Link>
        </p>
      ) : null}

      {landing.visual ? (
        <TerritorialLandingHero landing={landing} />
      ) : (
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-200/30 bg-[linear-gradient(140deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] p-6 text-white shadow-[0_30px_70px_-32px_rgba(2,6,23,0.8)] sm:p-10">
        <div className="pointer-events-none absolute -right-12 top-8 h-52 w-52 opacity-10 sm:h-64 sm:w-64">
          <Image src="/images/logo-hidrourgencias.jpg" alt="" fill sizes="220px" className="object-contain" />
        </div>
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.23em] text-sky-100">
          {presentation.schemaServiceType}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{landing.h1}</h1>
        <div className="relative mt-6 space-y-5 text-base leading-8 text-slate-100 sm:text-lg">
          {landing.heroParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Sumamos 15 anos de experiencia en el rubro sanitario, tecnicos con certificacion SEC gas clase 3 y
            maquinaria profesional RIDGID para dar respuestas de alto estandar en {landing.comuna}.
          </p>
        </div>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl(landing.ctaPrimaryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-600"
          >
            {presentation.primaryCtaLabel}
          </a>
          <a
            href={createWhatsAppUrl(landing.ctaMidMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {presentation.secondaryCtaLabel}
          </a>
          <a
            href={createMailToUrl()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-black shadow-sm shadow-slate-900/10 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" />
            Enviar solicitud por correo
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="brand-review-link rounded-full px-6 py-3 text-sm font-bold"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" />
            Resenas Google
          </a>
        </div>
      </section>
      )}

      {isPilotLanding ? (
        <ConversionExperience
          context={{
            service: presentation.serviceName,
            commune: landing.comuna,
            sourcePath: mainLandingHref,
          }}
        />
      ) : null}

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Diagnostico del problema</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {presentation.problemHeading}
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">{landing.problemSummary}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {landing.problemBullets.map((bullet) => (
            <p key={bullet} className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {bullet}
            </p>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Servicios disponibles</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {presentation.servicesHeading}
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
          {presentation.servicesIntro}
        </p>
        {shouldGroupServices ? (
          <CompactServiceGroups services={displayedServices} />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {displayedServices.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <article key={service.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-sky-300 hover:bg-white">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-950">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.href ? (
                      <Link
                        href={service.href}
                        className="inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-800 transition hover:border-sky-300"
                      >
                        Ver servicio
                      </Link>
                    ) : null}
                    {service.ctaHref && service.ctaLabel ? (
                      <a
                        href={service.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                      >
                        {service.ctaLabel}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Autoridad tecnica</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Respaldo profesional para urgencias sanitarias en {landing.comuna}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-950">15 anos de experiencia operativa</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Experiencia en contingencias sanitarias complejas para edificios, comunidades y operaciones comerciales.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-950">Tecnicos certificados SEC gas clase 3</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Equipo especializado para diagnosticar, ejecutar y validar intervenciones con estandar profesional.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Wrench className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-950">Maquinaria profesional RIDGID</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Integracion de maquinas destapadoras, hidrojet, aspiradoras y camaras tecnicas para resolver con precision.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <AlarmClock className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-950">Atencion 24/7 con enfoque corporativo</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Priorizamos continuidad operativa, trazabilidad y respuesta rapida para clientes de alto estandar.
            </p>
          </article>
        </div>
      </section>

      {showSeoGallery && <Galeria comuna={landing.comuna} className="mt-9" />}

      <div className="mt-9">
        <PublicAdminCasesForPath
          path={mainLandingHref}
          title={`Evidencia reciente en ${landing.comuna}`}
          limit={6}
        />
      </div>

      <section className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-md sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Bloque tecnico</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {presentation.technicalHeading}
          </h2>
          <div className="mt-5 space-y-5 text-sm leading-8 text-slate-200 sm:text-base">
            {landing.technicalParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold">Hidrojet 4000 PSI para limpieza profunda</p>
            <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold">Equipos RIDGID para diagnostico en terreno</p>
            <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold">Tecnicos certificados SEC gas clase 3</p>
            <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold">Recomendaciones para continuidad operativa</p>
          </div>
        </article>
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Canales de atencion directa</p>
          <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">Selecciona la via de contacto segun tu requerimiento</h3>
          <div className="mt-6 grid gap-3">
            <a
              href={createWhatsAppUrl(landing.ctaPrimaryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              {presentation.primaryCtaLabel}
            </a>
            <a
              href={createWhatsAppUrl(landing.ctaMidMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {presentation.secondaryCtaLabel}
            </a>
            <a
              href={createWhatsAppUrl("Hola, solicito evaluacion tecnica para definir plan de trabajo sanitario.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Solicitar evaluacion tecnica
            </a>
            <a
              href={createMailToUrl()}
              className={mailButtonClass}
            >
              <Mail className="h-4 w-4" />
              Enviar solicitud por correo
            </a>
          </div>
        </article>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Procedimiento de intervencion</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Paso a paso para resolver contingencias en {landing.comuna}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {landing.procedureSteps.map((step) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Cobertura territorial</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Zonas cercanas con cobertura tecnica en {landing.comuna}
        </h2>
        <div className="mt-5 space-y-5 text-base leading-8 text-slate-700 sm:text-lg">
          {landing.coverageParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Servicio de {presentation.coverageServiceName} en {landing.comuna}, con coordinacion tecnica en sectores
            cercanos y revision previa de los antecedentes del caso.
          </p>
        </div>

        {hasProgrammaticZones ? (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {zoneCoverageTargets.map((zone) => (
                <Link
                  key={zone.slug}
                  href={`/zona/${zone.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
                >
                  {`${coverageServiceLabel} en ${zone.nombre}`}
                </Link>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {zoneCoverageTargets.map((zone) => {
                const zoneMessage = createWhatsAppUrl(
                  `Hola, necesito ${presentation.coverageServiceName} en ${zone.nombre}, ${landing.comuna}.`,
                );

                return (
                  <article key={zone.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
                      {`${coverageServiceLabel} en ${zone.nombre}`}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {`Coordinamos ${presentation.coverageServiceName} en ${zone.nombre} con diagnostico tecnico, seleccion de equipo y verificacion del resultado segun el alcance de esta landing.`}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {zone.contextNote}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {`${zone.networkNote} ${zone.issueNote} ${zone.clientNote}`}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                      {`La cobertura de ${presentation.coverageServiceName} en ${zone.nombre} considera accesos, condicion de red y continuidad operativa del inmueble.`}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <a
                        href={zoneMessage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                      >
                        WhatsApp para {zone.nombre}
                      </a>
                      <Link
                        href={`/zona/${zone.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-800"
                      >
                        {`Ver detalle en ${zone.nombre}`}
                      </Link>
                      <Link
                        href={mainLandingHref}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-800"
                      >
                        {`Ver cobertura completa en ${landing.comuna}`}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {landing.nearbyZones.map((zone) => (
              <span key={zone} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                {zone}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Perfil de clientes</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Soporte para edificios, condominios, empresas y locales comerciales
        </h2>
        <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">{landing.clientParagraph}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {landing.clientList.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Preguntas frecuentes</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Respuestas para clientes que requieren atencion tecnica inmediata
        </h2>
        <div className="mt-6 space-y-4">
          {landing.faq.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-bold text-slate-950 group-open:text-sky-700">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Cobertura regional</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Comunas relacionadas para continuidad de servicio
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {linksToOtherCommunes.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-900 transition hover:border-sky-300 hover:bg-white"
            >
              <span>{item.presentation.serviceName}</span>
              <ChevronRight className="h-4 w-4 text-sky-700" />
            </Link>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Servicios relacionados</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Soluciones tecnicas complementarias disponibles
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {linkedServices.map((service) => (
            <Link
              key={service.slug}
              href={`/servicios/${service.slug}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
            >
              {service.navLabel}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-9 rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-md sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Cierre de atencion</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {presentation.closingHeading}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-200 sm:text-base">
          {presentation.closingParagraph}
        </p>
        <ServiceTermsNotice tone="dark" className="mt-5 max-w-4xl" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl(landing.ctaFinalMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            {presentation.finalCtaLabel}
          </a>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Llamar ahora
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-sky-200/35 bg-sky-900/30 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-800/40"
          >
            Ver guias tecnicas del blog
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>
    </main>
  );
}
