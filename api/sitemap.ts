import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readCatalog } from "../server/catalog.js";

/**
 * GET /api/sitemap — returns a dynamic XML sitemap.
 * Static pages are always included; published catalog products are added dynamically.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const origin = getSiteOrigin(req);
    const { products, updatedAt } = await readCatalog();

    const lastmod = updatedAt && Number(new Date(updatedAt)) > 0
      ? new Date(updatedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // Static pages
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/shop", priority: "0.9", changefreq: "weekly" },
      { loc: "/products", priority: "0.8", changefreq: "weekly" },
      { loc: "/checkout", priority: "0.5", changefreq: "monthly" },
    ];

    // Dynamic product pages from published catalog items
    const publishedProducts = products.filter((p) => p.status === "publish");

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(origin + page.loc)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Add published products
    for (const product of publishedProducts) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(origin + "/shop#product-" + product.slug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to generate sitemap",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

function getSiteOrigin(req: VercelRequest): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host || process.env.VERCEL_URL;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const resolvedHost = Array.isArray(host) ? host[0] : host;
  const resolvedProto = Array.isArray(proto) ? proto[0] : proto;
  return `${resolvedProto}://${resolvedHost}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
