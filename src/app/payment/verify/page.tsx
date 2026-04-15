"use client";

import {
  Check,
  Download,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Ticket as TicketIcon,
  Loader2,
  Home,
  AlertCircle, // Added
  QrCode, // Added
  ArrowRight, // Added
  Mail, // Added
  Bell, // Added
} from "lucide-react";
import { toast } from "sonner"; // Added
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { userApi } from "@/api/user";
import { QRCodeSVG } from "qrcode.react";
import { paymentApi } from "@/api/payment";
import { Transaction } from "@/types/models";

function VerifyContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reference = searchParams.get("reference");
  const message = searchParams.get("message");

  const [reminders, setReminders] = useState<{ [key: string]: boolean }>({
    one_day: false,
    three_hours: false,
    updates: true,
  });

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!transaction || !transaction.purchased_tickets?.[0]?.event) return;
    const event = transaction.purchased_tickets[0].event;
    const shareData = {
      title: "MyInvite Ticket",
      text: `I just got my ticket for ${event.title}! Join me there.`,
      url: window.location.origin + `/events/${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Event link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const handleAddToCalendar = (type: 'google' | 'apple' | 'outlook') => {
    if (!transaction || !transaction.purchased_tickets?.[0]?.event) {
      toast.error("Event details not available to add to calendar.");
      return;
    }
    const event = transaction.purchased_tickets[0].event;
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`Your ticket for ${event.title}. Reference: ${reference}`);
    const location = encodeURIComponent(event.location);
    const startDate = new Date(event.start_date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.end_date || event.start_date).toISOString().replace(/-|:|\.\d\d\d/g, "");

    let url = "";
    if (type === 'google') {
      url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(url, '_blank');
    } else {
      toast.info(`${type.toUpperCase()} calendar integration coming soon. Use Google for now.`);
    }
  };

  const handleToggleReminder = async (type: string) => {
    if (!transaction || !transaction.purchased_tickets?.[0]?.event_id) return;
    
    // Toggle state locally first for responsiveness
    setReminders(prev => ({ ...prev, [type]: !prev[type] }));

    if (!reminders[type]) { // If we are turning it ON
      try {
        await userApi.setReminder({
          event_id: transaction.purchased_tickets[0].event_id,
          type: type,
          remind_at: transaction.purchased_tickets[0].event?.start_date
        });
        toast.success(`Reminder set! We'll notify you via ${type === 'updates' ? 'email' : 'push'}.`);
      } catch (error) {
        // Revert on error
        setReminders(prev => ({ ...prev, [type]: false }));
        toast.error("Failed to set reminder.");
      }
    }
  };

  useEffect(() => {
    if (reference && status === "success") {
      paymentApi
        .verifyTransaction(reference)
        .then((data) => {
          setTransaction(data);
          // Trigger a subtle success event if needed
        })
        .catch((err) => {
          console.error("Failed to fetch transaction", err);
          toast.error("Payment verified but failed to load ticket details. Please check your dashboard.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [reference, status]);

  if (!status || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Confirming your experience...</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === "success";

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-[480px] w-full bg-card rounded-3xl shadow-2xl border border-border p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Transaction Unsuccessful
          </h1>
          <p className="text-muted-foreground mb-8">
            Don't worry, your payment wasn't processed
          </p>

          <div className="bg-muted/50 rounded-2xl p-5 mb-8 flex items-start text-left gap-3 border border-border/50">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message
                ? message
                : "We encountered an issue while processing your payment. This could be due to insufficient funds, network issues, or card restrictions."}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <Link
              href="/payment"
              className="group block w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98]"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform rotate-180" />
              Retry Payment
            </Link>
            <Link
              href="/"
              className="block w-full py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-3">
              Need help with your transaction?
            </div>
            <div className="flex justify-center gap-6 text-xs font-bold text-primary">
              <a href="mailto:support@myinvite.ng" className="hover:underline flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Contact Support
              </a>
              <Link href="/help" className="hover:underline flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for display
  const event = transaction?.purchased_tickets?.[0]?.event;
  const ticketCounts: { [key: string]: { count: number; price: number } } = {};
  transaction?.purchased_tickets?.forEach((t) => {
    const title = t.purchase_info.ticket_title;
    if (!ticketCounts[title]) {
      ticketCounts[title] = { count: 0, price: t.purchase_info.price };
    }
    ticketCounts[title].count++;
  });

  const emailSentTo =
    transaction?.transaction_data?.guest_email ||
    transaction?.purchased_tickets?.[0]?.purchase_info?.buyer_email;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Success Banner */}
        <div className="text-center mb-12 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/10 text-green-500 mb-6 shadow-inner animate-bounce-subtle">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">
            You're Going To <br className="sm:hidden" /> {event ? event.title : 'The Event'}!
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Your payment was successful. We've sent your tickets to{" "}
            <span className="font-bold text-foreground decoration-primary/30 decoration-2 underline-offset-4 underline">{emailSentTo}</span>
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-muted/50 border border-border text-xs font-mono text-muted-foreground">
            Reference: {reference}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Ticket Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2rem] shadow-xl shadow-shadow/5 border border-border overflow-hidden group hover:border-primary/20 transition-all duration-300">
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-xl font-bold text-foreground">
                    Ticket Summary
                  </h2>
                  <TicketIcon className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                </div>

                {event ? (
                  <div className="space-y-8">
                    <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                      <h3 className="text-2xl font-extrabold text-foreground mb-4">
                        {event.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-foreground">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm border border-border/50">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Date</span>
                            <span className="font-semibold">
                              {new Date(event.start_date).toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-foreground">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm border border-border/50">
                            <Clock className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Time</span>
                            <span className="font-semibold">{event.start_date.split(' ')[1] || 'TBD'}</span>
                          </div>
                        </div>
                        <div className="flex items-start text-sm text-foreground md:col-span-2">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm border border-border/50 shrink-0">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Location</span>
                            <span className="font-semibold leading-tight">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3">
                      {Object.entries(ticketCounts).map(([title, info]) => (
                        <div key={title} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="font-medium text-foreground">{title}</span>
                          </div>
                          <div className="font-bold">
                            {info.count} × ₦{info.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-sm text-muted-foreground pt-1">
                        <span>Service Fees & TAX</span>
                        <span className="font-medium">₦{(transaction?.fees || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-end pt-6 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Payment Method</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border/50 w-fit">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-xs font-bold text-foreground">Paystack</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Total Amount</span>
                        <span className="text-3xl font-black text-primary">
                          ₦{transaction?.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Fetching final details...</p>
                  </div>
                )}
              </div>
            </div>

            {/* What's Next Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm print:hidden">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Next Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-foreground mb-3">Calendar Invite</p>
                  <p className="text-xs text-muted-foreground mb-4">Add to your schedule to get notified</p>
                  <div className="flex flex-wrap gap-2">
                    {['google', 'apple', 'outlook'].map((cal) => (
                      <button
                        key={cal}
                        onClick={() => handleAddToCalendar(cal as any)}
                        className="px-4 py-2 bg-muted/50 hover:bg-muted text-[10px] font-bold uppercase tracking-widest text-foreground rounded-xl border border-border transition-colors active:scale-95"
                      >
                        {cal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground mb-3">Directions</p>
                  <p className="text-xs text-muted-foreground mb-4">Plan your route to arrive easily</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location || 'The Venue')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Open In Maps <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Action Column */}
          <div className="space-y-6">
            {/* QR/Check-in Card */}
            <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-xl text-center flex flex-col items-center group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
              <div className="mb-6 p-4 bg-white rounded-3xl shadow-inner border border-gray-100 dark:border-gray-800 transition-transform duration-500 group-hover:scale-105">
                <QRCodeSVG value={reference || ""} size={160} />
              </div>
              <h3 className="font-bold text-foreground mb-2">Check-in QR Code</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-8">
                Present this code at the entrance for quick entry. This covers all {transaction?.purchased_tickets?.length || ''} tickets.
              </p>
              
              <div className="w-full space-y-3 print:hidden">
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" /> Save To Device
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" /> Share Experience
                </button>
              </div>
            </div>

            {/* Reminders Card */}
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm print:hidden">
              <h3 className="text-lg font-bold text-foreground mb-6">Smart Reminders</h3>
              <div className="space-y-4">
                {[
                  { id: 'one_day', label: '1 Day Before' },
                  { id: 'three_hours', label: '3 Hours Before' },
                  { id: 'updates', label: 'Event Updates' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center p-3 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-all cursor-pointer group">
                    <div className="relative flex items-center justify-center mr-4">
                      <input
                        type="checkbox"
                        checked={reminders[item.id]}
                        onChange={() => handleToggleReminder(item.id)}
                        className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
                      />
                      <div className={`h-6 w-6 rounded-lg border-2 border-border transition-all flex items-center justify-center ${reminders[item.id] ? 'bg-primary border-primary' : 'bg-transparent'}`}>
                        {reminders[item.id] && <Check className="w-4 h-4 text-primary-foreground" />}
                      </div>
                    </div>
                    <span className={`text-sm font-medium transition-colors ${reminders[item.id] ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Community/Support */}
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center print:hidden">
              <p className="text-sm font-bold text-foreground mb-2">Need Assistance?</p>
              <p className="text-xs text-muted-foreground mb-6">Our team is available 24/7 for you.</p>
              <a href="mailto:support@myinvite.ng" className="text-sm font-black text-primary hover:underline flex items-center justify-center gap-2">
                Open Chat <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col items-center gap-6 print:hidden">
          <div className="flex w-full max-w-xl gap-4">
            <Link
              href="/dashboard/tickets"
              className="flex-1 py-5 bg-card border-2 border-border text-foreground font-black rounded-[1.5rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-center text-sm active:scale-[0.98] shadow-sm"
            >
              My Ticket Wallet
            </Link>
            <Link
              href="/"
              className="flex-1 py-5 bg-card border-2 border-border text-foreground font-black rounded-[1.5rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-center text-sm active:scale-[0.98] shadow-sm"
            >
              Explore More
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            <QrCode className="w-3 h-3" /> Encrypted & Verified by MyInvite
          </div>
        </div>
      </div>
      
      {/* Styles for bounce animation and print */}
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
