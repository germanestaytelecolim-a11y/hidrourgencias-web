import { AlertTriangle, Clock, ExternalLink, MapPin, Phone } from "@/components/icons";
import { ServiceTermsNotice } from "@/components/service-terms";
import { StaticPicture } from "@/components/static-picture";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

interface CTAUrgenteProps {
  comuna?: string;
}

const callHref = siteConfig.phoneHref;

export function CTAUrgente({ comuna }: CTAUrgenteProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#082f4f_0%,#08385f_48%,#0e5f86_100%)] py-16 sm:py-20">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "38px 38px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div className="text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200/35 bg-rose-400/10 px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-rose-100" />
              <span className="text-sm font-bold text-rose-50">Urgencia sanitaria</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              ¿Rebalse o emergencia{comuna ? ` en ${comuna}` : ""}?
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Si hay rebalse de aguas servidas, cámara colapsada, desagüe tapado, vertical obstruida, inundación
              sanitaria o mal olor severo, activa atención técnica 24/7 por WhatsApp.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-200" />
                <span>Atención 24 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-200" />
                <span>Cobertura regional</span>
              </div>
            </div>

            <ServiceTermsNotice tone="dark" className="mt-7 max-w-3xl" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={createWhatsAppUrl("Urgencia sanitaria: hay rebalse o emergencia y necesito atención inmediata.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#06c286] px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-1 hover:bg-emerald-600"
              >
                <Phone className="h-5 w-5" />
                WhatsApp inmediato
              </a>

              <a
                href={callHref}
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                Llamar: +56 9 4091 8672
              </a>

              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-xl px-6 py-4 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Valoración de clientes
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-[0_30px_75px_-44px_rgba(0,0,0,0.9)] backdrop-blur sm:p-6">
            <div className="rounded-[1.5rem] border border-sky-200/20 bg-white/10 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-20 w-20 flex-none overflow-hidden rounded-3xl border border-white/30 bg-white shadow-xl">
                  <StaticPicture
                    src="/images/logo-hidrourgencias.jpg"
                    alt="Logo Hidrourgencias SpA"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-100">Respuesta inmediata</p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-white">+56 9 4091 8672</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">
                    Envía sector, dirección y síntoma para orientar la salida técnica.
                  </p>
                </div>
              </div>

              <ServiceTermsNotice tone="dark" className="mt-6" />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={createWhatsAppUrl("Hola, necesito atención inmediata por urgencia sanitaria.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#06c286] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-600"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={callHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#08385f] transition hover:-translate-y-1 hover:bg-sky-50"
                >
                  <Phone className="h-4 w-4" />
                  Llamar
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["24/7", "RIDGID", "Hidrojet"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center">
                  <p className="text-lg font-black text-white">{item}</p>
                  <p className="text-xs font-semibold text-slate-300">Soporte técnico</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
