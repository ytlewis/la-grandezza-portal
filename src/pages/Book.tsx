import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Crown, Gem, Award, Star, ChevronRight, ChevronLeft } from "lucide-react";

const steps = ["Personal Details", "Event Details", "Package Selection", "Review & Submit"];

const packageOptions = [
  { name: "Premium", icon: Star, accent: "border-gray-400/30 hover:border-gray-400" },
  { name: "Elegance", icon: Gem, accent: "border-rose-300/30 hover:border-rose-300" },
  { name: "Prestige", icon: Award, accent: "border-slate-300/30 hover:border-slate-300" },
  { name: "GRANDEZZA", icon: Crown, accent: "border-gold/50 hover:border-gold" },
];

const Book = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", location: "",
    eventType: "Wedding", eventDate: "", guests: "", message: "",
    selectedPackage: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = () => {
    toast.success("Booking request submitted! We'll be in touch within 24 hours.");
    setStep(0);
    setForm({ fullName: "", phone: "", email: "", location: "", eventType: "Wedding", eventDate: "", guests: "", message: "", selectedPackage: "" });
  };

  const inputClass = "w-full bg-transparent border border-gold/20 px-4 py-3 text-cream text-sm focus:border-gold outline-none transition-colors";
  const labelClass = "text-cream/50 text-xs uppercase tracking-wider block mb-2";

  return (
    <main className="pt-24 pb-16 bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Let's Begin</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">Book a Consultation</h1>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body transition-all duration-300 ${
                i <= step ? "bg-gold text-black-deep" : "border border-gold/20 text-cream/30"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-gold" : "bg-gold/20"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="border border-gold/10 p-8 md:p-12 bg-black-soft/30"
          >
            <h2 className="font-heading text-xl text-cream mb-8">{steps[step]}</h2>

            {step === 0 && (
              <div className="space-y-5">
                <div><label className={labelClass}>Full Name *</label><input type="text" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Phone Number *</label><input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+254..." className={inputClass} /></div>
                <div><label className={labelClass}>Email Address *</label><input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Event Location / City *</label><input type="text" required value={form.location} onChange={(e) => update("location", e.target.value)} className={inputClass} /></div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Event Type *</label>
                  <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)} className={`${inputClass} bg-black-deep`}>
                    {["Wedding", "Corporate Gala", "Birthday", "Social Gathering", "Other"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div><label className={labelClass}>Event Date *</label><input type="date" required value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Number of Guests *</label><input type="number" required value={form.guests} onChange={(e) => update("guests", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Special Requests (Optional)</label><textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} resize-none`} /></div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-muted-foreground text-sm mb-6">Select a package or skip for a custom consultation.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageOptions.map((pkg) => (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => update("selectedPackage", form.selectedPackage === pkg.name ? "" : pkg.name)}
                      className={`p-6 border text-center transition-all duration-300 ${pkg.accent} ${
                        form.selectedPackage === pkg.name ? "bg-gold/10 border-gold" : "bg-transparent"
                      }`}
                    >
                      <pkg.icon className={`w-8 h-8 mx-auto mb-3 ${form.selectedPackage === pkg.name ? "text-gold" : "text-cream/40"}`} />
                      <p className={`font-heading text-lg ${form.selectedPackage === pkg.name ? "text-gold" : "text-cream/60"}`}>{pkg.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {[
                  ["Name", form.fullName],
                  ["Phone", form.phone],
                  ["Email", form.email],
                  ["Location", form.location],
                  ["Event Type", form.eventType],
                  ["Event Date", form.eventDate],
                  ["Guests", form.guests],
                  ["Package", form.selectedPackage || "Custom Consultation"],
                  ...(form.message ? [["Special Requests", form.message]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gold/10 pb-2">
                    <span className="text-cream/50 text-sm">{label}</span>
                    <span className="text-cream text-sm">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-cream/50 hover:text-gold transition-colors text-sm tracking-widest uppercase font-body">
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-8 py-3 bg-gold text-black-deep text-sm tracking-widest uppercase font-body font-semibold hover:bg-gold-light transition-all">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} className="px-8 py-3 bg-gold text-black-deep text-sm tracking-widest uppercase font-body font-semibold hover:bg-gold-light transition-all">
                  Submit Booking
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Book;
