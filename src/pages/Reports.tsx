import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageUp, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminLogin, fetchCatalog, saveCatalog, uploadProductImage } from "@/lib/api";
import type { CatalogProduct } from "@/types/catalog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ADMIN_STORAGE_KEY = "alpuz-admin-password";

function blankProduct(): CatalogProduct {
  const id = Date.now();
  return {
    id,
    name: "New store item",
    slug: `new-store-item-${id}`,
    permalink: "",
    price: "0",
    regular_price: "0",
    sale_price: "",
    short_description: "",
    description: "",
    images: [{ id: 1, src: "/placeholder.svg", alt: "New store item" }],
    categories: [{ id: 1, name: "Store" }],
    status: "draft",
    type: "simple",
  };
}

const Reports = () => {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState(() => localStorage.getItem(ADMIN_STORAGE_KEY) ?? "");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(ADMIN_STORAGE_KEY)));
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
  });

  useEffect(() => {
    if (data?.products) setProducts(data.products);
  }, [data]);

  const publishedCount = useMemo(
    () => products.filter((product) => product.status === "publish").length,
    [products]
  );

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await adminLogin(loginPassword);
      localStorage.setItem(ADMIN_STORAGE_KEY, loginPassword);
      setPassword(loginPassword);
      setIsLoggedIn(true);
      setLoginPassword("");
      setStatusMessage("Admin access confirmed.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setPassword("");
    setIsLoggedIn(false);
    setStatusMessage(null);
  };

  const updateProduct = (id: number, patch: Partial<CatalogProduct>) => {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...patch } : product))
    );
  };

  const updateCategory = (id: number, name: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, categories: [{ id: product.categories?.[0]?.id ?? 1, name }] }
          : product
      )
    );
  };

  const updateImage = (id: number, src: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, images: [{ id: product.images?.[0]?.id ?? 1, src, alt: product.name }] }
          : product
      )
    );
  };

  const handleUpload = async (id: number, file: File | undefined) => {
    if (!file) return;
    setErrorMessage(null);
    setStatusMessage(null);
    setUploadingId(id);

    try {
      const url = await uploadProductImage(password, file);
      updateImage(id, url);
      setStatusMessage("Image uploaded. Save the catalog to publish it.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const saved = await saveCatalog(password, products);
      setProducts(saved.products);
      queryClient.setQueryData(["catalog"], saved);
      setStatusMessage("Catalog saved to Vercel Blob.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const handleAdd = () => {
    setProducts((current) => [blankProduct(), ...current]);
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="container mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-28">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Store admin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                <Button type="submit" className="w-full bg-gradient-gold text-primary">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/60">
      <Navigation />
      <section className="container mx-auto px-6 py-28">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 font-body text-sm uppercase tracking-[0.25em] text-gold">Admin</p>
            <h1 className="font-display text-4xl text-foreground">Store catalog</h1>
            <p className="mt-3 font-body text-muted-foreground">
              {products.length} items, {publishedCount} published
              {data?.updatedAt && Number(new Date(data.updatedAt)) > 0
                ? `, last saved ${new Date(data.updatedAt).toLocaleString()}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add item
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || uploadingId !== null}
              className="bg-gradient-gold text-primary"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save catalog"}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-foreground">
            {statusMessage}
          </div>
        )}
        {(errorMessage || isError) && (
          <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage || (error instanceof Error ? error.message : "Catalog failed to load.")}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-44 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[180px_1fr_auto]">
                  <div>
                    <div className="mb-3 aspect-[4/3] overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.images?.[0]?.src || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Label
                      htmlFor={`image-${product.id}`}
                      className="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <ImageUp className="mr-2 h-4 w-4" />
                      {uploadingId === product.id ? "Uploading..." : "Upload"}
                    </Label>
                    <Input
                      id={`image-${product.id}`}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingId === product.id}
                      onChange={(event) => handleUpload(product.id, event.target.files?.[0])}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`name-${product.id}`}>Name</Label>
                      <Input
                        id={`name-${product.id}`}
                        value={product.name}
                        onChange={(event) => updateProduct(product.id, { name: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`price-${product.id}`}>Price SGD</Label>
                      <Input
                        id={`price-${product.id}`}
                        inputMode="decimal"
                        value={product.price}
                        onChange={(event) =>
                          updateProduct(product.id, {
                            price: event.target.value,
                            regular_price: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`category-${product.id}`}>Category</Label>
                      <Input
                        id={`category-${product.id}`}
                        value={product.categories?.[0]?.name ?? ""}
                        onChange={(event) => updateCategory(product.id, event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`status-${product.id}`}>Status</Label>
                      <select
                        id={`status-${product.id}`}
                        value={product.status}
                        onChange={(event) =>
                          updateProduct(product.id, { status: event.target.value as "publish" | "draft" })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="publish">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`image-url-${product.id}`}>Image URL</Label>
                      <Input
                        id={`image-url-${product.id}`}
                        value={product.images?.[0]?.src ?? ""}
                        onChange={(event) => updateImage(product.id, event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`description-${product.id}`}>Short description</Label>
                      <Textarea
                        id={`description-${product.id}`}
                        value={product.short_description ?? ""}
                        onChange={(event) =>
                          updateProduct(product.id, { short_description: event.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    <Button variant="ghost" className="text-destructive" onClick={() => handleRemove(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
};

export default Reports;
