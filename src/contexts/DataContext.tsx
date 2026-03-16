import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  collection, doc, getDocs, setDoc, deleteDoc, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TeamMember, PortfolioItem, ContactInfo, Package, Booking, PaymentSettings, Testimonial, Service } from "@/types/admin";

// ── Context type ───────────────────────────────────────────────────────────────
interface DataContextType {
  teamMembers: TeamMember[];
  portfolioItems: PortfolioItem[];
  contactInfo: ContactInfo;
  packages: Package[];
  bookings: Booking[];
  testimonials: Testimonial[];
  paymentSettings: PaymentSettings;
  services: Service[];
  loading: boolean;
  updateTeamMembers: (members: TeamMember[]) => Promise<void>;
  updatePortfolioItems: (items: PortfolioItem[]) => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updatePackages: (packages: Package[]) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookings: (bookings: Booking[]) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updatePaymentSettings: (settings: PaymentSettings) => Promise<void>;
  addTestimonial: (t: Testimonial) => Promise<void>;
  updateTestimonials: (t: Testimonial[]) => Promise<void>;
  updateServices: (s: Service[]) => Promise<void>;
}

// ── localStorage helpers ───────────────────────────────────────────────────────
const ls = {
  get: <T,>(key: string, fallback: T): T => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
  },
};

const migrateImg = (p: string) =>
  typeof p === "string" ? p.replace(/^\/src\/assets\//, "/assets/") : p;

// ── Defaults ───────────────────────────────────────────────────────────────────
const defaultTeam: TeamMember[] = [
  { id: "1", name: "Amara Njeri", role: "Lead Wedding Planner", image: "/assets/team-1.jpg", bio: "With over 8 years creating dream weddings, Amara brings passion and precision to every celebration." },
  { id: "2", name: "David Ochieng", role: "Corporate Events Director", image: "/assets/team-2.jpg", bio: "David orchestrates world-class corporate galas and conferences with strategic excellence." },
  { id: "3", name: "Grace Wambui", role: "Creative Director", image: "/assets/team-3.jpg", bio: "Grace transforms spaces into breathtaking environments with her eye for design and detail." },
  { id: "4", name: "James Kamau", role: "Operations Manager", image: "/assets/team-4.jpg", bio: "James ensures every event runs flawlessly from logistics to the final farewell." },
  { id: "5", name: "Faith Muthoni", role: "Client Relations Manager", image: "/assets/team-5.jpg", bio: "Faith ensures every client feels heard, valued, and delighted throughout their journey." },
];

const defaultPortfolio: PortfolioItem[] = [
  { id: "1", title: "The Anderson Wedding", category: "Wedding", image: "/assets/portfolio-wedding.jpg", description: "A sunset garden ceremony with 200 guests", date: "2026-01-15" },
  { id: "2", title: "Annual Executive Gala", category: "Corporate", image: "/assets/portfolio-corporate.jpg", description: "Black-tie corporate gala for 500 attendees", date: "2026-02-20" },
  { id: "3", title: "Golden 50th Birthday", category: "Birthday", image: "/assets/portfolio-birthday.jpg", description: "A milestone celebration with gold-themed décor", date: "2026-03-10" },
  { id: "4", title: "Champagne Soirée", category: "Social", image: "/assets/portfolio-social.jpg", description: "An intimate cocktail gathering for 80 guests", date: "2026-03-25" },
];

const defaultServices: Service[] = [
  { id: "1", title: "Weddings", icon: "Heart", image: "/assets/portfolio-wedding.jpg", description: "From intimate ceremonies to grand celebrations, we craft your love story with meticulous attention to every detail.", features: ["Venue Scouting", "Floral Design", "Catering Coordination", "Entertainment Booking", "Day-of Coordination"] },
  { id: "2", title: "Corporate Events", icon: "Building2", image: "/assets/portfolio-corporate.jpg", description: "Elevate your brand with sophisticated corporate gatherings. We handle conferences, product launches, and executive galas.", features: ["Conference Planning", "Brand Activation", "AV & Production", "Catering & Hospitality", "Post-Event Reports"] },
  { id: "3", title: "Galas & Balls", icon: "PartyPopper", image: "/assets/hero-event.jpg", description: "Grand, opulent affairs that command attention. Our galas feature stunning décor and world-class entertainment.", features: ["Theme Development", "Luxury Décor", "Live Entertainment", "VIP Management", "Red Carpet Setup"] },
  { id: "4", title: "Social Gatherings", icon: "Users", image: "/assets/portfolio-social.jpg", description: "Sophisticated cocktail parties, anniversary celebrations, and exclusive dinners.", features: ["Menu Curation", "Ambient Design", "Guest List Management", "Custom Invitations", "Photography"] },
  { id: "5", title: "Birthday Parties", icon: "Cake", image: "/assets/portfolio-birthday.jpg", description: "Milestone birthdays deserve extraordinary celebrations. From elegant adult parties to magical themed events.", features: ["Theme Design", "Custom Cakes", "Entertainment", "Party Favors", "Photo & Video"] },
  { id: "6", title: "Bespoke Events", icon: "Sparkles", image: "/assets/portfolio-social.jpg", description: "When your vision doesn't fit a category, we create something entirely new.", features: ["Concept Development", "Custom Design", "Full Production", "Concierge Service", "Legacy Documentation"] },
];

const defaultPackages: Package[] = [
  { id: "1", name: "Premium", price: 25000, description: "Perfect for intimate gatherings", features: ["Up to 50 guests", "Basic decoration", "4-hour event", "Standard catering"] },
  { id: "2", name: "Elegance", price: 45000, description: "Ideal for medium-sized events", features: ["Up to 100 guests", "Enhanced decoration", "6-hour event", "Premium catering", "Photography"] },
  { id: "3", name: "Prestige", price: 75000, description: "For grand celebrations", features: ["Up to 200 guests", "Luxury decoration", "8-hour event", "Gourmet catering", "Photography & Videography"] },
  { id: "4", name: "GRANDEZZA", price: 150000, description: "The ultimate luxury experience", features: ["500+ guests", "Full production design", "Multi-day event", "All-inclusive elite service", "Full cinematography"] },
];

const defaultContact: ContactInfo = { phone: "", email: "", address: "Nairobi, Kenya", facebook: "", instagram: "", twitter: "", tiktok: "" };

const defaultPayment: PaymentSettings = {
  mpesaPhoneNumber: "", mpesaPaybill: "", mpesaAccountNumber: "", mpesaDestination: "phone",
  stripePublicKey: "", stripeSecretKey: "", stripeAccountEmail: "", stripeAccountId: "",
  bankName: "", bankAccount: "", enabledMethods: { mpesa: true, card: false },
};

const defaultTestimonials: Testimonial[] = [
  { id: "static-1", userId: "static", userName: "Margaret & Peter", userEmail: "", event: "Wedding", text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting.", rating: 5, status: "approved", createdAt: "2026-01-15T00:00:00.000Z" },
  { id: "static-2", userId: "static", userName: "Safaricom Ltd.", userEmail: "", event: "Corporate Gala", text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed.", rating: 5, status: "approved", createdAt: "2026-02-20T00:00:00.000Z" },
  { id: "static-3", userId: "static", userName: "Angela Wanjiku", userEmail: "", event: "Birthday Celebration", text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty.", rating: 5, status: "approved", createdAt: "2026-03-10T00:00:00.000Z" },
];

// ── Firestore helpers ──────────────────────────────────────────────────────────
// Fetch all docs from a collection as typed array
async function fsGetAll<T>(col: string): Promise<T[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, col));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

// Replace entire collection with new array (batched)
async function fsSetAll<T extends { id: string }>(col: string, items: T[]) {
  if (!db) return;
  const batch = writeBatch(db);
  // Delete existing docs
  const snap = await getDocs(collection(db, col));
  snap.docs.forEach(d => batch.delete(d.ref));
  // Write new docs
  items.forEach(item => batch.set(doc(db!, col, item.id), item));
  await batch.commit();
}

// Set a single config doc
async function fsSetDoc(col: string, id: string, data: object) {
  if (!db) return;
  await setDoc(doc(db, col, id), data);
}

// Get a single config doc
async function fsGetDoc<T>(col: string, id: string, fallback: T): Promise<T> {
  if (!db) return fallback;
  const snap = await getDocs(collection(db, col));
  const found = snap.docs.find(d => d.id === id);
  return found ? (found.data() as T) : fallback;
}

// ── Provider ───────────────────────────────────────────────────────────────────
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(!!db);

  // Initialise from localStorage (instant), then overwrite from Firestore
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    ls.get<TeamMember[]>("teamMembers", defaultTeam).map(m => ({ ...m, image: migrateImg(m.image) }))
  );
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
    ls.get<PortfolioItem[]>("portfolioItems", defaultPortfolio).map(p => ({ ...p, image: migrateImg(p.image) }))
  );
  const [services, setServices] = useState<Service[]>(() =>
    ls.get<Service[]>("services", defaultServices).map(s => ({ ...s, image: migrateImg(s.image) }))
  );
  const [packages, setPackages] = useState<Package[]>(() => ls.get("packages", defaultPackages));
  const [bookings, setBookings] = useState<Booking[]>(() => ls.get("bookings", []));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => ls.get("testimonials", defaultTestimonials));
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => ls.get("contactInfo", defaultContact));
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() =>
    ({ ...defaultPayment, ...ls.get("paymentSettings", {}) })
  );

  // Fetch everything from Firestore on mount
  const fetchAll = useCallback(async () => {
    if (!db) {
      console.error("[DataContext] Firestore db is null — skipping fetch, using localStorage only");
      setLoading(false);
      return;
    }
    console.log("[DataContext] Fetching from Firestore...");
    try {
      const [team, portfolio, svcs, pkgs, bkgs, testi, contact, payment] = await Promise.all([
        fsGetAll<TeamMember>("teamMembers"),
        fsGetAll<PortfolioItem>("portfolioItems"),
        fsGetAll<Service>("services"),
        fsGetAll<Package>("packages"),
        fsGetAll<Booking>("bookings"),
        fsGetAll<Testimonial>("testimonials"),
        fsGetDoc<ContactInfo>("config", "contactInfo", defaultContact),
        fsGetDoc<PaymentSettings>("config", "paymentSettings", defaultPayment),
      ]);

      if (team.length)      { const d = team.map(m => ({ ...m, image: migrateImg(m.image) }));      setTeamMembers(d);      ls.set("teamMembers", d); }
      if (portfolio.length) { const d = portfolio.map(p => ({ ...p, image: migrateImg(p.image) })); setPortfolioItems(d);   ls.set("portfolioItems", d); }
      if (svcs.length)      { const d = svcs.map(s => ({ ...s, image: migrateImg(s.image) }));      setServices(d);         ls.set("services", d); }
      if (pkgs.length)      { setPackages(pkgs);       ls.set("packages", pkgs); }
      if (bkgs.length)      { setBookings(bkgs);       ls.set("bookings", bkgs); }
      if (testi.length)     { setTestimonials(testi);  ls.set("testimonials", testi); }
      if (contact)          { setContactInfo(contact); ls.set("contactInfo", contact); }
      if (payment)          { setPaymentSettings({ ...defaultPayment, ...payment }); ls.set("paymentSettings", payment); }
      console.log("[DataContext] ✅ Firestore fetch complete — team:", team.length, "portfolio:", portfolio.length);
    } catch (e) {
      console.error("[DataContext] ❌ Firestore fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Updaters ─────────────────────────────────────────────────────────────────
  const updateTeamMembers = async (members: TeamMember[]) => {
    setTeamMembers(members); ls.set("teamMembers", members);
    console.log("[DataContext] Writing teamMembers to Firestore, db:", !!db);
    await fsSetAll("teamMembers", members);
    console.log("[DataContext] ✅ teamMembers written");
  };

  const updatePortfolioItems = async (items: PortfolioItem[]) => {
    setPortfolioItems(items); ls.set("portfolioItems", items);
    await fsSetAll("portfolioItems", items);
  };

  const updateServices = async (s: Service[]) => {
    setServices(s); ls.set("services", s);
    await fsSetAll("services", s);
  };

  const updatePackages = async (pkgs: Package[]) => {
    setPackages(pkgs); ls.set("packages", pkgs);
    await fsSetAll("packages", pkgs);
  };

  const updateContactInfo = async (info: ContactInfo) => {
    setContactInfo(info); ls.set("contactInfo", info);
    await fsSetDoc("config", "contactInfo", info);
  };

  const updatePaymentSettings = async (settings: PaymentSettings) => {
    setPaymentSettings(settings); ls.set("paymentSettings", settings);
    await fsSetDoc("config", "paymentSettings", settings);
  };

  const addBooking = async (booking: Booking) => {
    setBookings(prev => { const n = [booking, ...prev]; ls.set("bookings", n); return n; });
    if (db) await setDoc(doc(db, "bookings", booking.id), booking);
  };

  const updateBookings = async (newBookings: Booking[]) => {
    setBookings(newBookings); ls.set("bookings", newBookings);
    await fsSetAll("bookings", newBookings);
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => { const n = prev.filter(b => b.id !== id); ls.set("bookings", n); return n; });
    if (db) await deleteDoc(doc(db, "bookings", id));
  };

  const addTestimonial = async (t: Testimonial) => {
    setTestimonials(prev => { const n = [t, ...prev]; ls.set("testimonials", n); return n; });
    if (db) await setDoc(doc(db, "testimonials", t.id), t);
  };

  const updateTestimonials = async (t: Testimonial[]) => {
    setTestimonials(t); ls.set("testimonials", t);
    await fsSetAll("testimonials", t);
  };

  return (
    <DataContext.Provider value={{
      teamMembers, portfolioItems, contactInfo, packages, bookings,
      testimonials, paymentSettings, services, loading,
      updateTeamMembers, updatePortfolioItems, updateContactInfo, updatePackages,
      addBooking, updateBookings, deleteBooking, updatePaymentSettings,
      addTestimonial, updateTestimonials, updateServices,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
