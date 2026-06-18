import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogForm, EMPTY, type BlogFormValues } from "@/components/admin/BlogForm";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blogs/$id")({
  component: EditBlog,
});

function EditBlog() {
  const { id } = Route.useParams();
  const [busy, setBusy] = useState(false);

  const { data: initial, isLoading, refetch } = useQuery({
    queryKey: ["admin", "blog", id],
    queryFn: async (): Promise<BlogFormValues> => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*, blog_tags(tag_id)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return {
        title: data.title,
        slug: data.slug,
        short_description: data.short_description ?? "",
        content: data.content ?? "",
        featured_image: data.featured_image,
        category_id: data.category_id,
        status: data.status,
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
        tagIds: (data.blog_tags ?? []).map((bt: any) => bt.tag_id),
      };
    },
  });

  async function save(v: BlogFormValues) {
    setBusy(true);
    try {
      const update: any = {
        title: v.title.trim(),
        slug: v.slug.trim(),
        short_description: v.short_description.trim() || null,
        content: v.content,
        featured_image: v.featured_image,
        category_id: v.category_id,
        status: v.status,
        seo_title: v.seo_title.trim() || null,
        seo_description: v.seo_description.trim() || null,
      };
      // Set published_at only on first publish
      if (v.status === "published") {
        const { data: cur } = await supabase.from("blogs").select("published_at").eq("id", id).single();
        if (!cur?.published_at) update.published_at = new Date().toISOString();
      }
      const { error } = await supabase.from("blogs").update(update).eq("id", id);
      if (error) throw error;
      await supabase.from("blog_tags").delete().eq("blog_id", id);
      if (v.tagIds.length) {
        const { error: te } = await supabase.from("blog_tags").insert(v.tagIds.map((tag_id) => ({ blog_id: id, tag_id })));
        if (te) throw te;
      }
      toast.success("Saved");
      refetch();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="p-10 max-w-6xl">
      <Link to="/admin/blogs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-6"><ArrowLeft className="h-4 w-4" /> Back to blogs</Link>
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Edit blog</p>
      <h1 className="font-serif text-4xl mt-2 mb-8">{initial?.title || "Loading…"}</h1>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : <BlogForm initial={initial ?? EMPTY} onSubmit={save} busy={busy} />}
    </div>
  );
}
