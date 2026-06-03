import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import PackagesSection from "@/components/PackagesSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingElements from "@/components/FloatingElements";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  return (
    <main className="overflow-x-hidden relative pb-24 sm:pb-8">
      <FloatingElements />
      <Navigation />
      <HeroSection />
      <StatsCounter />
      <ServicesSection />
      <PortfolioSection />
      <PackagesSection />
      <ProcessSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </main>
  );
};

export default Index;
