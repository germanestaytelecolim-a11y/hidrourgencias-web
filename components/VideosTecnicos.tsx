"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { StaticPicture } from "@/components/static-picture";
import type { CmsVideoEntry } from "@/lib/cms-content";

function youtubeId(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
              url.hostname,
            )
          ? url.pathname === "/watch"
            ? url.searchParams.get("v")
            : /^\/(shorts|embed)\//.test(url.pathname)
              ? url.pathname.split("/")[2]
              : null
          : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
function VideoCard({ video, id }: { video: CmsVideoEntry; id: string }) {
  const [active, setActive] = useState(false);
  return (
    <article className="home-video-card">
      <div className="home-video-frame">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={video.title}
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Cargar video: ${video.title}`}
          >
            <StaticPicture
              src={video.thumbnail}
              alt={video.thumbnailAlt}
              width={640}
              height={360}
              loading="lazy"
            />
            <span>
              <Play size={24} aria-hidden="true" /> Cargar video
            </span>
          </button>
        )}
      </div>
      <h3>{video.title}</h3>
      {video.description && <p>{video.description}</p>}
    </article>
  );
}
export function VideosTecnicos({ videos = [] }: { videos?: CmsVideoEntry[] }) {
  const valid = videos
    .filter(
      (video) =>
        video.published && video.thumbnail && youtubeId(video.videoUrl),
    )
    .slice(0, 4);
  if (!valid.length) return null;
  return (
    <section
      id="videos"
      className="home-section"
      aria-labelledby="home-videos-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Videos técnicos</p>
        <h2 id="home-videos-title">Intervenciones y equipamiento en acción</h2>
        <p>El reproductor de YouTube se carga cuando eliges un video.</p>
      </div>
      <div className="home-video-grid">
        {valid.map((video) => (
          <VideoCard
            key={video.slug}
            video={video}
            id={youtubeId(video.videoUrl)!}
          />
        ))}
      </div>
    </section>
  );
}
