import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const categories = ["All", "Wedding", "Corporate", "Birthday", "Social"];

const Portfolio = () => {
  const { portfolioItems } = useData();
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" 
    ? portfolioItems 
    : portfolioItems.filter((item) => item.category === filter);

  return (
    <main className="pt-24 pb-16 bg-white dark:bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Our Work</p>
          <h1 className="font-heading text-4xl md:text-6xl text-gray-900 dark:text-cream mb-4">Portfolio</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-4" />
          <p className="text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of memorable events we've brought to life
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-sm tracking-widest uppercase font-body transition-all duration-300 border rounded-full ${
                filter === cat 
                  ? "bg-gold text-white border-gold shadow-lg" 
                  : "border-gray-300 dark:border-gold/20 text-gray-700 dark:text-cream/60 hover:border-gold/50 hover:shadow-md"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-cream mb-2">
              No Portfolio Items Yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for our latest work!
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer overflow-hidden aspect-square rounded-lg shadow-md hover:shadow-2xl transition-shadow"
                  onClick={() => setLightbox(i)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-deep/90 via-black-deep/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-gold text-xs tracking-widest uppercase mb-1">{item.category}</p>
                      <h3 className="font-heading text-xl text-cream mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-cream/80 text-sm line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            className="fixed inset-0 z-50 bg-black-deep/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button 
              className="absolute top-6 right-6 text-gold hover:text-gold-light transition-colors" 
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img 
                src={filtered[lightbox]?.image} 
                alt={filtered[lightbox]?.title} 
                className="w-full max-h-[70vh] object-contain mb-6 rounded-lg"
              />
              <div className="text-center">
                <p className="text-gold text-xs tracking-widest uppercase mb-2">
                  {filtered[lightbox]?.category}
                </p>
                <h3 className="font-heading text-3xl text-cream mb-2">
                  {filtered[lightbox]?.title}
                </h3>
                {filtered[lightbox]?.description && (
                  <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                    {filtered[lightbox]?.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(filtered[lightbox]?.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Portfolio;
