import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Crown, Gem, Award, Star, Check } from "lucide-react";

const packagesData = [
  {
    name: "Premium",
    icon: Star,
    accentClass: "border-gray-400/30",
    iconClass: "text-gray-400",
    guests: "Up to 50",
    venue: "Curated List",
    design: "Mood Board",
    vendors: "Standard Partners",
    team: "Junior Planner",
    concierge: "Day-of Coordination",
    support: "Basic Support",
    postEvent: "Digital Photo Gallery",
    gifts: "Branded Token",
    photography: "Standard Coverage",
  },
  {
    name: "Elegance",
    icon: Gem,
    accentClass: "border-rose-300/30",
    iconClass: "text-rose-300",
    guests: "Up to 100",
    venue: "Premium Venues",
    design: "Mood Board + Design Deck",
    vendors: "Preferred Partners",
    team: "Senior Planner",
    concierge: "Weekend-of Coordination",
    support: "Enhanced Support",
    postEvent: "Photo Gallery + Thank You Notes",
    gifts: "Custom Gift",
    photography: "Enhanced Coverage",
  },
  {
    name: "Prestige",
    icon: Award,
    accentClass: "border-slate-300/30",
    iconClass: "text-slate-300",
    guests: "Up to 200",
    venue: "Exclusive & International",
    design: "Full 3D Render",
    vendors: "Elite Partnerships",
    team: "Lead Planner + Assistant",
    concierge: "Full-Weekend Experience",
    support: "Premium 24/7 Support",
    postEvent: "Premium Photo Album",
    gifts: "Luxury Hamper",
    photography: "Premium Direction",
  },
  {
    name: "GRANDEZZA",
    icon: Crown,
    accentClass: "border-gold/50 shadow-gold-lg",
    iconClass: "text-gold",
    featured: true,
    guests: "500+ Unlimited",
    venue: "Any Venue Worldwide",
    design: "Full-Scale Production Design",
    vendors: "All-Inclusive Elite",
    team: "Dedicated 5-Star Team",
    concierge: "Multi-Day Luxury Experience",
    support: "24/7 White-Glove Service",
    postEvent: "Feature Film + Luxury Album",
    gifts: "All-Expenses Gift Suite",
    photography: "Full Cinematography & Direction",
  },
];

const features = ["guests", "venue", "design", "vendors", "team", "concierge", "support", "postEvent", "gifts", "photography"] as const;
const featureLabels: Record<string, string> = {
  guests: "Number of Guests",
  venue: "Venue Access",
  design: "Design Conception",
  vendors: "Vendor Partnerships",
  team: "Planning Team",
  concierge: "Concierge Services",
  support: "Event Support",
  postEvent: "Post-Event Services",
  gifts: "Personalized Gifts",
  photography: "Photography Direction",
};

const Packages = () => (
  <main className="pt-24 pb-16 bg-black-deep min-h-screen">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Choose Your Experience</p>
        <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">Our Packages</h1>
        <div className="w-24 h-px bg-gold mx-auto mb-6" />
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each package is crafted to deliver an unparalleled experience. Select the tier that matches your vision.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {packagesData.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            className={`relative p-8 border bg-black-soft/50 ${pkg.accentClass} ${pkg.featured ? "lg:scale-105" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {pkg.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black-deep text-xs font-body tracking-widest uppercase font-semibold">
                The Pinnacle
              </div>
            )}
            <pkg.icon className={`w-12 h-12 mx-auto mb-4 ${pkg.iconClass}`} />
            <h3 className={`font-heading text-2xl text-center mb-6 ${pkg.iconClass}`}>{pkg.name}</h3>

            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-wider">{featureLabels[f]}</p>
                    <p className="text-cream text-sm">{pkg[f]}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/book"
              className={`mt-8 block text-center py-3 text-sm tracking-widest uppercase font-body transition-all duration-300 ${
                pkg.featured
                  ? "bg-gold text-black-deep hover:bg-gold-light font-semibold"
                  : "border border-gold/30 text-gold hover:bg-gold/10"
              }`}
            >
              Select Package
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </main>
);

export default Packages;
