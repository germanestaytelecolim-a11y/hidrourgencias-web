export function slugifyAdmin(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

export function buildWorkSlug(input: { services: string[]; propertyType: string; commune: string; title: string }) {
  const service = input.services[0] || "trabajo-sanitario";
  return slugifyAdmin(`${service} ${input.propertyType} ${input.commune}`) || slugifyAdmin(input.title) || "trabajo-sanitario";
}
