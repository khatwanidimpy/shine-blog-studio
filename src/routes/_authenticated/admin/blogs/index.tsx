import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/blogs/")({
  component: BlogsList,
});

function BlogsList() {
  const qc = useQueryClient();
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, status, updated_at, published_at, category:categories(name)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function toggleStatus(id: string, current: string) {
    const next = current === "published" ? "draft" : "published";
    const patch: any = { status: next };
    if (next === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("blogs").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(next === "published" ? "Published" : "Unpublished"); qc.invalidateQueries(); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this blog? This cannot be undone.")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries(); }
  }

  return (
    <div className="p-10 max-w-6xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Library</p>
          <h1 className="font-serif text-4xl mt-2">All blogs</h1>
        </div>
        <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-sm hover:bg-primary">
          <Plus className="h-4 w-4" /> New blog
        </Link>
      </div>

      <div className="border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left px-5 py-3 font-normal">Title</th>
              <th className="text-left px-5 py-3 font-normal">Category</th>
              <th className="text-left px-5 py-3 font-normal">Status</th>
              <th className="text-left px-5 py-3 font-normal">Updated</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && blogs.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No blogs yet.</td></tr>
            )}
            {blogs.map((b: any) => (
              <tr key={b.id} className="hover:bg-muted/50">
                <td className="px-5 py-3 font-serif">{b.title}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.category?.name ?? "—"}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleStatus(b.id, b.status)} className={`text-xs uppercase tracking-widest ${b.status === "published" ? "text-primary" : "text-muted-foreground"} hover:underline`}>
                    {b.status}
                  </button>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{format(new Date(b.updated_at), "MMM d, yyyy")}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2 text-muted-foreground">
                    {b.status === "published" && (
                      <Link to="/blog/$slug" params={{ slug: b.slug }} target="_blank" className="hover:text-foreground" title="View"><Eye className="h-4 w-4" /></Link>
                    )}
                    <Link to="/admin/blogs/$id" params={{ id: b.id }} className="hover:text-foreground" title="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(b.id)} className="hover:text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
