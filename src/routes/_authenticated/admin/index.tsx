import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FileEdit, FolderTree, CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [blogs, cats] = await Promise.all([
        supabase.from("blogs").select("id, status, title, updated_at, slug").order("updated_at", { ascending: false }),
        supabase.from("categories").select("id"),
      ]);
      const rows = blogs.data ?? [];
      return {
        total: rows.length,
        published: rows.filter((r) => r.status === "published").length,
        drafts: rows.filter((r) => r.status === "draft").length,
        categories: (cats.data ?? []).length,
        recent: rows.slice(0, 5),
      };
    },
  });

  const cards = [
    { label: "Total blogs", value: stats?.total ?? 0, icon: FileText },
    { label: "Published", value: stats?.published ?? 0, icon: CheckCircle2 },
    { label: "Drafts", value: stats?.drafts ?? 0, icon: FileEdit },
    { label: "Categories", value: stats?.categories ?? 0, icon: FolderTree },
  ];

  return (
    <div className="p-10 max-w-5xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Overview</p>
          <h1 className="font-serif text-4xl mt-2">Editor's desk</h1>
        </div>
        <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-sm hover:bg-primary">
          <Plus className="h-4 w-4" /> New blog
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="border border-border bg-card p-5">
              <Icon className="h-4 w-4 text-muted-foreground mb-3" />
              <p className="font-serif text-4xl">{c.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="border border-border bg-card">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-serif text-xl">Recent blogs</h2>
          <Link to="/admin/blogs" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <ul className="divide-y divide-border">
          {(stats?.recent ?? []).map((r) => (
            <li key={r.id} className="px-5 py-3 flex justify-between items-center">
              <Link to="/admin/blogs/$id" params={{ id: r.id }} className="hover:text-primary">{r.title}</Link>
              <span className={`text-xs uppercase tracking-widest ${r.status === "published" ? "text-primary" : "text-muted-foreground"}`}>{r.status}</span>
            </li>
          ))}
          {(stats?.recent ?? []).length === 0 && (
            <li className="px-5 py-10 text-center text-muted-foreground text-sm">No blogs yet. <Link to="/admin/blogs/new" className="text-primary">Write the first one</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
}
