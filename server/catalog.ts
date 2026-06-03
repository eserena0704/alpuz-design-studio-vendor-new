import { list, put } from "@vercel/blob";

export interface CatalogImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
}

export interface CatalogCategory {
  id: number;
  name: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description?: string;
  short_description?: string;
  images: CatalogImage[];
  categories?: CatalogCategory[];
  status: "publish" | "draft";
  type?: string;
}

export interface CatalogPayload {
  updatedAt: string;
  products: CatalogProduct[];
  chatbotScript?: string;
}

const CATALOG_PREFIX = "alpuz/catalog/";
const CATALOG_LIMIT = 25;

export const defaultCatalog: CatalogProduct[] = [
  {
    id: 1001,
    name: "Kitchen Cabinet Renovation Package",
    slug: "kitchen-cabinet-renovation-package",
    permalink: "",
    price: "3888",
    regular_price: "3888",
    sale_price: "",
    short_description: "Custom kitchen cabinet package for practical cooking zones, clean storage and premium everyday finishes.",
    description: "Custom kitchen cabinets\nQuartz-look countertop options\nSoft-close hinges and drawer runners\nSite measurement and design consultation",
    images: [{ id: 1, src: "/catalog/package-kitchen.jpg", alt: "Kitchen cabinet renovation package" }],
    categories: [{ id: 1, name: "Renovation Promotions" }],
    status: "publish",
    type: "simple",
  },
  {
    id: 1002,
    name: "BTO Renovation Package",
    slug: "bto-renovation-package",
    permalink: "",
    price: "7888",
    regular_price: "7888",
    sale_price: "",
    short_description: "Move-in ready BTO essentials from $7,888, planned for a clean handover and fast setup.",
    description: "2-room from $7,888\n3-room from $10,888\n4-room from $12,888\n5-room from $14,888",
    images: [{ id: 1, src: "/catalog/package-bto.jpg", alt: "BTO renovation package" }],
    categories: [{ id: 1, name: "Renovation Promotions" }],
    status: "publish",
    type: "simple",
  },
  {
    id: 1003,
    name: "2 Bathroom Renovation Package",
    slug: "two-bathroom-renovation-package",
    permalink: "",
    price: "9888",
    regular_price: "9888",
    sale_price: "",
    short_description: "Refresh two bathrooms with coordinated tiling, waterproofing, fixtures and vanity details.",
    description: "2 bathrooms included\nWall and floor tiling works\nWaterproofing and plumbing coordination\nVanity, mirror and fixture planning",
    images: [{ id: 1, src: "/catalog/package-bathroom.jpg", alt: "Two bathroom renovation package" }],
    categories: [{ id: 1, name: "Renovation Promotions" }],
    status: "publish",
    type: "simple",
  },
  {
    id: 1004,
    name: "Resale Kitchen Renovation Package",
    slug: "resale-kitchen-renovation-package",
    permalink: "",
    price: "10888",
    regular_price: "10888",
    sale_price: "",
    short_description: "A sharper resale kitchen package covering dismantling, cabinet rebuild and refreshed work surfaces.",
    description: "Existing kitchen refresh\nCabinet replacement and planning\nCountertop and backsplash options\nPlumbing and electrical coordination",
    images: [{ id: 1, src: "/catalog/package-carpentry.jpg", alt: "Resale kitchen renovation package" }],
    categories: [{ id: 1, name: "Renovation Promotions" }],
    status: "publish",
    type: "simple",
  },
  {
    id: 1005,
    name: "Kitchen and 2 Toilet Renovation Package",
    slug: "kitchen-and-two-toilet-renovation-package",
    permalink: "",
    price: "18888",
    regular_price: "18888",
    sale_price: "",
    short_description: "A high-impact home refresh combining the kitchen and both toilets into one coordinated package.",
    description: "Kitchen cabinet package\n2 toilet renovation works\nMaterial and colour coordination\nProject scheduling across wet areas",
    images: [{ id: 1, src: "/catalog/package-resale.jpg", alt: "Kitchen and two toilet renovation package" }],
    categories: [{ id: 1, name: "Renovation Promotions" }],
    status: "publish",
    type: "simple",
  },
  {
    id: 1006,
    name: "Commercial Fit-Out",
    slug: "commercial-fit-out",
    permalink: "",
    price: "",
    regular_price: "",
    sale_price: "",
    short_description: "Quote-on-request fit-out support for offices, retail, F&B and business spaces.",
    description: "Business space planning\nBrand-aligned design direction\nM&E and site coordination\nProject management for commercial handover",
    images: [{ id: 1, src: "/catalog/package-commercial.jpg", alt: "Commercial fit-out" }],
    categories: [{ id: 1, name: "Business" }],
    status: "publish",
    type: "simple",
  },
];

export function adminPasswordMatches(password: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? process.env.ALPUZ_ADMIN_PASSWORD ?? "alpuz-admin";
  return typeof password === "string" && password.length > 0 && password === expected;
}

export async function readCatalog(): Promise<CatalogPayload> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { updatedAt: new Date(0).toISOString(), products: defaultCatalog, chatbotScript: "" };
  }

  const { blobs } = await list({
    prefix: CATALOG_PREFIX,
    limit: CATALOG_LIMIT,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const latest = blobs
    .filter((blob) => blob.pathname.endsWith(".json"))
    .sort((a, b) => Number(new Date(b.uploadedAt)) - Number(new Date(a.uploadedAt)))[0];

  if (!latest) {
    return { updatedAt: new Date(0).toISOString(), products: defaultCatalog, chatbotScript: "" };
  }

  const response = await fetch(latest.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Catalog Blob returned ${response.status}`);
  }

  const payload = (await response.json()) as Partial<CatalogPayload>;
  return {
    updatedAt: payload.updatedAt ?? latest.uploadedAt.toISOString(),
    products: normalizeProducts(payload.products),
    chatbotScript: payload.chatbotScript || "",
  };
}

export async function saveCatalog(products: CatalogProduct[], chatbotScript?: string): Promise<CatalogPayload> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const payload: CatalogPayload = {
    updatedAt: new Date().toISOString(),
    products: normalizeProducts(products),
    chatbotScript: chatbotScript ? String(chatbotScript).trim() : undefined,
  };

  await put(`${CATALOG_PREFIX}${Date.now()}.json`, JSON.stringify(payload, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return payload;
}

export function normalizeProducts(input: unknown): CatalogProduct[] {
  const products = Array.isArray(input) ? input : defaultCatalog;
  return products.map((product, index) => {
    const p = product as Partial<CatalogProduct>;
    const name = String(p.name ?? `Product ${index + 1}`).trim();
    const id = Number.isFinite(Number(p.id)) ? Number(p.id) : Date.now() + index;
    const price = sanitizePrice(p.price ?? p.regular_price ?? "0");
    const imageSrc = p.images?.[0]?.src ? String(p.images[0].src) : "/placeholder.svg";
    const categoryName = p.categories?.[0]?.name ? String(p.categories[0].name) : "Store";

    return {
      id,
      name,
      slug: p.slug || slugify(name),
      permalink: p.permalink || "",
      price,
      regular_price: sanitizePrice(p.regular_price ?? price),
      sale_price: sanitizePrice(p.sale_price ?? ""),
      description: String(p.description ?? ""),
      short_description: String(p.short_description ?? ""),
      images: [
        {
          id: Number(p.images?.[0]?.id ?? 1),
          src: imageSrc,
          name: p.images?.[0]?.name ?? name,
          alt: p.images?.[0]?.alt ?? name,
        },
      ],
      categories: [{ id: Number(p.categories?.[0]?.id ?? 1), name: categoryName }],
      status: p.status === "draft" ? "draft" : "publish",
      type: "simple",
    };
  });
}

function sanitizePrice(value: unknown): string {
  const raw = String(value ?? "").replace(/[$,\s]/g, "");
  if (!raw) return "";
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount < 0) return "0";
  return amount % 1 === 0 ? String(amount) : amount.toFixed(2);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
