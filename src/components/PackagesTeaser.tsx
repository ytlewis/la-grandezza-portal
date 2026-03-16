import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Crown, Gem, Award, Star } from "lucide-react";

const packages = [
  { name: "Premium", icon: Star, accent: "text-gray-400 border-gray-400/30" },
  { name: "Elegance", icon: Gem, accent: "text-rose-300 border-rose-300/30" },
  { name: "Prestige", icon: Award, accent: "text-slate-300 border-slate-300/30" },
  { name: "GRANDEZZA", icon: Crown, accent: "text-gold border-gold/50", featured: true },
];

const PackagesTeaser = () => (
  <section className="py-24 bg-gray-100 dark:bg-black-soft">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Tailored For You</p>
        <h2 className="font-heading text-3xl md:text-5xl text-gray-900 dark:text-cream mb-4">Our Packages</h2>
        <div className="w-24 h-px bg-gold mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => (
          <Link
            key={pkg.name}
            to="/packages"
            className="block"
          >
            <motion.div
              className={`relative p-8 text-center border ${pkg.accent} bg-white dark:bg-black-deep/50 hover:shadow-gold transition-all duration-500 rounded-lg cursor-pointer ${pkg.featured ? "lg:scale-105 shadow-gold-lg" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black-deep text-xs font-body tracking-widest uppercase font-semibold">
                  Most Popular
                </div>
              )}
              <pkg.icon className={`w-12 h-12 mx-auto mb-4 ${pkg.accent.split(" ")[0]}`} />
              <h3 className={`font-heading text-2xl mb-4 ${pkg.accent.split(" ")[0]}`}>{pkg.name}</h3>
              <span className="text-gold text-sm tracking-widest uppercase font-body hover:underline underline-offset-4">
                View Details →
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PackagesTeaser;
