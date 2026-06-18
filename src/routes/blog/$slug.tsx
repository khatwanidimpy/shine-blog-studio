import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { Linkedin, Twitter, Link as LinkIcon } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BlogCard } from "@/components/site/BlogCard";
import { getBlogBySlug, listPublishedBlogs, signedMediaUrl, readingMinutes } from "@/lib/blog-queries";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) throw notFound();
    const ogImage = blog.featured_image ? await signedMediaUrl(blog.featured_image) : null;
    return { blog, ogImage };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.blog;
    if (!b) return {};
    const title = b.seo_title || `${b.title} — Dimpy`;
    const desc = b.seo_description || b.short_description || `Essay by ${b.author?.name ?? "Dimpy"} on ${b.category?.name ?? "DevOps"}.`;
    const canonical = `/blog/${b.slug}`;
    const meta: any[] = [
      { title },
      { name: "description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: canonical },
      { property: "article:published_time", content: b.published_at ?? b.created_at },
      { property: "article:author", content: b.author?.name ?? "Dimpy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (loaderData?.ogImage) {
      meta.push({ property: "og:image", content: loaderData.ogImage });
      meta.push({ name: "twitter:image", content: loaderData.ogImage });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: b.title,
            description: desc,
            datePublished: b.published_at ?? b.created_at,
            dateModified: b.updated_at,
            author: { "@type": "Person", name: b.author?.name ?? "Dimpy" },
            image: loaderData?.ogImage ?? undefined,
            mainEntityOfPage: canonical,
          }),
        },
      ],
    };
  },
  component: BlogDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-5xl text-primary">404</p>
        <p className="mt-3 font-serif text-2xl">Essay not found</p>
        <Link to="/blog" className="mt-6 inline-block text-sm border-b border-primary text-primary">Back to journal →</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const b = await getBlogBySlug(slug);
      if (!b) throw notFound();
      return b;
    },
  });
  const { data: allBlogs = [] } = useQuery({ queryKey: ["blogs", "home"], queryFn: () => listPublishedBlogs() });
  const { data: imgUrl } = useQuery({
    queryKey: ["signed", blog?.featured_image],
    queryFn: () => signedMediaUrl(blog?.featured_image ?? null),
    enabled: !!blog?.featured_image,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!blog) return null;

  const date = blog.published_at ?? blog.created_at;
  const related = allBlogs.filter((b) => b.id !== blog.id && b.category_id && b.category_id === blog.category_id).slice(0, 3);
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <article className="flex-1">
        <header className="container-prose pt-16 pb-10 text-center">
          {blog.category && (
            <Link to="/blog" search={{ category: blog.category.slug }} className="text-xs uppercase tracking-[0.25em] text-primary">
              {blog.category.name}
            </Link>
          )}
          <h1 className="font-serif text-4xl md:text-6xl font-medium leading-[1.05] mt-5 tracking-tight">{blog.title}</h1>
          {blog.short_description && (
            <p className="mt-6 text-lg text-muted-foreground italic font-serif">{blog.short_description}</p>
          )}
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="text-foreground">{blog.author?.name ?? "Dimpy"}</span>
            <span>·</span>
            <time>{format(new Date(date), "MMMM d, yyyy")}</time>
            <span>·</span>
            <span>{readingMinutes(blog.content)} min read</span>
          </div>
        </header>

        {imgUrl && (
          <div className="container-wide mb-12">
            <img src={imgUrl} alt={blog.title} className="w-full max-h-[560px] object-cover rounded" />
          </div>
        )}

        <div className="container-prose prose-editorial">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
        </div>

        {blog.tags.length > 0 && (
          <div className="container-prose mt-12 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <span key={t.id} className="text-xs uppercase tracking-widest border border-border px-3 py-1">
                #{t.name}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="container-prose mt-12 pt-8 border-t border-border flex items-center gap-4 text-sm">
          <span className="text-muted-foreground uppercase tracking-widest text-xs">Share</span>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="hover:text-primary"><Twitter className="h-4 w-4" /></a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="hover:text-primary"><Linkedin className="h-4 w-4" /></a>
          <button onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied"); }} className="hover:text-primary"><LinkIcon className="h-4 w-4" /></button>
        </div>

        {/* Author */}
        <div className="container-prose mt-16 pt-12 border-t border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">About the author</p>
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-serif text-2xl text-primary">
              {(blog.author?.name ?? "D").charAt(0)}
            </div>
            <div>
              <p className="font-serif text-xl">{blog.author?.name ?? "Dimpy"}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">Writes about infrastructure, reliability, and the quiet craft of keeping production alive.</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="container-wide mt-24 py-16 border-t border-border">
            <h2 className="font-serif text-3xl mb-10">Related essays</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {related.map((b) => <BlogCard key={b.id} blog={b} />)}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
