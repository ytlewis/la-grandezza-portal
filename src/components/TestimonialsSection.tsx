import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Margaret & Peter", event: "Wedding", text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting. We couldn't have asked for more.", rating: 5 },
  { name: "Safaricom Ltd.", event: "Corporate Gala", text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed with the elegance.", rating: 5 },
  { name: "Angela Wanjiku", event: "Birthday Celebration", text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty. Truly the grandest experience.", rating: 5 },
];

const TestimonialsSection = () => (
  <section className="py-24 bg-black-soft">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">What Our Clients Say</p>
        <h2 className="font-heading text-3xl md:text-5xl text-cream mb-4">Testimonials</h2>
        <div className="w-24 h-px bg-gold mx-auto" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="p-8 border border-gold/10 bg-black-deep/50 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="text-gold text-5xl font-heading absolute top-4 left-6 opacity-20">"</div>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-cream/80 text-sm leading-relaxed mb-6 italic">{t.text}</p>
            <div>
              <p className="font-heading text-cream">{t.name}</p>
              <p className="text-gold text-xs tracking-widest uppercase">{t.event}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
