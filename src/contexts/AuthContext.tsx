import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "super" | "admin";
  createdAt: string;
}

export interface AdminSettings {
  siteName: string;
  siteTagline: string;
  maintenanceMode: boolean;
  allowUserRegistration: boolean;
  requireTestimonialApproval: boolean;
  bookingNotificationEmail: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentAdmin: AdminAccount | null;
  adminSettings: AdminSettings;
  hasAdmins: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  changePassword: (current: string, next: string) => boolean;
  updateAdminSettings: (s: AdminSettings) => void;
  addAdmin: (name: string, email: string, password: string) => boolean;
  removeAdmin: (id: string) => boolean;
  getAdmins: () => AdminAccount[];
}

// ── Storage keys ───────────────────────────────────────────────────────────────
const ADMINS_KEY = "lg_admins";
const SESSION_KEY = "lg_admin_session";
const SETTINGS_KEY = "lg_admin_settings";

// ── Helpers ────────────────────────────────────────────────────────────────────
const hashPw = (password: string, salt: string): string => {
  let h = 0;
  const s = password + salt + "lg_admin_2024";
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36) + salt.slice(-6);
};

interface StoredAdmin extends AdminAccount {
  passwordHash: string;
  salt: string;
}

const loadAdmins = (): StoredAdmin[] => {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveAdmins = (admins: StoredAdmin[]) => {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
};

// ── Defaults ───────────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: AdminSettings = {
  siteName: "La Grandezza Events",
  siteTagline: "Where moments become masterpieces",
  maintenanceMode: false,
  allowUserRegistration: true,
  requireTestimonialApproval: true,
  bookingNotificationEmail: "",
};

// ── Context ────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const isAuthenticated = currentAdmin !== null;
  const hasAdmins = loadAdmins().length > 0;

  const login = (email: string, password: string): boolean => {
    const admins = loadAdmins();
    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    if (hashPw(password, found.salt) !== found.passwordHash) return false;
    const { passwordHash: _, salt: __, ...account } = found;
    setCurrentAdmin(account);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return true;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const admins = loadAdmins();
    if (admins.find(a => a.email.toLowerCase() === email.toLowerCase())) return false;
    const salt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newAdmin: StoredAdmin = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: admins.length === 0 ? "super" : "admin", // first signup = super admin
      passwordHash: hashPw(password, salt),
      salt,
      createdAt: new Date().toISOString(),
    };
    saveAdmins([...admins, newAdmin]);
    const { passwordHash: _, salt: __, ...account } = newAdmin;
    setCurrentAdmin(account);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return true;
  };

  const logout = () => {
    setCurrentAdmin(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const changePassword = (current: string, next: string): boolean => {
    if (!currentAdmin) return false;
    const admins = loadAdmins();
    const found = admins.find(a => a.id === currentAdmin.id);
    if (!found) return false;
    if (hashPw(current, found.salt) !== found.passwordHash) return false;
    const newSalt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const updated = admins.map(a =>
      a.id === currentAdmin.id
        ? { ...a, passwordHash: hashPw(next, newSalt), salt: newSalt }
        : a
    );
    saveAdmins(updated);
    return true;
  };

  const updateAdminSettings = (s: AdminSettings) => {
    setAdminSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  const addAdmin = (name: string, email: string, password: string): boolean => {
    const admins = loadAdmins();
    if (admins.find(a => a.email.toLowerCase() === email.toLowerCase())) return false;
    const salt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newAdmin: StoredAdmin = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "admin",
      passwordHash: hashPw(password, salt),
      salt,
      createdAt: new Date().toISOString(),
    };
    saveAdmins([...admins, newAdmin]);
    return true;
  };

  const removeAdmin = (id: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    if (id === currentAdmin.id) return false; // can't remove yourself
    const admins = loadAdmins();
    saveAdmins(admins.filter(a => a.id !== id));
    return true;
  };

  const getAdmins = (): AdminAccount[] => {
    return loadAdmins().map(({ passwordHash: _, salt: __, ...a }) => a);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, currentAdmin, adminSettings, hasAdmins,
      login, signup, logout, changePassword,
      updateAdminSettings, addAdmin, removeAdmin, getAdmins,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
