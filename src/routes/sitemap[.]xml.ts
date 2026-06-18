import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL!;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(url, key, { auth: { persistSession: false } });

        const { data: blogs } = await supabase
          .from("blogs")
          .select("slug, updated_at, published_at")
          .eq("status", "published");

        const staticEntries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/blog", changefreq: "daily", priority: "0.9" },
          { path: "/about", changefreq: "monthly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
        ];

        const blogEntries = (blogs ?? []).map((b: any) => ({
          path: `/blog/${b.slug}`,
          lastmod: (b.updated_at ?? b.published_at ?? "").slice(0, 10) || undefined,
          changefreq: "monthly",
          priority: "0.8",
        }));

        const urls = [...staticEntries, ...blogEntries].map((e: any) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
