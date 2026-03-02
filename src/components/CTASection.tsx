import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-24 bg-black-deep relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, hsl(43 56% 54% / 0.1) 0%, transparent 50%)" }} />
    </div>
    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-5xl text-cream mb-6">
          Ready to Create Something <span className="gold-text-gradient italic">Extraordinary</span>?
        </h2>
        <p className="text-muted-foreground text-base mb-10 leading-relaxed">
          Let us bring your vision to life. Every event is bespoke, every moment is curated, and every detail is perfected.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/book"
            className="px-10 py-4 bg-gold text-black-deep font-body text-sm tracking-widest uppercase font-semibold hover:bg-gold-light transition-all duration-300 shadow-gold-lg"
          >
            Start Planning
          </Link>
          <Link
            to="/contact"
            className="px-10 py-4 border border-gold text-gold font-body text-sm tracking-widest uppercase hover:bg-gold/10 transition-all duration-300"
          >
            Get In Touch
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
