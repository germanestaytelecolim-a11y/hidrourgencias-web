import { ArrowRight, Clock, ExternalLink, MapPin, Phone, Shield } from "@/components/icons";
import { ServiceTermsNotice } from "@/components/service-terms";
import { StaticPicture } from "@/components/static-picture";
import type { CmsHomeSettings } from "@/lib/cms-content";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

const callHref = siteConfig.phoneHref;

const defaultHeroSettings: CmsHomeSettings = {
  heroTitle: "Disponibles 24/7 en la Región de Valparaíso",
  heroSubtitle: "Urgencias sanitarias 24 horas con respuesta técnica",
  heroImage: "/images/logo-hidrourgencias.jpg",
  heroImageAlt: "Logo Hidrourgencias SpA",
  primaryCtaText: "WhatsApp urgencia",
  primaryCtaUrl: "whatsapp:Urgencia sanitaria: necesito ayuda inmediata en la Región de Valparaíso",
  secondaryCtaText: "Servicios sanitarios",
  secondaryCtaUrl: "/#servicios",
};

type HeroUrgenciasProps = {
  settings?: CmsHomeSettings;
};

function resolveCtaHref(value: string | undefined, fallbackMessage: string) {
  if (!value) {
    return createWhatsAppUrl(fallbackMessage);
  }

  if (value.startsWith("whatsapp:")) {
    return createWhatsAppUrl(value.replace(/^whatsapp:/, ""));
  }

  return value;
}

export function HeroUrgencias({ settings }: HeroUrgenciasProps) {
  const hero = settings ?? defaultHeroSettings;
  const primaryHref = resolveCtaHref(hero.primaryCtaUrl, "Urgencia sanitaria: necesito ayuda inmediata en la Región de Valparaíso");
  const secondaryHref = hero.secondaryCtaUrl ? resolveCtaHref(hero.secondaryCtaUrl, "Necesito información sobre servicios sanitarios.") : "";

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#08385f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,174,239,0.28),transparent_34%),linear-gradient(135deg,#082f4f_0%,#08385f_46%,#0e5f86_100%)]" />
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
            backgroundSize: "34px 34px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="min-w-0 max-w-full text-white">
            <div className="mb-6 inline-flex h-10 max-w-full items-center gap-2 rounded-full border border-sky-200/30 bg-sky-300/10 px-4 py-2">
              <Clock className="h-4 w-4 flex-none text-sky-200" />
              <span className="truncate text-sm font-bold text-sky-100">Urgencias sanitarias 24/7</span>
            </div>

            <h1 className="max-w-[calc(100vw-2rem)] break-words text-3xl font-black leading-tight tracking-tight sm:max-w-4xl sm:text-5xl lg:text-6xl">
              {hero.heroTitle}
            </h1>

            <p className="mt-5 max-w-[calc(100vw-2rem)] break-words text-xl font-extrabold leading-tight text-[#00aeef] sm:max-w-4xl sm:text-3xl">
              {hero.heroSubtitle}
            </p>

            <p className="mt-6 max-w-[calc(100vw-2rem)] break-words text-sm leading-7 text-slate-100 sm:max-w-2xl sm:text-xl sm:leading-8">
              Destape de alcantarillado, hidrojet 4000 PSI, videoinspección y mantención preventiva con criterio
              profesional para edificios, comunidades, empresas y viviendas.
            </p>

            <ServiceTermsNotice tone="dark" className="mt-7 max-w-[calc(100vw-2rem)] sm:max-w-3xl" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#06c286] px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-1 hover:bg-emerald-600"
              >
                <Phone className="h-5 w-5" />
                {hero.primaryCtaText}
              </a>

              {hero.secondaryCtaText && secondaryHref && (
                <a
                  href={secondaryHref}
                  className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/20"
                >
                  {hero.secondaryCtaText}
                  <ArrowRight className="h-5 w-5" />
                </a>
              )}

              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-xl px-6 py-4 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Ver reseñas en Google
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-200" />
                <span>Técnicos certificados</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-200" />
                <span>Cobertura regional</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-200" />
                <span>Atención prioritaria 24/7</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-6">
              <div className="rounded-[1.6rem] border border-sky-200/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.05))] p-5 sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 flex-none overflow-hidden rounded-3xl border border-white/30 bg-white p-2 shadow-xl">
                    <StaticPicture
                      src={hero.heroImage}
                      alt={hero.heroImageAlt}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-100">Respuesta inmediata</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">+56 9 4091 8672</p>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-200">
                      Envía comuna, dirección, síntomas y fotos del punto afectado para orientar el recurso técnico.
                    </p>
                  </div>
                </div>

                <ServiceTermsNotice tone="dark" className="mt-6" />

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <a
                    href={createWhatsAppUrl("Hola, necesito atención inmediata por urgencia sanitaria.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06c286] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-1 hover:bg-emerald-600"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={callHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white px-5 py-3 text-sm font-bold text-[#08385f] transition hover:-translate-y-1 hover:bg-sky-50"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </a>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-black text-white">15+ años</p>
                  <p className="mt-1 text-sm text-slate-200">Experiencia operativa en terreno</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-black text-white">RIDGID</p>
                  <p className="mt-1 text-sm text-slate-200">Equipamiento técnico profesional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H0Z"
            fill="#eff8ff"
          />
        </svg>
      </div>
    </section>
  );
}
