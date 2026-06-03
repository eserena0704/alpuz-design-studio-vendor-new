import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { adminPasswordMatches } from "../server/catalog.js";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const BODY_READ_TIMEOUT_MS = 20000;

/** Disable automatic body parsing so we can read raw multipart stream. (Next.js / Vercel) */
export const config = { api: { bodyParser: false } };

/**
 * POST multipart/form-data with field "file" (or "image").
 * Uploads product media to Vercel Blob and returns { url } for catalog admin saves.
 * Requires BLOB_READ_WRITE_TOKEN in the project (create a Blob store in Vercel → Project → Storage).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({
      error: "Blob storage not configured",
      detail: "Add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
    });
  }

  const password = req.headers["x-admin-password"];
  if (!adminPasswordMatches(Array.isArray(password) ? password[0] : password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  try {
    const body = await getRawBody(req);
    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "Empty body",
        detail: "Request body was empty. Ensure the client sends multipart/form-data with a file.",
      });
    }

    const contentType = (req.headers["content-type"] ?? req.headers["Content-Type"] ?? "").toString();
    const isMultipart = contentType.toLowerCase().includes("multipart/form-data");
    let boundary = contentType.split(/boundary\s*=/i)[1]?.trim().replace(/["';]\s*$/g, "").trim() ?? "";
    // Fallback: if body looks like multipart (starts with --), extract boundary from first line (e.g. proxy stripped Content-Type)
    if (!boundary && body.length >= 4 && body[0] === 0x2d && body[1] === 0x2d) {
      const firstLineEnd = body.indexOf(13); // \r
      if (firstLineEnd > 2) {
        boundary = body.subarray(2, firstLineEnd).toString("ascii").trim();
      }
    }
    if (!boundary) {
      return res.status(400).json({
        error: "Expected multipart/form-data",
        detail: "Send Content-Type: multipart/form-data; boundary=... or ensure the request body is multipart.",
      });
    }
    boundary = String(boundary).trim();

    const parts = parseMultipart(body, boundary);
    const filePart = parts.find((p) => p.name === "file" || p.name === "image") ?? parts[0];
    if (!filePart?.filename || !filePart.data || filePart.data.length === 0) {
      return res.status(400).json({
        error: "No file in request",
        detail: "Include a file in the form (field name 'file' or 'image').",
      });
    }

    const mime = String(filePart.contentType ?? "application/octet-stream");
    if (!ALLOWED_TYPES.includes(mime) && !mime.startsWith("image/")) {
      return res.status(400).json({
        error: "Invalid file type",
        detail: "Allowed: " + ALLOWED_TYPES.join(", "),
      });
    }

    // pathname: string. body: ArrayBuffer only (SDK can throw "Cannot convert object to primitive" with Buffer/Blob in some runtimes)
    const safeFilename = String(filePart.filename ?? "upload").replace(/\0/g, "");
    const pathname = "wp-uploads/" + String(Date.now()) + "-" + safeFilename;
    const data = filePart.data;
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const opts: { access: "public"; contentType: string; addRandomSuffix: boolean; token?: string } = {
      access: "public",
      contentType: mime,
      addRandomSuffix: true,
    };
    if (token != null && typeof token === "string" && token.length > 0) {
      opts.token = token;
    }

    const blob = await put(pathname, arrayBuffer, opts);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ url: String(blob.url) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      error: "Upload failed",
      detail: message,
    });
  }
}

/**
 * Get raw request body. Tries req.body (Buffer) first if set by runtime, then reads stream with timeout.
 */
function getRawBody(req: VercelRequest): Promise<Buffer> {
  const r = req as VercelRequest & { body?: Buffer | string };
  if (r.body !== undefined && r.body !== null) {
    const buf = Buffer.isBuffer(r.body) ? r.body : Buffer.from(String(r.body), "binary");
    return Promise.resolve(buf);
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const timeout = setTimeout(() => {
      reject(new Error("Request body read timeout (20s)"));
    }, BODY_READ_TIMEOUT_MS);
    const onEnd = () => {
      clearTimeout(timeout);
      resolve(Buffer.concat(chunks));
    };
    const onError = (e: Error) => {
      clearTimeout(timeout);
      reject(e);
    };
    (req as NodeJS.ReadableStream & { on(e: string, cb: (...a: unknown[]) => void): void }).on(
      "data",
      (chunk: Buffer) => chunks.push(chunk)
    );
    (req as NodeJS.ReadableStream & { on(e: string, cb: () => void): void }).on("end", onEnd);
    (req as NodeJS.ReadableStream & { on(e: string, cb: (e: Error) => void): void }).on("error", onError);
  });
}

interface Part {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
}

function parseMultipart(buffer: Buffer, boundary: string): Part[] {
  const parts: Part[] = [];
  const boundaryStr = String(boundary).trim();
  const b = Buffer.from("--" + boundaryStr);
  const end = Buffer.from("--" + boundaryStr + "--");
  let i = buffer.indexOf(b) + b.length;
  while (i < buffer.length) {
    const next = buffer.indexOf(b, i);
    const chunk = next === -1 ? buffer.subarray(i) : buffer.subarray(i, next);
    i = next === -1 ? buffer.length : next + b.length;
    if (chunk.length <= 2) continue;
    const headEnd = chunk.indexOf(Buffer.from("\r\n\r\n"));
    if (headEnd === -1) continue;
    const headers = chunk.subarray(0, headEnd).toString("utf8");
    let data = chunk.subarray(headEnd + 4);
    if (data.subarray(-2).equals(Buffer.from("\r\n"))) {
      data = data.subarray(0, data.length - 2);
    }
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]*)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/);
    parts.push({
      name: nameMatch?.[1] ?? "file",
      filename: filenameMatch?.[1] || undefined,
      contentType: contentTypeMatch?.[1]?.trim(),
      data: Buffer.from(data),
    });
    if (buffer.subarray(i - end.length, i).equals(end)) break;
  }
  return parts;
}
