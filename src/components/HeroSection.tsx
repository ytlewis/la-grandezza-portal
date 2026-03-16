import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-event.jpg";

const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black-deep/70 via-black-deep/50 to-black-deep" />

    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <motion.p
        className="text-gold text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase font-body mb-4 md:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Luxury Event Planning
      </motion.p>
      <motion.h1
        className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 md:mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <span className="text-cream">Where Moments Become</span>{" "}
        <span className="gold-text-gradient italic">Masterpieces</span>
      </motion.h1>
      <motion.p
        className="text-cream/70 text-sm md:text-base lg:text-lg font-body max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        La Grandezza Events crafts bespoke experiences that transcend the ordinary.
        Every detail, curated to perfection.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <Link
          to="/book"
          className="inline-block px-10 py-4 bg-gold text-black-deep font-body text-sm tracking-widest uppercase font-semibold hover:bg-gold-light transition-all duration-300 shadow-gold-lg"
        >
          Plan Your Event
        </Link>
      </motion.div>
    </div>

    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div className="w-5 h-8 border border-gold/50 rounded-full flex items-start justify-center p-1">
        <div className="w-1 h-2 bg-gold rounded-full" />
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
