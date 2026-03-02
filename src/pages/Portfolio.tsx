import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import portfolioWedding from "@/assets/portfolio-wedding.jpg";
import portfolioCorporate from "@/assets/portfolio-corporate.jpg";
import portfolioBirthday from "@/assets/portfolio-birthday.jpg";
import portfolioSocial from "@/assets/portfolio-social.jpg";
import heroEvent from "@/assets/hero-event.jpg";
import { X } from "lucide-react";

const categories = ["All", "Weddings", "Corporate", "Birthdays", "Social"];

const galleryItems = [
  { src: portfolioWedding, category: "Weddings", title: "The Anderson Wedding", description: "A sunset garden ceremony with 200 guests — Elegance Package" },
  { src: portfolioCorporate, category: "Corporate", title: "Annual Executive Gala", description: "Black-tie corporate gala for 500 attendees — GRANDEZZA Package" },
  { src: portfolioBirthday, category: "Birthdays", title: "Golden 50th Birthday", description: "A milestone celebration with gold-themed décor — Prestige Package" },
  { src: portfolioSocial, category: "Social", title: "Champagne Soirée", description: "An intimate cocktail gathering for 80 guests — Elegance Package" },
  { src: heroEvent, category: "Corporate", title: "Starlight Awards Night", description: "Grand ballroom awards ceremony — GRANDEZZA Package" },
  { src: portfolioWedding, category: "Weddings", title: "The Kamau Nuptials", description: "A lavish countryside wedding — Prestige Package" },
];

const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter);

  return (
    <main className="pt-24 pb-16 bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Our Work</p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">Portfolio</h1>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-sm tracking-widest uppercase font-body transition-all duration-300 border ${
                filter === cat ? "bg-gold text-black-deep border-gold" : "border-gold/20 text-cream/60 hover:border-gold/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative group cursor-pointer overflow-hidden aspect-square"
                onClick={() => setLightbox(i)}
              >
                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black-deep/0 group-hover:bg-black-deep/60 transition-all duration-500 flex items-end p-6">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-gold text-xs tracking-widest uppercase mb-1">{item.category}</p>
                    <h3 className="font-heading text-lg text-cream">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black-deep/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-gold" onClick={() => setLightbox(null)}>
              <X size={32} />
            </button>
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={filtered[lightbox]?.src} alt="" className="w-full max-h-[70vh] object-contain mb-4" />
              <h3 className="font-heading text-2xl text-cream">{filtered[lightbox]?.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{filtered[lightbox]?.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Portfolio;
