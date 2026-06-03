import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Pencil, Hammer, Sparkles } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Consultation",
    description:
      "We begin with a free consultation to understand your vision, requirements, and budget.",
  },
  {
    icon: Pencil,
    number: "02",
    title: "Design & Planning",
    description:
      "Our designers create detailed 3D renders and floor plans tailored to your space.",
  },
  {
    icon: Hammer,
    number: "03",
    title: "Construction",
    description:
      "Expert craftsmen bring the design to life with quality materials and precision.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Handover",
    description:
      "Final walkthrough and handover of your dream space, ready to move in.",
  },
];

const ProcessStep = ({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connection Line */}
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
          className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gold to-gold/30 origin-left z-0"
        />
      )}

      {/* Icon Container */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold mb-6 group-hover:shadow-lg transition-shadow duration-500"
      >
        <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />

        {/* Step Number */}
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="font-display text-sm text-gold">{step.number}</span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
      >
        <h3 className="font-display text-2xl text-foreground mb-3">
          {step.title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xs">
          {step.description}
        </p>
      </motion.div>

      {/* Hover Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const ProcessSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Our Process
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            From Vision to
            <span className="text-gradient-gold"> Reality</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            A streamlined journey to transform your space with transparency and
            excellence at every step.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.title}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-gold text-gold font-body font-semibold px-8 py-4 rounded-full hover:bg-gold hover:text-primary transition-all duration-300"
          >
            Start Your Journey
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
