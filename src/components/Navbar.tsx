import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jfif";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Packages", path: "/packages" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black-deep/95 backdrop-blur-md shadow-gold" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="La Grandezza" className="w-12 h-12 rounded-full object-cover" />
          <span className="font-heading text-xl tracking-wider gold-text-gradient hidden sm:block">
            La Grandezza
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-gold"
                  : "text-cream/70 hover:text-gold"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/book"
            className="inline-block px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body transition-all duration-300 hover:bg-gold hover:text-black-deep"
          >
            Book Now
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-gold"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`lg:hidden overflow-hidden bg-black-deep/98 backdrop-blur-md`}
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm tracking-widest uppercase ${
                location.pathname === link.path ? "text-gold" : "text-cream/70"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/book"
            className="px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body"
          >
            Book Now
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
