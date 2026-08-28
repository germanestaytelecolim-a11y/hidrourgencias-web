import { createAdminId, saveWorkCase } from "@/lib/admin/db";
import { buildWorkSlug, slugifyAdmin } from "@/lib/admin/slug";
import type { AdminSessionUser } from "@/lib/admin/auth";
import type { MediaAsset, WorkCase, WorkStatus } from "@/lib/admin/types";

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

function getServices(formData: FormData) {
  return formData.getAll("services").map((item) => String(item)).filter(Boolean);
}

export function validateWorkCaseForm(formData: FormData) {
  const errors: string[] = [];
  const title = getString(formData, "title");
  const commune = getString(formData, "commune");
  const propertyType = getString(formData, "propertyType");
  const problem = getString(formData, "problem");
  const intervention = getString(formData, "intervention");
  const result = getString(formData, "result");
  const services = getServices(formData);

  if (!title) errors.push("Ingresa un título del trabajo.");
  if (!commune) errors.push("Selecciona una comuna.");
  if (!propertyType) errors.push("Selecciona tipo de propiedad.");
  if (!services.length) errors.push("Selecciona al menos un servicio.");
  if (!problem) errors.push("Describe la situación encontrada.");
  if (!intervention) errors.push("Describe la intervención realizada.");
  if (!result) errors.push("Describe el resultado observado.");

  return errors;
}

export async function buildWorkCaseFromForm({
  formData,
  user,
  existing,
  media,
  status,
}: {
  formData: FormData;
  user: AdminSessionUser;
  existing?: WorkCase | null;
  media?: MediaAsset[];
  status: WorkStatus;
}) {
  const now = new Date().toISOString();
  const services = getServices(formData);
  const title = getString(formData, "title");
  const commune = getString(formData, "commune");
  const sector = getString(formData, "sector");
  const propertyType = getString(formData, "propertyType");
  const publicLocation = sector ? `${sector} · ${commune}` : commune;
  const baseSlug = existing?.slug || buildWorkSlug({ services, propertyType, commune, title });

  const workCase: WorkCase = {
    id: existing?.id ?? createAdminId(),
    title,
    slug: slugifyAdmin(baseSlug),
    status,
    date: getString(formData, "date") || now.slice(0, 10),
    commune,
    sector,
    privateAddress: getString(formData, "privateAddress"),
    publicLocation,
    propertyType,
    services,
    problem: getString(formData, "problem"),
    diagnosis: getString(formData, "diagnosis"),
    intervention: getString(formData, "intervention"),
    equipment: getString(formData, "equipment"),
    result: getString(formData, "result"),
    recommendation: getString(formData, "recommendation"),
    featured: getBoolean(formData, "featured"),
    showInCases: getBoolean(formData, "showInCases"),
    showInCommune: getBoolean(formData, "showInCommune"),
    showInServices: getBoolean(formData, "showInServices"),
    showOnHome: getBoolean(formData, "showOnHome"),
    videoMode: (getString(formData, "videoMode") || "none") as WorkCase["videoMode"],
    videoUrl: getString(formData, "videoUrl"),
    origin: existing?.origin ?? "admin",
    legacyId: existing?.legacyId,
    clientName: existing?.clientName,
    createdBy: existing?.createdBy ?? user.id,
    updatedBy: user.id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt,
    media: media ?? existing?.media ?? [],
  };

  await saveWorkCase(workCase);
  return workCase;
}
