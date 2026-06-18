import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BlogCard } from "@/components/site/BlogCard";
import { listPublishedBlogs, listCategories } from "@/lib/blog-queries";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Search = { category?: string; q?: string; page?: number };

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — Dimpy" },
      { name: "description", content: "Essays on SRE, automation, observability, and infrastructure." },
      { property: "og:title", content: "Journal — Dimpy" },
      { property: "og:description", content: "Essays on SRE, automation, observability, and infrastructure." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    page: typeof s.page === "number" ? s.page : s.page ? Number(s.page) : undefined,
  }),
  component: BlogIndex,
});

const PAGE_SIZE = 9;

function BlogIndex() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/blog" });
  const [q, setQ] = useState(search.q ?? "");

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", search.category ?? null, search.q ?? null],
    queryFn: () => listPublishedBlogs({ categorySlug: search.category ?? null, search: search.q ?? null }),
  });

  const page = search.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const paged = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="border-b border-border">
        <div className="container-wide py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">The Journal</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">All essays</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">Field notes, postmortems, and runbooks worth keeping.</p>
        </div>
      </section>

      <section className="container-wide py-10 border-b border-border">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ search: (s) => ({ ...s, q: q || undefined, page: 1 }) }); }}
            className="relative w-full md:max-w-sm"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search essays…"
              className="pl-10 bg-card"
            />
          </form>
          <div className="flex gap-1 flex-wrap text-sm">
            <button
              onClick={() => navigate({ search: (s) => ({ ...s, category: undefined, page: 1 }) })}
              className={`px-3 py-1.5 border ${!search.category ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
            >All</button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ search: (s) => ({ ...s, category: c.slug, page: 1 }) })}
                className={`px-3 py-1.5 border ${search.category === c.slug ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
              >{c.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-16 flex-1">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : paged.length === 0 ? (
          <p className="font-serif text-2xl text-center py-20 text-muted-foreground">No essays match this filter.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {paged.map((b) => <BlogCard key={b.id} blog={b} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                to="/blog"
                search={{ ...search, page: n }}
                className={`px-3 py-1.5 border ${n === page ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
              >{n}</Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
