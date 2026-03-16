import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun, UserCircle, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
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
  const { theme, toggleTheme } = useTheme();
  const { user, logout: userLogout } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 dark:bg-black-deep/95 backdrop-blur-md shadow-lg dark:shadow-gold" 
          : "bg-white/80 dark:bg-transparent backdrop-blur-sm"
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
                  : "text-gray-700 dark:text-cream/70 hover:text-gold"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-cream/70">
                <UserCircle size={18} className="text-gold" />
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={userLogout}
                className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}
          <Link
            to="/book"
            className="inline-block px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body transition-all duration-300 hover:bg-gold hover:text-white"
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
        className={`lg:hidden overflow-hidden bg-white dark:bg-black-deep/98 backdrop-blur-md border-t border-gray-200 dark:border-gold/20`}
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
                location.pathname === link.path ? "text-gold" : "text-gray-700 dark:text-cream/70"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gold text-sm tracking-widest uppercase"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <Link
            to="/book"
            className="px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-body"
          >
            Book Now
          </Link>
          {user ? (
            <div className="flex flex-col items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-cream/70">
                <UserCircle size={16} className="text-gold" /> {user.name}
              </span>
              <button onClick={userLogout} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <LogOut size={12} /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
