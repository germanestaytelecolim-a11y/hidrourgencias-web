import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { MapPinned, Wrench } from "lucide-react";

import type { LandingVisualProfile } from "@/lib/landing-visuals";

type LandingVisualHeroProps = {
  profile: LandingVisualProfile;
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
};

type AccentStyle = CSSProperties & {
  "--landing-accent": string;
};

export function LandingVisualHero({ profile, eyebrow, title, children, actions }: LandingVisualHeroProps) {
  const Icon = profile.family === "zona" ? MapPinned : Wrench;
  const sideClass = profile.imageSide === "left" ? "landing-visual-hero--image-left" : "landing-visual-hero--image-right";
  const accentStyle: AccentStyle = { "--landing-accent": profile.accent };

  return (
    <section
      className={["landing-visual-hero", "landing-visual-hero--" + profile.variant, sideClass].join(" ")}
      style={accentStyle}
      data-visual-variant={profile.variant}
    >
      <figure className="landing-visual-hero__media">
        <Image
          src={profile.image}
          alt={profile.alt}
          fill
          sizes="(max-width: 959px) 100vw, (min-width: 1280px) 680px, 52vw"
          className="landing-visual-hero__image"
          style={{ objectPosition: profile.objectPosition }}
          preload
        />
        <div className="landing-visual-hero__overlay" aria-hidden="true" />
        {profile.source.url ? (
          <figcaption className="landing-visual-hero__credit">
            Foto:{" "}
            <a href={profile.source.url} target="_blank" rel="noopener noreferrer">
              {profile.source.label}
            </a>
            {profile.source.licenseUrl ? (
              <>
                {" · "}
                <a href={profile.source.licenseUrl} target="_blank" rel="license noopener noreferrer">
                  {profile.source.license}
                </a>
              </>
            ) : null}
          </figcaption>
        ) : null}
      </figure>

      <div className="landing-visual-hero__copy">
        <p className="landing-visual-hero__eyebrow">
          <Icon aria-hidden="true" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <div className="landing-visual-hero__body">{children}</div>
        <div className="landing-visual-hero__actions">{actions}</div>
      </div>
    </section>
  );
}
