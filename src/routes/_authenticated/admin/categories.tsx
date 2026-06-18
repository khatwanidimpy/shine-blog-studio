import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import slugify from "slugify";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return <Manager kind="categories" title="Categories" />;
}

export function Manager({ kind, title }: { kind: "categories" | "tags"; title: string }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const { data: rows = [], isLoading } = useQuery({
    queryKey: [kind],
    queryFn: async () => (await supabase.from(kind).select("*").order("name")).data ?? [],
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await supabase.from(kind).insert({ name: name.trim(), slug: slugify(name, { lower: true, strict: true }) });
    if (error) toast.error(error.message);
    else { setName(""); qc.invalidateQueries({ queryKey: [kind] }); toast.success("Added"); }
  }
  async function rename(id: string, newName: string) {
    const { error } = await supabase.from(kind).update({ name: newName, slug: slugify(newName, { lower: true, strict: true }) }).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: [kind] });
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from(kind).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: [kind] }); toast.success("Deleted"); }
  }

  return (
    <div className="p-10 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Taxonomy</p>
      <h1 className="font-serif text-4xl mt-2 mb-8">{title}</h1>

      <form onSubmit={add} className="flex gap-2 mb-8">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`New ${kind.slice(0, -1)}…`} className="bg-card" />
        <Button type="submit"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </form>

      <div className="border border-border bg-card divide-y divide-border">
        {isLoading && <p className="p-5 text-muted-foreground">Loading…</p>}
        {!isLoading && rows.length === 0 && <p className="p-10 text-center text-muted-foreground">None yet.</p>}
        {rows.map((r: any) => (
          <div key={r.id} className="flex items-center px-5 py-3 gap-3">
            <Input
              defaultValue={r.name}
              onBlur={(e) => e.target.value !== r.name && rename(r.id, e.target.value)}
              className="border-0 !bg-transparent px-0 focus-visible:ring-0"
            />
            <span className="font-mono text-xs text-muted-foreground">/{r.slug}</span>
            <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
