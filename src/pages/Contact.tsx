import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";

const Contact = () => {
  const { contactInfo } = useData();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputClass = "w-full bg-transparent border border-gray-300 dark:border-gold/20 px-4 py-3 text-gray-900 dark:text-cream text-sm focus:border-gold outline-none transition-colors rounded";

  return (
    <main className="pt-24 pb-16 bg-white dark:bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-12 md:mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Reach Out</p>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-gray-900 dark:text-cream mb-4">Contact Us</h1>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-heading text-2xl text-gray-900 dark:text-cream mb-8">Get In Touch</h2>
            <div className="space-y-5">
              {contactInfo.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 shrink-0 border border-gray-300 dark:border-gold/30 flex items-center justify-center rounded">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-gray-900 dark:text-cream hover:text-gold transition-colors text-sm">{contactInfo.phone}</a>
                  </div>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 shrink-0 border border-gray-300 dark:border-gold/30 flex items-center justify-center rounded">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-900 dark:text-cream hover:text-gold transition-colors text-sm break-all">{contactInfo.email}</a>
                  </div>
                </div>
              )}
              {contactInfo.address && (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 shrink-0 border border-gray-300 dark:border-gold/30 flex items-center justify-center rounded">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider">Location</p>
                    <p className="text-gray-900 dark:text-cream text-sm">{contactInfo.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social links */}
            {(contactInfo.facebook || contactInfo.instagram || contactInfo.twitter || contactInfo.tiktok) && (
              <div className="mt-8">
                <p className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-3 flex-wrap">
                  {contactInfo.facebook && (
                    <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-300 dark:border-gold/30 flex items-center justify-center text-gray-500 dark:text-cream/50 hover:text-gold hover:border-gold transition-all rounded">
                      <Facebook size={17} />
                    </a>
                  )}
                  {contactInfo.instagram && (
                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-300 dark:border-gold/30 flex items-center justify-center text-gray-500 dark:text-cream/50 hover:text-gold hover:border-gold transition-all rounded">
                      <Instagram size={17} />
                    </a>
                  )}
                  {contactInfo.twitter && (
                    <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-300 dark:border-gold/30 flex items-center justify-center text-gray-500 dark:text-cream/50 hover:text-gold hover:border-gold transition-all rounded">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                  )}
                  {contactInfo.tiktok && (
                    <a href={contactInfo.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gray-300 dark:border-gold/30 flex items-center justify-center text-gray-500 dark:text-cream/50 hover:text-gold hover:border-gold transition-all rounded">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.8a8.18 8.18 0 003.76.92V6.27a4.83 4.83 0 01-3.76.42z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider block mb-2">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider block mb-2">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider block mb-2">Subject</label>
              <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-gray-500 dark:text-cream/50 text-xs uppercase tracking-wider block mb-2">Message</label>
              <textarea rows={5} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={inputClass + " resize-none"} />
            </div>
            <button type="submit" className="w-full py-4 bg-gold text-white font-body text-sm tracking-widest uppercase font-semibold hover:bg-gold-light transition-all duration-300 rounded">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
