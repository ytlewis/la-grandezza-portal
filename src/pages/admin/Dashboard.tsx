import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardHome from "@/components/admin/DashboardHome";
import BookingManagement from "@/components/admin/BookingManagement";
import CalendarView from "@/components/admin/CalendarView";
import PortfolioManagement from "@/components/admin/PortfolioManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import ContactSettings from "@/components/admin/ContactSettings";
import PackageEditor from "@/components/admin/PackageEditor";
import PaymentSettings from "@/components/admin/PaymentSettings";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";
import AdminSettings from "@/components/admin/AdminSettings";
import ServicesManagement from "@/components/admin/ServicesManagement";

export type AdminView = 
  | "dashboard" 
  | "bookings" 
  | "calendar" 
  | "portfolio" 
  | "team" 
  | "contact" 
  | "packages" 
  | "payments"
  | "testimonials"
  | "settings"
  | "services";

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardHome />;
      case "bookings":
        return <BookingManagement />;
      case "calendar":
        return <CalendarView />;
      case "portfolio":
        return <PortfolioManagement />;
      case "team":
        return <TeamManagement />;
      case "contact":
        return <ContactSettings />;
      case "packages":
        return <PackageEditor />;
      case "payments":
        return <PaymentSettings />;
      case "testimonials":
        return <TestimonialsManagement />;
      case "settings":
        return <AdminSettings />;
      case "services":
        return <ServicesManagement />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AdminLayout>
  );
};

export default AdminDashboard;
