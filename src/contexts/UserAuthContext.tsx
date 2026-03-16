import { createContext, useContext, useState, ReactNode } from "react";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserAuthContextType {
  user: UserAccount | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

const USERS_KEY = "lg_users";
const SESSION_KEY = "lg_user_session";

// Simple deterministic hash — keeps plain-text passwords out of localStorage.
// Not a substitute for bcrypt on a real backend, but far better than plain text.
const hashPassword = (password: string, salt: string): string => {
  let hash = 0;
  const str = password + salt + "lg_salt_2024";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + salt.slice(-4);
};

interface StoredUser extends UserAccount {
  passwordHash: string;
  salt: string;
}

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const getUsers = (): StoredUser[] => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    const hash = hashPassword(password, found.salt);
    if (hash !== found.passwordHash) return false;
    const { passwordHash: _, salt: __, ...account } = found;
    setUser(account);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return true;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false;
    const salt = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newUser: StoredUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password, salt),
      salt,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { passwordHash: _, salt: __, ...account } = newUser;
    setUser(account);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
};
