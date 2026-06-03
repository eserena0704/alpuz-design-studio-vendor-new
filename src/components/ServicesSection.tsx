import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import kitchenImage from "@/assets/kitchen-interior.jpg";
import bedroomImage from "@/assets/bedroom-interior.jpg";
import officeImage from "@/assets/office-interior.jpg";
import restaurantImage from "@/assets/restaurant-interior.jpg";

const services = [
  {
    title: "Home Interior Design",
    description:
      "Transform your living spaces into elegant sanctuaries that reflect your personality and lifestyle.",
    image: bedroomImage,
  },
  {
    title: "Carpentry Works",
    description:
      "Custom-built furniture and fixtures crafted with precision and premium materials.",
    image: kitchenImage,
  },
  {
    title: "Commercial Design",
    description:
      "Professional office and retail spaces designed to boost productivity and impress clients.",
    image: officeImage,
  },
  {
    title: "Restaurant & F&B",
    description:
      "Create unforgettable dining experiences with atmospheric designs that captivate guests.",
    image: restaurantImage,
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-elegant transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl text-primary-foreground mb-2">
          {service.title}
        </h3>
        <p className="font-body text-primary-foreground/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {service.description}
        </p>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/50 rounded-2xl transition-all duration-500" />
    </motion.div>
  );
};

const ServicesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Transforming Spaces Into
            <span className="text-gradient-gold"> Masterpieces</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            From residential homes to commercial establishments, we bring your
            vision to life with quality craftsmanship and affordable solutions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-block bg-gradient-navy text-primary-foreground font-body font-semibold px-10 py-4 rounded-full shadow-elegant hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
