import { ClientLogoCaseStudy } from "@/components/ClientLogoCaseStudy";
import { getCaseStudyTrustLogos } from "@/lib/case-studies";

export function CaseStudyTrustLogos() {
  const clients = getCaseStudyTrustLogos();

  if (!clients.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Módulo de confianza</p>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
        Clientes e Instituciones que han confiado en Hidrourgencias
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <article key={client.slug} className="rounded-2xl border border-sky-100 bg-white p-4">
            <ClientLogoCaseStudy logo={client.logo} compact />
            <p className="mt-3 text-center text-sm font-bold text-slate-800">{client.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
