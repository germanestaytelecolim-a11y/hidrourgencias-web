import { generateContenidoZona } from "@/lib/generadorContenidoZona";
import { getZonasByLandingSlug } from "@/lib/zonas";

interface ComunaLandingProps {
  slug: string;
  comuna: string;
}

export function ComunaLanding({ slug, comuna }: ComunaLandingProps) {
  const zonas = getZonasByLandingSlug(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Bloque "Cerca de mí" */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold">
          Servicio de destape de alcantarillado cerca de ti en {comuna}
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Atendemos requerimientos en tu sector y zonas cercanas dentro de {comuna}, 
          permitiendo una respuesta rápida ante emergencias sanitarias como rebalses, 
          desagües colapsados o retorno de aguas servidas.
        </p>
        <p className="mt-2 text-base text-slate-600">
          Nuestra cobertura operativa está diseñada para llegar con rapidez, 
          evaluando cada situación en terreno y aplicando la solución más adecuada.
        </p>
      </section>

      {/* Listado de zonas con contenido único */}
      <div className="space-y-8">
        {zonas.map((zona) => {
          const contenido = generateContenidoZona(zona, comuna);

          return (
            <section key={zona} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[color:var(--primary)]">
                {contenido.titulo}
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-base text-slate-700 leading-relaxed">
                  {contenido.parrafo1}
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  {contenido.parrafo2}
                </p>
                <p className="text-base text-slate-700 leading-relaxed">
                  {contenido.parrafo3}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href={`https://wa.me/56940918672?text=Necesito%20destape%20en%20${zona}%20${comuna}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--secondary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-95"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
                  {contenido.cta}
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
