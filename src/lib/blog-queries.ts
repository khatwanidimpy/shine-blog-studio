import { supabase } from "@/integrations/supabase/client";

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  content: string;
  featured_image: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  author_id: string;
};

export type BlogWithRelations = BlogRow & {
  category: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string; slug: string }[];
  author: { name: string; avatar_url: string | null } | null;
};

const BLOG_SELECT = `
  id, title, slug, short_description, content, featured_image, status,
  seo_title, seo_description, published_at, created_at, updated_at,
  category_id, author_id,
  category:categories(id, name, slug),
  blog_tags(tag:tags(id, name, slug)),
  author:profiles!blogs_author_id_fkey(name, avatar_url)
` as const;

function shape(row: any): BlogWithRelations {
  return {
    ...row,
    tags: (row.blog_tags ?? []).map((bt: any) => bt.tag).filter(Boolean),
  };
}

export async function listPublishedBlogs(opts?: { categorySlug?: string | null; search?: string | null }) {
  let q = supabase.from("blogs").select(BLOG_SELECT).eq("status", "published").order("published_at", { ascending: false });
  if (opts?.search) q = q.ilike("title", `%${opts.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data ?? []).map(shape);
  if (opts?.categorySlug) rows = rows.filter((b) => b.category?.slug === opts.categorySlug);
  return rows;
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase.from("blogs").select(BLOG_SELECT).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw error;
  return data ? shape(data) : null;
}

export async function listCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getProfile() {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at").limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

// Featured image is stored as a path inside the 'blog-media' bucket. Resolve to a signed URL.
export async function signedMediaUrl(path: string | null | undefined, expiresIn = 60 * 60 * 24 * 7) {
  if (!path) return null;
  if (path.startsWith("http")) return path; // already a URL
  const { data, error } = await supabase.storage.from("blog-media").createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
