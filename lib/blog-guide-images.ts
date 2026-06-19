export const blogGuideImages = [
  "/guia-tecnica/guia-tecnica-01.jpeg",
  "/guia-tecnica/guia-tecnica-02.jpeg",
  "/guia-tecnica/guia-tecnica-03.jpeg",
  "/guia-tecnica/guia-tecnica-04.jpeg",
  "/guia-tecnica/guia-tecnica-05.jpeg",
  "/guia-tecnica/guia-tecnica-06.jpeg",
  "/guia-tecnica/guia-tecnica-07.jpeg",
  "/guia-tecnica/guia-tecnica-08.jpeg",
  "/guia-tecnica/guia-tecnica-09.jpeg",
  "/guia-tecnica/guia-tecnica-10.jpeg",
  "/guia-tecnica/guia-tecnica-11.jpeg",
] as const;

export function getBlogGuideImage(index: number) {
  return blogGuideImages[index % blogGuideImages.length];
}
