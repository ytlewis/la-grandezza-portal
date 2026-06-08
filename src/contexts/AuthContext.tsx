import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, deleteDoc, collection, getDocs, query, limit,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────
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
  firebaseReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<boolean>;
  updateAdminSettings: (s: AdminSettings) => void;
  addAdmin: (name: string, email: string, password: string) => Promise<boolean>;
  removeAdmin: (id: string) => Promise<boolean>;
  getAdmins: () => AdminAccount[];
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const SETTINGS_KEY = "lg_admin_settings";

const DEFAULT_SETTINGS: AdminSettings = {
  siteName: "La Grandezza Events",
  siteTagline: "Where moments become masterpieces",
  maintenanceMode: false,
  allowUserRegistration: true,
  requireTestimonialApproval: true,
  bookingNotificationEmail: "",
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [hasAdmins, setHasAdmins] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // ── On mount: listen to Firebase Auth state ───────────────────────────────
  useEffect(() => {
    if (!auth || !db) {
      setFirebaseReady(true);
      return;
    }

    // Check if any admins exist in Firestore (for login vs signup decision)
    const checkAdmins = async () => {
      try {
        const snap = await getDocs(query(collection(db!, "admins"), limit(1)));
        setHasAdmins(!snap.empty);
      } catch {
        setHasAdmins(false);
      }
    };

    checkAdmins();

    const unsub = onAuthStateChanged(auth!, async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Load admin profile from Firestore
        try {
          const snap = await getDoc(doc(db!, "admins", user.uid));
          if (snap.exists()) {
            const profile = { id: snap.id, ...snap.data() } as AdminAccount;
            setCurrentAdmin(profile);
            // Refresh full admins list
            await refreshAdmins();
          } else {
            // Firebase Auth user exists but no Firestore profile — sign them out
            await signOut(auth!);
            setCurrentAdmin(null);
          }
        } catch {
          setCurrentAdmin(null);
        }
      } else {
        setCurrentAdmin(null);
      }

      setFirebaseReady(true);
    });

    return () => unsub();
  }, []);

  const refreshAdmins = async () => {
    if (!db) return;
    try {
      const snap = await getDocs(collection(db, "admins"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAccount));
      setAdmins(list);
      setHasAdmins(list.length > 0);
    } catch {
      // ignore
    }
  };

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!auth || !db) return false;
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Verify Firestore profile exists
      const snap = await getDoc(doc(db, "admins", cred.user.uid));
      if (!snap.exists()) {
        // Auth account exists but no admin profile — deny access
        await signOut(auth);
        return false;
      }
      const profile = { id: snap.id, ...snap.data() } as AdminAccount;
      setCurrentAdmin(profile);
      await refreshAdmins();
      return true;
    } catch (e: unknown) {
      console.error("[Auth] login error:", e);
      return false;
    }
  };

  // ── signup ────────────────────────────────────────────────────────────────
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!auth || !db) return false;
    try {
      // Determine role: first admin is super
      const snap = await getDocs(query(collection(db, "admins"), limit(1)));
      const role: "super" | "admin" = snap.empty ? "super" : "admin";

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: AdminAccount = {
        id: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "admins", cred.user.uid), profile);
      setCurrentAdmin(profile);
      await refreshAdmins();
      return true;
    } catch (e: unknown) {
      console.error("[Auth] signup error:", e);
      return false;
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (e) {
      console.error("[Auth] logout error:", e);
    }
    setCurrentAdmin(null);
    setFirebaseUser(null);
  };

  // ── changePassword ────────────────────────────────────────────────────────
  const changePassword = async (current: string, next: string): Promise<boolean> => {
    if (!auth?.currentUser || !firebaseUser) return false;
    try {
      const cred = EmailAuthProvider.credential(firebaseUser.email!, current);
      await reauthenticateWithCredential(firebaseUser, cred);
      await updatePassword(firebaseUser, next);
      return true;
    } catch (e) {
      console.error("[Auth] changePassword error:", e);
      return false;
    }
  };

  // ── updateAdminSettings ───────────────────────────────────────────────────
  const updateAdminSettings = (s: AdminSettings) => {
    setAdminSettings(s);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
  };

  // ── addAdmin ──────────────────────────────────────────────────────────────
  const addAdmin = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!auth || !db) return false;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: AdminAccount = {
        id: cred.user.uid,
        name,
        email,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "admins", cred.user.uid), profile);
      await refreshAdmins();
      return true;
    } catch (e: unknown) {
      console.error("[Auth] addAdmin error:", e);
      return false;
    }
  };

  // ── removeAdmin ───────────────────────────────────────────────────────────
  const removeAdmin = async (id: string): Promise<boolean> => {
    if (!db) return false;
    // Cannot remove yourself or a super admin
    if (id === currentAdmin?.id) return false;
    try {
      await deleteDoc(doc(db, "admins", id));
      await refreshAdmins();
      return true;
    } catch (e) {
      console.error("[Auth] removeAdmin error:", e);
      return false;
    }
  };

  const getAdmins = () => admins;

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!currentAdmin && !!firebaseUser,
      currentAdmin,
      adminSettings,
      hasAdmins,
      firebaseReady,
      login,
      signup,
      logout,
      changePassword,
      updateAdminSettings,
      addAdmin,
      removeAdmin,
      getAdmins,
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
