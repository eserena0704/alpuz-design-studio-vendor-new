import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * GET /api/robots — returns a dynamic robots.txt with the correct Sitemap URL.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  const origin = getSiteOrigin(req);

  const body = [
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: Twitterbot",
    "Allow: /",
    "",
    "User-agent: facebookexternalhit",
    "Allow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
  return res.status(200).send(body);
}

function getSiteOrigin(req: VercelRequest): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host || process.env.VERCEL_URL;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const resolvedHost = Array.isArray(host) ? host[0] : host;
  const resolvedProto = Array.isArray(proto) ? proto[0] : proto;
  return `${resolvedProto}://${resolvedHost}`;
}
