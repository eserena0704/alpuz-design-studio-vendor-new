import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminPasswordMatches, readCatalog, saveCatalog } from "../server/catalog.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const catalog = await readCatalog();
      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
      return res.status(200).json(catalog);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to load catalog",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (req.method === "POST") {
    const password = req.headers["x-admin-password"];
    if (!adminPasswordMatches(Array.isArray(password) ? password[0] : password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
      const catalog = await saveCatalog(body?.products, body?.chatbotScript);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(catalog);
    } catch (err) {
      return res.status(500).json({
        error: "Failed to save catalog",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
