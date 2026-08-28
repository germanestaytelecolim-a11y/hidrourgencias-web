import { createHash } from "node:crypto";

import { getAllBlogPosts } from "@/lib/blog-data";
import { createAdminId, getBlogPostBySlugAdmin, saveBlogPost } from "@/lib/admin/db";
import type { AdminBlogPost } from "@/lib/admin/types";

function sectionsToMarkdown(post: ReturnType<typeof getAllBlogPosts>[number]) {
  return post.sections
    .map((section) => {
      const bullets = section.bullets?.length ? `\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}` : "";
      return `## ${section.heading}\n\n${section.paragraphs.join("\n\n")}${bullets}`;
    })
    .join("\n\n");
}

function stableLegacyId(slug: string) {
  return `legacy-blog-${createHash("sha1").update(slug).digest("hex").slice(0, 18)}`;
}

async function main() {
  const legacyPosts = getAllBlogPosts();
  let imported = 0;
  let skippedExisting = 0;

  for (const post of legacyPosts) {
    const existing = await getBlogPostBySlugAdmin(post.slug);
    if (existing) {
      skippedExisting += 1;
      continue;
    }

    const now = new Date().toISOString();
    const blogPost: AdminBlogPost = {
      id: createAdminId(),
      slug: post.slug,
      title: post.title,
      h1: post.h1,
      summary: post.heroSummary || post.description,
      content: sectionsToMarkdown(post),
      coverImage: post.image ?? "/images/hero-mantencion.jpg",
      coverAlt: post.imageAlt ?? post.h1,
      gallery: [],
      category: "Guía técnica",
      tags: post.keywords,
      date: now.slice(0, 10),
      featured: false,
      relatedService: post.relatedServiceLinks[0]?.href ?? "",
      relatedCommune: post.relatedComunaLinks?.[0]?.href ?? "",
      relatedCta: "Solicitar evaluación técnica",
      status: "published",
      seoTitle: post.title,
      seoDescription: post.description,
      ctaMessage: post.ctaMessage,
      origin: "legacy",
      legacySlug: stableLegacyId(post.slug),
      createdBy: "legacy-import",
      updatedBy: "legacy-import",
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    };

    await saveBlogPost(blogPost);
    imported += 1;
  }

  console.log(JSON.stringify({ legacy: legacyPosts.length, imported, skippedExisting, duplicates: 0 }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
