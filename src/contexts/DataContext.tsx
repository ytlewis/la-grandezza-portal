import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { TeamMember, PortfolioItem, ContactInfo, Package, Booking, PaymentSettings, Testimonial, Service } from "@/types/admin";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────────
const migrateImagePath = (p: string) =>
  typeof p === "string" ? p.replace(/^\/src\/assets\//, "/assets/") : p;

const ls = {
  get: <T,>(key: string, fallback: T): T => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set: <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
  },
};

// ── Defaults ───────────────────────────────────────────────────────────────────
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

const defaultContactInfo: ContactInfo = { phone: "", email: "", address: "Nairobi, Kenya", facebook: "", instagram: "", twitter: "", tiktok: "" };

const defaultPaymentSettings: PaymentSettings = {
  mpesaPhoneNumber: "", mpesaPaybill: "", mpesaAccountNumber: "", mpesaDestination: "phone",
  stripePublicKey: "", stripeSecretKey: "", stripeAccountEmail: "", stripeAccountId: "",
  bankName: "", bankAccount: "", enabledMethods: { mpesa: true, card: false },
};

const defaultTestimonials: Testimonial[] = [
  { id: "static-1", userId: "static", userName: "Margaret & Peter", userEmail: "", event: "Wedding", text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting.", rating: 5, status: "approved", createdAt: "2026-01-15T00:00:00.000Z" },
  { id: "static-2", userId: "static", userName: "Safaricom Ltd.", userEmail: "", event: "Corporate Gala", text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed.", rating: 5, status: "approved", createdAt: "2026-02-20T00:00:00.000Z" },
  { id: "static-3", userId: "static", userName: "Angela Wanjiku", userEmail: "", event: "Birthday Celebration", text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty.", rating: 5, status: "approved", createdAt: "2026-03-10T00:00:00.000Z" },
];

// ── Supabase helpers ───────────────────────────────────────────────────────────
// Upsert a full array into a table (delete-all + insert pattern for simplicity)
async function sbUpsertArray<T extends { id: string }>(table: string, rows: T[]) {
  if (!supabase) return;
  await supabase.from(table).delete().neq("id", "__never__");
  if (rows.length > 0) await supabase.from(table).insert(rows as never);
}

async function sbSetConfig(key: string, value: unknown) {
  if (!supabase) return;
  await supabase.from("site_config").upsert({ key, value });
}

async function sbGetConfig<T>(key: string, fallback: T): Promise<T> {
  if (!supabase) return fallback;
  const { data } = await supabase.from("site_config").select("value").eq("key", key).single();
  return data ? (data.value as T) : fallback;
}

// Map DB row → TeamMember
const rowToTeam = (r: Record<string, unknown>): TeamMember => ({
  id: r.id as string, name: r.name as string, role: r.role as string,
  image: migrateImagePath(r.image as string), bio: r.bio as string,
});

// Map DB row → PortfolioItem
const rowToPortfolio = (r: Record<string, unknown>): PortfolioItem => ({
  id: r.id as string, title: r.title as string, category: r.category as string,
  image: migrateImagePath(r.image as string), description: r.description as string, date: r.date as string,
});

// Map DB row → Service
const rowToService = (r: Record<string, unknown>): Service => ({
  id: r.id as string, title: r.title as string, description: r.description as string,
  image: migrateImagePath(r.image as string), icon: r.icon as string,
  features: (r.features as string[]) ?? [],
});

// Map DB row → Package
const rowToPackage = (r: Record<string, unknown>): Package => ({
  id: r.id as string, name: r.name as string, price: r.price as number,
  description: r.description as string, features: (r.features as string[]) ?? [],
});

// Map DB row → Booking
const rowToBooking = (r: Record<string, unknown>): Booking => ({
  id: r.id as string, clientName: r.client_name as string, email: r.email as string,
  phone: r.phone as string, eventDate: r.event_date as string, eventType: r.event_type as string,
  package: r.package as string, guests: r.guests as number, totalAmount: r.total_amount as number,
  depositAmount: r.deposit_amount as number, depositPaid: r.deposit_paid as boolean,
  paymentMethod: r.payment_method as Booking["paymentMethod"], paymentStatus: r.payment_status as Booking["paymentStatus"],
  transactionId: r.transaction_id as string, status: r.status as Booking["status"],
  createdAt: r.created_at as string, notes: r.notes as string,
});

// Map DB row → Testimonial
const rowToTestimonial = (r: Record<string, unknown>): Testimonial => ({
  id: r.id as string, userId: r.user_id as string, userName: r.user_name as string,
  userEmail: r.user_email as string, event: r.event as string, text: r.text as string,
  rating: r.rating as number, status: r.status as Testimonial["status"], createdAt: r.created_at as string,
});

// Map Booking → DB row
const bookingToRow = (b: Booking) => ({
  id: b.id, client_name: b.clientName, email: b.email, phone: b.phone,
  event_date: b.eventDate, event_type: b.eventType, package: b.package,
  guests: b.guests, total_amount: b.totalAmount, deposit_amount: b.depositAmount,
  deposit_paid: b.depositPaid, payment_method: b.paymentMethod ?? "",
  payment_status: b.paymentStatus, transaction_id: b.transactionId ?? "",
  status: b.status, created_at: b.createdAt, notes: b.notes ?? "",
});

// Map Testimonial → DB row
const testimonialToRow = (t: Testimonial) => ({
  id: t.id, user_id: t.userId, user_name: t.userName, user_email: t.userEmail,
  event: t.event, text: t.text, rating: t.rating, status: t.status, created_at: t.createdAt,
});

// ── Context ────────────────────────────────────────────────────────────────────
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(!!supabase);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    ls.get("teamMembers", defaultTeamMembers).map((m: TeamMember) => ({ ...m, image: migrateImagePath(m.image) }))
  );
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() =>
    ls.get("portfolioItems", defaultPortfolioItems).map((p: PortfolioItem) => ({ ...p, image: migrateImagePath(p.image) }))
  );
  const [services, setServices] = useState<Service[]>(() =>
    ls.get("services", defaultServices).map((s: Service) => ({ ...s, image: migrateImagePath(s.image) }))
  );
  const [packages, setPackages] = useState<Package[]>(() => ls.get("packages", defaultPackages));
  const [bookings, setBookings] = useState<Booking[]>(() => ls.get("bookings", []));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => ls.get("testimonials", defaultTestimonials));
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => ls.get("contactInfo", defaultContactInfo));
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() =>
    ({ ...defaultPaymentSettings, ...ls.get("paymentSettings", {}) })
  );

  // ── Fetch from Supabase on mount ─────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!supabase) return;
    try {
      const [teamRes, portfolioRes, servicesRes, packagesRes, bookingsRes, testimonialsRes, contactRes, paymentRes] =
        await Promise.all([
          supabase.from("team_members").select("*").order("sort_order"),
          supabase.from("portfolio_items").select("*").order("date", { ascending: false }),
          supabase.from("services").select("*").order("sort_order"),
          supabase.from("packages").select("*"),
          supabase.from("bookings").select("*").order("created_at", { ascending: false }),
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
          sbGetConfig<ContactInfo>("contactInfo", defaultContactInfo),
          sbGetConfig<PaymentSettings>("paymentSettings", defaultPaymentSettings),
        ]);

      if (teamRes.data?.length) {
        const t = teamRes.data.map(rowToTeam);
        setTeamMembers(t); ls.set("teamMembers", t);
      }
      if (portfolioRes.data?.length) {
        const p = portfolioRes.data.map(rowToPortfolio);
        setPortfolioItems(p); ls.set("portfolioItems", p);
      }
      if (servicesRes.data?.length) {
        const s = servicesRes.data.map(rowToService);
        setServices(s); ls.set("services", s);
      }
      if (packagesRes.data?.length) {
        const p = packagesRes.data.map(rowToPackage);
        setPackages(p); ls.set("packages", p);
      }
      if (bookingsRes.data?.length) {
        const b = bookingsRes.data.map(rowToBooking);
        setBookings(b); ls.set("bookings", b);
      }
      if (testimonialsRes.data?.length) {
        const t = testimonialsRes.data.map(rowToTestimonial);
        setTestimonials(t); ls.set("testimonials", t);
      }
      if (contactRes) { setContactInfo(contactRes); ls.set("contactInfo", contactRes); }
      if (paymentRes) { setPaymentSettings({ ...defaultPaymentSettings, ...paymentRes }); ls.set("paymentSettings", paymentRes); }
    } catch (e) {
      console.error("Supabase fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Update functions (write to Supabase + localStorage) ──────────────────────
  const updateTeamMembers = async (members: TeamMember[]) => {
    setTeamMembers(members); ls.set("teamMembers", members);
    await sbUpsertArray("team_members", members.map((m, i) => ({ ...m, sort_order: i })));
  };

  const updatePortfolioItems = async (items: PortfolioItem[]) => {
    setPortfolioItems(items); ls.set("portfolioItems", items);
    await sbUpsertArray("portfolio_items", items);
  };

  const updateServices = async (s: Service[]) => {
    setServices(s); ls.set("services", s);
    await sbUpsertArray("services", s.map((svc, i) => ({ ...svc, sort_order: i })));
  };

  const updatePackages = async (pkgs: Package[]) => {
    setPackages(pkgs); ls.set("packages", pkgs);
    await sbUpsertArray("packages", pkgs);
  };

  const updateContactInfo = async (info: ContactInfo) => {
    setContactInfo(info); ls.set("contactInfo", info);
    await sbSetConfig("contactInfo", info);
  };

  const updatePaymentSettings = async (settings: PaymentSettings) => {
    setPaymentSettings(settings); ls.set("paymentSettings", settings);
    await sbSetConfig("paymentSettings", settings);
  };

  const addBooking = async (booking: Booking) => {
    setBookings(prev => { const n = [booking, ...prev]; ls.set("bookings", n); return n; });
    if (supabase) await supabase.from("bookings").insert(bookingToRow(booking));
  };

  const updateBookings = async (newBookings: Booking[]) => {
    setBookings(newBookings); ls.set("bookings", newBookings);
    await sbUpsertArray("bookings", newBookings.map(bookingToRow));
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => { const n = prev.filter(b => b.id !== id); ls.set("bookings", n); return n; });
    if (supabase) await supabase.from("bookings").delete().eq("id", id);
  };

  const addTestimonial = async (t: Testimonial) => {
    setTestimonials(prev => { const n = [t, ...prev]; ls.set("testimonials", n); return n; });
    if (supabase) await supabase.from("testimonials").insert(testimonialToRow(t));
  };

  const updateTestimonials = async (t: Testimonial[]) => {
    setTestimonials(t); ls.set("testimonials", t);
    await sbUpsertArray("testimonials", t.map(testimonialToRow));
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
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
