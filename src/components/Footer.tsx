import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jfif";
import { useData } from "@/contexts/DataContext";

const Footer = () => {
  const { contactInfo } = useData();
  return (
    <footer className="bg-gray-900 dark:bg-black-deep border-t border-gray-700 dark:border-gold/20 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="La Grandezza" className="w-20 h-20 rounded-full mb-4 object-cover" />
            <h3 className="font-heading text-2xl gold-text-gradient mb-3">La Grandezza</h3>
            <p className="text-gray-400 dark:text-muted-foreground text-sm text-center md:text-left leading-relaxed">
              Where moments become masterpieces. Luxury event planning for life's most extraordinary occasions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-lg text-gold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Services", "Packages", "Portfolio", "Contact", "Book"].map((l) => (
                <Link
                  key={l}
                  to={`/${l.toLowerCase()}`}
                  className="text-gray-400 dark:text-muted-foreground text-sm hover:text-gold transition-colors"
                >
                  {l === "Book" ? "Book a Consultation" : l}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-lg text-gold mb-4">Get In Touch</h4>
            <div className="flex flex-col gap-3">
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-gray-400 dark:text-muted-foreground text-sm hover:text-gold transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <Phone size={14} /> {contactInfo.phone}
                </a>
              )}
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-400 dark:text-muted-foreground text-sm hover:text-gold transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <Mail size={14} /> {contactInfo.email}
                </a>
              )}
              <div className="flex gap-4 justify-center md:justify-start mt-2">
                {contactInfo.facebook && (
                  <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-muted-foreground hover:text-gold transition-colors">
                    <Facebook size={20} />
                  </a>
                )}
                {contactInfo.instagram && (
                  <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-muted-foreground hover:text-gold transition-colors">
                    <Instagram size={20} />
                  </a>
                )}
                {contactInfo.twitter && (
                  <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-muted-foreground hover:text-gold transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {contactInfo.tiktok && (
                  <a href={contactInfo.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-muted-foreground hover:text-gold transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.8a8.18 8.18 0 003.76.92V6.27a4.83 4.83 0 01-3.76.42z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 dark:border-gold/10 pt-6 text-center">
          <p className="text-gray-400 dark:text-muted-foreground text-xs">
            © {new Date().getFullYear()} La Grandezza Events. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-muted-foreground/50 text-xs mt-1">
            Owned &amp; operated by Lewis Mwangi
          </p>
          <Link
            to="/admin/login"
            className="text-gray-600 dark:text-muted-foreground/30 hover:text-gold text-xs mt-3 inline-block transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
