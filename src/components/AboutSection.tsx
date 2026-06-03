import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Clock, Award, ThumbsUp } from "lucide-react";
import prestigeAward from "@/assets/prestige-award.jpeg";
import top50Award from "@/assets/top50-award.jpeg";
import bizsafeLogo from "@/assets/bizsafe-logo.jpeg";

const credentials = [
  { image: prestigeAward, alt: "Prestige 100 Singapore 2023/2024" },
  { image: top50Award, alt: "Top 50 Interior Design Award 2023/2024" },
  { image: bizsafeLogo, alt: "BizSafe 3 Certified" },
];

const features = [
  {
    icon: Shield,
    title: "Quality Materials",
    description: "Premium materials at competitive prices",
  },
  {
    icon: Award,
    title: "Certified Designers",
    description: "Professional certified design team",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "Comprehensive project management",
  },
  {
    icon: ThumbsUp,
    title: "Transparent Pricing",
    description: "No hidden costs, ever",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-secondary relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="w-12 h-0.5 bg-gold origin-left mb-6"
            />
            <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Quality &amp; Affordable
              <span className="text-gradient-gold"> Excellence</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-10">
              At Alpuz Interior Design, we believe everyone deserves a beautiful
              space. Our team combines professionalism and dedication to deliver
              exceptional results that exceed expectations, all while remaining
              budget-conscious.
            </p>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-card transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="font-body text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Credentials & Awards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-8 shadow-elegant relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent" />

              <h3 className="font-display text-2xl text-foreground mb-8 text-center relative z-10">
                Awards &amp; Certifications
              </h3>
              
              <div className="grid grid-cols-3 gap-6 items-center mb-8">
                {credentials.map((cred, index) => (
                  <motion.div
                    key={cred.alt}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex items-center justify-center p-4 bg-background rounded-xl hover:shadow-card transition-all duration-300"
                  >
                    <img
                      src={cred.image}
                      alt={cred.alt}
                      className="max-h-20 w-auto object-contain"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Trust Statement */}
              <div className="pt-8 border-t border-border">
                <p className="font-body text-center text-muted-foreground text-sm leading-relaxed">
                  Recognized as one of Singapore&apos;s Top 50 Interior Design
                  firms, certified with BizSafe 3 for workplace safety, and
                  honored in the Prestige 100 Singapore 2023/2024.
                </p>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -left-8 w-32 h-32 border border-gold/10 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
