import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Search } from "lucide-react";
import { signedMediaUrl } from "@/lib/blog-queries";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaPage,
});

type Item = { name: string; id: string | null; updated_at: string | null; metadata: any };

function MediaPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("blog-media").list("featured", { limit: 200, sortBy: { column: "updated_at", order: "desc" } });
      if (error) throw error;
      return data as Item[];
    },
  });

  async function upload(file: File) {
    const path = `featured/${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["media"] }); toast.success("Uploaded"); }
  }
  async function remove(name: string) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.storage.from("blog-media").remove([`featured/${name}`]);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["media"] }); toast.success("Deleted"); }
  }

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-10 max-w-6xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Library</p>
      <h1 className="font-serif text-4xl mt-2 mb-8">Media</h1>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search images…" className="pl-10 bg-card" />
        </div>
        <label className="bg-foreground text-background px-4 py-2 text-sm cursor-pointer hover:bg-primary inline-flex items-center gap-2">
          <Upload className="h-4 w-4" /> Upload
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
            Array.from(e.target.files ?? []).forEach(upload);
          }} />
        </label>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((f) => <MediaTile key={f.name} name={f.name} onDelete={() => remove(f.name)} />)}
        </div>
      )}
    </div>
  );
}

function MediaTile({ name, onDelete }: { name: string; onDelete: () => void }) {
  const { data: url } = useQuery({
    queryKey: ["signed", `featured/${name}`],
    queryFn: () => signedMediaUrl(`featured/${name}`),
  });
  return (
    <div className="border border-border bg-card group">
      <div className="aspect-video bg-muted overflow-hidden">
        {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        <span className="text-xs truncate text-muted-foreground" title={name}>{name}</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => { navigator.clipboard.writeText(`featured/${name}`); toast.success("Path copied"); }} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
          <button onClick={onDelete} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
