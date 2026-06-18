import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getProfile } from "@/lib/blog-queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dimpy" },
      { name: "description", content: "About Dimpy: DevOps engineer focused on automation, reliability, and infrastructure security." },
      { property: "og:title", content: "About — Dimpy" },
      { property: "og:description", content: "DevOps engineer. Automation, reliability, infrastructure security." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const SKILLS = [
  "Kubernetes", "Terraform", "AWS / GCP", "CI/CD", "Observability", "Linux internals",
  "Incident response", "SLO design", "Security hardening", "Python · Go · Bash",
];

const EXPERIENCE = [
  { year: "2024 — Now", role: "Senior SRE", org: "Platform team" },
  { year: "2021 — 2024", role: "DevOps Engineer", org: "Fintech" },
  { year: "2019 — 2021", role: "Cloud Engineer", org: "Startup" },
];

export default function AboutPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const name = profile?.name ?? "Dimpy";
  const bio = profile?.bio ?? "I'm a DevOps engineer who has spent the last several years living inside production. I build platforms that scale predictably, automate the boring (and the terrifying), and write runbooks the on-call hopes they never need.";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="container-prose py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Colophon</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Hi, I'm {name}.</h1>
        <div className="prose-editorial mt-10">
          <p className="text-xl text-muted-foreground italic font-serif leading-snug">{bio}</p>
          <p>
            This journal is where I think out loud — about runbooks, distributed systems failing in interesting ways,
            and the deeply unfashionable practice of writing things down before you forget them at 3am.
          </p>
        </div>
      </section>

      <section className="container-prose py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Tools of the trade</p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="text-sm border border-border px-3 py-1.5">{s}</span>
          ))}
        </div>
      </section>

      <section className="container-prose py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Selected work</p>
        <ul className="divide-y divide-border">
          {EXPERIENCE.map((e) => (
            <li key={e.year} className="py-5 flex justify-between items-baseline">
              <div>
                <p className="font-serif text-xl">{e.role}</p>
                <p className="text-sm text-muted-foreground">{e.org}</p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">{e.year}</p>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </div>
  );
}
