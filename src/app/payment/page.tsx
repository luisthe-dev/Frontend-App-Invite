"use client";

import { Clock, Ticket, CheckCircle2, ShieldCheck, Lock, CreditCard, Building2, Globe, HelpCircle, MessageCircle, Loader2 } from "lucide-react";
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
  const [guestDetails, setGuestDetails] = useState({ name: '', email: '' });
  const [user, setUser] = useState<any>(null);

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

  const eventSlug = searchParams.get('event');
  const ticketsParam = searchParams.get('tickets');

  useEffect(() => {
    if (!eventSlug || !ticketsParam) {
        // Redirect back if missing params
        // router.push('/events'); 
        // For now just stop loading to show empty state or error
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
                    const selected = data.tickets.filter((t: any) => counts[t.id] && counts[t.id] > 0);
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
      return acc + (ticket.price * (ticketCounts[ticket.id] || 0));
  }, 0);
  
  const serviceFee = subtotal * 0.05; // 5% fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + serviceFee + tax;

  const finalTotal = total;
  const wallet = user?.wallets?.find((w: any) => w.label == 'Main Wallet') || user?.wallets?.[0];
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
              payment_method: selectedMethod
          });
          
          if (data.redirect_url) {
              router.push(data.redirect_url);
          } else {
              router.push('/dashboard/tickets');
          }
          
      } catch (err: any) {
          console.error("Payment failed", err);
          error(err.response?.data?.message || "Payment failed. Please try again.");
          setProcessing(false);
      }
  };


  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
      );
  }

  if (!event) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h1 className="text-xl font-bold mb-4">Invalid Request</h1>
              <Link href="/events" className="text-violet-600 hover:underline">Browse Events</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">
        
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h1>
            <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1.5 text-violet-600" />
                Estimated time to complete: 2-3 minutes
            </div>
        </div>
        
        {/* Guest Details Form (Mobile/Desktop) */}
        {!user && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Guest Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            value={guestDetails.name}
                            onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            value={guestDetails.email}
                            onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                            placeholder="e.g. john@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Ticket Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Ticket Summary</h2>
                        <p className="text-xs text-gray-500">Order #PENDING</p>
                    </div>
                </div>

                {/* Event Details */}
                <div className="flex gap-4 mb-8">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-0.5">
                            {new Date(event.start_date).toLocaleDateString()} • {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-sm text-gray-500">{event.location || 'Online'}</p>
                    </div>
                    <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center shrink-0 text-violet-600">
                        <Ticket className="w-6 h-6" />
                    </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3 pb-6 border-b border-gray-100">
                    {ticketDetails.length > 0 ? ticketDetails.map(ticket => (
                        <div key={ticket.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{ticket.title} (x{ticketCounts[ticket.id]})</span>
                            <span className="text-gray-900 font-medium">{formatCurrency(ticket.price * ticketCounts[ticket.id])}</span>
                        </div>
                    )) : (
                        <div className="text-sm text-red-500">No tickets selected</div>
                    )}
                </div>

                {/* Costs */}
                <div className="space-y-2 py-4 border-b border-gray-100">
                   <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Fee (5%)</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (8%)</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(tax)}</span>
                    </div> 
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-violet-600">{formatCurrency(total)}</span>
                </div>
            </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Choose Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Paystack */}
                <button 
                    onClick={() => setSelectedMethod('paystack')}
                    className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === 'paystack' ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600' : 'border-gray-200 hover:border-violet-200 hover:bg-gray-50'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">Paystack</span>
                        <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Credit/Debit Card, Bank Transfer</p>
                </button>

                {/* Flutterwave */}
                <button 
                    onClick={() => setSelectedMethod('flutterwave')}
                    className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === 'flutterwave' ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600' : 'border-gray-200 hover:border-violet-200 hover:bg-gray-50'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">Flutterwave</span>
                        <Globe className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Credit/Debit Card, USSD, QR Code</p>
                </button>

                {/* Wallet Payment */}
                 {user && (
                    <button 
                        onClick={() => setSelectedMethod('wallet')}
                        disabled={!walletSufficient}
                        className={`text-left p-4 rounded-xl border transition-all ${selectedMethod === 'wallet' ? 'border-violet-600 bg-violet-50/50 ring-1 ring-violet-600' : 'border-gray-200 hover:border-violet-200 hover:bg-gray-50'} ${!walletSufficient ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900">My Wallet</span>
                            <Wallet className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Pay with your wallet balance</p>
                        <p className={`text-sm font-bold ${walletSufficient ? 'text-green-600' : 'text-red-500'}`}>
                            Balance: {formatCurrency(walletBalance)}
                        </p>
                        {!walletSufficient && <p className="text-[10px] text-red-500 mt-1">Insufficient funds</p>}
                    </button>
                 )}
            </div>

            <button 
                onClick={handlePayment}
                disabled={!selectedMethod || (!user && (!guestDetails.name || !guestDetails.email)) || processing} 
                className="w-full py-3.5 bg-gray-200 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200 text-gray-500 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-violet-600 data-[state=active]:text-white flex justify-center items-center gap-2"
            >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Proceed to Payment'}
            </button>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Customer Support</p>
                        <p className="text-xs text-gray-500 mb-1">Available 24/7 for payment issues</p>
                        <a href="#" className="text-xs text-violet-600 font-medium hover:underline">support@eventticket.com</a>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">FAQ</p>
                        <p className="text-xs text-gray-500 mb-1">Find answers to common questions</p>
                        <a href="#" className="text-xs text-violet-600 font-medium hover:underline">View payment FAQ</a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure Payment</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> PCI Compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> End-to-end Encryption</span>
            </div>
            
             <p className="text-[10px] text-gray-400 text-center mt-4">
                By proceeding with the payment, you agree to our <Link href="/terms" className="text-violet-500">Terms of Service</Link> and <Link href="/privacy" className="text-violet-500">Privacy Policy</Link>.
             </p>

        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
