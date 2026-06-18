import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container-wide py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="font-serif text-lg">Dimpy<span className="text-primary">.</span></p>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Automating scale. Securing infrastructure. Minimizing downtime.
          </p>
        </div>
        <div>
          <p className="uppercase tracking-widest text-xs text-muted-foreground mb-3">Explore</p>
          <ul className="space-y-2">
            <li><Link to="/blog" className="hover:text-primary">Journal</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="uppercase tracking-widest text-xs text-muted-foreground mb-3">Elsewhere</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary"><Github className="h-4 w-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary"><Linkedin className="h-4 w-4" /></a>
            <a href="mailto:hello@example.com" className="hover:text-primary"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="container-wide py-6 border-t border-border text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} Dimpy. All notes belong to their author.</span>
        <Link to="/auth" className="hover:text-foreground">Admin</Link>
      </div>
    </footer>
  );
}
