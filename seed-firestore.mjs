// Seeds default data into Firestore so all devices see it immediately
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCe_le_LySEEU7X6Qk4Wt4q0rXyvPUPc0",
  authDomain: "la-grandezza.firebaseapp.com",
  projectId: "la-grandezza",
  storageBucket: "la-grandezza.firebasestorage.app",
  messagingSenderId: "497136272235",
  appId: "1:497136272235:web:08761f5f23098cd65b022e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCollection(colName, items) {
  const batch = writeBatch(db);
  items.forEach(item => batch.set(doc(db, colName, item.id), item));
  await batch.commit();
  console.log(`✅ Seeded ${items.length} docs into "${colName}"`);
}

const teamMembers = [
  { id: "1", name: "Amara Njeri", role: "Lead Wedding Planner", image: "/assets/team-1.jpg", bio: "With over 8 years creating dream weddings, Amara brings passion and precision to every celebration." },
  { id: "2", name: "David Ochieng", role: "Corporate Events Director", image: "/assets/team-2.jpg", bio: "David orchestrates world-class corporate galas and conferences with strategic excellence." },
  { id: "3", name: "Grace Wambui", role: "Creative Director", image: "/assets/team-3.jpg", bio: "Grace transforms spaces into breathtaking environments with her eye for design and detail." },
  { id: "4", name: "James Kamau", role: "Operations Manager", image: "/assets/team-4.jpg", bio: "James ensures every event runs flawlessly from logistics to the final farewell." },
  { id: "5", name: "Faith Muthoni", role: "Client Relations Manager", image: "/assets/team-5.jpg", bio: "Faith ensures every client feels heard, valued, and delighted throughout their journey." },
];

const portfolioItems = [
  { id: "1", title: "The Anderson Wedding", category: "Wedding", image: "/assets/portfolio-wedding.jpg", description: "A sunset garden ceremony with 200 guests", date: "2026-01-15" },
  { id: "2", title: "Annual Executive Gala", category: "Corporate", image: "/assets/portfolio-corporate.jpg", description: "Black-tie corporate gala for 500 attendees", date: "2026-02-20" },
  { id: "3", title: "Golden 50th Birthday", category: "Birthday", image: "/assets/portfolio-birthday.jpg", description: "A milestone celebration with gold-themed décor", date: "2026-03-10" },
  { id: "4", title: "Champagne Soirée", category: "Social", image: "/assets/portfolio-social.jpg", description: "An intimate cocktail gathering for 80 guests", date: "2026-03-25" },
];

const services = [
  { id: "1", title: "Weddings", icon: "Heart", image: "/assets/portfolio-wedding.jpg", description: "From intimate ceremonies to grand celebrations, we craft your love story with meticulous attention to every detail.", features: ["Venue Scouting", "Floral Design", "Catering Coordination", "Entertainment Booking", "Day-of Coordination"] },
  { id: "2", title: "Corporate Events", icon: "Building2", image: "/assets/portfolio-corporate.jpg", description: "Elevate your brand with sophisticated corporate gatherings. We handle conferences, product launches, and executive galas.", features: ["Conference Planning", "Brand Activation", "AV & Production", "Catering & Hospitality", "Post-Event Reports"] },
  { id: "3", title: "Galas & Balls", icon: "PartyPopper", image: "/assets/hero-event.jpg", description: "Grand, opulent affairs that command attention. Our galas feature stunning décor and world-class entertainment.", features: ["Theme Development", "Luxury Décor", "Live Entertainment", "VIP Management", "Red Carpet Setup"] },
  { id: "4", title: "Social Gatherings", icon: "Users", image: "/assets/portfolio-social.jpg", description: "Sophisticated cocktail parties, anniversary celebrations, and exclusive dinners.", features: ["Menu Curation", "Ambient Design", "Guest List Management", "Custom Invitations", "Photography"] },
  { id: "5", title: "Birthday Parties", icon: "Cake", image: "/assets/portfolio-birthday.jpg", description: "Milestone birthdays deserve extraordinary celebrations.", features: ["Theme Design", "Custom Cakes", "Entertainment", "Party Favors", "Photo & Video"] },
  { id: "6", title: "Bespoke Events", icon: "Sparkles", image: "/assets/portfolio-social.jpg", description: "When your vision doesn't fit a category, we create something entirely new.", features: ["Concept Development", "Custom Design", "Full Production", "Concierge Service", "Legacy Documentation"] },
];

const packages = [
  { id: "1", name: "Premium", price: 25000, description: "Perfect for intimate gatherings", features: ["Up to 50 guests", "Basic decoration", "4-hour event", "Standard catering"] },
  { id: "2", name: "Elegance", price: 45000, description: "Ideal for medium-sized events", features: ["Up to 100 guests", "Enhanced decoration", "6-hour event", "Premium catering", "Photography"] },
  { id: "3", name: "Prestige", price: 75000, description: "For grand celebrations", features: ["Up to 200 guests", "Luxury decoration", "8-hour event", "Gourmet catering", "Photography & Videography"] },
  { id: "4", name: "GRANDEZZA", price: 150000, description: "The ultimate luxury experience", features: ["500+ guests", "Full production design", "Multi-day event", "All-inclusive elite service", "Full cinematography"] },
];

const testimonials = [
  { id: "static-1", userId: "static", userName: "Margaret & Peter", userEmail: "", event: "Wedding", text: "La Grandezza transformed our wedding into a fairy tale. Every detail was perfect — from the flowers to the lighting.", rating: 5, status: "approved", createdAt: "2026-01-15T00:00:00.000Z" },
  { id: "static-2", userId: "static", userName: "Safaricom Ltd.", userEmail: "", event: "Corporate Gala", text: "Professionalism at its finest. Our annual gala was executed flawlessly, and our guests were thoroughly impressed.", rating: 5, status: "approved", createdAt: "2026-02-20T00:00:00.000Z" },
  { id: "static-3", userId: "static", userName: "Angela Wanjiku", userEmail: "", event: "Birthday Celebration", text: "My 40th birthday was absolutely magical! The team went above and beyond to make me feel like royalty.", rating: 5, status: "approved", createdAt: "2026-03-10T00:00:00.000Z" },
];

try {
  await seedCollection("teamMembers", teamMembers);
  await seedCollection("portfolioItems", portfolioItems);
  await seedCollection("services", services);
  await seedCollection("packages", packages);
  await seedCollection("testimonials", testimonials);
  await setDoc(doc(db, "config", "contactInfo"), { phone: "", email: "", address: "Nairobi, Kenya", facebook: "", instagram: "", twitter: "", tiktok: "" });
  console.log("✅ Seeded config/contactInfo");
  console.log("\n🎉 Firestore seeded successfully! All devices will now sync.");
} catch (e) {
  console.error("❌ Seed failed:", e.message);
}
process.exit(0);
