import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import alpuzLogo from "@/assets/alpuz-logo.png";

const navLinks = [
  { name: "Home", hash: "#home" },
  { name: "Services", hash: "#services" },
  { name: "Portfolio", hash: "#portfolio" },
  { name: "Shop", path: "/shop" },
  { name: "About", hash: "#about" },
  { name: "Contact", hash: "#contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash scrolling after navigation
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  const handleNavClick = useCallback(
    (link: (typeof navLinks)[number]) => {
      setIsMobileMenuOpen(false);
      if ("path" in link && link.path) {
        navigate(link.path);
        return;
      }

      const hash = link.hash;
      if (isHome) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/" + hash);
      }
    },
    [isHome, navigate]
  );

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-elegant py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={alpuzLogo}
            alt="Alpuz Interior Design"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              className={`font-body text-sm font-medium tracking-wide transition-colors duration-300 hover:text-gold bg-transparent border-none cursor-pointer ${
                isScrolled || !isHome ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.name}
            </button>
          ))}
          <a
            href="https://wa.me/6597631290"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-gold text-primary font-body text-sm font-semibold px-6 py-2.5 rounded-full shadow-gold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            WhatsApp Us
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 ${
            isScrolled || !isHome ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="font-body text-lg font-medium text-foreground py-2 border-b border-border/50 text-left bg-transparent border-x-0 border-t-0 cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <a
                href="https://wa.me/6597631290"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-gold text-primary font-body text-base font-semibold px-6 py-3 rounded-full shadow-gold text-center mt-2"
              >
                WhatsApp Us
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navigation;
