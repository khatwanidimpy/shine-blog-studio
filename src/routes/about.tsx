import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

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

const SKILL_GROUPS = [
  {
    title: "Cloud",
    icon: Cloud,
    items: "AWS (EC2, S3, RDS, IAM, VPC, Route 53, ASG, ELB, CloudWatch, EKS), Azure, GCP",
  },
  {
    title: "CI/CD & GitOps",
    icon: GitBranch,
    items: "Jenkins, GitHub Actions, GitLab CI, ArgoCD, Azure DevOps",
  },
  {
    title: "Containers & Kubernetes",
    icon: Boxes,
    items: "Docker, Docker Compose, Kubernetes, Helm, Portainer",
  },
  {
    title: "IaC & Config Mgmt",
    icon: Code2,
    items: "Terraform, Ansible",
  },
  {
    title: "Virtualization",
    icon: Server,
    items: "Proxmox VE, TrueNAS, ZFS, NFS",
  },
  {
    title: "Monitoring & Observability",
    icon: Activity,
    items: "Prometheus, Grafana, CloudWatch, Loki, Datadog (familiar)",
  },
  {
    title: "OS & Scripting",
    icon: Terminal,
    items: "Linux (Unix), Bash, Python",
  },
  {
    title: "Databases",
    icon: Database,
    items: "PostgreSQL, MySQL, MongoDB",
  },
  {
    title: "ITSM & Process",
    icon: ShieldCheck,
    items: "Incident Management, SLA/SLI tracking, Root Cause Analysis, Runbook Authoring, ITIL, CSAT",
  },
];

const STATS = [
  { label: "Services onboarded", value: "200+", icon: Layers3 },
  { label: "Concurrent users supported", value: "69K+", icon: Network },
  { label: "Production uptime", value: "99.9%+", icon: Gauge },
];

const EXPERIENCE = [
  {
    year: "Aug 2024 – Present",
    role: "Senior DevOps Engineer",
    org: "Toshal Infotech Pvt. Ltd, Bengaluru",
    highlights: [
      "Independently owned and delivered multiple infrastructure projects end-to-end — including Kubernetes migration, AWS-to-Azure transition, and hybrid cloud build-out — with full technical accountability and minimal supervision.",
      "Deployed and managed containerised workloads on AWS EKS (Elastic Kubernetes Service), configuring node groups, IAM roles for service accounts (IRSA), and auto-scaling for production traffic.",
      "Managed end-to-end DevOps pipeline across planning, coding, build, test, staging, release, and monitoring phases for 200+ containerised services.",
      "Led CI/CD automation using Jenkins and GitHub Actions; onboarded applications onto DevOps toolchain and configured pipelines per client requirements.",
      "Led monolith-to-Kubernetes migration — designed cluster topology, reducing deployment time by ~40% and supporting 69,000+ concurrent users at 99.9%+ uptime.",
      "Led end-to-end cloud migration from AWS to Azure — migrated VMs, databases, and full application stack using Azure Migrate; ensured zero downtime cutover with rollback strategy.",
      "Engineered on-prem hybrid cloud using Proxmox VE + TrueNAS (ZFS) with automated backup, disaster recovery, and infrastructure provisioning via Terraform and Ansible.",
      "Implemented Prometheus + Grafana observability; performed root cause analysis on critical incidents and resolved issues within defined TAT with zero escalations.",
      "Enforced IAM least-privilege policies, network segmentation, SSL/TLS lifecycle management, and DevSecOps practices across all environments.",
    ],
  },
  {
    year: "Sep 2023 – Aug 2024",
    role: "DevOps Engineer",
    org: "Infinity Brains Pvt. Ltd, Surat",
    highlights: [
      "Maintained SLA compliance for production AWS infrastructure using CloudWatch monitoring and alerting pipelines; implemented proactive reporting to prevent prolonged outages.",
      "Designed highly available AWS infrastructure using Auto Scaling Groups, ALB, and Route 53 failover routing; managed multi-AZ deployments ensuring production stability.",
      "Resolved infrastructure tickets within TAT; collaborated cross-functionally with development and QA teams to ensure smooth release cycles and customer experience.",
      "Improved CI/CD workflows via Jenkins and GitHub Actions, reducing manual deployment effort and improving release reliability.",
      "Applied AWS security best practices: IAM role design, VPC segmentation, and secure network architecture aligned with compliance requirements.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--color-primary)_12%,transparent),transparent_34rem),linear-gradient(180deg,var(--color-background),color-mix(in_oklch,var(--color-background)_88%,var(--color-secondary)))]">
      <SiteHeader />

      <section className="container-wide py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">About</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
              Dimpy builds infrastructure that stays calm under pressure.
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p>
                DevOps Engineer with hands-on experience owning cloud infrastructure, SLA maintenance, and production reliability end-to-end. Proven track record in proactive issue detection, SLA compliance, and root cause analysis with zero escalations.
              </p>
              <p>
                Deep expertise in AWS (EKS, EC2, RDS, CloudWatch), Kubernetes, Terraform, Ansible, Jenkins, and GitHub Actions. AWS Certified Cloud Practitioner with experience troubleshooting distributed systems, writing runbooks, and collaborating across engineering, QA, and operations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="border border-border bg-card/70 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-serif text-3xl text-foreground">{stat.value}</p>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-wide py-14 border-t border-border">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Technical Skills</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Tooling across the delivery lifecycle</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Cloud platforms, automation, observability, and release systems shaped for production reliability.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SKILL_GROUPS.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="group border border-border bg-card/70 p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-card">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-primary transition-colors group-hover:border-primary/40">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{g.title}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.items}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-wide py-14 border-t border-border">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Experience</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Infrastructure ownership in production</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A practical track record across migrations, CI/CD automation, monitoring, security, and incident response.
          </p>
        </div>
        <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:hidden before:h-full before:w-px before:bg-border md:before:block">
          {EXPERIENCE.map((e) => (
            <div key={e.year} className="relative grid gap-4 md:grid-cols-[9rem_1fr] md:pl-10">
              <span className="absolute left-0 top-2 hidden h-6 w-6 items-center justify-center border border-primary bg-background text-primary md:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground md:pt-2">{e.year}</p>
              <article className="border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
                <div className="mb-5">
                  <p className="font-serif text-2xl leading-tight">{e.role}</p>
                  <p className="mt-1 text-sm text-primary">{e.org}</p>
                </div>
                <ul className="grid gap-3 md:grid-cols-2">
                  {e.highlights.map((h, i) => (
                    <li key={i} className="relative pl-5 text-sm text-muted-foreground leading-relaxed before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:bg-primary">
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide py-14 border-t border-border">
        <div className="grid gap-6 border border-border bg-foreground p-8 text-background md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Certification</p>
            <h2 className="mt-3 font-serif text-3xl">AWS Certified Cloud Practitioner</h2>
          </div>
          <div className="inline-flex h-14 w-14 items-center justify-center border border-background/25 text-primary-foreground">
            <Cloud className="h-6 w-6" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
