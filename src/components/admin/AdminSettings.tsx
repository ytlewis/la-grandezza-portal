import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Settings, Eye, EyeOff, UserPlus, Trash2, Crown, Shield } from "lucide-react";

const AdminSettings = () => {
  const { changePassword, adminSettings, updateAdminSettings, currentAdmin, addAdmin, removeAdmin, getAdmins } = useAuth();

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Site settings
  const [settings, setSettings] = useState({ ...adminSettings });

  // Add admin
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPw, setNewAdminPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  const admins = getAdmins();
  const isSuperAdmin = currentAdmin?.role === "super";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { toast.error("Passwords do not match."); return; }
    const ok = await changePassword(currentPw, newPw);
    if (ok) {
      toast.success("Password updated successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      toast.error("Current password is incorrect.");
    }
  };

  const handleSaveSettings = () => {
    updateAdminSettings(settings);
    toast.success("Settings saved.");
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPw.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    const ok = await addAdmin(newName, newEmail, newAdminPw);
    if (ok) {
      toast.success(`Admin account created for ${newName}.`);
      setNewName(""); setNewEmail(""); setNewAdminPw("");
    } else {
      toast.error("An account with this email already exists.");
    }
  };

  const handleRemove = async (id: string, name: string) => {
    const ok = await removeAdmin(id);
    if (ok) toast.success(`${name} removed.`);
    else toast.error("Cannot remove this admin.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">Admin Settings</h2>
        <p className="text-gray-300 mt-1 text-sm">Manage accounts, password, and site preferences</p>
      </div>

      {/* ── Admin Accounts ─────────────────────────────────────────────── */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Shield className="h-5 w-5 text-purple-600" />
            Admin Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current admins list */}
          <div className="space-y-2">
            {admins.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{a.name}</p>
                    <Badge variant="outline" className={`text-xs shrink-0 ${a.role === "super" ? "border-amber-400 text-amber-600" : "border-purple-400 text-purple-600"}`}>
                      {a.role === "super" ? <><Crown size={10} className="mr-1" />Super Admin</> : <><Shield size={10} className="mr-1" />Admin</>}
                    </Badge>
                    {a.id === currentAdmin?.id && (
                      <Badge variant="secondary" className="text-xs shrink-0">You</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                </div>
                {isSuperAdmin && a.id !== currentAdmin?.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => handleRemove(a.id, a.name)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add new admin — super admin only */}
          {isSuperAdmin && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <UserPlus size={15} className="text-purple-600" /> Add New Admin
              </p>
              <form onSubmit={handleAddAdmin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Doe" required className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="jane@example.com" required className="h-9" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Temporary Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPw ? "text" : "password"}
                      value={newAdminPw}
                      onChange={e => setNewAdminPw(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="h-9 pr-9"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-2.5 top-2 text-gray-400">
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  <UserPlus size={14} className="mr-1.5" /> Add Admin
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Change Password ────────────────────────────────────────────── */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Lock className="h-5 w-5 text-purple-600" />
            Change Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-1">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)} required className="h-10 pr-10" placeholder="Current password" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-gray-400">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} required className="h-10 pr-10" placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-gray-400">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required className="h-10" placeholder="Repeat new password" />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Site Settings ──────────────────────────────────────────────── */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Settings className="h-5 w-5 text-purple-600" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Site Name</Label>
              <Input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="h-10" />
            </div>
            <div className="space-y-1">
              <Label>Site Tagline</Label>
              <Input value={settings.siteTagline} onChange={e => setSettings({ ...settings, siteTagline: e.target.value })} className="h-10" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Booking Notification Email</Label>
              <Input type="email" value={settings.bookingNotificationEmail} onChange={e => setSettings({ ...settings, bookingNotificationEmail: e.target.value })} className="h-10" placeholder="admin@yourdomain.com" />
              <p className="text-xs text-muted-foreground">New booking alerts will be sent here.</p>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Feature Toggles</h4>
            {[
              { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Show a maintenance page to visitors" },
              { key: "allowUserRegistration" as const, label: "Allow User Registration", desc: "Let visitors create accounts to leave reviews" },
              { key: "requireTestimonialApproval" as const, label: "Require Testimonial Approval", desc: "New reviews must be approved before appearing publicly" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b last:border-0 gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch checked={settings[key]} onCheckedChange={v => setSettings({ ...settings, [key]: v })} className="shrink-0" />
              </div>
            ))}
          </div>

          <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
