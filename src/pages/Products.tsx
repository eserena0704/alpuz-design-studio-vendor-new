import Navigation from "@/components/Navigation";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartDrawer from "@/components/CartDrawer";

const Products = () => {
  return (
    <main className="overflow-x-hidden relative min-h-screen pb-24 sm:pb-8">
      <Navigation />
      <ProductsSection />
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </main>
  );
};

export default Products;
