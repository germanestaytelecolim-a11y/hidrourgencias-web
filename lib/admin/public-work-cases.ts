import { getPublicDistributionPaths } from "@/lib/admin/distribution-paths";
import { listWorkCases } from "@/lib/admin/db";
import type { WorkCase } from "@/lib/admin/types";

export type PublicWorkCaseDto = {
  id: string;
  slug: string;
  title: string;
  date: string;
  commune: string;
  sector: string;
  publicLocation: string;
  propertyType: string;
  services: string[];
  problem: string;
  diagnosis: string;
  intervention: string;
  equipment: string;
  result: string;
  recommendation: string;
  featured: boolean;
  media: Array<{
    id: string;
    url: string;
    thumbnailUrl?: string;
    caption: string;
    altText: string;
    isCover: boolean;
    sortOrder: number;
  }>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  origin: "admin" | "legacy";
  clientName?: string;
};

export function getCaseRecencyTimestamp(workCase: Pick<WorkCase, "date" | "publishedAt" | "createdAt" | "updatedAt">) {
  for (const value of [workCase.date, workCase.publishedAt, workCase.createdAt, workCase.updatedAt]) {
    if (!value) continue;
    const time = new Date(value).getTime();
    if (!Number.isNaN(time)) return time;
  }
  return 0;
}

export function sortCasesByRecency<T extends Pick<WorkCase, "date" | "publishedAt" | "createdAt" | "updatedAt">>(cases: T[]) {
  return [...cases].sort((a, b) => getCaseRecencyTimestamp(b) - getCaseRecencyTimestamp(a));
}

export async function getPublicWorkCasesForPath(path: string, limit = 12) {
  try {
    return sortCasesByRecency(
      (await listWorkCases())
      .filter((workCase) => workCase.status === "published")
      .filter((workCase) => getPublicDistributionPaths(workCase).includes(path)),
    )
      .slice(0, limit)
      .map(toPublicWorkCaseDto);
  } catch (error) {
    if (process.env.NODE_ENV === "production" && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      return [];
    }
    throw error;
  }
}

export async function getPublicWorkCaseBySlug(slug: string) {
  try {
    const workCase = (await listWorkCases()).find((item) => item.status === "published" && item.slug === slug);
    return workCase ? toPublicWorkCaseDto(workCase) : null;
  } catch (error) {
    if (process.env.NODE_ENV === "production" && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      return null;
    }
    throw error;
  }
}

export function toPublicWorkCaseDto(workCase: WorkCase): PublicWorkCaseDto {
  const publicMedia = workCase.media.filter((asset) => asset.isPublic);
  const fallbackMedia = publicMedia.length ? publicMedia : workCase.media;
  return {
    id: workCase.id,
    slug: workCase.slug,
    title: workCase.title,
    date: workCase.date,
    commune: workCase.commune,
    sector: workCase.sector,
    publicLocation: workCase.publicLocation,
    propertyType: workCase.propertyType,
    services: workCase.services,
    problem: workCase.problem,
    diagnosis: workCase.diagnosis,
    intervention: workCase.intervention,
    equipment: workCase.equipment,
    result: workCase.result,
    recommendation: workCase.recommendation,
    featured: workCase.featured,
    media: fallbackMedia
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((asset) => ({
        id: asset.id,
        url: asset.url,
        thumbnailUrl: asset.thumbnailUrl,
        caption: asset.caption,
        altText: asset.altText,
        isCover: asset.isCover,
        sortOrder: asset.sortOrder,
      })),
    publishedAt: workCase.publishedAt,
    createdAt: workCase.createdAt,
    updatedAt: workCase.updatedAt,
    origin: workCase.origin,
    clientName: workCase.clientName,
  };
}
