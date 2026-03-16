export interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  package: string;
  guests: number;
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  paymentMethod?: "mpesa" | "card";
  paymentStatus: "unpaid" | "deposit_paid" | "paid";
  transactionId?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  date: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface PaymentSettings {
  mpesaPhoneNumber: string;
  mpesaPaybill: string;
  mpesaAccountNumber: string;
  mpesaDestination: "phone" | "paybill" | "till";
  stripePublicKey: string;
  stripeSecretKey: string;
  stripeAccountEmail: string;
  stripeAccountId: string;
  bankName: string;
  bankAccount: string;
  enabledMethods: {
    mpesa: boolean;
    card: boolean;
  };
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface CashflowData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  event: string;
  text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
