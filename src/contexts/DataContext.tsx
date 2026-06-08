import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  collection, doc, setDoc, deleteDoc, writeBatch, getDocs, onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, configured } from "@/lib/firebase";
import { toast } from "sonner";
import {
  TeamMember, PortfolioItem, ContactInfo, Package,
  Booking, PaymentSettings, Testimonial, Service,
} from "@/types/admin";

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
  updateTeamMembers: (m: TeamMember[]) => Promise<void>;
  updatePortfolioItems: (i: PortfolioItem[]) => Promise<void>;
  updateContactInfo: (i: ContactInfo) => Promise<void>;
  updatePackages: (p: Package[]) => Promise<void>;
  addBooking: (b: Booking) => Promise<void>;
  updateBookings: (b: Booking[]) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updatePaymentSettings: (s: PaymentSettings) => Promise<void>;
  addTestimonial: (t: Testimonial) => Promise<void>;
  updateTestimonials: (t: Testimonial[]) => Promise<void>;
  updateServices: (s: Service[]) => Promise<void>;
}

const img = (p: string) =>
  typeof p === "string" ? p.replace(/^\/src\/assets\//, "/assets/") : p;

// ── Defaults — only used when Firebase is NOT configured ──────────────────────
const DEFAULT_TEAM: TeamMember[] = [
  { id: "1", name: "Amara Njeri", role: "Lead Wedding Planner", image: "/assets/team-1.jpg", bio: "With over 8 years creating dream weddings, Amara brings passion and precision to every celebration." },
  { id: "2", name: "David Ochieng", role: "Corporate Events Director", image: "/assets/team-2.jpg", bio: "David orchestrates world-class corporate galas and conferences with strategic excellence." },
  { id: "3", name: "Grace Wambui", role: "Creative Director", image: "/assets/team-3.jpg", bio: "Grace transforms spaces into breathtaking environments with her eye for design and detail." },
  { id: "4", name: "James Kamau", role: "Operations Manager", image: "/assets/team-4.jpg", bio: "James ensures every event runs flawlessly from logistics to the final farewell." },
  { id: "5", name: "Faith Muthoni", role: "Client Relations Manager", image: "/assets/team-5.jpg", bio: "Faith ensures every client feels heard, valued, and delighted throughout their journey." },
];
const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: "1", title: "The Anderson Wedding", category: "Wedding", image: "/assets/portfolio-wedding.jpg", description: "A sunset garden ceremony with 200 guests", date: "2026-01-15" },
  { id: "2", title: "Annual Executive Gala", category: "Corporate", image: "/assets/portfolio-corporate.jpg", description: "Black-tie corporate gala for 500 attendees", date: "2026-02-20" },
  { id: "3", title: "Golden 50th Birthday", category: "Birthday", image: "/assets/portfolio-birthday.jpg", description: "A milestone celebration with gold-themed décor", date: "2026-03-10" },
  { id: "4", title: "Champagne Soirée", category: "Social", image: "/assets/portfolio-social.jpg", description: "An intimate cocktail gathering for 80 guests", date: "2026-03-25" },
];
const DEFAULT_SERVICES: Service[] = [
  { id: "1", title: "Weddings", icon: "Heart", image: "/assets/portfolio-wedding.jpg", description: "From intimate ceremonies to grand celebrations, we craft your love story with meticulous attention to every detail.", features: ["Venue Scouting", "Floral Design", "Catering Coordination", "Entertainment Booking", "Day-of Coordination"] },
  { id: "2", title: "Corporate Events", icon: "Building2", image: "/assets/portfolio-corporate.jpg", description: "Elevate your brand with sophisticated corporate gatherings.", features: ["Conference Planning", "Brand Activation", "AV & Production", "Catering & Hospitality", "Post-Event Reports"] },
  { id: "3", title: "Galas & Balls", icon: "PartyPopper", image: "/assets/hero-event.jpg", description: "Grand, opulent affairs that command attention.", features: ["Theme Development", "Luxury Décor", "Live Entertainment", "VIP Management", "Red Carpet Setup"] },
  { id: "4", title: "Social Gatherings", icon: "Users", image: "/assets/portfolio-social.jpg", description: "Sophisticated cocktail parties, anniversary celebrations, and exclusive dinners.", features: ["Menu Curation", "Ambient Design", "Guest List Management", "Custom Invitations", "Photography"] },
  { id: "5", title: "Birthday Parties", icon: "Cake", image: "/assets/portfolio-birthday.jpg", description: "Milestone birthdays deserve extraordinary celebrations.", features: ["Theme Design", "Custom Cakes", "Entertainment", "Party Favors", "Photo & Video"] },
  { id: "6", title: "Bespoke Events", icon: "Sparkles", image: "/assets/portfolio-social.jpg", description: "When your vision doesn't fit a category, we create something entirely new.", features: ["Concept Development", "Custom Design", "Full Production", "Concierge Service", "Legacy Documentation"] },
];
const DEFAULT_PACKAGES: Package[] = [
  { id: "1", name: "Premium", price: 25000, description: "Perfect for intimate gatherings", features: ["Up to 50 guests", "Basic decoration", "4-hour event", "Standard catering"] },
  { id: "2", name: "Elegance", price: 45000, description: "Ideal for medium-sized events", features: ["Up to 100 guests", "Enhanced decoration", "6-hour event", "Premium catering", "Photography"] },
  { id: "3", name: "Prestige", price: 75000, description: "For grand celebrations", features: ["Up to 200 guests", "Luxury decoration", "8-hour event", "Gourmet catering", "Photography & Videography"] },
  { id: "4", name: "GRANDEZZA", price: 150000, description: "The ultimate luxury experience", features: ["500+ guests", "Full production design", "Multi-day event", "All-inclusive elite service", "Full cinematography"] },
];
const DEFAULT_CONTACT: ContactInfo = { phone: "", email: "", address: "Nairobi, Kenya", facebook: "", instagram: "", twitter: "", tiktok: "" };
const DEFAULT_PAYMENT: PaymentSettings = {
  mpesaPhoneNumber: "", mpesaPaybill: "", mpesaAccountNumber: "", mpesaDestination: "phone",
  stripePublicKey: "", stripeSecretKey: "", stripeAccountEmail: "", stripeAccountId: "",
  bankName: "", bankAccount: "", enabledMethods: { mpesa: true, card: false },
};
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "static-1", userId: "static", userName: "Margaret & Peter", userEmail: "", event: "Wedding", text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting.", rating: 5, status: "approved", createdAt: "2026-01-15T00:00:00.000Z" },
  { id: "static-2", userId: "static", userName: "Safaricom Ltd.", userEmail: "", event: "Corporate Gala", text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed.", rating: 5, status: "approved", createdAt: "2026-02-20T00:00:00.000Z" },
  { id: "static-3", userId: "static", userName: "Angela Wanjiku", userEmail: "", event: "Birthday Celebration", text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty.", rating: 5, status: "approved", createdAt: "2026-03-10T00:00:00.000Z" },
];

// ── Auth-aware write helper ────────────────────────────────────────────────────
function waitForAuth(): Promise<boolean> {
  if (!auth) return Promise.resolve(false);
  if (auth.currentUser) return Promise.resolve(true);
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth!, user => { unsub(); resolve(!!user); });
    setTimeout(() => { unsub(); resolve(false); }, 6000);
  });
}

async function fsSetAll<T extends { id: string }>(col: string, items: T[]) {
  if (!db) {
    toast.error("Firebase not configured");
    return;
  }
  const ok = await waitForAuth();
  if (!ok) {
    toast.error("Not signed in — changes won't sync to other devices.");
    console.warn(`[Firestore] ⚠️ Not authenticated - ${col} changes local only`);
    return;
  }
  try {
    const batch = writeBatch(db);
    const existing = await getDocs(collection(db, col));
    existing.docs.forEach(d => batch.delete(d.ref));
    items.forEach(item => {
      batch.set(doc(db!, col, item.id), item);
    });
    await batch.commit();
    console.log(`[Firestore] ✅ Synced ${col} (${items.length} items)`);
  } catch (e: unknown) {
    const msg = (e as { message?: string }).message ?? String(e);
    console.error(`[Firestore] ❌ ${col} sync failed:`, msg);
    toast.error(`Sync failed: ${msg}`);
  }
}

async function fsSetDoc(col: string, id: string, data: object) {
  if (!db) return;
  const ok = await waitForAuth();
  if (!ok) { toast.error("Not signed in — changes won't sync."); return; }
  try {
    await setDoc(doc(db, col, id), data);
  } catch (e: unknown) {
    const msg = (e as { message?: string }).message ?? String(e);
    toast.error(`Save failed: ${msg}`);
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Start with null — means "not yet loaded from Firestore"
  // Only fall back to defaults if Firebase is not configured
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(configured ? [] : DEFAULT_TEAM);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(configured ? [] : DEFAULT_PORTFOLIO);
  const [services, setServices] = useState<Service[]>(configured ? [] : DEFAULT_SERVICES);
  const [packages, setPackages] = useState<Package[]>(configured ? [] : DEFAULT_PACKAGES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(configured ? [] : DEFAULT_TESTIMONIALS);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !configured) {
      // No Firebase — use defaults immediately
      setTeamMembers(DEFAULT_TEAM);
      setPortfolioItems(DEFAULT_PORTFOLIO);
      setServices(DEFAULT_SERVICES);
      setPackages(DEFAULT_PACKAGES);
      setTestimonials(DEFAULT_TESTIMONIALS);
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      // Firestore timed out — fall back to defaults
      console.warn("[DataContext] Firestore timeout — using defaults");
      setTeamMembers(prev => prev.length === 0 ? DEFAULT_TEAM : prev);
      setPortfolioItems(prev => prev.length === 0 ? DEFAULT_PORTFOLIO : prev);
      setServices(prev => prev.length === 0 ? DEFAULT_SERVICES : prev);
      setPackages(prev => prev.length === 0 ? DEFAULT_PACKAGES : prev);
      setTestimonials(prev => prev.length === 0 ? DEFAULT_TESTIMONIALS : prev);
      setLoading(false);
    }, 10000);

    const unsubs = [
      onSnapshot(collection(db, "teamMembers"),
        snap => {
          // Always use Firestore data — empty means admin deleted all members
          setTeamMembers(snap.docs.map(d => ({
            id: d.id, ...d.data(),
            image: img((d.data() as TeamMember).image),
          } as TeamMember)));
          setLoading(false);
          clearTimeout(timeout);
        },
        err => {
          console.error("[Firestore] teamMembers:", err.code, err.message);
          setTeamMembers(DEFAULT_TEAM);
          setLoading(false);
          clearTimeout(timeout);
        }
      ),
      onSnapshot(collection(db, "portfolioItems"),
        snap => {
          setPortfolioItems(snap.docs.map(d => ({
            id: d.id, ...d.data(),
            image: img((d.data() as PortfolioItem).image),
          } as PortfolioItem)));
        },
        err => { console.error("[Firestore] portfolioItems:", err.code); setPortfolioItems(DEFAULT_PORTFOLIO); }
      ),
      onSnapshot(collection(db, "services"),
        snap => {
          setServices(snap.docs.map(d => ({
            id: d.id, ...d.data(),
            image: img((d.data() as Service).image),
          } as Service)));
        },
        err => { console.error("[Firestore] services:", err.code); setServices(DEFAULT_SERVICES); }
      ),
      onSnapshot(collection(db, "packages"),
        snap => {
          setPackages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Package)));
        },
        err => { console.error("[Firestore] packages:", err.code); setPackages(DEFAULT_PACKAGES); }
      ),
      onSnapshot(collection(db, "bookings"),
        snap => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))),
        err => console.error("[Firestore] bookings:", err.code)
      ),
      onSnapshot(collection(db, "testimonials"),
        snap => {
          setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
        },
        err => { console.error("[Firestore] testimonials:", err.code); setTestimonials(DEFAULT_TESTIMONIALS); }
      ),
      onSnapshot(collection(db, "config"),
        snap => {
          snap.docs.forEach(d => {
            if (d.id === "contactInfo") setContactInfo(d.data() as ContactInfo);
            if (d.id === "paymentSettings") setPaymentSettings({ ...DEFAULT_PAYMENT, ...d.data() as PaymentSettings });
          });
        },
        err => console.error("[Firestore] config:", err.code)
      ),
    ];

    return () => { clearTimeout(timeout); unsubs.forEach(u => u()); };
  }, []);

  // ── Write functions ───────────────────────────────────────────────────────
  const updateTeamMembers = async (m: TeamMember[]) => { setTeamMembers(m); await fsSetAll("teamMembers", m); };
  const updatePortfolioItems = async (i: PortfolioItem[]) => { setPortfolioItems(i); await fsSetAll("portfolioItems", i); };
  const updateServices = async (s: Service[]) => { setServices(s); await fsSetAll("services", s); };
  const updatePackages = async (p: Package[]) => { setPackages(p); await fsSetAll("packages", p); };
  const updateContactInfo = async (i: ContactInfo) => { setContactInfo(i); await fsSetDoc("config", "contactInfo", i); };
  const updatePaymentSettings = async (s: PaymentSettings) => { setPaymentSettings(s); await fsSetDoc("config", "paymentSettings", s); };

  const addBooking = async (b: Booking) => {
    setBookings(prev => [b, ...prev]);
    if (db) try { await setDoc(doc(db, "bookings", b.id), b); } catch (e) { console.error("[Firestore] addBooking:", e); }
  };
  const updateBookings = async (b: Booking[]) => { setBookings(b); await fsSetAll("bookings", b); };
  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    if (db && await waitForAuth()) try { await deleteDoc(doc(db, "bookings", id)); } catch (e) { console.error("[Firestore] deleteBooking:", e); }
  };
  const addTestimonial = async (t: Testimonial) => {
    setTestimonials(prev => [t, ...prev]);
    if (db) try { await setDoc(doc(db, "testimonials", t.id), t); } catch (e) { console.error("[Firestore] addTestimonial:", e); }
  };
  const updateTestimonials = async (t: Testimonial[]) => { setTestimonials(t); await fsSetAll("testimonials", t); };

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
