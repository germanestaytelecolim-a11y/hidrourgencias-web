/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import {
  ArrowRight,
  AlertTriangle,
  BadgeCheck,
  Building2,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Wrench,
  type IconComponent,
} from "@/components/icons";

import { CasosReales } from "@/components/CasosReales";
import { CTAUrgente } from "@/components/CTAUrgente";
import { GaleriaOperativa } from "@/components/GaleriaOperativa";
import { HeroUrgencias } from "@/components/HeroUrgencias";
import { ProcesoOperativo } from "@/components/ProcesoOperativo";
import { ServiceTermsNotice } from "@/components/service-terms";
import { ServiciosGrid } from "@/components/ServiciosGrid";
import { StaticPicture } from "@/components/static-picture";
import { VideosTecnicos } from "@/components/VideosTecnicos";
import type { BlogPost } from "@/lib/blog-data";
import { getBlogGuideImage } from "@/lib/blog-guide-images";
import type {
  CmsClientItem,
  CmsCommercialBlock,
  CmsEquipmentItem,
  CmsFeaturedService,
  CmsGalleryEntry,
  CmsHomeSettings,
  CmsVideoEntry,
} from "@/lib/cms-content";
import type { CaseStudy } from "@/lib/case-studies";
import { comunasSeo, createSeoSlug } from "@/lib/seo-territorial";
import { GOOGLE_REVIEWS_URL, buildCanonicalUrl, createMailToUrl, createWhatsAppUrl, serviceCatalog, siteConfig } from "@/lib/site-config";

const siteUrl = siteConfig.siteUrl;

const coverageComunas = [
  { name: "Viña del Mar", href: "/destape-alcantarillado-vina-del-mar", detail: "Destape e hidrojet 24/7" },
  { name: "Valparaíso", href: "/destape-alcantarillado-valparaiso", detail: "Cerros, comercio y edificios" },
  { name: "Concón", href: "/hidrojet-concon", detail: "Redes costeras y gastronómicas" },
  { name: "Reñaca", href: "/zona/renaca-vina-del-mar", detail: "Edificios, turismo y condominios" },
  { name: "Quilpué", href: "/destape-alcantarillado-quilpue", detail: "Redes domiciliarias y comercio" },
  { name: "Villa Alemana", href: "/destape-alcantarillado-villa-alemana", detail: "Urgencias y mantención sanitaria" },
  { name: "Limache", href: "/destape-alcantarillado-limache", detail: "Redes urbanas y productivas" },
  { name: "Quillota", href: "/destape-alcantarillado-quillota", detail: "Edificios, empresas y viviendas" },
  { name: "Casablanca", href: "/#contacto", detail: "Consulta cobertura técnica" },
  { name: "Puchuncaví", href: "/destape-alcantarillado-puchuncavi", detail: "Sectores costeros e industriales" },
  { name: "Maitencillo", href: "/destape-alcantarillado-puchuncavi", detail: "Cobertura vía Puchuncaví" },
  { name: "Curauma", href: "/destape-alcantarillado-placilla-curauma", detail: "Condominios y redes compartidas" },
  { name: "Placilla", href: "/destape-alcantarillado-placilla-curauma", detail: "Placilla y Curauma" },
];

const highlightedZones = [
  { label: "Reñaca, Viña del Mar", href: "/zona/renaca-vina-del-mar" },
  { label: "Recreo, Viña del Mar", href: "/destape-alcantarillado-recreo-vina-del-mar" },
  { label: "Cerro Barón, Valparaíso", href: "/destape-alcantarillado-cerro-baron-valparaiso" },
  { label: "Placilla y Curauma", href: "/destape-alcantarillado-placilla-curauma" },
  { label: "Maitencillo, Puchuncaví", href: "/destape-alcantarillado-puchuncavi" },
  { label: "Concón costero", href: "/hidrojet-concon" },
];

const featuredClients: Array<{ name: string; logo?: string; detail: string }> = [
  { name: "KFC", logo: "/logos/kfc.webp", detail: "Restaurantes y continuidad operativa" },
  { name: "Sheraton", detail: "Hoteles y operación de alto estándar" },
  { name: "Mesita Grande", logo: "/logos/mesita-grande.png", detail: "Locales gastronómicos" },
  { name: "UPLA", detail: "Universidades e instituciones" },
  { name: "Bomberos", detail: "Instituciones de respuesta pública" },
  { name: "Carabineros", logo: "/logos/carabineros.png", detail: "Instituciones públicas" },
  { name: "Comunidades y edificios", detail: "Administraciones y condominios" },
  { name: "Restaurantes y locales", detail: "Comercio, cocinas y atención al público" },
];

const otherClients = [
  "FONASA",
  "Clínica Reñaca",
  "Chilquinta",
  "Wendy's",
  "Doggis",
  "Hospital Naval",
  "Hospital El Salvador Valparaíso",
  "Liceo Industrial de Valparaíso",
  "Bodegas del Salto",
];

const premiumPoints: Array<{ icon: IconComponent; title: string; description: string }> = [
  {
    icon: BadgeCheck,
    title: "Especialistas en urgencias sanitarias",
    description:
      "Intervenimos rebalses, cámaras saturadas, verticales obstruidas y redes críticas con criterio técnico y trazabilidad.",
  },
  {
    icon: ShieldCheck,
    title: "Respuesta para operación continua",
    description:
      "Soporte para edificios, comunidades, empresas, restaurantes e instituciones que necesitan recuperar servicio sin improvisación.",
  },
  {
    icon: Wrench,
    title: "Maquinaria profesional RIDGID",
    description:
      "Equipos mecánicos, hidrojet, videoinspección y motobombas para diagnosticar, destapar y prevenir reincidencias.",
  },
  {
    icon: Building2,
    title: "Cobertura técnica regional",
    description:
      "Atención 24/7 en comunas y sectores estratégicos de la Región de Valparaíso, con prioridad para emergencias.",
  },
];

const authorityPoints: Array<{ icon: IconComponent; title: string; description: string }> = [
  {
    icon: BadgeCheck,
    title: "Diagnóstico técnico",
    description: "Evaluamos síntomas, cámaras, artefactos, tramos verticales y horizontales antes de definir maniobra.",
  },
  {
    icon: FileText,
    title: "Informes y respaldo",
    description: "Entregamos antecedentes técnicos, evidencia y recomendaciones cuando el servicio lo requiere.",
  },
  {
    icon: ShieldCheck,
    title: "Evidencia operativa",
    description: "Registramos hallazgos relevantes para administradores, empresas o responsables del inmueble.",
  },
  {
    icon: Wrench,
    title: "Continuidad preventiva",
    description: "Proponemos mantención, hidrojet o videoinspección cuando existe riesgo de reincidencia.",
  },
];

const symptomItems = [
  {
    title: "Rebalse sanitario activo",
    description: "Aguas servidas expuestas, retorno por WC, cámara saturada o inundación que compromete uso del inmueble.",
  },
  {
    title: "Evacuación lenta o intermitente",
    description: "Desagües, lavaplatos, urinarios o redes interiores que pierden flujo y anticipan una obstrucción mayor.",
  },
  {
    title: "Redes verticales u horizontales exigidas",
    description: "Edificios, condominios, restaurantes y empresas con carga sanitaria alta o eventos recurrentes.",
  },
  {
    title: "Olores persistentes y riesgo higiénico",
    description: "Sectores afectados por aguas servidas, grasas, sedimentos o intervenciones sanitarias que requieren recuperación técnica.",
  },
];

const antiPortfolioExclusions = [
  "Gasfitería doméstica general",
  "Cambio de llaves, sifones o gomas",
  "Instalación de artefactos sanitarios",
  "Detección de fugas de agua potable",
  "Reparaciones estructurales directas",
  "Limpieza de vidrios",
  "Aseo doméstico básico",
];

const mailButtonClass =
  "rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-bold text-black shadow-sm shadow-slate-900/10 transition hover:border-slate-400 hover:bg-slate-50";

export type HomePageCmsContent = {
  homeSettings: CmsHomeSettings;
  featuredServices: CmsFeaturedService[];
  equipmentItems: CmsEquipmentItem[];
  clients: CmsClientItem[];
  commercialBlocks: CmsCommercialBlock[];
  galleryItems: CmsGalleryEntry[];
  videos: CmsVideoEntry[];
  cases: CaseStudy[];
  blogPosts: BlogPost[];
};

type HomePageContentProps = {
  cmsContent?: HomePageCmsContent;
};

export const metadata: Metadata = {
  title: "Destape de alcantarillado, hidrojet y urgencias sanitarias 24/7 en Región de Valparaíso",
  description:
    "Hidrourgencias SpA: destape de alcantarillado y desagües, hidrojet 4000 PSI, videoinspección sanitaria, mantención preventiva, sanitización e higienización con atención 24/7 en la Región de Valparaíso.",
  keywords: [
    "destape de alcantarillado",
    "destape de desagües",
    "hidrojet 4000 PSI",
    "urgencias sanitarias 24/7",
    "mantención de alcantarillado",
    "videoinspección sanitaria",
    "sanitización e higienización",
    "Viña del Mar",
    "Valparaíso",
    "Concón",
    "Quilpué",
    "Villa Alemana",
    "Puchuncaví",
    "Limache",
    "Quillota",
    "Placilla de Curauma",
  ],
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Hidrourgencias SpA | Urgencias sanitarias y destape técnico 24/7",
    description:
      "15 años resolviendo contingencias sanitarias con hidrojet 4000 PSI, equipos RIDGID y atención profesional en la Región de Valparaíso.",
    url: siteUrl,
    type: "website",
    locale: "es_CL",
    images: [
      {
        url: "/images/hero-urgencia.jpg",
        width: 1200,
        height: 630,
        alt: "Hidrourgencias SpA en operación técnica sanitaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidrourgencias SpA | Urgencias sanitarias 24/7",
    description: "Destape de alcantarillado y desagües con hidrojet, RIDGID y diagnóstico técnico profesional.",
    images: ["/images/hero-urgencia.jpg"],
  },
};

function SocialIcon({ label }: { label: string }) {
  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M14 8h3V5h-3c-2.76 0-5 2.24-5 5v2H7v3h2v4h3v-4h3l1-3h-4v-2c0-1.1.9-2 2-2Z" />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25Zm0 2A1.75 1.75 0 1 0 13.75 12 1.75 1.75 0 0 0 12 10.25ZM16.75 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"
        />
      </svg>
    );
  }

  if (label === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.8 8.08a2.9 2.9 0 0 0-2.04-2.06C18.04 5.5 12 5.5 12 5.5s-6.04 0-7.76.52A2.9 2.9 0 0 0 2.2 8.08 30.2 30.2 0 0 0 1.75 12c0 1.31.15 2.62.45 3.92a2.9 2.9 0 0 0 2.04 2.06c1.72.52 7.76.52 7.76.52s6.04 0 7.76-.52a2.9 2.9 0 0 0 2.04-2.06c.3-1.3.45-2.61.45-3.92s-.15-2.62-.45-3.92ZM10 15.25V8.75L15.5 12 10 15.25Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.7 6.2a4.4 4.4 0 0 1 3.3 4.22v7.37a4.4 4.4 0 0 1-4.4 4.4H10.2a4.4 4.4 0 0 1-4.4-4.4V10.4A4.4 4.4 0 0 1 10.2 6h7.38a4.4 4.4 0 0 1 1.11.2Zm-5.1 4.4v7.2h1.8v-7.2h-1.8Zm-3.6 2.2v5h1.8v-5H10Zm7.2 1.4v3.6H19v-3.6h-1.8Zm-9.3-10a3.1 3.1 0 0 0-3.1 3.1v10.5a3.1 3.1 0 0 0 3.1 3.1h10.5a3.1 3.1 0 0 0 3.1-3.1V7.3a3.1 3.1 0 0 0-3.1-3.1H7.9Z"
      />
    </svg>
  );
}

function SymptomsSection() {
  return (
    <section id="sintomas" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="rounded-[2rem] border border-sky-200 bg-white px-6 py-8 shadow-[0_24px_70px_-44px_rgba(8,56,95,0.55)] sm:px-10">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Síntomas que requieren respuesta técnica</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Si la red sanitaria falla, el tiempo de reacción importa
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-700 sm:text-base">
            Priorizamos síntomas de alto impacto para asignar el recurso correcto: RIDGID, hidrojet, motobomba,
            videoinspección o recuperación higiénico-sanitaria posterior.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {symptomItems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AntiPortfolioSection() {
  return (
    <section id="especialidad-sanitaria" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-md sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Especialización operativa</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Nuestra especialidad es la red sanitaria de alto impacto
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-700 sm:text-base">
            Para garantizar tiempos de respuesta rápidos, criterio técnico y calidad operativa, Hidrourgencias SpA
            concentra su trabajo en alcantarillado, desagüe, hidrojet, videoinspección sanitaria, mantención preventiva,
            revisión técnica de redes, recuperación de espacios afectados e higienización técnica.
          </p>
          <p className="mt-5 text-base font-extrabold text-[#08385f]">
            No somos gasfitería básica. Somos especialistas en urgencias sanitarias, alcantarillado, desagüe, revisión
            técnica de redes, recuperación higiénico-sanitaria y continuidad operativa.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-950">Hidrourgencias SpA NO realiza:</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {antiPortfolioExclusions.map((item) => (
              <p key={item} className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-bold leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ cmsContent }: HomePageContentProps) {
  const blogPosts = (cmsContent?.blogPosts ?? []).slice(0, 3);
  const displayedClients = (cmsContent?.clients.length ? cmsContent.clients : featuredClients).map((client) => {
    const fallback = featuredClients.find((item) => item.name === client.name);

    return {
      name: client.name,
      logo: client.logo,
      alt: "alt" in client ? client.alt : `Logo de ${client.name}`,
      detail: "description" in client && client.description ? client.description : fallback?.detail ?? "Cliente atendido por Hidrourgencias SpA",
    };
  });
  const visiblePremiumPoints = premiumPoints.map((point, index) => {
    const block = cmsContent?.commercialBlocks[index];

    return {
      ...point,
      title: block?.title || point.title,
      description: block?.text || point.description,
    };
  });
  const extraCoverageLinks = comunasSeo.slice(0, 6).flatMap((comuna) =>
    comuna.sectores.slice(0, 2).map((sector) => ({
      label: `${sector}, ${comuna.comuna}`,
      href: `/${createSeoSlug("destape-alcantarillado", sector, comuna.slug)}`,
    })),
  );

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hidrourgencias SpA",
    url: siteUrl,
    description: metadata.description,
    about: serviceCatalog.map((service) => service.title),
  }).replace(/</g, "\\u003c");

  return (
    <main className="min-h-screen text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <HeroUrgencias settings={cmsContent?.homeSettings} />
      <SymptomsSection />
      <ServiciosGrid services={cmsContent?.featuredServices} />
      <AntiPortfolioSection />

      <section id="comunas" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white px-6 py-9 shadow-[0_24px_70px_-44px_rgba(8,56,95,0.55)] sm:px-10 sm:py-11">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Comunas y sectores donde atendemos</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Cobertura territorial</h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-700 sm:text-base">
            Comunas y sectores donde atendemos con destape de alcantarillado, hidrojet, mantención preventiva y urgencias
            sanitarias 24/7.
          </p>

          <div className="relative mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
            <h3 className="text-xl font-extrabold tracking-tight text-[#08385f]">
              Encuentra el servicio sanitario más cercano a tu zona
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Selecciona tu comuna o sector para revisar cobertura local y activar atención por WhatsApp cuando se trate
              de rebalse, destape urgente o mantención sanitaria.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coverageComunas.map((page, index) => (
              <a
                key={page.name}
                href={page.href}
                className={`group rounded-2xl border px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  index % 4 === 0
                    ? "border-[#08385f]/20 bg-[#08385f] text-white"
                    : "border-sky-200 bg-white text-slate-800 hover:border-sky-300"
                }`}
              >
                <span className="flex items-start gap-3">
                  <MapPin className={`mt-0.5 h-5 w-5 flex-none ${index % 4 === 0 ? "text-sky-100" : "text-sky-700"}`} />
                  <span>
                    <span className="block text-base font-extrabold">{page.name}</span>
                    <span className={`mt-1 block text-sm leading-6 ${index % 4 === 0 ? "text-slate-100" : "text-slate-600"}`}>
                      {page.detail}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 flex-none transition group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>

          <div className="relative mt-8 border-t border-slate-200 pt-7">
            <h3 className="text-xl font-extrabold tracking-tight text-slate-950">Cobertura por zonas destacadas</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {highlightedZones.map((zone, index) => (
                <a
                  key={zone.href}
                  href={zone.href}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    index % 3 === 0
                      ? "border-[#08385f]/20 bg-[#08385f] text-white"
                      : index % 3 === 1
                        ? "border-sky-200 bg-sky-50 text-[#08385f]"
                        : "border-sky-200 bg-white text-slate-800"
                  }`}
                >
                  <MapPin className="h-4 w-4 flex-none" />
                  {zone.label}
                </a>
              ))}
            </div>
            <a
              href={createWhatsAppUrl("Necesito consultar cobertura sanitaria por mi zona.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:-translate-y-1 hover:bg-emerald-100"
            >
              <PhoneCall className="h-4 w-4" />
              Consultar cobertura por WhatsApp
            </a>
          </div>

          <details className="relative mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-sky-800 [&::-webkit-details-marker]:hidden">
              Ver más zonas
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
              {extraCoverageLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-800"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </section>

      <ProcesoOperativo />
      <CTAUrgente />

      <section id="empresa-tecnica-premium" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white px-6 py-9 shadow-[0_24px_70px_-44px_rgba(8,56,95,0.55)] sm:px-10 sm:py-11">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            Destape de alcantarillado y urgencias sanitarias 24/7
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Empresa técnica premium
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-700 sm:text-base">
            Hidrourgencias SpA se posiciona como especialista técnico para contingencias sanitarias severas, mantención de
            redes, continuidad operativa y atención profesional en la Región de Valparaíso.
          </p>
          <div className="relative mt-7 grid gap-4 md:grid-cols-2">
            {visiblePremiumPoints.map((item, index) => {
              const isDark = index === 0;

              return (
                <article
                  key={item.title}
                  className={`relative overflow-hidden rounded-2xl border p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isDark
                      ? "border-sky-900/20 bg-[linear-gradient(145deg,#08385f_0%,#0e5f86_100%)] text-white"
                      : "border-sky-200 bg-[linear-gradient(145deg,#ffffff_0%,#eff8ff_100%)] text-slate-900"
                  }`}
                >
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                      isDark ? "bg-white/15 text-sky-100" : "bg-white text-sky-700 shadow-sm"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-lg font-extrabold tracking-tight">{item.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${isDark ? "text-slate-100" : "text-slate-700"}`}>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <GaleriaOperativa equipmentItems={cmsContent?.equipmentItems} galleryItems={cmsContent?.galleryItems} />
      <VideosTecnicos videos={cmsContent?.videos} />

      <section id="clientes" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 shadow-md sm:px-10 sm:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Evidencia institucional</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Algunos de nuestros clientes
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Empresas, instituciones, comunidades, edificios, restaurantes y locales que han confiado en servicios
              sanitarios especializados.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {displayedClients.map((client) => (
              <article
                key={client.name}
                className="group flex min-h-[172px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-20 w-full items-center justify-center">
                  {client.logo ? (
                    <StaticPicture
                      src={client.logo}
                      alt={client.alt}
                      width={240}
                      height={120}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="inline-flex h-20 w-full items-center justify-center rounded-2xl bg-sky-50 px-3 text-center text-lg font-black text-[#08385f]">
                      {client.name}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-center text-sm font-semibold text-slate-700">{client.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-center text-xl font-bold tracking-tight text-slate-950">Otros clientes atendidos</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherClients.map((client) => (
                <p
                  key={client}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true" />
                  {client}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              No improvises. Trabajamos con quienes exigen resultados reales.
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={createWhatsAppUrl("Hola, necesito apoyo con un servicio de destape, diagnóstico o mantención sanitaria.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-1 hover:bg-emerald-600"
              >
                Solicitar atención inmediata
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-full px-7 py-3 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Ver reseñas en Google
              </a>
            </div>
          </div>
        </div>
      </section>

      <CasosReales cases={cmsContent?.cases} />

      <section id="autoridad-tecnica" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white px-6 py-9 shadow-[0_24px_70px_-44px_rgba(8,56,95,0.55)] sm:px-10 sm:py-11">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Autoridad técnica</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Respaldo profesional para contingencias sanitarias de alto impacto
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-700 sm:text-base">
            Diagnóstico, informes, evidencia, recomendaciones y continuidad técnica para administradores, empresas,
            edificios y clientes que necesitan decisiones claras después de una contingencia sanitaria.
          </p>
          <div className="relative mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {authorityPoints.map((item) => (
              <article key={item.title} className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] px-6 py-8 shadow-md sm:px-10 sm:py-10">
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Blog técnico</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Guías técnicas y contenido útil para prevenir urgencias sanitarias y tomar mejores decisiones
              </h2>
            </div>
            <a
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08385f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-950/20 transition hover:-translate-y-1 hover:bg-[#0e5f86]"
            >
              Ver todos los artículos
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post, index) => {
              const image = post.image ?? getBlogGuideImage(index);
              const imageAlt = post.imageAlt ?? `Guía técnica sobre ${post.h1} - Hidrourgencias SpA`;

              return (
                <article
                  key={post.slug}
                  className="group overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-sky-50">
                    <StaticPicture
                      src={image}
                      alt={imageAlt}
                      width={640}
                      height={360}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/45 to-transparent" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Guía técnica</p>
                    <h3 className="mt-3 text-lg font-extrabold leading-7 text-slate-950">{post.h1}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
                    <a
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-800 transition hover:bg-sky-100"
                    >
                      Leer guía técnica
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-6 lg:pb-24 lg:pt-14">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-9 text-white shadow-[0_26px_58px_-24px_rgba(2,6,23,0.85)] sm:px-10 sm:py-11">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Contacto directo</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Respuesta técnica confiable para contingencias sanitarias severas
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-200 sm:text-base">
                Coordinamos atención 24/7 para urgencias, destape de alcantarillado, rebalse de aguas servidas,
                mantención preventiva, hidrojet y diagnóstico técnico en la Región de Valparaíso.
              </p>
            </div>
            <div className="grid gap-3">
              <ServiceTermsNotice tone="dark" />
              <p className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm leading-7 text-slate-200">
                Mientras más claro sea el síntoma, mejor podemos asignar equipo: RIDGID, hidrojet, motobomba,
                videoinspección o revisión técnica sanitaria.
              </p>
              <a
                href={createWhatsAppUrl("Hola, necesito atención por urgencia sanitaria. Requiero prioridad por posible rebalse activo.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                WhatsApp urgencia sanitaria
              </a>
              <a
                href="/#servicios"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Ver servicios sanitarios
              </a>
              <a
                href="/#comunas"
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Revisar cobertura territorial
              </a>
              <a href={createMailToUrl()} className={`inline-flex items-center justify-center gap-2 ${mailButtonClass}`}>
                <Mail className="h-4 w-4" />
                Enviar solicitud por correo
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-xl px-5 py-3 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Opiniones de clientes
              </a>
            </div>
          </div>

          <footer className="mt-9 border-t border-white/15 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-300 sm:text-sm">
                Hidrourgencias SpA | Destape de alcantarillado, hidrojet y urgencias sanitarias 24/7.
              </p>
              <div className="flex flex-wrap gap-2">
                {siteConfig.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    <SocialIcon label={item.label} />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
