import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { fetchProducts } from "@/lib/api";
import type { CatalogProduct } from "@/types/catalog";

function ProductCard({
  product,
  index,
}: {
  product: CatalogProduct;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const navigate = useNavigate();
  const { buyNow } = useCart();
  const apiImageUrl =
    product.images?.[0]?.src ||
    (product as { featured_src?: string }).featured_src ||
    "";
  const [imgSrc, setImgSrc] = useState(apiImageUrl || "/placeholder.svg");
  const priceValue = Number(product.price || "0");
  const canCheckout = priceValue > 0;
  const featureLines = String(product.description || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
  const isFromPrice = /bto|whole house/i.test(product.name);
  const category = product.categories?.[0]?.name ?? "Renovation Promotions";

  useEffect(() => {
    setImgSrc(apiImageUrl || "/placeholder.svg");
  }, [apiImageUrl]);

  const handleBuyNow = () => {
    buyNow(product);
    navigate("/checkout");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col border-border/80 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-gold">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            key={apiImageUrl || product.id}
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc("/placeholder.svg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-primary shadow-card">
            2026 Promo
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="mb-1 font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {category}
            </p>
            <h3 className="font-display text-2xl leading-tight text-primary-foreground">
              {product.name}
            </h3>
          </div>
        </div>
        <CardContent className="p-5 flex-1">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Package price
              </p>
              <p className="font-display text-4xl font-semibold leading-none text-gold">
                {canCheckout ? (
                  <>
                    <span className="mr-1 text-base font-body font-semibold uppercase tracking-[0.14em] text-foreground">
                      {isFromPrice ? "From " : ""}
                    </span>
                    <span className="text-2xl text-foreground">$</span>
                    {priceValue.toLocaleString("en-SG", {
                      minimumFractionDigits: priceValue % 1 === 0 ? 0 : 2,
                    })}
                  </>
                ) : (
                  <span className="text-3xl">Quote on request</span>
                )}
              </p>
            </div>
          </div>
          {product.short_description ? (
            <p
              className="mb-5 min-h-[44px] text-sm leading-relaxed text-muted-foreground font-body"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          ) : null}
          {featureLines.length ? (
            <ul className="space-y-2">
              {featureLines.map((feature) => (
                <li key={feature} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
        <CardFooter className="p-5 pt-0 grid gap-3">
          {canCheckout ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="w-full font-body font-semibold"
              >
                <a
                  href={`https://wa.me/6597631290?text=${encodeURIComponent(`Hi Alpuz, I want to know more about the ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enquire now
                </a>
              </Button>
              <Button
                className="w-full bg-gradient-gold text-primary hover:opacity-90 font-body font-semibold"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy now
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="w-full bg-gradient-gold text-primary hover:opacity-90 font-body font-semibold"
            >
              <a
                href={`https://wa.me/6597631290?text=${encodeURIComponent(`Hi Alpuz, I'm interested in ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enquire now
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const ProductsSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({ per_page: 12 }),
  });

  const products = (data?.products ?? []).filter((product) => product.status === "publish");

  return (
    <section id="shop" className="py-28 pb-32 sm:pb-24 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
            2026 Renovation Promotions
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Package Pricing,
            <span className="text-gradient-gold"> Clearly Listed</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Browse Alpuz renovation packages for kitchens, BTO homes, bathrooms,
            resale flats and business spaces. Buy fixed-price packages online or
            enquire for a custom quote.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">
              Unable to load products.{" "}
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">
              No products available yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
