import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BlogCard } from "@/components/site/BlogCard";
import { listPublishedBlogs, getProfile } from "@/lib/blog-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dimpy — Automating Scale. Securing Infrastructure." },
      { name: "description", content: "Field notes from a DevOps engineer on automation, observability, and uptime." },
      { property: "og:title", content: "Dimpy — DevOps Journal" },
      { property: "og:description", content: "Field notes from a DevOps engineer on automation, observability, and uptime." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: blogs = [] } = useQuery({ queryKey: ["blogs", "home"], queryFn: () => listPublishedBlogs() });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const [featured, ...rest] = blogs;
  const grid = rest.slice(0, 5);
  const name = profile?.name ?? "Dimpy";
  const tagline = profile?.tagline ?? "Automating Scale. Securing Infrastructure. Minimizing Downtime.";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="container-wide py-20 md:py-32 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Volume 01 · A DevOps Journal
            </p>
            <h1 className="font-serif font-medium text-5xl md:text-7xl leading-[1.05] tracking-tight">
              {tagline.split(".").filter(Boolean).map((part, i, arr) => (
                <span key={i}>
                  {part.trim()}
                  {i < arr.length - 1 && <span className="text-primary">.</span>}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
              <span className="text-primary">.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Long-form notes by <span className="text-foreground">{name}</span> on infrastructure, reliability, and the quiet craft of keeping production alive at 3am.
            </p>
            <div className="mt-10 flex gap-6 items-center text-sm">
              <Link to="/blog" className="bg-foreground text-background px-5 py-3 hover:bg-primary transition-colors">Read the journal</Link>
              <Link to="/about" className="border-b border-foreground pb-0.5 hover:text-primary hover:border-primary">About the author →</Link>
            </div>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="border-l border-border pl-6 text-sm space-y-4 text-muted-foreground">
              <p className="uppercase tracking-widest text-xs">In this issue</p>
              {blogs.slice(0, 4).map((b, i) => (
                <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="block hover:text-primary">
                  <span className="font-mono text-xs mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {b.title}
                </Link>
              ))}
              {blogs.length === 0 && <p className="italic">First essays coming soon.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="container-wide py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">Featured</p>
          <BlogCard blog={featured} featured />
        </section>
      )}

      {/* GRID */}
      {grid.length > 0 && (
        <section className="container-wide py-12 md:py-20 border-t border-border">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl">Latest dispatches</h2>
            <Link to="/blog" className="text-sm border-b border-foreground pb-0.5 hover:text-primary hover:border-primary">View all →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {grid.map((b) => <BlogCard key={b.id} blog={b} />)}
          </div>
        </section>
      )}

      {blogs.length === 0 && (
        <section className="container-wide py-32 text-center text-muted-foreground">
          <p className="font-serif text-2xl text-foreground">The first essay is in the typewriter.</p>
          <p className="mt-3">Check back soon — or sign in as admin to publish.</p>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
