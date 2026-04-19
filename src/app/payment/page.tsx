"use client";

import {
  Clock,
  Ticket,
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  Globe,
  HelpCircle,
  MessageCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { eventsApi } from "@/api/events";
import { paymentApi } from "@/api/payment";
import { authService } from "@/api/auth";
import { userApi } from "@/api/user";
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { useToast } from "@/context/ToastContext";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { error } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [ticketDetails, setTicketDetails] = useState<any[]>([]);
  const [guestDetails, setGuestDetails] = useState({ name: "", email: "" });
  const [user, setUser] = useState<any>(null);
  const [publicSettings, setPublicSettings] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        try {
          const res = await userApi.getUser();
          setUser(res);
        } catch (err) {
          console.error("Failed to fetch fresh user data", err);
          setUser(currentUser); // Fallback
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await eventsApi.getPublicSettings();
        setPublicSettings(settings);
      } catch (err) {
        console.error("Failed to fetch public settings", err);
      }
    };
    fetchSettings();
  }, []);

  const eventSlug = searchParams.get("event");
  const ticketsParam = searchParams.get("tickets");

  useEffect(() => {
    if (!eventSlug || !ticketsParam) {
      router.push("/events");
      setLoading(false);
      return;
    }

    try {
      const counts = JSON.parse(decodeURIComponent(ticketsParam));
      setTicketCounts(counts);

      const fetchEvent = async () => {
        try {
          const data = await eventsApi.getBySlug(eventSlug);
          setEvent(data);

          // Filter selected tickets
          if (data.tickets) {
            const selected = data.tickets.filter(
              (t: any) => counts[t.id] && counts[t.id] > 0,
            );
            setTicketDetails(selected);
          }
        } catch (error) {
          console.error("Failed to fetch event", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    } catch (e) {
      console.error("Error parsing tickets", e);
      setLoading(false);
    }
  }, [eventSlug, ticketsParam]);

  // Calculations
  const subtotal = ticketDetails.reduce((acc, ticket) => {
    return acc + ticket.price * (ticketCounts[ticket.id] || 0);
  }, 0);

  const serviceFee = subtotal * 0.05; // 5% fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + serviceFee + tax;

  const finalTotal = total;
  const wallet =
    user?.wallets?.find((w: any) => w.label == "Main Wallet") ||
    user?.wallets?.[0];
  const walletBalance = wallet?.balance || 0;
  const walletSufficient = walletBalance >= finalTotal;

  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setProcessing(true);

    try {
      const data = await paymentApi.initCheckout({
        event_slug: eventSlug,
        tickets: ticketCounts,
        guest_name: !user ? guestDetails.name : undefined,
        guest_email: !user ? guestDetails.email : undefined,
        payment_method: selectedMethod,
      });

      if (data.redirect_url) {
        router.push(data.redirect_url);
      } else {
        router.push("/dashboard/tickets");
      }
    } catch (err: any) {
      console.error("Payment failed", err);
      error(err.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-xl font-bold mb-4">Invalid Request</h1>
        <Link href="/events" className="text-primary hover:underline">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors">
      <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Payment Details
          </h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1.5 text-primary" />
            Estimated time to complete: 2-3 minutes
          </div>
        </div>

        {/* Guest Details Form (Mobile/Desktop) */}
        {!user && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-foreground mb-6">
              Guest Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestDetails.name}
                  onChange={(e) =>
                    setGuestDetails({ ...guestDetails, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) =>
                    setGuestDetails({ ...guestDetails, email: e.target.value })
                  }
                  placeholder="e.g. john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* Ticket Summary Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Ticket Summary
                </h2>
                <p className="text-xs text-muted-foreground">Order #PENDING</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-0.5">
                  {new Date(event.start_date).toLocaleDateString()} •{" "}
                  {new Date(event.start_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.location || "Online"}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary">
                <Ticket className="w-6 h-6" />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pb-6 border-b border-border">
              {ticketDetails.length > 0 ? (
                ticketDetails.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {ticket.title} (x{ticketCounts[ticket.id]})
                    </span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(ticket.price * ticketCounts[ticket.id])}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-destructive">
                  No tickets selected
                </div>
              )}
            </div>

            {/* Costs */}
            <div className="space-y-2 py-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee (5%)</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(tax)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-xl text-primary">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Choose Payment Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Paystack */}
            {(!publicSettings || publicSettings.payment_paystack_enabled) && (
              <button
                onClick={() => setSelectedMethod("paystack")}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "paystack" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">Paystack</span>
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Credit/Debit Card, Bank Transfer
                </p>
              </button>
            )}

            {/* Flutterwave */}
            {(!publicSettings || publicSettings.payment_flutterwave_enabled) && (
              <button
                onClick={() => setSelectedMethod("flutterwave")}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "flutterwave" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">Flutterwave</span>
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Card, USSD, QR Code
                </p>
              </button>
            )}

            {/* Korapay */}
            {(!publicSettings || publicSettings.payment_korapay_enabled) && (
              <button
                onClick={() => setSelectedMethod("korapay")}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "korapay" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">Korapay</span>
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Card, Bank Transfer
                </p>
              </button>
            )}

            {/* Monnify */}
            {(!publicSettings || publicSettings.payment_monnify_enabled) && (
              <button
                onClick={() => setSelectedMethod("monnify")}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "monnify" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">Monnify</span>
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Account Transfer, Card
                </p>
              </button>
            )}

            {/* Opay */}
            {(!publicSettings || publicSettings.payment_opay_enabled) && (
              <button
                onClick={() => setSelectedMethod("opay")}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "opay" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">Opay Cashier</span>
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Opay Wallet, Card
                </p>
              </button>
            )}

            {/* Wallet Payment */}
            {user && (
              <button
                onClick={() => setSelectedMethod("wallet")}
                disabled={!walletSufficient}
                className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === "wallet" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-accent"} ${!walletSufficient ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-foreground">My Wallet</span>
                  <Wallet className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Pay with your wallet balance
                </p>
                <p
                  className={`text-sm font-bold ${walletSufficient ? "text-emerald-600" : "text-destructive"}`}
                >
                  Balance: {formatCurrency(walletBalance)}
                </p>
                {!walletSufficient && (
                  <p className="text-[10px] text-destructive mt-1">
                    Insufficient funds
                  </p>
                )}
              </button>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={
              !selectedMethod ||
              (!user && (!guestDetails.name || !guestDetails.email)) ||
              processing
            }
            className={`w-full py-3.5 ${
              !selectedMethod ||
              (!user && (!guestDetails.name || !guestDetails.email)) ||
              processing
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            } font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin text-current" />
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </div>

        {/* Support Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
          <h3 className="font-bold text-foreground mb-4">Need Help?</h3>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Customer Support
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  Available 24/7 for payment issues
                </p>
                <a
                  href="#"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  support@eventticket.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">FAQ</p>
                <p className="text-xs text-muted-foreground mb-1">
                  Find answers to common questions
                </p>
                <a
                  href="#"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  View payment FAQ
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> PCI Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> End-to-end Encryption
            </span>
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            By proceeding with the payment, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
