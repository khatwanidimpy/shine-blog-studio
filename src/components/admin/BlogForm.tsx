import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import slugify from "slugify";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { signedMediaUrl } from "@/lib/blog-queries";

export type BlogFormValues = {
  title: string;
  slug: string;
  short_description: string;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
  tagIds: string[];
};

export const EMPTY: BlogFormValues = {
  title: "",
  slug: "",
  short_description: "",
  content: "",
  featured_image: null,
  category_id: null,
  status: "draft",
  seo_title: "",
  seo_description: "",
  tagIds: [],
};

export function BlogForm({ initial, onSubmit, busy }: { initial: BlogFormValues; onSubmit: (v: BlogFormValues) => Promise<void>; busy: boolean }) {
  const [v, setV] = useState<BlogFormValues>(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [autoSlug, setAutoSlug] = useState(!initial.slug);

  useEffect(() => { setV(initial); setAutoSlug(!initial.slug); }, [initial]);

  useEffect(() => {
    if (autoSlug && v.title) {
      setV((p) => ({ ...p, slug: slugify(v.title, { lower: true, strict: true }) }));
    }
  }, [v.title, autoSlug]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => (await supabase.from("tags").select("*").order("name")).data ?? [],
  });

  const { data: imgUrl } = useQuery({
    queryKey: ["signed", v.featured_image],
    queryFn: () => signedMediaUrl(v.featured_image),
    enabled: !!v.featured_image,
  });

  async function uploadImage(file: File) {
    const path = `featured/${Date.now()}-${slugify(file.name, { lower: true })}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) { toast.error(error.message); return; }
    setV({ ...v, featured_image: path });
    toast.success("Image uploaded");
  }

  function toggleTag(id: string) {
    setV({ ...v, tagIds: v.tagIds.includes(id) ? v.tagIds.filter((t) => t !== id) : [...v.tagIds, id] });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); }} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <Input
          value={v.title}
          onChange={(e) => setV({ ...v, title: e.target.value })}
          placeholder="Essay title"
          required
          className="font-serif !text-3xl h-auto py-3 border-0 border-b !bg-transparent rounded-none px-0 focus-visible:ring-0"
        />
        <div className="flex items-center gap-3">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">/blog/</Label>
          <Input
            value={v.slug}
            onChange={(e) => { setAutoSlug(false); setV({ ...v, slug: e.target.value }); }}
            className="font-mono text-sm"
            placeholder="auto-generated-slug"
            required
          />
        </div>
        <Textarea
          value={v.short_description}
          onChange={(e) => setV({ ...v, short_description: e.target.value })}
          placeholder="Short description / dek (shown in cards and meta description)"
          rows={2}
          maxLength={300}
        />

        <div className="border border-border">
          <div className="flex border-b border-border text-xs uppercase tracking-widest">
            <button type="button" onClick={() => setTab("write")} className={`px-4 py-2 ${tab === "write" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Write</button>
            <button type="button" onClick={() => setTab("preview")} className={`px-4 py-2 ${tab === "preview" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Preview</button>
            <span className="ml-auto px-4 py-2 text-muted-foreground">Markdown supported</span>
          </div>
          {tab === "write" ? (
            <Textarea
              value={v.content}
              onChange={(e) => setV({ ...v, content: e.target.value })}
              rows={22}
              placeholder="Write your essay in Markdown…"
              className="border-0 rounded-none font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="prose-editorial p-6 min-h-[400px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{v.content || "*Nothing to preview yet.*"}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="border border-border bg-card p-5 space-y-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Publication</p>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy} className="flex-1" onClick={() => setV((p) => ({ ...p, status: "draft" }))}>
              Save draft
            </Button>
            <Button
              type="submit" disabled={busy}
              variant="default"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => setV((p) => ({ ...p, status: "published" }))}
            >
              Publish
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Current status: <span className={v.status === "published" ? "text-primary" : ""}>{v.status}</span>
          </p>
        </div>

        <div className="border border-border bg-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Featured image</p>
          {imgUrl && v.featured_image ? (
            <div className="relative">
              <img src={imgUrl} alt="" className="w-full aspect-video object-cover" />
              <button type="button" onClick={() => setV({ ...v, featured_image: null })} className="absolute top-2 right-2 bg-background/90 border border-border p-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-border aspect-video flex items-center justify-center cursor-pointer hover:border-primary text-muted-foreground text-sm">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload</span>
            </label>
          )}
        </div>

        <div className="border border-border bg-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Category</p>
          <Select value={v.category_id ?? "none"} onValueChange={(val) => setV({ ...v, category_id: val === "none" ? null : val })}>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="border border-border bg-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t: any) => (
              <button
                key={t.id} type="button" onClick={() => toggleTag(t.id)}
                className={`text-xs px-2 py-1 border ${v.tagIds.includes(t.id) ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}
              >#{t.name}</button>
            ))}
            {tags.length === 0 && <p className="text-xs text-muted-foreground">No tags yet.</p>}
          </div>
        </div>

        <div className="border border-border bg-card p-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">SEO</p>
          <div>
            <Label className="text-xs">SEO Title</Label>
            <Input value={v.seo_title} onChange={(e) => setV({ ...v, seo_title: e.target.value })} maxLength={70} placeholder={v.title} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">SEO Description</Label>
            <Textarea value={v.seo_description} onChange={(e) => setV({ ...v, seo_description: e.target.value })} rows={3} maxLength={160} placeholder={v.short_description} className="mt-1" />
          </div>
        </div>
      </aside>
    </form>
  );
}
