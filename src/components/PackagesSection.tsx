import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import packageBto from "@/assets/package-bto.jpg";
import packageKitchen from "@/assets/package-kitchen.jpg";
import packageResale from "@/assets/package-resale.jpg";
import packageBathroom from "@/assets/package-bathroom.jpg";
import packageCarpentry from "@/assets/package-carpentry.jpg";
import packageCommercial from "@/assets/package-commercial.jpg";

const packages = [
  {
    image: packageBto,
    title: "BTO Renovation Package",
    price: "$7,888",
    tag: "Most Popular",
    description: "Complete HDB BTO move-in ready package with flooring, painting and essentials.",
    features: ["Full home flooring", "Painting all rooms", "Basic carpentry", "Electrical works"],
  },
  {
    image: packageKitchen,
    title: "Kitchen Cabinet Package",
    price: "$3,888",
    tag: "Best Value",
    description: "Custom-made kitchen cabinets designed to maximize your space beautifully.",
    features: ["Custom cabinetry", "Quartz countertop", "Soft-close hinges", "Backsplash tiling"],
  },
  {
    image: packageResale,
    title: "Resale HDB Package",
    price: "$18,888",
    tag: "Premium",
    description: "Comprehensive renovation for resale flats — refresh every corner of your home.",
    features: ["Hacking works", "Full flooring", "Plumbing & electrical", "Custom carpentry"],
  },
  {
    image: packageBathroom,
    title: "Bathroom Renovation",
    price: "$4,888",
    tag: "Luxury",
    description: "Transform your bathroom into a spa-like retreat with premium finishes.",
    features: ["Marble-look tiling", "Premium fixtures", "Waterproofing", "Vanity cabinet"],
  },
  {
    image: packageCarpentry,
    title: "Carpentry Package",
    price: "$5,888",
    tag: "Custom",
    description: "Built-in wardrobes, TV consoles and storage solutions tailored to your space.",
    features: ["Built-in wardrobe", "TV console", "Shoe cabinet", "Study table"],
  },
  {
    image: packageCommercial,
    title: "Commercial Fit-Out",
    price: "Quote on request",
    tag: "Business",
    description: "End-to-end design and build for offices, F&B and retail spaces.",
    features: ["Space planning", "Brand-aligned design", "M&E coordination", "Project management"],
  },
];

const PackageCard = ({
  pkg,
  index,
}: {
  pkg: (typeof packages)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-gold/50 transition-all duration-500 hover:shadow-gold flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-gradient-gold text-primary text-xs font-body font-semibold rounded-full">
            {pkg.tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-6 right-6">
          <h3 className="font-display text-2xl text-primary-foreground mb-1">
            {pkg.title}
          </h3>
          <p className="font-display text-3xl text-gold font-semibold">
            {pkg.price}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="font-body text-muted-foreground text-sm mb-5">
          {pkg.description}
        </p>
        <ul className="space-y-2 mb-6 flex-1">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm font-body text-foreground">
              <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" className="font-body font-semibold w-full">
            <a
              href={`https://wa.me/6597631290?text=${encodeURIComponent(`Hi Alpuz, I'm interested in the ${pkg.title} (${pkg.price}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enquire
            </a>
          </Button>
          <Button
            asChild
            className="bg-gradient-gold text-primary hover:opacity-90 font-body font-semibold w-full"
          >
            <Link to="/shop">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View shop
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const PackagesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="shop" className="py-24 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
            2026 Renovation Packages
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Transparent Pricing,
            <span className="text-gradient-gold"> No Hidden Costs</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Choose from our curated renovation packages — designed to make your
            dream home affordable, beautiful and stress-free.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.title} pkg={pkg} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="font-body text-muted-foreground mb-4">
            Need a customised package? We'll tailor one just for you.
          </p>
          <a
            href="https://wa.me/6597631290"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-gold text-primary font-body font-semibold px-10 py-4 rounded-full shadow-gold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp for Custom Quote</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PackagesSection;
