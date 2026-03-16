import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PaymentSettings as PaymentSettingsType } from "@/types/admin";
import { Lock, AlertCircle, Smartphone, Building2, CreditCard } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentSettings = () => {
  const { paymentSettings, updatePaymentSettings } = useData();
  const [settings, setSettings] = useState<PaymentSettingsType>(paymentSettings);

  useEffect(() => {
    setSettings(paymentSettings);
  }, [paymentSettings]);

  const handleSave = () => {
    // Validate that at least one payment method is enabled
    if (!settings.enabledMethods?.mpesa && !settings.enabledMethods?.card) {
      toast.error("Please enable at least one payment method (M-Pesa or Card)");
      return;
    }

    // Validate M-Pesa settings if enabled
    if (settings.enabledMethods?.mpesa) {
      if (settings.mpesaDestination === "phone" && !settings.mpesaPhoneNumber) {
        toast.error("Please enter your M-Pesa phone number");
        return;
      }
      if (settings.mpesaDestination === "paybill" && (!settings.mpesaPaybill || !settings.mpesaAccountNumber)) {
        toast.error("Please enter both Paybill number and Account number");
        return;
      }
      if (settings.mpesaDestination === "till" && !settings.mpesaPaybill) {
        toast.error("Please enter your Till number");
        return;
      }
    }

    // Validate Stripe settings if enabled
    if (settings.enabledMethods?.card) {
      if (!settings.stripePublicKey || !settings.stripeSecretKey) {
        toast.error("Please enter your Stripe API keys to enable card payments");
        return;
      }
      if (!settings.stripeAccountEmail) {
        toast.error("Please enter your Stripe account email where funds will be deposited");
        return;
      }
    }

    updatePaymentSettings(settings);
    toast.success("Payment settings updated successfully! These will be used for all future transactions.");
  };

  const handleClearCache = () => {
    localStorage.removeItem("paymentSettings");
    window.location.reload();
    toast.success("Cache cleared! Page will reload with default settings.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight">Payment Settings</h2>
        <p className="text-purple-100 mt-1">Configure your payment methods for customer transactions</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These payment details will be used when customers make payments. Ensure all information is accurate and up-to-date.
          {paymentSettings.mpesaPhoneNumber && (
            <span className="block mt-2 font-semibold text-green-600 dark:text-green-400">
              ✓ Currently configured: {paymentSettings.mpesaPhoneNumber}
            </span>
          )}
          <div className="mt-2 text-sm">
            <span className="font-semibold">Enabled Methods: </span>
            {paymentSettings.enabledMethods?.mpesa && <span className="text-green-600">M-Pesa </span>}
            {paymentSettings.enabledMethods?.card && <span className="text-blue-600">Card</span>}
            {!paymentSettings.enabledMethods?.mpesa && !paymentSettings.enabledMethods?.card && (
              <span className="text-red-600">None (Please enable at least one method)</span>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Card className="shadow-md border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Lock className="h-5 w-5" />
            Payment Methods Configuration
          </CardTitle>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Choose which payment methods to enable for your customers
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
            <div className="flex-1">
              <Label htmlFor="enable-mpesa" className="text-base font-semibold cursor-pointer">
                Enable M-Pesa Payments
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Allow customers to pay via M-Pesa mobile money
              </p>
            </div>
            <Switch
              id="enable-mpesa"
              checked={settings.enabledMethods?.mpesa ?? true}
              onCheckedChange={(checked) => 
                setSettings({ 
                  ...settings, 
                  enabledMethods: { ...settings.enabledMethods, mpesa: checked } 
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/10">
            <div className="flex-1">
              <Label htmlFor="enable-card" className="text-base font-semibold cursor-pointer">
                Enable Card Payments (Stripe)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Allow customers to pay with credit/debit cards via Stripe
              </p>
            </div>
            <Switch
              id="enable-card"
              checked={settings.enabledMethods?.card ?? false}
              onCheckedChange={(checked) => 
                setSettings({ 
                  ...settings, 
                  enabledMethods: { ...settings.enabledMethods, card: checked } 
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            M-Pesa Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure where you want to receive M-Pesa payments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Payment Destination</Label>
            <RadioGroup 
              value={settings.mpesaDestination || "phone"} 
              onValueChange={(value) => setSettings({ ...settings, mpesaDestination: value as "phone" | "paybill" | "till" })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="phone" id="dest-phone" />
                <Label htmlFor="dest-phone" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Phone Number (Personal)</div>
                    <div className="text-xs text-muted-foreground">Receive payments directly to your M-Pesa phone number</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="paybill" id="dest-paybill" />
                <Label htmlFor="dest-paybill" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Paybill Number (Business)</div>
                    <div className="text-xs text-muted-foreground">Receive payments to your business Paybill account</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="till" id="dest-till" />
                <Label htmlFor="dest-till" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Till Number (Business)</div>
                    <div className="text-xs text-muted-foreground">Receive payments to your business Till number</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {settings.mpesaDestination === "phone" && (
            <div>
              <Label>Your M-Pesa Phone Number *</Label>
              <Input
                value={settings.mpesaPhoneNumber}
                onChange={(e) => setSettings({ ...settings, mpesaPhoneNumber: e.target.value })}
                placeholder="254712345678"
                type="tel"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Payments will be sent directly to this phone number
              </p>
            </div>
          )}

          {settings.mpesaDestination === "paybill" && (
            <div className="space-y-4">
              <div>
                <Label>Paybill Number *</Label>
                <Input
                  value={settings.mpesaPaybill}
                  onChange={(e) => setSettings({ ...settings, mpesaPaybill: e.target.value })}
                  placeholder="Enter your Paybill number"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your business Paybill number
                </p>
              </div>
              <div>
                <Label>Account Number *</Label>
                <Input
                  value={settings.mpesaAccountNumber}
                  onChange={(e) => setSettings({ ...settings, mpesaAccountNumber: e.target.value })}
                  placeholder="Account reference"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The account number for your Paybill
                </p>
              </div>
            </div>
          )}

          {settings.mpesaDestination === "till" && (
            <div>
              <Label>Till Number *</Label>
              <Input
                value={settings.mpesaPaybill}
                onChange={(e) => setSettings({ ...settings, mpesaPaybill: e.target.value })}
                placeholder="Enter your Till number"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your business Till number (no account number needed)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Stripe Configuration (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure Stripe for international card payments
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Stripe Account Email *</Label>
            <Input
              value={settings.stripeAccountEmail}
              onChange={(e) => setSettings({ ...settings, stripeAccountEmail: e.target.value })}
              placeholder="your-email@example.com"
              type="email"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The email address associated with your Stripe account where funds will be deposited
            </p>
          </div>
          <div>
            <Label>Stripe Account ID (Optional)</Label>
            <Input
              value={settings.stripeAccountId}
              onChange={(e) => setSettings({ ...settings, stripeAccountId: e.target.value })}
              placeholder="acct_..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your Stripe Connect account ID (if using Stripe Connect)
            </p>
          </div>
          <div>
            <Label>Publishable Key *</Label>
            <Input
              value={settings.stripePublicKey}
              onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
              placeholder="pk_live_..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your Stripe publishable API key
            </p>
          </div>
          <div>
            <Label>Secret Key *</Label>
            <Input
              type="password"
              value={settings.stripeSecretKey}
              onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
              placeholder="sk_live_..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your Stripe secret API key (kept secure)
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 Stripe payments will be deposited to your Stripe account balance, then transferred to your bank account based on your Stripe payout schedule.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Bank Account Details (For Reference)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your bank account information for manual transfers
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Bank Name</Label>
              <Input
                value={settings.bankName}
                onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={settings.bankAccount}
                onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1 md:flex-none" size="lg">
          Save Payment Settings
        </Button>
        <Button onClick={handleClearCache} variant="outline" size="lg">
          Clear Cache & Reset
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
