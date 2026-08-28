import type { BlogPost } from "@/lib/blog-data";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-data";
import { listBlogPosts } from "@/lib/admin/db";
import type { AdminBlogPost } from "@/lib/admin/types";

export type PublicBlogPost = BlogPost & {
  date?: string;
  featured?: boolean;
  category?: string;
  origin?: "admin" | "legacy";
};

export function adminBlogToPublicBlog(post: AdminBlogPost): PublicBlogPost {
  return {
    slug: post.slug,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    h1: post.h1 || post.title,
    heroSummary: post.summary,
    ctaMessage: post.ctaMessage,
    keywords: post.tags.length ? post.tags : ["guía técnica", "redes sanitarias", "Hidrourgencias"],
    image: post.coverImage,
    imageAlt: post.coverAlt,
    relatedServiceLinks: post.relatedService
      ? [{ href: post.relatedService, label: post.relatedCta || "Conocer servicio relacionado" }]
      : [{ href: "/servicios/destape-alcantarillado", label: "destape de alcantarillado" }],
    relatedComunaLinks: post.relatedCommune ? [{ href: post.relatedCommune, label: "Cobertura relacionada" }] : undefined,
    sections: markdownToSections(post.content),
    date: post.date,
    featured: post.featured,
    category: post.category,
    origin: post.origin,
  };
}

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  const legacy = getAllBlogPosts().map((post) => ({ ...post, origin: "legacy" as const }));

  try {
    const adminPosts = (await listBlogPosts()).filter((post) => post.status === "published").map(adminBlogToPublicBlog);
    return Array.from(new Map([...adminPosts, ...legacy].map((post) => [post.slug, post] as const)).values());
  } catch (error) {
    if (process.env.NODE_ENV === "production" && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) return legacy;
    throw error;
  }
}

export async function getPublicBlogPostBySlug(slug: string): Promise<PublicBlogPost | undefined> {
  try {
    const adminPost = (await listBlogPosts()).find((post) => post.status === "published" && post.slug === slug);
    if (adminPost) return adminBlogToPublicBlog(adminPost);
  } catch (error) {
    if (!(process.env.NODE_ENV === "production" && !process.env.POSTGRES_URL && !process.env.DATABASE_URL)) throw error;
  }

  const legacy = getBlogPostBySlug(slug);
  return legacy ? { ...legacy, origin: "legacy" as const } : undefined;
}

function markdownToSections(markdown: string): BlogPost["sections"] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [{ heading: "Contenido técnico", paragraphs: ["Contenido pendiente de edición."] }];

  const chunks = normalized.split(/\n(?=##\s+)/g);
  return chunks.map((chunk, index) => {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    const heading = lines[0]?.startsWith("## ") ? lines[0].replace(/^##\s+/, "") : index === 0 ? "Contenido técnico" : "Detalle técnico";
    const bodyLines = lines[0]?.startsWith("## ") ? lines.slice(1) : lines;
    const bullets = bodyLines.filter((line) => /^[-*]\s+/.test(line)).map((line) => line.replace(/^[-*]\s+/, ""));
    const paragraphs = bodyLines
      .filter((line) => !/^[-*]\s+/.test(line))
      .join("\n")
      .split(/\n{2,}/)
      .map((item) => item.replace(/^#{1,6}\s+/, "").trim())
      .filter(Boolean);
    return { heading, paragraphs: paragraphs.length ? paragraphs : ["Contenido técnico disponible para revisión."], ...(bullets.length ? { bullets } : {}) };
  });
}
