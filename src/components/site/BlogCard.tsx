import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { BlogWithRelations } from "@/lib/blog-queries";
import { signedMediaUrl, readingMinutes } from "@/lib/blog-queries";
import { format } from "date-fns";

function useSignedUrl(path: string | null) {
  return useQuery({
    queryKey: ["signed", path],
    queryFn: () => signedMediaUrl(path),
    enabled: !!path,
    staleTime: 1000 * 60 * 60,
  });
}

export function BlogCard({ blog, featured = false }: { blog: BlogWithRelations; featured?: boolean }) {
  const { data: imgUrl } = useSignedUrl(blog.featured_image);
  const date = blog.published_at ?? blog.created_at;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: blog.slug }}
      className="group block"
    >
      <article className={featured ? "grid md:grid-cols-2 gap-8 items-center" : ""}>
        <div className={`overflow-hidden bg-muted aspect-[16/10] ${featured ? "" : "mb-5"}`}>
          {imgUrl ? (
            <img src={imgUrl} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif text-5xl">
              {blog.title.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {blog.category && <span className="text-primary">{blog.category.name}</span>}
            {blog.category && <span>·</span>}
            <time>{format(new Date(date), "MMM d, yyyy")}</time>
            <span>·</span>
            <span>{readingMinutes(blog.content)} min</span>
          </div>
          <h2 className={`font-serif font-medium leading-tight group-hover:text-primary transition-colors ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {blog.title}
          </h2>
          {blog.short_description && (
            <p className="text-muted-foreground mt-3 leading-relaxed">{blog.short_description}</p>
          )}
          <span className="inline-block mt-4 text-sm border-b border-primary text-primary pb-0.5">Read essay →</span>
        </div>
      </article>
    </Link>
  );
}
