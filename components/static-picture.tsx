import type { ImgHTMLAttributes } from "react";

type StaticPictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  pictureClassName?: string;
};

function sourceWithExtension(src: string, extension: "avif" | "webp") {
  return src.replace(/\.(jpe?g|png)$/i, `.${extension}`);
}

function canUseGeneratedSources(src: string) {
  return (
    /\.(jpe?g|png)$/i.test(src) &&
    (src === "/images/logo-hidrourgencias.jpg" || src.startsWith("/images/PRINCIPAL/") || src.startsWith("/logos/"))
  );
}

export function StaticPicture({ src, alt, className, pictureClassName, decoding = "async", ...props }: StaticPictureProps) {
  const useGeneratedSources = canUseGeneratedSources(src);

  return (
    <picture className={pictureClassName ?? "block h-full w-full"}>
      {useGeneratedSources && <source srcSet={sourceWithExtension(src, "avif")} type="image/avif" />}
      {useGeneratedSources && <source srcSet={sourceWithExtension(src, "webp")} type="image/webp" />}
      <img src={src} alt={alt} className={className} decoding={decoding} {...props} />
    </picture>
  );
}
