import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TeamMember, PortfolioItem, ContactInfo, Package, Booking, PaymentSettings, Testimonial, Service } from "@/types/admin";

interface DataContextType {
  teamMembers: TeamMember[];
  portfolioItems: PortfolioItem[];
  contactInfo: ContactInfo;
  packages: Package[];
  bookings: Booking[];
  testimonials: Testimonial[];
  paymentSettings: PaymentSettings;
  services: Service[];
  updateTeamMembers: (members: TeamMember[]) => void;
  updatePortfolioItems: (items: PortfolioItem[]) => void;
  updateContactInfo: (info: ContactInfo) => void;
  updatePackages: (packages: Package[]) => void;
  addBooking: (booking: Booking) => void;
  updateBookings: (bookings: Booking[]) => void;
  deleteBooking: (id: string) => void;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  addTestimonial: (t: Testimonial) => void;
  updateTestimonials: (t: Testimonial[]) => void;
  updateServices: (s: Service[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Migrate stale /src/assets/ paths to /assets/ (fixes production image paths)
const migrateImagePath = (path: string) =>
  typeof path === "string" ? path.replace(/^\/src\/assets\//, "/assets/") : path;

const defaultServices: Service[] = [
  {
    id: "1",
    title: "Weddings",
    icon: "Heart",
    image: "/assets/portfolio-wedding.jpg",
    description: "From intimate ceremonies to grand celebrations, we craft your love story with meticulous attention to every detail. Our wedding planning services include venue selection, décor design, vendor coordination, and day-of management.",
    features: ["Venue Scouting", "Floral Design", "Catering Coordination", "Entertainment Booking", "Day-of Coordination"],
  },
  {
    id: "2",
    title: "Corporate Events",
    icon: "Building2",
    image: "/assets/portfolio-corporate.jpg",
    description: "Elevate your brand with sophisticated corporate gatherings. We handle conferences, product launches, team-building events, and executive galas with professionalism and flair.",
    features: ["Conference Planning", "Brand Activation", "AV & Production", "Catering & Hospitality", "Post-Event Reports"],
  },
  {
    id: "3",
    title: "Galas & Balls",
    icon: "PartyPopper",
    image: "/assets/hero-event.jpg",
    description: "Grand, opulent affairs that command attention. Our galas feature stunning décor, world-class entertainment, and a seamless guest experience from arrival to departure.",
    features: ["Theme Development", "Luxury Décor", "Live Entertainment", "VIP Management", "Red Carpet Setup"],
  },
  {
    id: "4",
    title: "Social Gatherings",
    icon: "Users",
    image: "/assets/portfolio-social.jpg",
    description: "Sophisticated cocktail parties, anniversary celebrations, and exclusive dinners. We create intimate atmospheres that foster connection and celebration.",
    features: ["Menu Curation", "Ambient Design", "Guest List Management", "Custom Invitations", "Photography"],
  },
  {
    id: "5",
    title: "Birthday Parties",
    icon: "Cake",
    image: "/assets/portfolio-birthday.jpg",
    description: "Milestone birthdays deserve extraordinary celebrations. From elegant adult parties to magical themed events, we make every birthday unforgettable.",
    features: ["Theme Design", "Custom Cakes", "Entertainment", "Party Favors", "Photo & Video"],
  },
  {
    id: "6",
    title: "Bespoke Events",
    icon: "Sparkles",
    image: "/assets/portfolio-social.jpg",
    description: "When your vision doesn't fit a category, we create something entirely new. Our bespoke service is for those who dream beyond convention.",
    features: ["Concept Development", "Custom Design", "Full Production", "Concierge Service", "Legacy Documentation"],
  },
];

// Default data with image paths as strings
const defaultTeamMembers: TeamMember[] = [
  { id: "1", name: "Amara Njeri", role: "Lead Wedding Planner", image: "/assets/team-1.jpg", bio: "With over 8 years creating dream weddings, Amara brings passion and precision to every celebration." },
  { id: "2", name: "David Ochieng", role: "Corporate Events Director", image: "/assets/team-2.jpg", bio: "David orchestrates world-class corporate galas and conferences with strategic excellence." },
  { id: "3", name: "Grace Wambui", role: "Creative Director", image: "/assets/team-3.jpg", bio: "Grace transforms spaces into breathtaking environments with her eye for design and detail." },
  { id: "4", name: "James Kamau", role: "Operations Manager", image: "/assets/team-4.jpg", bio: "James ensures every event runs flawlessly from logistics to the final farewell." },
  { id: "5", name: "Faith Muthoni", role: "Client Relations Manager", image: "/assets/team-5.jpg", bio: "Faith ensures every client feels heard, valued, and delighted throughout their journey." },
];

const defaultPortfolioItems: PortfolioItem[] = [
  { id: "1", title: "The Anderson Wedding", category: "Wedding", image: "/assets/portfolio-wedding.jpg", description: "A sunset garden ceremony with 200 guests", date: "2026-01-15" },
  { id: "2", title: "Annual Executive Gala", category: "Corporate", image: "/assets/portfolio-corporate.jpg", description: "Black-tie corporate gala for 500 attendees", date: "2026-02-20" },
  { id: "3", title: "Golden 50th Birthday", category: "Birthday", image: "/assets/portfolio-birthday.jpg", description: "A milestone celebration with gold-themed décor", date: "2026-03-10" },
  { id: "4", title: "Champagne Soirée", category: "Social", image: "/assets/portfolio-social.jpg", description: "An intimate cocktail gathering for 80 guests", date: "2026-03-25" },
];

const defaultContactInfo: ContactInfo = {
  phone: "",
  email: "",
  address: "Nairobi, Kenya",
  facebook: "",
  instagram: "",
  twitter: "",
  tiktok: "",
};

const defaultPackages: Package[] = [
  {
    id: "1",
    name: "Premium",
    price: 25000,
    description: "Perfect for intimate gatherings",
    features: ["Up to 50 guests", "Basic decoration", "4-hour event", "Standard catering"],
  },
  {
    id: "2",
    name: "Elegance",
    price: 45000,
    description: "Ideal for medium-sized events",
    features: ["Up to 100 guests", "Enhanced decoration", "6-hour event", "Premium catering", "Photography"],
  },
  {
    id: "3",
    name: "Prestige",
    price: 75000,
    description: "For grand celebrations",
    features: ["Up to 200 guests", "Luxury decoration", "8-hour event", "Gourmet catering", "Photography & Videography"],
  },
  {
    id: "4",
    name: "GRANDEZZA",
    price: 150000,
    description: "The ultimate luxury experience",
    features: ["500+ guests", "Full production design", "Multi-day event", "All-inclusive elite service", "Full cinematography"],
  },
];

const defaultBookings: Booking[] = [];

const defaultPaymentSettings: PaymentSettings = {
  mpesaPhoneNumber: "",
  mpesaPaybill: "",
  mpesaAccountNumber: "",
  mpesaDestination: "phone",
  stripePublicKey: "",
  stripeSecretKey: "",
  stripeAccountEmail: "",
  stripeAccountId: "",
  bankName: "",
  bankAccount: "",
  enabledMethods: {
    mpesa: true,
    card: false,
  },
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load data from localStorage or use defaults
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const stored = localStorage.getItem("teamMembers");
      if (stored) {
        const parsed: TeamMember[] = JSON.parse(stored);
        return parsed.map(m => ({ ...m, image: migrateImagePath(m.image) }));
      }
      return defaultTeamMembers;
    } catch (error) {
      console.error("Error loading team members:", error);
      return defaultTeamMembers;
    }
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const stored = localStorage.getItem("portfolioItems");
      if (stored) {
        const parsed: PortfolioItem[] = JSON.parse(stored);
        return parsed.map(p => ({ ...p, image: migrateImagePath(p.image) }));
      }
      return defaultPortfolioItems;
    } catch (error) {
      console.error("Error loading portfolio items:", error);
      return defaultPortfolioItems;
    }
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    try {
      const stored = localStorage.getItem("contactInfo");
      return stored ? JSON.parse(stored) : defaultContactInfo;
    } catch (error) {
      console.error("Error loading contact info:", error);
      return defaultContactInfo;
    }
  });

  const [packages, setPackages] = useState<Package[]>(() => {
    try {
      const stored = localStorage.getItem("packages");
      return stored ? JSON.parse(stored) : defaultPackages;
    } catch (error) {
      console.error("Error loading packages:", error);
      return defaultPackages;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem("bookings");
      return stored ? JSON.parse(stored) : defaultBookings;
    } catch (error) {
      console.error("Error loading bookings:", error);
      return defaultBookings;
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const stored = localStorage.getItem("paymentSettings");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultPaymentSettings, ...parsed };
      }
      return defaultPaymentSettings;
    } catch (error) {
      console.error("Error loading payment settings:", error);
      return defaultPaymentSettings;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const stored = localStorage.getItem("services");
      if (stored) {
        const parsed: Service[] = JSON.parse(stored);
        return parsed.map(s => ({ ...s, image: migrateImagePath(s.image) }));
      }
      return defaultServices;
    } catch { return defaultServices; }
  });

  const defaultTestimonials: Testimonial[] = [
    {
      id: "static-1",
      userId: "static",
      userName: "Margaret & Peter",
      userEmail: "",
      event: "Wedding",
      text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting. We couldn't have asked for more.",
      rating: 5,
      status: "approved",
      createdAt: "2026-01-15T00:00:00.000Z",
    },
    {
      id: "static-2",
      userId: "static",
      userName: "Safaricom Ltd.",
      userEmail: "",
      event: "Corporate Gala",
      text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed with the elegance.",
      rating: 5,
      status: "approved",
      createdAt: "2026-02-20T00:00:00.000Z",
    },
    {
      id: "static-3",
      userId: "static",
      userName: "Angela Wanjiku",
      userEmail: "",
      event: "Birthday Celebration",
      text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty. Truly the grandest experience.",
      rating: 5,
      status: "approved",
      createdAt: "2026-03-10T00:00:00.000Z",
    },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem("testimonials");
      return stored ? JSON.parse(stored) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    } catch (error) {
      console.error("Error saving team members:", error);
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem("portfolioItems", JSON.stringify(portfolioItems));
    } catch (error) {
      console.error("Error saving portfolio items:", error);
    }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  }, [contactInfo]);

  useEffect(() => {
    try {
      localStorage.setItem("packages", JSON.stringify(packages));
    } catch (error) {
      console.error("Error saving packages:", error);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings:", error);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem("paymentSettings", JSON.stringify(paymentSettings));
    } catch (error) {
      console.error("Error saving payment settings:", error);
    }
  }, [paymentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem("testimonials", JSON.stringify(testimonials));
    } catch {
      console.error("Error saving testimonials");
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem("services", JSON.stringify(services));
    } catch { console.error("Error saving services"); }
  }, [services]);

  const updateTeamMembers = (members: TeamMember[]) => {
    setTeamMembers(members);
  };

  const updatePortfolioItems = (items: PortfolioItem[]) => {
    setPortfolioItems(items);
  };

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
  };

  const updatePackages = (pkgs: Package[]) => {
    setPackages(pkgs);
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
  };

  const deleteBooking = (id: string) => {
    setBookings(prevBookings => {
      const updatedBookings = prevBookings.filter(b => b.id !== id);
      // Explicitly save to localStorage immediately
      try {
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      } catch (error) {
        console.error("Error saving bookings after delete:", error);
      }
      return updatedBookings;
    });
  };

  const updatePaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettings(settings);
  };

  const addTestimonial = (t: Testimonial) => {
    setTestimonials(prev => [t, ...prev]);
  };

  const updateTestimonials = (t: Testimonial[]) => {
    setTestimonials(t);
  };

  const updateServices = (s: Service[]) => {
    setServices(s);
  };

  return (
    <DataContext.Provider
      value={{
        teamMembers,
        portfolioItems,
        contactInfo,
        packages,
        bookings,
        testimonials,
        paymentSettings,
        services,
        updateTeamMembers,
        updatePortfolioItems,
        updateContactInfo,
        updatePackages,
        addBooking,
        updateBookings,
        deleteBooking,
        updatePaymentSettings,
        addTestimonial,
        updateTestimonials,
        updateServices,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
