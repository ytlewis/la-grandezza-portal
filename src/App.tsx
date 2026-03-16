import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { DataProvider } from "./contexts/DataContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Packages from "./pages/Packages";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserAuthProvider>
              <DataProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
                  <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />

                      {/* Public Routes */}
                      <Route path="/" element={<><Navbar /><Index /><Footer /></>} />
                      <Route path="/services" element={<><Navbar /><Services /><Footer /></>} />
                      <Route path="/packages" element={<><Navbar /><Packages /><Footer /></>} />
                      <Route path="/portfolio" element={<><Navbar /><Portfolio /><Footer /></>} />
                      <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
                      <Route path="/book" element={<><Navbar /><Book /><Footer /></>} />
                      <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </DataProvider>
            </UserAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
