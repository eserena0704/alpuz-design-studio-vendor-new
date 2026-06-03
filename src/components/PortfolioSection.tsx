import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const portfolioItems = [
  {
    image: portfolio1,
    title: "Modern Living Room",
    category: "Residential",
    description: "Luxury condominium renovation with panoramic city views",
  },
  {
    image: portfolio2,
    title: "Spa Bathroom",
    category: "Residential",
    description: "Elegant marble bathroom with gold accents",
  },
  {
    image: portfolio3,
    title: "Minimalist Dining",
    category: "Residential",
    description: "Contemporary dining space with statement lighting",
  },
  {
    image: portfolio4,
    title: "Walk-in Wardrobe",
    category: "Carpentry",
    description: "Custom-built closet with LED illumination",
  },
  {
    image: portfolio5,
    title: "Artisan Café",
    category: "Commercial",
    description: "Cozy F&B interior with industrial charm",
  },
  {
    image: portfolio6,
    title: "Executive Office",
    category: "Commercial",
    description: "Premium workspace with skyline views",
  },
];

const PortfolioCard = ({
  item,
  index,
  onClick,
}: {
  item: (typeof portfolioItems)[0];
  index: number;
  onClick: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-80"
    >
      {/* Image with Ken Burns effect */}
      <motion.img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="absolute top-4 left-4"
      >
        <span className="px-3 py-1 bg-gold/90 text-primary text-xs font-body font-semibold rounded-full">
          {item.category}
        </span>
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-display text-2xl text-primary-foreground mb-2">
          {item.title}
        </h3>
        <p className="font-body text-primary-foreground/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {item.description}
        </p>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-2xl border-2 border-gold/0 group-hover:border-gold/40 transition-all duration-500" />
    </motion.div>
  );
};

const PortfolioSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [selectedImage, setSelectedImage] = useState<(typeof portfolioItems)[0] | null>(null);

  return (
    <>
      <section id="portfolio" className="py-24 bg-secondary relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4"
            >
              Our Portfolio
            </motion.p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Spaces We've
              <span className="text-gradient-gold"> Transformed</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Explore our collection of stunning residential and commercial
              projects that showcase our commitment to excellence.
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <PortfolioCard
                key={item.title}
                item={item}
                index={index}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>

          {/* View More CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <a
              href="https://wa.me/6597631290"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-gold text-primary font-body font-semibold px-10 py-4 rounded-full shadow-gold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>View More Projects</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-md p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-primary-foreground hover:text-gold transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="font-display text-2xl text-primary-foreground">
                {selectedImage.title}
              </h3>
              <p className="font-body text-primary-foreground/70 text-sm mt-1">
                {selectedImage.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default PortfolioSection;
