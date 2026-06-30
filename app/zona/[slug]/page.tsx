import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { ServiceTermsNotice } from "@/components/service-terms";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllComunaLandings, getComunaLandingBySlug } from "@/lib/comuna-landings";
import { GOOGLE_REVIEWS_URL, buildCanonicalUrl, createWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { getAllServicios } from "@/lib/servicios";
import { getZonaBySlug, getZonaSlugs } from "@/lib/zonas-detalle";

type Props = {
  params: Promise<{ slug: string }>;
};

function normalizeZonaValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getContextoZona(zona: string, comuna: string) {
  const contextos = {
    Recreo: "sector con alta densidad residencial y edificios en pendiente",
    Renaca: "zona costera con departamentos de temporada, condominios y rebalses críticos en niveles inferiores",
    Forestal: "sector con viviendas en pendiente, cámaras con sedimento y retornos por pérdida de evacuación",
    GomezCarreno: "sector con condominios, cámaras domiciliarias y redes interiores o exteriores de alta carga residencial",
    Belloto: "sector residencial con redes antiguas y acumulacion de grasas",
    Penablanca: "zona con viviendas unifamiliares y redes domiciliarias extensas",
    Centro: "sector con alto flujo sanitario y colectores exigidos",
  };

  const zonaNormalizada = normalizeZonaValue(zona);
  const comunaNormalizada = normalizeZonaValue(comuna);

  if (zonaNormalizada.includes("recreo")) {
    return contextos.Recreo;
  }

  if (zonaNormalizada.includes("renaca")) {
    return contextos.Renaca;
  }

  if (zonaNormalizada.includes("forestal")) {
    return contextos.Forestal;
  }

  if (zonaNormalizada.includes("gomez") || zonaNormalizada.includes("carreno")) {
    return contextos.GomezCarreno;
  }

  if (zonaNormalizada.includes("belloto")) {
    return contextos.Belloto;
  }

  if (zonaNormalizada.includes("penablanca")) {
    return contextos.Penablanca;
  }

  if (zonaNormalizada.includes("centro") || comunaNormalizada.includes("centro")) {
    return contextos.Centro;
  }

  return "sector urbano con uso intensivo de redes sanitarias";
}

function getKeywordVariations(zona: string) {
  return [
    `obstruccion sanitaria en ${zona}`,
    `destape de desague en ${zona}`,
    `urgencia sanitaria en ${zona}`,
    `rebalse de alcantarillado en ${zona}`,
  ];
}

function getUniqueZonaParagraphs(zona: string, comuna: string) {
  const seed = normalizeZonaValue(`${zona}-${comuna}`)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const enfoqueTecnico = [
    "Priorizamos diagnostico de causa raiz en redes verticales, horizontales y puntos de descarga con mayor criticidad.",
    "Aplicamos una secuencia de diagnostico, limpieza tecnica y verificacion de flujo para reducir reincidencia operativa.",
    "La intervencion combina lectura sanitaria en terreno con control de riesgo para edificios, comercio y viviendas de alto uso.",
    "Definimos maniobra segun estado de la red, carga sanitaria y sintomas de rebalse para evitar correcciones parciales.",
  ];

  const enfoquePreventivo = [
    "Esto permite pasar de la urgencia reactiva a una continuidad sanitaria mas estable en el corto y mediano plazo.",
    "Con este enfoque tecnico-comercial, cada atencion entrega solucion inmediata y base preventiva para la siguiente etapa.",
    "El objetivo es restituir flujo con rapidez y dejar criterios claros de mantencion para que el evento no se repita.",
    "La trazabilidad operativa posterior ayuda a reducir costos por emergencias repetidas en comunidades y empresas.",
  ];

  return [
    `En ${zona}, ${enfoqueTecnico[seed % enfoqueTecnico.length]}`,
    `Para clientes en ${comuna}, ${enfoquePreventivo[(seed + 1) % enfoquePreventivo.length]}`,
  ];
}

export function generateStaticParams() {
  return getZonaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const zona = getZonaBySlug(slug);

  if (!zona) {
    return {
      title: "Zona no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `Destape en ${zona.nombre} | Urgencias 24/7 | ${zona.comuna}`;
  const contextoZona = getContextoZona(zona.nombre, zona.comuna);
  const description = `En ${zona.nombre}, ${contextoZona}. Servicio profesional de destape de alcantarillado, control de rebalses y urgencias sanitarias 24/7 en ${zona.comuna}.`;
  const canonical = buildCanonicalUrl(`/zona/${zona.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "es_CL",
      type: "article",
      images: [
        {
          url: "/images/hero-urgencia.jpg",
          width: 1200,
          height: 630,
          alt: `Destape de alcantarillado en ${zona.nombre}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-urgencia.jpg"],
    },
  };
}

export default async function ZonaPage({ params }: Props) {
  const { slug } = await params;
  const zona = getZonaBySlug(slug);

  if (!zona) {
    notFound();
  }

  const landing = getComunaLandingBySlug(zona.landingSlug);
  const relatedServices = getAllServicios().slice(0, 5);
  const relatedComunas = getAllComunaLandings().filter((item) => item.slug !== zona.landingSlug).slice(0, 5);
  const relatedPosts = getAllBlogPosts().slice(0, 4);
  const contextoZona = getContextoZona(zona.nombre, zona.comuna);
  const keywordVariations = getKeywordVariations(zona.nombre);
  const uniqueZonaParagraphs = getUniqueZonaParagraphs(zona.nombre, zona.comuna);

  const zonaMessage = createWhatsAppUrl(`Urgencia sanitaria en ${zona.nombre}`);
  const evaluationMessage = createWhatsAppUrl(
    `Necesito evaluacion tecnica de alcantarillado en ${zona.nombre}, ${zona.comuna}.`,
  );

  const zonaSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `Destape de alcantarillado en ${zona.nombre}`,
    name: `Destape de alcantarillado en ${zona.nombre} - ${zona.comuna}`,
    areaServed: [zona.nombre, zona.comuna, ...zona.nearbyComunas],
    description: `Atencion 24/7 para destape de alcantarillado, desagues y urgencias sanitarias cerca de ${zona.nombre}, ${zona.comuna}.`,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phoneDisplay,
      url: siteConfig.siteUrl,
    },
  }).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: zonaSchema }} />

      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="rounded-[2rem] border border-sky-200/30 bg-[linear-gradient(135deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] p-7 text-white shadow-[0_28px_65px_-30px_rgba(2,6,23,0.8)] sm:p-10">
        <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
          Cobertura por zona
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {`Destape de alcantarillado en ${zona.nombre} - ${zona.comuna}`}
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">
          En {zona.nombre}, {contextoZona}, las redes sanitarias suelen presentar obstrucciones por acumulacion de
          grasas, sedimentos y residuos solidos.
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">
          Nuestro servicio en {zona.nombre} esta orientado a la resolucion de colapsos sanitarios, restitucion de
          flujo y control de rebalses en sistemas domiciliarios y colectivos.
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">{uniqueZonaParagraphs[0]}</p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">
          Atendemos {keywordVariations[0]}, {keywordVariations[1]}, {keywordVariations[2]} y{" "}
          {keywordVariations[3]} con disponibilidad inmediata.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={zonaMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            WhatsApp servicio inmediato
          </a>
          <a
            href={evaluationMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Solicitar evaluacion tecnica
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

      <section className="mt-9 grid gap-6 lg:grid-cols-2">
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Problemas frecuentes en {zona.nombre}
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Acumulacion de grasa en redes domiciliarias</li>
            <li>Obstruccion por residuos solidos en colectores</li>
            <li>Retorno de aguas servidas en artefactos sanitarios</li>
            <li>Perdida de capacidad hidraulica en tuberias</li>
          </ul>
          <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">{uniqueZonaParagraphs[1]}</p>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Atendemos en {zona.nombre} y sectores cercanos dentro de {zona.comuna}, con disponibilidad inmediata para
            urgencias sanitarias.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {keywordVariations.map((variation) => (
              <span
                key={variation}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {variation}
              </span>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Bloque tecnico de intervencion</h2>
          <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">{zona.networkNote}</p>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Utilizamos hidrojet 4000 PSI, equipos RIDGID y evaluacion profesional para definir maniobra correcta segun
            severidad de obstruccion, tipo de red y criticidad operativa del cliente.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Trabajamos desagues domiciliarios, redes verticales de edificios, tramos horizontales de condominios y
            camaras de inspeccion con protocolo de diagnostico, correccion y verificacion final.
          </p>
        </article>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Cobertura inmediata cerca de {zona.nombre}
        </h2>
        <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">
          Entregamos servicio urgente cerca de ti en {zona.comuna}, con desplazamiento tecnico para sectores residenciales,
          edificios, comunidades y comercio que requieren continuidad operativa.
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{zona.clientNote}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {zona.nearbyComunas.map((nearby) => (
            <span key={nearby} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Cobertura cercana: {nearby}
            </span>
          ))}
        </div>
        <ServiceTermsNotice className="mt-5 max-w-4xl" />
        <a
          href={zonaMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
        >
          Solicitar destape urgente en {zona.nombre}
        </a>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Enlaces recomendados</h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article>
            <h3 className="text-lg font-extrabold text-slate-950">Cobertura por comuna</h3>
            <div className="mt-3 grid gap-2">
              {landing ? (
                <Link
                  href={`/${landing.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
                >
                  {`Ver cobertura completa en ${landing.comuna}`}
                </Link>
              ) : null}
              {relatedComunas.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
                >
                  {`destape de alcantarillado en ${item.comuna}`}
                </Link>
              ))}
            </div>
          </article>

          <article>
            <h3 className="text-lg font-extrabold text-slate-950">Servicios especializados</h3>
            <div className="mt-3 grid gap-2">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicios/${service.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
                >
                  {service.navLabel}
                </Link>
              ))}
            </div>
          </article>

          <article>
            <h3 className="text-lg font-extrabold text-slate-950">Guias del blog</h3>
            <div className="mt-3 grid gap-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
                >
                  {post.h1}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-9 rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-md sm:p-10">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Respuesta sanitaria urgente en {zona.nombre}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-200 sm:text-base">
          Si necesitas destape de alcantarillado urgente, videoinspeccion o hidrojet en {zona.comuna}, activa atencion
          inmediata por WhatsApp y recibe soporte tecnico profesional 24/7.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-5 max-w-4xl" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={zonaMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            WhatsApp urgencia 24 horas
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {"\u2190"} Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
