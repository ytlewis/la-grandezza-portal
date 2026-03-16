import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Crown, Gem, Award, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import PaymentModal from "@/components/PaymentModal";

const steps = ["Personal Details", "Event Details", "Package Selection", "Review & Payment"];

const Book = () => {
  const { packages, addBooking, bookings, updateBookings } = useData();
  const [step, setStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState("");
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full" | "skip">("deposit");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", location: "",
    eventType: "Wedding", eventDate: "", guests: "", message: "",
    selectedPackage: "",
  });

  const packageOptions = packages.map(pkg => {
    const icons = { Premium: Star, Elegance: Gem, Prestige: Award, GRANDEZZA: Crown };
    const accents = {
      Premium: "border-gray-400/30 hover:border-gray-400",
      Elegance: "border-rose-300/30 hover:border-rose-300",
      Prestige: "border-slate-300/30 hover:border-slate-300",
      GRANDEZZA: "border-gold/50 hover:border-gold"
    };
    return {
      ...pkg,
      icon: icons[pkg.name as keyof typeof icons] || Star,
      accent: accents[pkg.name as keyof typeof accents] || "border-gray-400/30"
    };
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = () => {
    const selectedPkg = packages.find(p => p.name === form.selectedPackage);
    const totalAmount = selectedPkg?.price || 0;
    const depositAmount = Math.round(totalAmount * 0.5); // 50% deposit
    const amountToPay = paymentOption === "skip" ? 0 : (paymentOption === "deposit" ? depositAmount : totalAmount);
    
    const bookingId = Date.now().toString();
    const booking = {
      id: bookingId,
      clientName: form.fullName,
      email: form.email,
      phone: form.phone,
      eventDate: form.eventDate,
      eventType: form.eventType,
      package: form.selectedPackage || "Custom Consultation",
      guests: parseInt(form.guests) || 0,
      totalAmount: totalAmount,
      depositAmount: depositAmount,
      depositPaid: paymentOption === "full",
      paymentStatus: (paymentOption === "full" ? "paid" : "unpaid") as const,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      notes: form.message,
    };
    
    addBooking(booking);
    setCurrentBookingId(bookingId);
    
    // Show payment modal if payment is required
    if (paymentOption !== "skip" && amountToPay > 0) {
      setShowPaymentModal(true);
    } else {
      toast.success(
        paymentOption === "skip" 
          ? "Consultation request submitted! We'll contact you within 24 hours to discuss your event."
          : "Booking request submitted! We'll be in touch within 24 hours."
      );
      resetForm();
    }
  };

  const handlePaymentSuccess = (transactionId: string, method: "mpesa" | "card") => {
    updateBookings(bookings.map(b => 
      b.id === currentBookingId 
        ? { 
            ...b, 
            depositPaid: true, 
            paymentStatus: (paymentOption === "full" ? "paid" : "deposit_paid") as const,
            paymentMethod: method,
            transactionId: transactionId
          } 
        : b
    ));
    
    toast.success("Booking confirmed! We'll contact you within 24 hours to finalize details.");
    resetForm();
  };

  const resetForm = () => {
    setStep(0);
    setPaymentOption("deposit");
    setForm({ fullName: "", phone: "", email: "", location: "", eventType: "Wedding", eventDate: "", guests: "", message: "", selectedPackage: "" });
    setShowPaymentModal(false);
    setCurrentBookingId("");
  };

  const selectedPackage = packages.find(p => p.name === form.selectedPackage);
  const depositAmount = selectedPackage ? Math.round(selectedPackage.price * 0.5) : 0;
  const amountToPay = paymentOption === "skip" ? 0 : (paymentOption === "deposit" ? depositAmount : (selectedPackage?.price || 0));

  const inputClass = "w-full bg-white dark:bg-transparent border border-gray-300 dark:border-gold/20 px-4 py-3 text-gray-900 dark:text-cream text-sm focus:border-gold outline-none transition-colors";
  const labelClass = "text-gray-600 dark:text-cream/50 text-xs uppercase tracking-wider block mb-2";

  return (
    <main className="pt-24 pb-16 bg-white dark:bg-black-deep min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Let's Begin</p>
          <h1 className="font-heading text-4xl md:text-5xl text-gray-900 dark:text-cream mb-4">Book a Consultation</h1>
          <div className="w-24 h-px bg-gold mx-auto" />
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body transition-all duration-300 ${
                i <= step ? "bg-gold text-black-deep" : "border border-gold/20 text-gray-400 dark:text-cream/30"
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
            className="border border-gold/10 p-8 md:p-12 bg-gray-50 dark:bg-black-soft/30"
          >
            <h2 className="font-heading text-xl text-gray-900 dark:text-cream mb-8">{steps[step]}</h2>

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
                  <select value={form.eventType} onChange={(e) => update("eventType", e.target.value)} className={`${inputClass} bg-white dark:bg-black-deep`}>
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
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded">
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    💡 Select a package below, or skip to proceed with a custom consultation
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageOptions.map((pkg) => (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => update("selectedPackage", form.selectedPackage === pkg.name ? "" : pkg.name)}
                      className={`p-6 border text-center transition-all duration-300 rounded-lg ${pkg.accent} ${
                        form.selectedPackage === pkg.name ? "bg-gold/10 border-gold shadow-lg scale-105" : "bg-white dark:bg-transparent hover:shadow-md"
                      }`}
                    >
                      <pkg.icon className={`w-8 h-8 mx-auto mb-3 ${form.selectedPackage === pkg.name ? "text-gold" : "text-gray-400 dark:text-cream/40"}`} />
                      <p className={`font-heading text-lg ${form.selectedPackage === pkg.name ? "text-gold" : "text-gray-700 dark:text-cream/60"}`}>{pkg.name}</p>
                      <p className={`text-sm mt-2 ${form.selectedPackage === pkg.name ? "text-gold font-semibold" : "text-gray-600 dark:text-cream/50"}`}>
                        KSh {pkg.price.toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
                {!form.selectedPackage && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No package selected - You'll proceed with a <span className="font-semibold text-gold">Custom Consultation</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
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
                      <span className="text-gray-600 dark:text-cream/50 text-sm">{label}</span>
                      <span className="text-gray-900 dark:text-cream text-sm">{value}</span>
                    </div>
                  ))}
                </div>

                {selectedPackage && (
                  <>
                    <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-cream/70 text-sm">Package Price:</span>
                        <span className="text-gray-900 dark:text-cream font-medium">KSh {selectedPackage.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="border-t border-gold/20 pt-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-cream mb-3">Choose Payment Option:</p>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setPaymentOption("deposit")}
                            className={`w-full p-3 border rounded-lg text-left transition-all ${
                              paymentOption === "deposit"
                                ? "border-gold bg-gold/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-gold/50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-cream">Pay 50% Deposit</p>
                                <p className="text-xs text-gray-600 dark:text-cream/60 mt-1">
                                  Secure your booking now, pay balance later
                                </p>
                              </div>
                              <span className="text-gold font-semibold">KSh {depositAmount.toLocaleString()}</span>
                            </div>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentOption("full")}
                            className={`w-full p-3 border rounded-lg text-left transition-all ${
                              paymentOption === "full"
                                ? "border-gold bg-gold/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-gold/50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-cream">Pay Full Amount</p>
                                <p className="text-xs text-gray-600 dark:text-cream/60 mt-1">
                                  Complete payment now
                                </p>
                              </div>
                              <span className="text-gold font-semibold">KSh {selectedPackage.price.toLocaleString()}</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentOption("skip" as any)}
                            className={`w-full p-3 border rounded-lg text-left transition-all ${
                              paymentOption === "skip"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-cream">Skip Payment - Consult First</p>
                                <p className="text-xs text-gray-600 dark:text-cream/60 mt-1">
                                  Book consultation, discuss details before payment
                                </p>
                              </div>
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">Free</span>
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gold/20 pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-cream/70 text-sm">Amount to Pay Now:</span>
                          <span className={`font-bold text-xl ${paymentOption === "skip" ? "text-blue-600" : "text-gold"}`}>
                            {paymentOption === "skip" ? "KSh 0 (Consultation)" : `KSh ${amountToPay.toLocaleString()}`}
                          </span>
                        </div>
                        {paymentOption === "deposit" && (
                          <p className="text-xs text-gray-600 dark:text-cream/50 mt-2">
                            Remaining balance of KSh {(selectedPackage.price - depositAmount).toLocaleString()} will be due before the event.
                          </p>
                        )}
                        {paymentOption === "skip" && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                            We'll contact you to discuss your requirements and finalize payment details.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-600 dark:text-cream/50 hover:text-gold transition-colors text-sm tracking-widest uppercase font-body">
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-8 py-3 bg-gold text-black-deep text-sm tracking-widest uppercase font-body font-semibold hover:bg-gold-light transition-all">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} className={`px-8 py-3 text-sm tracking-widest uppercase font-body font-semibold transition-all ${
                  paymentOption === "skip" 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gold text-black-deep hover:bg-gold-light"
                }`}>
                  {selectedPackage 
                    ? (paymentOption === "skip" 
                        ? "Book Consultation - Free" 
                        : `Pay ${paymentOption === "deposit" ? "Deposit" : "Full Amount"} - KSh ${amountToPay.toLocaleString()}`)
                    : "Submit Booking"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={amountToPay}
          bookingId={currentBookingId}
          clientPhone={form.phone}
          onPaymentSuccess={handlePaymentSuccess}
          paymentType={paymentOption}
        />
      </div>
    </main>
  );
};

export default Book;
