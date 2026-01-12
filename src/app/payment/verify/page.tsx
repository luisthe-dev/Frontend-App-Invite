"use client";

import { Check, Download, Share2, MapPin, Calendar, Clock, Ticket as TicketIcon, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { QRCodeSVG } from 'qrcode.react'; 
import { paymentApi } from "@/api/payment";

interface TransactionDetails {
    id: number;
    transaction_id: string; // Reference
    total_amount: number;
    fees: number;
    status: string;
    transaction_data: {
        event_slug: string;
        is_guest: boolean;
        guest_email?: string;
    };
    purchased_tickets: {
        id: number;
        ticket_id: number;
        purchase_info: {
            ticket_title: string;
            price: number;
            buyer_name: string;
            buyer_email: string;
        };
        event: {
            title: string;
            location: string;
            start_date: string;
            start_time: string;
        };
    }[];
}

function VerifyContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const reference = searchParams.get('reference');
    const message = searchParams.get('message');

    const [loading, setLoading] = useState(true);
    const [transaction, setTransaction] = useState<TransactionDetails | null>(null);

    useEffect(() => {
        if (reference && status === 'success') {
            paymentApi.verifyTransaction(reference)
                .then(data => {
                    setTransaction(data.data);
                })
                .catch(err => console.error("Failed to fetch transaction", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [reference, status]);


    if (!status || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                    <p className="text-gray-500">Verifying payment...</p>
                </div>
            </div>
        );
    }

    const isSuccess = status === 'success';

    if (!isSuccess) {
        return (
             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-[480px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-6">
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Unsuccessful</h1>
                    <p className="text-gray-500 mb-8">Don't worry, your payment wasn't processed</p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 flex items-start text-left gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        <p className="text-sm text-gray-600">
                           {message ? message : "We encountered an issue while processing your payment. This could be due to insufficient funds, network issues, or card restrictions."}
                        </p>
                    </div>

                    <div className="space-y-3 mb-8">
                         <Link href="/payment" className="block w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                            Retry Payment
                         </Link>
                         <Link href="/" className="block w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                             <Home className="w-4 h-4" />
                            Return Home
                         </Link>
                    </div>

                    <div className="text-xs text-gray-500 mb-1">Need help with your transaction?</div>
                    <div className="flex justify-center gap-4 text-xs font-semibold text-violet-600 mb-8">
                        <a href="#" className="hover:underline flex items-center gap-1">Contact Support</a>
                        <a href="#" className="hover:underline flex items-center gap-1">FAQ</a>
                    </div>
                    
                    <div className="text-[10px] text-gray-400 font-mono">
                        <p>Error Reference: {reference || 'N/A'}</p>
                        <p>{new Date().toLocaleString()}</p>
                    </div>
                </div>
             </div>
        )
    }

    console.log(transaction);

    // Prepare data for display
    const event = transaction?.purchased_tickets[0]?.event;
    // Group tickets by title to show quantity
    const ticketCounts: {[key: string]: {count: number, price: number}} = {};
    transaction?.purchased_tickets.forEach(t => {
        const title = t.purchase_info.ticket_title;
        if (!ticketCounts[title]) {
            ticketCounts[title] = { count: 0, price: t.purchase_info.price };
        }
        ticketCounts[title].count++;
    });

    const emailSentTo = transaction?.transaction_data?.guest_email || transaction?.purchased_tickets[0]?.purchase_info?.buyer_email;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-6">
                        <Check className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
                    <p className="text-sm font-medium text-gray-500 mb-2">Confirmation #: {reference}</p>
                    <p className="text-sm text-gray-500">
                        A confirmation email with all event details has been sent to <span className="font-medium text-gray-900">{emailSentTo}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Main Ticket/Event Details Card */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Event Details</h2>
                            
                            {event ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base mb-1">{event.title}</h3>
                                        <div className="space-y-1 mt-2">
                                             <div className="flex items-start text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                                <span>{new Date(event.start_date).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                                            </div>
                                            <div className="flex items-start text-sm text-gray-600">
                                                 <Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                                <span>{event.start_time}</span>
                                            </div>
                                            <div className="flex items-start text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Breakdown */}
                                    <div className="pt-4 border-t border-gray-50">
                                        {Object.entries(ticketCounts).map(([title, info]) => (
                                            <div key={title} className="flex justify-between items-center text-sm py-2">
                                                <div>
                                                    <span className="font-medium text-gray-900">{title}</span>
                                                </div>
                                                <div className="text-gray-900">
                                                    {info.count} × ₦{info.price.toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm py-2">
                                            <span className="text-gray-500">Service Fee</span>
                                            <span className="text-gray-900">₦{(transaction?.fees || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">Total Paid</span>
                                            <span className="text-xs text-gray-500">Paid with Paystack</span>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900">₦{transaction?.total_amount.toLocaleString()}</span>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Loading event details...</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / QR Code */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                             <div className="mb-4 bg-white p-2 border border-gray-100 rounded-lg">
                                 <QRCodeSVG value={reference || ""} size={120} />
                             </div>
                             <p className="text-xs text-gray-500 max-w-[200px] mx-auto mb-6">
                                 Show this QR code at each venue entrance. This QR code is valid for all events in this purchase.
                             </p>
                             <div className="flex w-full gap-2">
                                 <button className="flex-1 py-2 px-3 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-700 transition flex items-center justify-center gap-1">
                                     <Download className="w-3 h-3" /> Download
                                 </button>
                                 <button className="flex-1 py-2 px-3 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1">
                                     <Share2 className="w-3 h-3" /> Share
                                 </button>
                             </div>
                        </div>

                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                       <Calendar className="w-3 h-3 mr-1.5 text-violet-600" /> Add to your calendar
                                    </p>
                                    <div className="flex gap-2">
                                         <button className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-100">Google</button>
                                         <button className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-100">Apple</button>
                                         <button className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-600 hover:bg-gray-100">Outlook</button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                                       <MapPin className="w-3 h-3 mr-1.5 text-violet-600" /> Get directions to the venue
                                    </p>
                                    <p className="text-[10px] text-gray-500 mb-2">Plan your route in advance to arrive on time</p>
                                    <a href="#" className="text-[10px] font-medium text-violet-600 flex items-center gap-1 hover:underline">
                                        View on map <span className="text-xs">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Reminders</h3>
                            <div className="space-y-3">
                                 <label className="flex items-start gap-2 cursor-pointer">
                                     <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                                     <span className="text-xs text-gray-600">Remind me 1 day before the event</span>
                                 </label>
                                 <label className="flex items-start gap-2 cursor-pointer">
                                     <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                                     <span className="text-xs text-gray-600">Remind me 3 hours before the event</span>
                                 </label>
                                 <label className="flex items-start gap-2 cursor-pointer">
                                     <input type="checkbox" defaultChecked className="mt-0.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                                     <span className="text-xs text-gray-600">Send me updates about this event</span>
                                 </label>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-col items-center gap-4">
                     <div className="flex w-full max-w-md gap-3">
                         <Link href="/dashboard/tickets" className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-center text-sm">
                             View My Tickets
                         </Link>
                         <Link href="/" className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-center text-sm">
                             Return to Home
                         </Link>
                     </div>
                     <p className="text-xs text-gray-400">
                         Need help? <a href="#" className="text-violet-600 hover:underline">Contact Support</a>
                     </p>
                </div>

            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
