import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin — Dimpy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — signing in…");
        const { error: e2 } = await supabase.auth.signInWithPassword({ email, password });
        if (e2) throw e2;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-foreground text-background flex-col justify-between p-12">
        <Link to="/" className="font-serif text-xl">Dimpy<span className="text-primary">.</span></Link>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">Editor's desk</p>
          <p className="font-serif text-4xl leading-tight">
            "Write the runbook before <span className="text-primary">you need it</span>."
          </p>
        </div>
        <p className="text-xs text-background/50">© {new Date().getFullYear()} Dimpy</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Admin portal</p>
            <h1 className="font-serif text-4xl mt-2">{mode === "signin" ? "Sign in" : "Create account"}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {mode === "signin" ? "Welcome back, editor." : "The first account becomes the admin."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account?" : "Have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline">
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to journal</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
