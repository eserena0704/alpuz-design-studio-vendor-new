import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "+65 9763 1290",
    href: "tel:+6597631290",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@alpuz.com.sg",
    href: "mailto:hello@alpuz.com.sg",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Singapore",
    href: "#",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon - Sat: 9AM - 6PM",
    href: "#",
  },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4">
              Get In Touch
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Let&apos;s Create Your
              <span className="text-gradient-gold"> Dream Space</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-10">
              Ready to transform your space? Contact us today for a free
              consultation. Our team is here to bring your vision to life with
              quality craftsmanship and personalized service.
            </p>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-cream-dark transition-colors duration-300 group"
                >
                  <div className="p-3 rounded-lg bg-gradient-gold group-hover:shadow-gold transition-shadow duration-300">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-body font-medium text-foreground">
                      {info.title}
                    </h4>
                    <p className="font-body text-muted-foreground text-sm mt-1">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="w-full bg-gradient-navy rounded-3xl p-10 text-center shadow-elegant">
              <h3 className="font-display text-3xl md:text-4xl text-primary-foreground mb-4">
                Book Your Free Consultation
              </h3>
              <p className="font-body text-primary-foreground/80 mb-8 max-w-md mx-auto">
                Schedule a free no-obligation consultation with our expert
                designers. Discuss your vision and get a personalized quote.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/6597631290?text=Hi%20Alpuz%2C%20I%27m%20interested%20in%20your%20interior%20design%20services.%20Can%20we%20schedule%20a%20consultation%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary font-body font-semibold px-8 py-4 rounded-full shadow-gold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
                <a
                  href="tel:+6597631290"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/50 text-primary-foreground font-body font-medium px-8 py-4 rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
