export interface CatalogProductImage {
  id: number;
  src: string;
  name?: string;
  alt?: string;
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
  images: CatalogProductImage[];
  categories?: { id: number; name: string }[];
  status: string;
  type?: string;
}

export interface CatalogPayload {
  updatedAt: string;
  products: CatalogProduct[];
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export interface CheckoutCustomerDetails {
  name: string;
  email: string;
  phone: string;
  projectAddress?: string;
  notes?: string;
}
