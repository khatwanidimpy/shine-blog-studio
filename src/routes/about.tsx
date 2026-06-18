import { createFileRoute } from "@tanstack/react-router";
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
    items: "AWS (EC2, S3, RDS, IAM, VPC, Route 53, ASG, ELB, CloudWatch, EKS), Azure, GCP",
  },
  {
    title: "CI/CD & GitOps",
    items: "Jenkins, GitHub Actions, GitLab CI, ArgoCD, Azure DevOps",
  },
  {
    title: "Containers & Kubernetes",
    items: "Docker, Docker Compose, Kubernetes, Helm, Portainer",
  },
  {
    title: "IaC & Config Mgmt",
    items: "Terraform, Ansible",
  },
  {
    title: "Virtualization",
    items: "Proxmox VE, TrueNAS, ZFS, NFS",
  },
  {
    title: "Monitoring & Observability",
    items: "Prometheus, Grafana, CloudWatch, Loki, Datadog (familiar)",
  },
  {
    title: "OS & Scripting",
    items: "Linux (Unix), Bash, Python",
  },
  {
    title: "Databases",
    items: "PostgreSQL, MySQL, MongoDB",
  },
  {
    title: "ITSM & Process",
    items: "Incident Management, SLA/SLI tracking, Root Cause Analysis, Runbook Authoring, ITIL, CSAT",
  },
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
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="container-prose py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">About</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Dimpy.</h1>
        <div className="prose-editorial mt-10">
          <p className="text-xl text-muted-foreground italic font-serif leading-snug">
            DevOps Engineer with hands-on experience owning cloud infrastructure, SLA maintenance, and production reliability end-to-end. Proven track record in proactive issue detection, SLA compliance, and root cause analysis with zero escalations.
          </p>
          <p>
            Deep expertise in AWS (EKS, EC2, RDS, CloudWatch), Kubernetes, Terraform, Ansible, Jenkins, and GitHub Actions. AWS Certified Cloud Practitioner. Experienced in troubleshooting complex distributed systems, writing runbooks and system documentation, and collaborating cross-functionally with engineering, QA, and operations teams to drive operational excellence.
          </p>
        </div>
      </section>

      <section className="container-prose py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Technical Skills</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-medium text-foreground mb-1">{g.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-prose py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Experience</p>
        <div className="space-y-12">
          {EXPERIENCE.map((e) => (
            <div key={e.year} className="border-b border-border pb-10 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-4">
                <div>
                  <p className="font-serif text-xl">{e.role}</p>
                  <p className="text-sm text-muted-foreground">{e.org}</p>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-1 sm:mt-0">{e.year}</p>
              </div>
              <ul className="space-y-3">
                {e.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-prose py-12 border-t border-border">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">Certifications</p>
        <p className="text-sm text-muted-foreground">AWS Certified Cloud Practitioner</p>
      </section>

      <SiteFooter />
    </div>
  );
}
