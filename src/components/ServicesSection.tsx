import { motion } from "framer-motion";
import { Heart, Building2, PartyPopper, Users, Cake, Sparkles } from "lucide-react";

const services = [
  { icon: Heart, title: "Weddings", description: "Crafting your perfect love story with elegance and attention to every detail." },
  { icon: Building2, title: "Corporate Events", description: "Professional galas, conferences, and brand experiences that leave lasting impressions." },
  { icon: PartyPopper, title: "Galas & Balls", description: "Grand celebrations with opulent décor, entertainment, and flawless execution." },
  { icon: Users, title: "Social Gatherings", description: "Intimate soirées and cocktail events with sophistication and style." },
  { icon: Cake, title: "Birthday Parties", description: "Milestone celebrations designed to delight and create unforgettable memories." },
  { icon: Sparkles, title: "Bespoke Events", description: "Fully customized experiences tailored to your unique vision and desires." },
];

const ServicesSection = () => (
  <section className="py-24 bg-white dark:bg-black-deep">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">What We Offer</p>
        <h2 className="font-heading text-3xl md:text-5xl text-gray-900 dark:text-cream mb-4">Our Services</h2>
        <div className="w-24 h-px bg-gold mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            className="group p-8 border border-gray-200 dark:border-gold/10 hover:border-gold/40 transition-all duration-500 bg-gray-50 dark:bg-black-soft/50 hover:shadow-gold rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <service.icon className="w-10 h-10 text-gold mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-heading text-xl text-gray-900 dark:text-cream mb-3">{service.title}</h3>
            <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
