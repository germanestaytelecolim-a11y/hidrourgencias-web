/* eslint-disable @next/next/no-html-link-for-pages */
import { ExternalLink, Mail, PhoneCall } from "@/components/icons";
import { StaticPicture } from "@/components/static-picture";
import { GOOGLE_REVIEWS_URL, createMailToUrl, createWhatsAppUrl } from "@/lib/site-config";
import { comunasSeo, createSeoSlug, serviciosSeo } from "@/lib/seo-territorial";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#mantenimiento", label: "Mantenimiento" },
  { href: "/#clientes", label: "Evidencia" },
  { href: "/casos-de-exito", label: "Casos" },
  { href: "/blog", label: "Blog" },
  { href: "/#contacto", label: "Contacto" },
];

const mailButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 xl:px-4 xl:text-sm";

const coverageComunas = comunasSeo.slice(0, 7);
const coverageSectors = comunasSeo.flatMap((comuna) =>
  comuna.sectores.slice(0, 2).map((sector) => ({
    label: `${sector}, ${comuna.comuna}`,
    href: `/${createSeoSlug("destape-alcantarillado", sector, comuna.slug)}`,
  })),
).slice(0, 8);
const coverageServices = [
  ...serviciosSeo.slice(0, 6),
  {
    slug: "limpieza-higienizacion-sanitizacion",
    pageSlug: "limpieza-higienizacion-sanitizacion",
    nombre: "Limpieza, higienización y sanitización",
  },
  {
    slug: "limpieza-domicilios-recuperacion-espacios",
    pageSlug: "limpieza-domicilios-recuperacion-espacios",
    nombre: "Limpieza de domicilios",
  },
  {
    slug: "limpieza-fachadas-hidrolavado-superficies",
    pageSlug: "limpieza-fachadas-hidrolavado-superficies",
    nombre: "Hidrolavado de fachadas",
  },
  {
    slug: "extraccion-aguas-estanques-piscinas",
    pageSlug: "extraccion-aguas-estanques-piscinas",
    nombre: "Extracción de aguas",
  },
  {
    slug: "asesoria-mantenimiento-integral-redes-sanitarias",
    pageSlug: "asesoria-mantenimiento-integral-redes-sanitarias",
    nombre: "Asesoría sanitaria",
  },
  {
    slug: "analisis-tecnico-propiedad-redes-sanitarias",
    pageSlug: "analisis-tecnico-propiedad-redes-sanitarias",
    nombre: "Análisis técnico de propiedad",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/90 bg-white/95 shadow-lg shadow-sky-950/10 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <a href="/" className="flex min-w-0 flex-1 items-center gap-3 lg:min-w-[22rem]">
          <div className="relative h-14 w-14 flex-none overflow-hidden rounded-2xl border border-sky-100 bg-white p-1 shadow-lg shadow-sky-950/15 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]">
            <StaticPicture
              src="/images/logo-hidrourgencias.jpg"
              alt="Logo Hidrourgencias SpA"
              width={80}
              height={80}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:whitespace-nowrap lg:text-[1.7rem] xl:text-3xl">
              Hidrourgencias SpA
            </p>
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 sm:block sm:text-xs">
              Urgencias sanitarias 24/7 | Región de Valparaíso
            </p>
          </div>
        </a>

        <nav className="ml-auto hidden items-center gap-3 2xl:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-700 transition hover:text-sky-800">
              {item.label}
            </a>
          ))}
          <details className="group relative">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700 transition hover:text-sky-800 [&::-webkit-details-marker]:hidden">
              Cobertura
            </summary>
            <div className="absolute right-0 top-8 z-50 grid w-[680px] grid-cols-3 gap-5 rounded-2xl border border-sky-100 bg-white p-5 shadow-2xl shadow-sky-950/20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Comunas</p>
                <div className="mt-3 grid gap-2">
                  {coverageComunas.map((comuna) => (
                    <a key={comuna.slug} href={comuna.landingPath} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800">
                      {comuna.comuna}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Sectores</p>
                <div className="mt-3 grid gap-2">
                  {coverageSectors.map((sector) => (
                    <a key={sector.href} href={sector.href} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800">
                      {sector.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Servicios</p>
                <div className="mt-3 grid gap-2">
                  {coverageServices.map((service) => (
                    <a key={service.slug} href={`/servicios/${service.pageSlug}`} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-800">
                      {service.nombre}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </details>
        </nav>

        <div className="ml-auto hidden items-center gap-2 xl:flex lg:ml-0">
          <a href="#terminos-servicio" className="text-xs font-bold text-amber-700 transition hover:text-amber-900">
            Términos del servicio
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="brand-review-link brand-focus-ring rounded-full px-3.5 py-2 text-xs font-bold xl:px-4 xl:text-sm"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" />
            Resenas Google
          </a>
          <a href={createMailToUrl()} className={mailButtonClass}>
            <Mail className="h-4 w-4" />
            Enviar solicitud por correo
          </a>
          <a
            href={createWhatsAppUrl("Hola, necesito urgencia sanitaria 24/7 en Región de Valparaíso.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c286] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-600 xl:px-4 xl:text-sm"
          >
            <PhoneCall className="h-4 w-4" />
            WhatsApp 24/7
          </a>
        </div>

        <details className="relative ml-auto 2xl:hidden">
          <summary className="list-none rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 max-h-[calc(100vh-6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-sky-100 bg-white p-4 shadow-xl shadow-sky-950/20">
            <div className="space-y-1">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-800">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Cobertura</p>
              <div className="mt-2 grid gap-1">
                {coverageComunas.slice(0, 5).map((comuna) => (
                  <a key={comuna.slug} href={comuna.landingPath} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-800">
                    {comuna.comuna}
                  </a>
                ))}
                {coverageServices.slice(0, 3).map((service) => (
                  <a key={service.slug} href={`/servicios/${service.pageSlug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-800">
                    {service.nombre}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              <a href="#terminos-servicio" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-bold text-amber-950">
                Términos del servicio
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-lg px-3 py-2 text-center text-sm font-bold"
              >
                Opiniones de clientes
              </a>
              <a
                href={createWhatsAppUrl("Hola, necesito urgencia sanitaria 24/7 en Región de Valparaíso.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#06c286] px-3 py-2 text-center text-sm font-semibold text-white"
              >
                WhatsApp urgencia sanitaria
              </a>
              <a href={createMailToUrl()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-bold text-black">
                Enviar solicitud por correo
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
