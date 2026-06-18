import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Github, Linkedin, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dimpy" },
      { name: "description", content: "Get in touch with Dimpy about consulting, speaking, or just to compare horror stories from production." },
      { property: "og:title", content: "Contact — Dimpy" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSending(true);
    const subject = encodeURIComponent(`Hello from ${result.data.name}`);
    const body = encodeURIComponent(`${result.data.message}\n\n— ${result.data.name} (${result.data.email})`);
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 800);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="container-wide py-20 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Write a letter</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Let's talk.</h1>
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            Consulting work, speaking, war stories, or just to say a runbook helped — all welcome.
          </p>

          <div className="mt-12 space-y-4 text-sm">
            <a href="mailto:hello@example.com" className="flex items-center gap-3 hover:text-primary">
              <Mail className="h-4 w-4" /> hello@example.com
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary">
              <Linkedin className="h-4 w-4" /> /in/dimpy
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary">
              <Github className="h-4 w-4" /> /dimpy
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5 bg-card border border-border p-8">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} maxLength={2000} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Opening mail…" : "Send message"}
          </Button>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}
