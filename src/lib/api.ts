import { defaultProducts } from "@/lib/defaultCatalog";

const API_BASE = "";
const LOCAL_CATALOG_KEY = "alpuz-local-catalog";
const LOCAL_ADMIN_PASSWORD = "alpuz-admin";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`API ${res.status}: expected JSON response`);
  }
  const data = await res.json().catch(() => ({})) as { error?: string; detail?: string; message?: string };
  if (!res.ok) {
    const msg = data?.detail ? `${data?.error ?? data?.message ?? "Error"}: ${data.detail}` : (data?.error ?? data?.message ?? data?.detail ?? `API ${res.status}`);
    throw new Error(msg);
  }
  return data as T;
}

export async function fetchProducts(params?: { per_page?: number; page?: number }) {
  const catalog = await fetchCatalog();
  const limit = params?.per_page ?? catalog.products.length;
  return { ...catalog, products: catalog.products.slice(0, limit) };
}

export async function createCheckoutSession(body: {
  items: { product_id: number; quantity: number }[];
  customer: import("@/types/catalog").CheckoutCustomerDetails;
}) {
  return apiFetch<import("@/types/catalog").CheckoutSessionResponse>("/api/create-checkout-session", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminLogin(password: string) {
  try {
    return await apiFetch<{ ok: true }>("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  } catch (err) {
    if (import.meta.env.DEV && password === LOCAL_ADMIN_PASSWORD) return { ok: true };
    throw err;
  }
}

export async function fetchCatalog() {
  try {
    return await apiFetch<import("@/types/catalog").CatalogPayload>("/api/catalog");
  } catch (err) {
    if (import.meta.env.DEV) {
      const localCatalog = localStorage.getItem(LOCAL_CATALOG_KEY);
      if (localCatalog) {
        return JSON.parse(localCatalog) as import("@/types/catalog").CatalogPayload;
      }
      return {
        updatedAt: new Date(0).toISOString(),
        products: defaultProducts,
      };
    }
    throw err;
  }
}

export async function saveCatalog(
  password: string,
  products: import("@/types/catalog").CatalogProduct[]
) {
  try {
    return await apiFetch<import("@/types/catalog").CatalogPayload>("/api/catalog", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: JSON.stringify({ products }),
    });
  } catch (err) {
    if (import.meta.env.DEV && password === LOCAL_ADMIN_PASSWORD) {
      const catalog = {
        updatedAt: new Date().toISOString(),
        products,
      };
      localStorage.setItem(LOCAL_CATALOG_KEY, JSON.stringify(catalog));
      return catalog;
    }
    throw err;
  }
}

export async function uploadProductImage(password: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  try {
    const res = await fetch("/api/upload-media", {
      method: "POST",
      headers: { "x-admin-password": password },
      body,
    });
    const data = await res.json().catch(() => ({})) as { url?: string; error?: string; detail?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.detail || data.error || `Upload failed: ${res.status}`);
    }
    return data.url;
  } catch (err) {
    if (import.meta.env.DEV && password === LOCAL_ADMIN_PASSWORD) {
      return URL.createObjectURL(file);
    }
    throw err;
  }
}
