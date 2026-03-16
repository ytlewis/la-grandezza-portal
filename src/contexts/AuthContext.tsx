import { createContext, useContext, useState, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<boolean>;
  updateAdminSettings: (s: AdminSettings) => void;
  addAdmin: (name: string, email: string, password: string) => Promise<boolean>;
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
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h).toString(36) + salt.slice(-6);
};

interface StoredAdmin extends AdminAccount { passwordHash: string; salt: string; }

const loadAdmins = (): StoredAdmin[] => {
  try { const r = localStorage.getItem(ADMINS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
};
const saveAdmins = (a: StoredAdmin[]) => localStorage.setItem(ADMINS_KEY, JSON.stringify(a));

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
    try { const s = sessionStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try { const s = localStorage.getItem(SETTINGS_KEY); return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS; } catch { return DEFAULT_SETTINGS; }
  });

  const isAuthenticated = currentAdmin !== null;
  const hasAdmins = loadAdmins().length > 0;

  // Sign into both local store AND Firebase Auth
  const login = async (email: string, password: string): Promise<boolean> => {
    const admins = loadAdmins();
    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    if (hashPw(password, found.salt) !== found.passwordHash) return false;

    // Also sign into Firebase Auth so Firestore rules pass
    if (auth) {
      try { await signInWithEmailAndPassword(auth, email, password); }
      catch { /* Firebase Auth user may not exist yet — create it */ 
        try { await createUserWithEmailAndPassword(auth, email, password); } catch { /* already exists or other error */ }
      }
    }

    const { passwordHash: _, salt: __, ...account } = found;
    setCurrentAdmin(account);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const admins = loadAdmins();
    if (admins.find(a => a.email.toLowerCase() === email.toLowerCase())) return false;

    // Create Firebase Auth user
    if (auth) {
      try { await createUserWithEmailAndPassword(auth, email, password); }
      catch (e: unknown) {
        const code = (e as { code?: string }).code;
        if (code !== "auth/email-already-in-use") return false;
        // Already exists in Firebase — sign in instead
        try { await signInWithEmailAndPassword(auth, email, password); } catch { return false; }
      }
    }

    const salt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newAdmin: StoredAdmin = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: admins.length === 0 ? "super" : "admin",
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

  const logout = async (): Promise<void> => {
    if (auth) try { await signOut(auth); } catch { /* ignore */ }
    setCurrentAdmin(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const changePassword = async (current: string, next: string): Promise<boolean> => {
    if (!currentAdmin) return false;
    const admins = loadAdmins();
    const found = admins.find(a => a.id === currentAdmin.id);
    if (!found) return false;
    if (hashPw(current, found.salt) !== found.passwordHash) return false;

    // Update Firebase Auth password
    if (auth?.currentUser) {
      try {
        const cred = EmailAuthProvider.credential(currentAdmin.email, current);
        await reauthenticateWithCredential(auth.currentUser, cred);
        await updatePassword(auth.currentUser, next);
      } catch { return false; }
    }

    const newSalt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    saveAdmins(admins.map(a => a.id === currentAdmin.id ? { ...a, passwordHash: hashPw(next, newSalt), salt: newSalt } : a));
    return true;
  };

  const updateAdminSettings = (s: AdminSettings) => {
    setAdminSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  const addAdmin = async (name: string, email: string, password: string): Promise<boolean> => {
    const admins = loadAdmins();
    if (admins.find(a => a.email.toLowerCase() === email.toLowerCase())) return false;

    // Create Firebase Auth account for the new admin
    if (auth) {
      try { await createUserWithEmailAndPassword(auth, email, password); }
      catch (e: unknown) {
        const code = (e as { code?: string }).code;
        if (code !== "auth/email-already-in-use") return false;
      }
    }

    const salt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    saveAdmins([...admins, {
      id: Date.now().toString(), name: name.trim(),
      email: email.toLowerCase().trim(), role: "admin",
      passwordHash: hashPw(password, salt), salt,
      createdAt: new Date().toISOString(),
    }]);
    return true;
  };

  const removeAdmin = (id: string): boolean => {
    if (!currentAdmin || currentAdmin.role !== "super") return false;
    if (id === currentAdmin.id) return false;
    saveAdmins(loadAdmins().filter(a => a.id !== id));
    return true;
  };

  const getAdmins = (): AdminAccount[] =>
    loadAdmins().map(({ passwordHash: _, salt: __, ...a }) => a);

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
