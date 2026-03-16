import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useAuth } from "@/contexts/AuthContext";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UserAuthModal = ({ isOpen, onClose, onSuccess }: UserAuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup } = useUserAuth();
  const { adminSettings } = useAuth();
  const canRegister = adminSettings.allowUserRegistration;

  const reset = () => {
    setName(""); setEmail(""); setPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      if (login(email, password)) {
        toast.success("Welcome back!");
        reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error("Invalid email or password.");
      }
    } else {
      if (!name.trim()) { toast.error("Please enter your name."); return; }
      const ok = signup(name, email, password);
      if (ok) {
        toast.success("Account created! Welcome.");
        reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error("An account with this email already exists.");
      }
    }
  };

  const inputClass = "w-full border border-gray-300 dark:border-gold/20 bg-white dark:bg-transparent px-4 py-2.5 text-gray-900 dark:text-cream text-sm focus:border-gold outline-none transition-colors rounded";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {mode === "signup" && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50">Full Name</Label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className={`${inputClass} mt-1`}
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <Label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50">Email</Label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`${inputClass} mt-1`}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-gray-500 dark:text-cream/50">Password</Label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${inputClass} mt-1`}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black-deep font-semibold tracking-widest uppercase text-sm">
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-cream/50 mt-2">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          {mode === "login" && !canRegister ? (
            <span className="text-gray-400 text-xs">(Registration currently disabled)</span>
          ) : (
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); reset(); }}
              className="text-gold hover:underline font-medium"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default UserAuthModal;
