import { motion } from "framer-motion";
import { Heart, Building2, PartyPopper, Users, Cake, Sparkles, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const iconMap: Record<string, LucideIcon> = {
  Heart, Building2, PartyPopper, Users, Cake, Sparkles,
};

const Services = () => {
  const { services } = useData();

  return (
    <main className="pt-24 pb-16 bg-white dark:bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">What We Do Best</p>
          <h1 className="font-heading text-4xl md:text-6xl text-gray-900 dark:text-cream mb-4">Our Services</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-6" />
          <p className="text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Every event is a masterpiece. We bring creativity, precision, and luxury to each occasion we touch.
          </p>
        </motion.div>

        <div className="space-y-12">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Sparkles;
            return (
              <motion.div
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch border border-gray-200 dark:border-gold/10 overflow-hidden rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Image */}
                <div className={`relative h-64 lg:h-auto min-h-[280px] ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center">
                      <Icon className="w-24 h-24 text-gold/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className={`p-8 md:p-12 bg-gray-50 dark:bg-black-soft/30 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Icon className="w-10 h-10 text-gold mb-4" />
                  <h2 className="font-heading text-3xl text-gray-900 dark:text-cream mb-4">{service.title}</h2>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((f) => (
                      <li key={f} className="text-gray-700 dark:text-cream/70 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/book"
                    className="inline-block self-start px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body hover:bg-gold hover:text-white transition-all duration-300"
                  >
                    Book This Service
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Services;
