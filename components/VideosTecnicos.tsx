import { ExternalLink } from "@/components/icons";
import { StaticPicture } from "@/components/static-picture";
import type { CmsVideoEntry } from "@/lib/cms-content";

type VideosTecnicosProps = {
  videos?: CmsVideoEntry[];
};

export function VideosTecnicos({ videos = [] }: VideosTecnicosProps) {
  if (!videos.length) {
    return null;
  }

  return (
    <section id="videos" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white px-6 py-9 shadow-[0_24px_70px_-44px_rgba(8,56,95,0.55)] sm:px-10 sm:py-11">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Videos técnicos</p>
        <h2 className="mt-3 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Registros audiovisuales de trabajos y equipamiento
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-700 sm:text-base">
          Evidencia visual de intervenciones, diagnósticos, maniobras técnicas y continuidad operativa en terreno.
        </p>

        <div className="relative mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.slice(0, 6).map((video) => (
            <article
              key={video.slug}
              className="group overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
            >
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-sky-50">
                  <StaticPicture
                    src={video.thumbnail}
                    alt={video.thumbnailAlt}
                    width={640}
                    height={360}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-slate-950/25" aria-hidden="true" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#08385f] shadow-lg">
                    <ExternalLink className="h-4 w-4" />
                    Ver video
                  </span>
                </div>
              </a>
              <div className="p-6">
                <h3 className="text-lg font-extrabold leading-7 text-slate-950">{video.title}</h3>
                {video.description && <p className="mt-3 text-sm leading-7 text-slate-600">{video.description}</p>}
                {(video.service || video.commune) && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                    {[video.service, video.commune].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
