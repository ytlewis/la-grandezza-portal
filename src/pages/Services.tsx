import { motion } from "framer-motion";
import { Heart, Building2, PartyPopper, Users, Cake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Heart, title: "Weddings", description: "From intimate ceremonies to grand celebrations, we craft your love story with meticulous attention to every detail. Our wedding planning services include venue selection, décor design, vendor coordination, and day-of management.", features: ["Venue Scouting", "Floral Design", "Catering Coordination", "Entertainment Booking", "Day-of Coordination"] },
  { icon: Building2, title: "Corporate Events", description: "Elevate your brand with sophisticated corporate gatherings. We handle conferences, product launches, team-building events, and executive galas with professionalism and flair.", features: ["Conference Planning", "Brand Activation", "AV & Production", "Catering & Hospitality", "Post-Event Reports"] },
  { icon: PartyPopper, title: "Galas & Balls", description: "Grand, opulent affairs that command attention. Our galas feature stunning décor, world-class entertainment, and a seamless guest experience from arrival to departure.", features: ["Theme Development", "Luxury Décor", "Live Entertainment", "VIP Management", "Red Carpet Setup"] },
  { icon: Users, title: "Social Gatherings", description: "Sophisticated cocktail parties, anniversary celebrations, and exclusive dinners. We create intimate atmospheres that foster connection and celebration.", features: ["Menu Curation", "Ambient Design", "Guest List Management", "Custom Invitations", "Photography"] },
  { icon: Cake, title: "Birthday Parties", description: "Milestone birthdays deserve extraordinary celebrations. From elegant adult parties to magical themed events, we make every birthday unforgettable.", features: ["Theme Design", "Custom Cakes", "Entertainment", "Party Favors", "Photo & Video"] },
  { icon: Sparkles, title: "Bespoke Events", description: "When your vision doesn't fit a category, we create something entirely new. Our bespoke service is for those who dream beyond convention.", features: ["Concept Development", "Custom Design", "Full Production", "Concierge Service", "Legacy Documentation"] },
];

const Services = () => (
  <main className="pt-24 pb-16 bg-white dark:bg-black-deep min-h-screen">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">What We Do Best</p>
        <h1 className="font-heading text-4xl md:text-6xl text-gray-900 dark:text-cream mb-4">Our Services</h1>
        <div className="w-24 h-px bg-gold mx-auto mb-6" />
        <p className="text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">Every event is a masterpiece. We bring creativity, precision, and luxury to each occasion we touch.</p>
      </motion.div>

      <div className="space-y-12">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-gray-200 dark:border-gold/10 p-8 md:p-12 bg-gray-50 dark:bg-black-soft/30 rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <service.icon className="w-10 h-10 text-gold mb-4" />
              <h2 className="font-heading text-3xl text-gray-900 dark:text-cream mb-4">{service.title}</h2>
              <p className="text-gray-600 dark:text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="text-gray-700 dark:text-cream/70 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/book" className="inline-block px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body hover:bg-gold hover:text-white transition-all duration-300">
                Book This Service
              </Link>
            </div>
            <div className={`h-64 bg-gradient-to-br from-gold/5 to-transparent border border-gray-200 dark:border-gold/10 flex items-center justify-center rounded-lg ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <service.icon className="w-24 h-24 text-gold/20" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </main>
);

export default Services;
