import { motion } from "framer-motion";

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gold floating orb - top right */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
      />

      {/* Navy orb - bottom left */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
      />

      {/* Small accent orb */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/5 rounded-full blur-2xl"
      />

      {/* Geometric shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-20 w-4 h-4 border border-gold/10"
        style={{ transformOrigin: "100px 100px" }}
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-32 right-32 w-6 h-6 border border-gold/10 rotate-45"
        style={{ transformOrigin: "-80px -80px" }}
      />
    </div>
  );
};

export default FloatingElements;
