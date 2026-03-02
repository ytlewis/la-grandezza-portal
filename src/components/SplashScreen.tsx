import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jfif";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0); // 0: logo reveal, 1: text reveal, 2: exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800);
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const handleClick = () => {
    setPhase(2);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800);
    }, 400);
  };

  // Gold particle positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.cos((i / 20) * Math.PI * 2) * 160,
    y: Math.sin((i / 20) * Math.PI * 2) * 160,
    delay: i * 0.05,
    size: 2 + Math.random() * 3,
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleClick}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ background: "linear-gradient(180deg, #ffffff 0%, #faf8f3 50%, #f5f0e6 100%)" }}
        >
          {/* Radiating gold ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              border: "1px solid hsl(43 56% 54% / 0.3)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 2 ? 3 : 1, opacity: phase >= 2 ? 0 : 0.4 }}
            transition={{ duration: phase >= 2 ? 0.6 : 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              border: "1px solid hsl(43 56% 54% / 0.15)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 2 ? 4 : 1, opacity: phase >= 2 ? 0 : 0.25 }}
            transition={{ duration: phase >= 2 ? 0.6 : 1.4, ease: "easeOut", delay: 0.15 }}
          />

          {/* Gold particles orbiting */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: "hsl(43 56% 54%)",
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: phase >= 1 ? p.x : 0,
                y: phase >= 1 ? p.y : 0,
                opacity: phase >= 2 ? 0 : phase >= 1 ? 0.7 : 0,
              }}
              transition={{
                duration: 1,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Logo with golden glow */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
            animate={{
              opacity: phase >= 2 ? 0 : 1,
              scale: phase >= 2 ? 1.2 : 1,
              rotate: 0,
            }}
            transition={{ duration: phase >= 2 ? 0.4 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(43 56% 54% / 0.2) 0%, transparent 70%)",
                transform: "scale(1.6)",
              }}
              animate={{
                scale: [1.5, 1.8, 1.5],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <img
              src={logo}
              alt="La Grandezza Events"
              className="w-36 h-36 md:w-48 md:h-48 object-contain rounded-full relative z-10"
              style={{ boxShadow: "0 0 60px hsl(43 56% 54% / 0.3)" }}
            />
          </motion.div>

          {/* Brand text */}
          <motion.div
            className="relative z-10 mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 && phase < 2 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1
              className="text-3xl md:text-4xl tracking-[0.2em] font-heading"
              style={{ color: "hsl(43 45% 40%)" }}
            >
              LA GRANDEZZA
            </h1>
            <motion.div
              className="mx-auto mt-3 h-px"
              style={{ background: "linear-gradient(90deg, transparent, hsl(43 56% 54%), transparent)" }}
              initial={{ width: 0 }}
              animate={{ width: phase >= 1 ? 200 : 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
            <motion.p
              className="mt-3 text-xs tracking-[0.4em] uppercase"
              style={{ color: "hsl(43 56% 54% / 0.7)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Events & Experiences
            </motion.p>
          </motion.div>

          {/* Tap hint */}
          <motion.p
            className="absolute bottom-10 text-xs tracking-[0.3em] uppercase"
            style={{ color: "hsl(43 56% 54% / 0.4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 1 ? [0, 0.6, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            Tap to enter
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
