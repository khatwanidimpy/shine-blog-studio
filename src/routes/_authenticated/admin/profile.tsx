import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { signedMediaUrl } from "@/lib/blog-queries";
import slugify from "slugify";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: ProfilePage,
});

type Social = { twitter?: string; github?: string; linkedin?: string; website?: string };

function ProfilePage() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", tagline: "", bio: "", avatar_url: null as string | null });
  const [social, setSocial] = useState<Social>({});

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name ?? "", tagline: profile.tagline ?? "", bio: profile.bio ?? "", avatar_url: profile.avatar_url });
      setSocial((profile.social_links as Social) ?? {});
    }
  }, [profile]);

  const { data: avatarUrl } = useQuery({
    queryKey: ["signed", form.avatar_url],
    queryFn: () => signedMediaUrl(form.avatar_url),
    enabled: !!form.avatar_url,
  });

  async function upload(file: File) {
    const path = `avatars/${Date.now()}-${slugify(file.name, { lower: true })}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file);
    if (error) toast.error(error.message);
    else setForm((f) => ({ ...f, avatar_url: path }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      name: form.name, tagline: form.tagline, bio: form.bio, avatar_url: form.avatar_url, social_links: social,
    }).eq("id", user.id);
    if (error) toast.error(error.message);
    else { toast.success("Profile saved"); qc.invalidateQueries(); }
    setBusy(false);
  }

  return (
    <div className="p-10 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Author</p>
      <h1 className="font-serif text-4xl mt-2 mb-8">Profile</h1>

      <form onSubmit={save} className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center font-serif text-3xl text-primary">
            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : (form.name.charAt(0) || "?")}
          </div>
          <label className="border border-border px-3 py-2 text-sm cursor-pointer hover:border-foreground inline-flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload avatar
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>

        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Tagline (shown on home page)</Label>
          <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1.5" placeholder="Automating Scale. Securing Infrastructure." />
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} className="mt-1.5" />
        </div>

        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="text-xs uppercase tracking-widest text-muted-foreground mb-2 col-span-2">Social links</legend>
          {(["twitter", "github", "linkedin", "website"] as const).map((k) => (
            <div key={k}>
              <Label className="capitalize">{k}</Label>
              <Input value={social[k] ?? ""} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} className="mt-1.5" placeholder="https://…" />
            </div>
          ))}
        </fieldset>

        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
      </form>
    </div>
  );
}
