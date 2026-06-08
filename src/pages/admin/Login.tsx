import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, UserPlus, LogIn, Crown, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { configured } from "@/lib/firebase";

const logo = "/assets/logo.jfif";

const AdminLogin = () => {
  const { login, signup, hasAdmins, firebaseReady } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup" | "loading">("loading");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Wait for Firebase to resolve hasAdmins before deciding which form to show
  useEffect(() => {
    if (firebaseReady) {
      setMode(hasAdmins ? "login" : "signup");
    }
  }, [firebaseReady, hasAdmins]);

  const isFirstRun = !hasAdmins;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) { toast.error("Please enter your name."); return; }
        if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
        if (password !== confirm) { toast.error("Passwords do not match."); return; }
        const ok = await signup(name, email, password);
        if (ok) {
          toast.success(isFirstRun ? "Account created! Welcome, Super Admin." : "Account created!");
          navigate("/admin/dashboard");
        } else {
          toast.error("Signup failed. Check your details and try again.");
        }
      } else {
        const ok = await login(email, password);
        if (ok) {
          toast.success("Welcome back!");
          navigate("/admin/dashboard");
        } else {
          toast.error("Invalid email or password.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black-deep">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black-deep px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-3">
              <img src={logo} alt="La Grandezza" className="w-16 h-16 rounded-full object-cover shadow-lg" />
              <span className="font-heading text-xl tracking-wider gold-text-gradient">La Grandezza</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Firebase Not Configured</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                The admin dashboard is not available because Firebase environment variables are not set. 
              </p>
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-left">
                <p className="text-xs text-amber-900 dark:text-amber-100 font-mono">
                  Missing env vars: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                If this is a Vercel deployment, configure environment variables in your project settings and redeploy.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link to="/" className="hover:text-gold transition-colors">← Back to website</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black-deep px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <img src={logo} alt="La Grandezza" className="w-16 h-16 rounded-full object-cover shadow-lg" />
            <span className="font-heading text-xl tracking-wider gold-text-gradient">La Grandezza</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === "signup" ? <UserPlus className="h-6 w-6 text-purple-600" /> : <Lock className="h-6 w-6 text-purple-600" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "signup" ? (isFirstRun ? "Create Super Admin Account" : "Create Admin Account") : "Admin Login"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === "signup"
                ? isFirstRun ? "Set up your admin account to manage La Grandezza Events" : "Create a new admin account"
                : "Sign in to access the dashboard"}
            </p>
            {isFirstRun && mode === "signup" && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                <Crown size={14} />
                First account becomes Super Admin
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Lewis Mwangi" value={name} onChange={e => setName(e.target.value)} required className="h-11" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="admin@lagrandezza.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="h-11" />
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium">
              {submitting ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Please wait...</>
              ) : mode === "signup" ? (
                <><UserPlus size={16} className="mr-2" /> Create Account</>
              ) : (
                <><LogIn size={16} className="mr-2" /> Sign In</>
              )}
            </Button>
          </form>

          {hasAdmins && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              {mode === "login" ? (
                <>Need to add an admin?{" "}<button onClick={() => setMode("signup")} className="text-purple-600 hover:underline font-medium">Create account</button></>
              ) : (
                <>Already have an account?{" "}<button onClick={() => setMode("login")} className="text-purple-600 hover:underline font-medium">Sign in</button></>
              )}
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/" className="hover:text-gold transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
