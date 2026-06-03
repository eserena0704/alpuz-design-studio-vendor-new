import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Lim",
    role: "Homeowner, Toa Payoh",
    content:
      "Alpuz transformed our 4-room HDB into a luxurious haven. Their attention to detail and professionalism exceeded our expectations. The team was responsive and delivered on time!",
    rating: 5,
  },
  {
    name: "David Tan",
    role: "Restaurant Owner, Tanjong Pagar",
    content:
      "We hired Alpuz for our new café concept and they absolutely nailed it. The design captures the exact vibe we wanted - cozy yet modern. Our customers love the ambiance!",
    rating: 5,
  },
  {
    name: "Michelle Wong",
    role: "Condo Owner, Orchard",
    content:
      "From concept to completion, the Alpuz team was exceptional. They maximized every inch of our space while keeping within budget. Highly recommend their services!",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Office Manager, CBD",
    content:
      "Our office renovation was completed seamlessly with minimal disruption to operations. The modern design has improved both staff morale and client impressions.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setActiveIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Quote size={120} className="text-gold" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 rotate-180">
        <Quote size={120} className="text-gold" />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-6">
            What Our Clients
            <span className="text-gradient-gold"> Say</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[300px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-6 h-6 text-gold fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </motion.svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-body text-primary-foreground/90 text-xl md:text-2xl leading-relaxed mb-8 italic">
                  "{testimonials[activeIndex].content}"
                </p>

                {/* Author */}
                <div>
                  <p className="font-display text-xl text-gold">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="font-body text-primary-foreground/60 text-sm">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 -translate-x-4 md:-translate-x-16 p-3 rounded-full border border-primary-foreground/20 text-primary-foreground/60 hover:text-gold hover:border-gold transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-0 translate-x-4 md:translate-x-16 p-3 rounded-full border border-primary-foreground/20 text-primary-foreground/60 hover:text-gold hover:border-gold transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? "w-8 h-2 bg-gold"
                    : "w-2 h-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
