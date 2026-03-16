import { useState } from "react";
import { motion } from "framer-motion";
import { Star, PenLine, LogIn } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import UserAuthModal from "./UserAuthModal";
import { toast } from "sonner";
import { Testimonial } from "@/types/admin";

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        className={onChange ? "cursor-pointer" : "cursor-default"}
      >
        <Star className={`w-5 h-5 ${n <= value ? "fill-gold text-gold" : "text-gray-300 dark:text-gray-600"}`} />
      </button>
    ))}
  </div>
);

const TestimonialsSection = () => {
  const { testimonials, addTestimonial } = useData();
  const { user } = useUserAuth();
  const { adminSettings } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [event, setEvent] = useState("Wedding");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  // Only show approved testimonials publicly
  const approved = testimonials.filter(t => t.status === "approved");

  const handleSubmitClick = () => {
    if (!adminSettings.allowUserRegistration && !user) {
      toast.error("User accounts are currently disabled.");
      return;
    }
    if (!user) { setShowAuth(true); return; }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (text.trim().length < 20) { toast.error("Please write at least 20 characters."); return; }
    const autoApprove = !adminSettings.requireTestimonialApproval;
    const t: Testimonial = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      event,
      text: text.trim(),
      rating,
      status: autoApprove ? "approved" : "pending",
      createdAt: new Date().toISOString(),
    };
    addTestimonial(t);
    toast.success(autoApprove
      ? "Thank you! Your testimonial is now live."
      : "Thank you! Your testimonial is pending review and will appear once approved."
    );
    setShowForm(false);
    setText(""); setEvent("Wedding"); setRating(5);
  };

  const inputClass = "w-full border border-gray-300 dark:border-gold/20 bg-white dark:bg-transparent px-4 py-2.5 text-gray-900 dark:text-cream text-sm focus:border-gold outline-none transition-colors rounded";

  return (
    <section className="py-24 bg-gray-100 dark:bg-black-soft">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">What Our Clients Say</p>
          <h2 className="font-heading text-3xl md:text-5xl text-gray-900 dark:text-cream mb-4">Testimonials</h2>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {approved.map((t, i) => (
            <motion.div key={t.id} className="p-8 border border-gray-200 dark:border-gold/10 bg-white dark:bg-black-deep/50 relative rounded-lg"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-gold text-5xl font-heading absolute top-4 left-6 opacity-20">"</div>
              <StarRating value={t.rating} />
              <p className="text-gray-700 dark:text-cream/80 text-sm leading-relaxed my-4 italic">{t.text}</p>
              <div>
                <p className="font-heading text-gray-900 dark:text-cream">{t.userName}</p>
                <p className="text-gold text-xs tracking-widest uppercase">{t.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to leave a testimonial */}
        <div className="text-center mt-16">
          {!showForm ? (
            <button onClick={handleSubmitClick}
              className="inline-flex items-center gap-2 px-8 py-3 border border-gold text-gold text-sm tracking-widest uppercase font-body hover:bg-gold hover:text-black-deep transition-all duration-300">
              {user ? <PenLine size={16} /> : <LogIn size={16} />}
              {user ? "Share Your Experience" : "Login to Leave a Review"}
            </button>
          ) : (
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-white dark:bg-black-deep/60 border border-gray-200 dark:border-gold/10 rounded-lg p-8 text-left space-y-5">
              <h3 className="font-heading text-xl text-gray-900 dark:text-cream">Share Your Experience</h3>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50 block mb-1">Event Type</label>
                <select value={event} onChange={e => setEvent(e.target.value)} className={inputClass + " bg-white dark:bg-black-deep"}>
                  {["Wedding", "Corporate Gala", "Birthday", "Social Gathering", "Other"].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50 block mb-1">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50 block mb-1">Your Testimonial</label>
                <textarea rows={4} required value={text} onChange={e => setText(e.target.value)}
                  placeholder="Tell us about your experience..." className={inputClass + " resize-none"} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-gold text-black-deep text-sm tracking-widest uppercase font-body font-semibold hover:bg-gold/90 transition-all rounded">
                  Submit
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gold/20 text-gray-600 dark:text-cream/60 text-sm tracking-widest uppercase font-body hover:border-gold transition-all rounded">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-cream/40">Submitting as <span className="text-gold">{user?.name}</span>. Your review will appear after admin approval.</p>
            </motion.form>
          )}
        </div>
      </div>

      <UserAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowForm(true)} />
    </section>
  );
};

export default TestimonialsSection;
