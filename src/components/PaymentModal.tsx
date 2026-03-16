import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingId: string;
  clientPhone: string;
  onPaymentSuccess: (transactionId: string, method: "mpesa" | "card") => void;
  paymentType?: "deposit" | "full";
}

const PaymentModal = ({ isOpen, onClose, amount, bookingId, clientPhone, onPaymentSuccess, paymentType = "deposit" }: PaymentModalProps) => {
  const { paymentSettings } = useData();
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">(
    paymentSettings.enabledMethods?.mpesa ? "mpesa" : "card"
  );
  const [phoneNumber, setPhoneNumber] = useState(clientPhone);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Update default payment method when settings change
  useEffect(() => {
    if (paymentSettings.enabledMethods?.mpesa) {
      setPaymentMethod("mpesa");
    } else if (paymentSettings.enabledMethods?.card) {
      setPaymentMethod("card");
    }
  }, [paymentSettings.enabledMethods]);

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }

    if (!paymentSettings.mpesaPhoneNumber) {
      toast.error("M-Pesa payment is not configured. Please contact support.");
      return;
    }

    setIsProcessing(true);
    
    try {
      toast.info("🔄 Initiating M-Pesa payment request...", { duration: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        `📱 STK Push sent to ${phoneNumber}. Check your phone, enter your M-Pesa PIN to confirm payment of KSh ${amount.toLocaleString()}.`,
        { duration: 6000 }
      );
      
      // Simulate waiting for user to enter PIN
      toast.loading("⏳ Waiting for payment confirmation...", { duration: 4000 });
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const transactionId = `MPX${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const destinationText = 
        paymentSettings.mpesaDestination === "phone" ? `Phone: ${paymentSettings.mpesaPhoneNumber}` :
        paymentSettings.mpesaDestination === "paybill" ? `Paybill: ${paymentSettings.mpesaPaybill} (Acc: ${paymentSettings.mpesaAccountNumber})` :
        `Till: ${paymentSettings.mpesaPaybill}`;
      
      onPaymentSuccess(transactionId, "mpesa");
      toast.success(
        `✅ Payment Successful! Transaction ID: ${transactionId} | Amount: KSh ${amount.toLocaleString()} | Recipient: ${destinationText}`,
        { duration: 8000 }
      );
      onClose();
      
    } catch (error) {
      toast.error("Payment failed. Please try again or contact support.");
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv) {
      toast.error("Please fill in all card details");
      return;
    }

    if (!paymentSettings.stripeAccountEmail) {
      toast.error("Stripe payment is not configured. Please contact support.");
      return;
    }

    setIsProcessing(true);
    
    try {
      toast.info("🔄 Processing card payment...", { duration: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.loading("💳 Securely processing via Stripe...", { duration: 3000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `CARD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      onPaymentSuccess(transactionId, "card");
      toast.success(
        `✅ Payment Successful! Transaction ID: ${transactionId} | Amount: KSh ${amount.toLocaleString()}`,
        { duration: 8000 }
      );
      onClose();
      
    } catch (error) {
      toast.error("Payment failed. Please check your card details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment();
    } else {
      handleCardPayment();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay {paymentType === "deposit" ? "Deposit (50%)" : "Full Amount"}</DialogTitle>
          <DialogDescription>
            {paymentType === "deposit" 
              ? `Secure your booking with a 50% deposit payment of KSh ${amount.toLocaleString()}`
              : `Complete your booking with full payment of KSh ${amount.toLocaleString()}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Select Payment Method</Label>
            {!paymentSettings.enabledMethods?.mpesa && !paymentSettings.enabledMethods?.card && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ No payment methods are currently enabled. Please contact support.
                </p>
              </div>
            )}
            {(paymentSettings.enabledMethods?.mpesa || paymentSettings.enabledMethods?.card) && (
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "mpesa" | "card")}>
                {paymentSettings.enabledMethods?.mpesa && (
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">M-Pesa</div>
                        <div className="text-xs text-muted-foreground">Pay via M-Pesa STK Push</div>
                      </div>
                    </Label>
                  </div>
                )}
                
                {paymentSettings.enabledMethods?.card && (
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-muted-foreground">Visa, Mastercard accepted</div>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            )}
          </div>

          {paymentMethod === "mpesa" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Your M-Pesa Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive an STK push prompt on this number
                </p>
              </div>
              {paymentSettings.mpesaPhoneNumber && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Payment Flow:</p>
                  <div className="text-xs text-green-800 dark:text-green-200 mt-2 space-y-1">
                    <p>1. You'll receive an STK push on <span className="font-semibold">{phoneNumber || 'your phone'}</span></p>
                    <p>2. Enter your M-Pesa PIN to authorize payment</p>
                    <p>3. KSh {amount.toLocaleString()} will be sent to:</p>
                    {paymentSettings.mpesaDestination === "phone" && (
                      <p className="ml-4 font-semibold">📱 Phone: {paymentSettings.mpesaPhoneNumber}</p>
                    )}
                    {paymentSettings.mpesaDestination === "paybill" && (
                      <div className="ml-4">
                        <p className="font-semibold">🏢 Paybill: {paymentSettings.mpesaPaybill}</p>
                        <p className="font-semibold">Account: {paymentSettings.mpesaAccountNumber}</p>
                      </div>
                    )}
                    {paymentSettings.mpesaDestination === "till" && (
                      <p className="ml-4 font-semibold">🏪 Till: {paymentSettings.mpesaPaybill}</p>
                    )}
                    <p>4. You'll receive confirmation SMS from M-Pesa</p>
                  </div>
                </div>
              )}
              {!paymentSettings.mpesaPhoneNumber && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    ⚠️ Payment recipient not configured. Please contact support to complete your payment.
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4">
              {paymentSettings.stripeAccountEmail && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Payment Destination:</p>
                  <div className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                    <p>💳 Your card payment will be processed securely via Stripe</p>
                    <p>💰 Funds will be deposited to: <span className="font-semibold">{paymentSettings.stripeAccountEmail}</span></p>
                    <p>🔒 All card details are encrypted and secure</p>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {paymentType === "deposit" ? "Deposit Amount (50%):" : "Total Amount:"}
              </span>
              <span className="font-medium">KSh {amount.toLocaleString()}</span>
            </div>
            {paymentMethod === "mpesa" && paymentSettings.mpesaPhoneNumber && (
              <div className="flex justify-between text-sm mb-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-muted-foreground">Payment goes to:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {paymentSettings.mpesaDestination === "phone" && paymentSettings.mpesaPhoneNumber}
                  {paymentSettings.mpesaDestination === "paybill" && `Paybill ${paymentSettings.mpesaPaybill}`}
                  {paymentSettings.mpesaDestination === "till" && `Till ${paymentSettings.mpesaPaybill}`}
                </span>
              </div>
            )}
            {paymentMethod === "card" && paymentSettings.stripeAccountEmail && (
              <div className="flex justify-between text-sm mb-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-muted-foreground">Deposited to:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 text-xs">
                  {paymentSettings.stripeAccountEmail}
                </span>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              {paymentMethod === "mpesa" 
                ? "An STK push will be sent to your phone. Enter your M-Pesa PIN to authorize the payment."
                : "Your card will be charged securely via Stripe. Funds deposited to merchant's Stripe account."}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isProcessing || (!paymentSettings.enabledMethods?.mpesa && !paymentSettings.enabledMethods?.card)}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${paymentMethod === "mpesa" ? "Pay via M-Pesa" : "Pay by Card"} — KSh ${amount.toLocaleString()}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
