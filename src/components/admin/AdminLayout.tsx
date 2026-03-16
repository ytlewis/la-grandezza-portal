import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Image, 
  Users, 
  CreditCard, 
  Phone, 
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  MessageSquare,
  Settings
} from "lucide-react";
import { AdminView } from "@/pages/admin/Dashboard";
import { useState, ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminLayout = ({ children, currentView, onViewChange }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { testimonials, bookings } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentAdmin } = useAuth();

  const pendingTestimonials = testimonials.filter(t => t.status === "pending").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  const menuItems = [
    { id: "dashboard" as AdminView, label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings" as AdminView, label: "Bookings", icon: Package },
    { id: "calendar" as AdminView, label: "Calendar", icon: Calendar },
    { id: "portfolio" as AdminView, label: "Portfolio", icon: Image },
    { id: "team" as AdminView, label: "Team", icon: Users },
    { id: "packages" as AdminView, label: "Packages", icon: Package },
    { id: "testimonials" as AdminView, label: "Testimonials", icon: MessageSquare },
    { id: "contact" as AdminView, label: "Contact Info", icon: Phone },
    { id: "payments" as AdminView, label: "Payment Settings", icon: CreditCard },
    { id: "settings" as AdminView, label: "Admin Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">La Grandezza Events</p>
            {currentAdmin && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                {currentAdmin.name}
              </p>
            )}
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const badge = item.id === "testimonials" ? pendingTestimonials : item.id === "bookings" ? pendingBookings : 0;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      currentView === item.id 
                        ? "bg-purple-600 text-white hover:bg-purple-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      onViewChange(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
