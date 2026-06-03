import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { readCatalog } from "../server/catalog.js";

const stripeApiVersion = "2026-04-22.dahlia";

interface CheckoutCustomerDetails {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  projectAddress?: unknown;
  notes?: unknown;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({
      error: "Stripe is not configured",
      detail: "Set STRIPE_SECRET_KEY in Vercel.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const requestedItems = Array.isArray(body?.items) ? body.items : [];
    if (requestedItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const customer = parseCustomerDetails(body?.customer);

    const { products } = await readCatalog();
    const lineItems = requestedItems.map((item: { product_id?: number; quantity?: number }) => {
      const quantity = Math.max(1, Math.min(99, Number(item.quantity || 1)));
      const product = products.find((p) => p.id === Number(item.product_id) && p.status === "publish");
      if (!product) {
        throw new Error(`Product ${item.product_id} is not available`);
      }

      const amount = toStripeAmount(product.price);
      if (amount <= 0) {
        throw new Error(`${product.name} requires a custom quote and cannot be checked out online`);
      }

      return {
        quantity,
        price_data: {
          currency: (process.env.STRIPE_CURRENCY || "sgd").toLowerCase(),
          unit_amount: amount,
          product_data: {
            name: product.name,
            description: stripHtml(product.short_description || product.description || ""),
            images: product.images?.[0]?.src?.startsWith("http") ? [product.images[0].src] : undefined,
          },
        },
      };
    });

    const origin = getOrigin(req);
    const stripe = new Stripe(secretKey, { apiVersion: stripeApiVersion });
    const metadata = {
      buyer_name: customer.name,
      buyer_email: customer.email,
      buyer_phone: customer.phone,
      project_address: customer.projectAddress,
      project_notes: customer.notes,
    };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${origin}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["SG"],
      },
      phone_number_collection: { enabled: true },
      metadata,
      payment_intent_data: { metadata },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    return res.status(400).json({
      error: "Failed to create checkout session",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}

function parseCustomerDetails(input: CheckoutCustomerDetails) {
  const name = toCleanString(input?.name, 120);
  const email = toCleanString(input?.email, 160).toLowerCase();
  const phone = toCleanString(input?.phone, 40);
  const projectAddress = toCleanString(input?.projectAddress, 500);
  const notes = toCleanString(input?.notes, 500);

  if (!name) throw new Error("Please enter the buyer name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid buyer email");
  }
  if (!phone) throw new Error("Please enter the buyer phone number");

  return { name, email, phone, projectAddress, notes };
}

function toCleanString(value: unknown, maxLength: number): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function toStripeAmount(price: string): number {
  const amount = Number(String(price).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

function getOrigin(req: VercelRequest): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host || process.env.VERCEL_URL;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const resolvedHost = Array.isArray(host) ? host[0] : host;
  const resolvedProto = Array.isArray(proto) ? proto[0] : proto;
  return `${resolvedProto}://${resolvedHost}`;
}
