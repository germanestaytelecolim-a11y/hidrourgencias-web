export const adminRoles = ["admin", "editor", "collaborator"] as const;
export const workStatuses = ["draft", "published", "archived"] as const;
export const blogStatuses = ["draft", "published", "archived"] as const;

export type AdminRole = (typeof adminRoles)[number];
export type WorkStatus = (typeof workStatuses)[number];
export type BlogStatus = (typeof blogStatuses)[number];

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  sessionVersion: number;
};

export type AdminSession = {
  id: string;
  userId: string;
  sessionVersion: number;
  csrfToken: string;
  expiresAt: string;
  createdAt: string;
};

export type MediaAsset = {
  id: string;
  workCaseId?: string;
  blogPostId?: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  caption: string;
  altText: string;
  isCover: boolean;
  isPublic: boolean;
  sortOrder: number;
  createdAt: string;
};

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  summary: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  gallery: MediaAsset[];
  category: string;
  tags: string[];
  date: string;
  featured: boolean;
  relatedService: string;
  relatedCommune: string;
  relatedCta: string;
  status: BlogStatus;
  seoTitle: string;
  seoDescription: string;
  ctaMessage: string;
  origin: "admin" | "legacy";
  legacySlug?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type WorkCase = {
  id: string;
  title: string;
  slug: string;
  status: WorkStatus;
  date: string;
  commune: string;
  sector: string;
  privateAddress: string;
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
  showInCases: boolean;
  showInCommune: boolean;
  showInServices: boolean;
  showOnHome: boolean;
  videoMode: "none" | "upload" | "external";
  videoUrl: string;
  origin: "admin" | "legacy";
  legacyId?: string;
  clientName?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  media: MediaAsset[];
};

export type AuditEvent = {
  id: string;
  userId?: string;
  action: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export type LoginAttempt = {
  id: string;
  username: string;
  ip: string;
  success: boolean;
  createdAt: string;
};
