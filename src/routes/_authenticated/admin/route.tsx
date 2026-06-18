import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, FolderTree, Tags, Image as ImageIcon, User, LogOut, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const NAV: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/blogs", label: "Essays", icon: FileText },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/tags", label: "Tags", icon: Tags },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      setAllowed((data ?? []).length > 0);
    })();
  }, [navigate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (allowed === null) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">…</div>;
  if (!allowed) return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="font-serif text-3xl">Not authorized</p>
        <p className="mt-2 text-muted-foreground">Your account doesn't have admin access.</p>
        <button onClick={signOut} className="mt-6 text-sm border-b border-primary text-primary">Sign out →</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 border-r border-border flex flex-col">
        <div className="px-6 py-6 border-b border-border">
          <Link to="/" className="font-serif text-xl">Dimpy<span className="text-primary">.</span></Link>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Editor</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded">
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
