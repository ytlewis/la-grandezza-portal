import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="pt-24 pb-16 bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Reach Out</p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">Contact Us</h1>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-heading text-2xl text-cream mb-8">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center"><Phone className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wider">Phone</p>
                  <a href="tel:0757133057" className="text-cream hover:text-gold transition-colors">0757133057</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center"><Mail className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wider">Email</p>
                  <a href="mailto:lagrandezzaltd@gmail.com" className="text-cream hover:text-gold transition-colors">lagrandezzaltd@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center"><MapPin className="w-5 h-5 text-gold" /></div>
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-wider">Location</p>
                  <p className="text-cream">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-cream/50 text-xs uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-4">
                <a href="https://facebook.com/lagrandezzaofficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gold/30 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-all"><Facebook size={18} /></a>
                <a href="https://instagram.com/lagrandezzaoffical" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gold/30 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-all"><Instagram size={18} /></a>
                <a href="https://tiktok.com/@lagrandezzaofficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gold/30 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.8a8.18 8.18 0 003.76.92V6.27a4.83 4.83 0 01-3.76.42z"/></svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border border-gold/20 px-4 py-3 text-cream text-sm focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border border-gold/20 px-4 py-3 text-cream text-sm focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-transparent border border-gold/20 px-4 py-3 text-cream text-sm focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">Message</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border border-gold/20 px-4 py-3 text-cream text-sm focus:border-gold outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gold text-black-deep font-body text-sm tracking-widest uppercase font-semibold hover:bg-gold-light transition-all duration-300"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
