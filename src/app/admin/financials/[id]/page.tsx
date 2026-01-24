"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/api/admin";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Loader2, Calendar, User, CreditCard, ExternalLink, CheckCircle, XCircle, Clock, FileText, Ticket } from "lucide-react";

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await adminApi.getTransaction(id);
        setTransaction(data);
      } catch (err) {
        console.error("Failed to fetch transaction", err);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/admin/financials" className="text-muted-foreground hover:text-foreground flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Financials
        </Link>
        <div className="p-8 bg-card border border-border rounded-xl text-center">
             <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-foreground">Error Loading Transaction</h3>
             <p className="text-muted-foreground mt-2">{error || "Transaction not found"}</p>
        </div>
      </div>
    );
  }
  
  const ticketGroups = transaction?.purchased_tickets?.reduce((acc: any, pt: any) => {
      // Use ticket object if available, otherwise just use ID
      const ticketId = pt.ticket_id;
      const title = pt.ticket?.title || "Unknown Ticket";
      const price = pt.ticket?.price || 0; // Or from pt.purchase_info if available?
      
      if (!acc[ticketId]) {
          acc[ticketId] = { title, price, quantity: 0 };
      }
      acc[ticketId].quantity += 1;
      return acc;
  }, {});

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
            <Link href="/admin/financials" className="text-muted-foreground hover:text-foreground flex items-center mb-4 text-sm font-medium transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Financials
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction Details</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            transaction.type === 'Purchase' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            transaction.type === 'Withdrawal' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                            transaction.type === 'Refund' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                            'bg-muted text-muted-foreground border-border'
                        }`}>
                        {transaction.type}
                      </span>
                   </div>
                   <h1 className="text-2xl font-bold text-foreground font-mono">{transaction.transaction_id || transaction.reference || id}</h1>
                </div>
                
                 <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        transaction.status === 'payment_successful' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700' :
                        ['pending', 'pending_confirmation'].includes(transaction.status) ? 'bg-amber-500/5 border-amber-500/20 text-amber-700' :
                        'bg-destructive/5 border-destructive/20 text-destructive'
                    }`}>
                    {transaction.status === 'payment_successful' ? <CheckCircle className="w-5 h-5" /> : 
                     ['pending', 'pending_confirmation'].includes(transaction.status) ? <Clock className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />
                    }
                    <span className="font-bold capitalize">{transaction.status?.replace(/_/g, " ")}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                         <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Amount</p>
                            <p className={`text-2xl font-bold ${
                                ['Withdrawal', 'Debit'].includes(transaction.type) ? 'text-foreground' : 'text-emerald-600'
                            }`}>
                                {['Withdrawal', 'Debit'].includes(transaction.type) ? '-' : '+'}{formatCurrency(transaction.total_amount)}
                            </p>
                        </div>
                        <div>
                             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Date Created</p>
                             <p className="text-foreground font-medium">{new Date(transaction.created_at).toLocaleString()}</p>
                        </div>
                        <div className="md:col-span-2">
                             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                             <p className="text-foreground">{transaction.description || "No description provided."}</p>
                        </div>
                    </div>
                </div>

                {/* Purchased Tickets Section */}
                {ticketGroups && Object.keys(ticketGroups).length > 0 && (
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-primary" />
                            Purchased Tickets
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(ticketGroups).map(([id, t]: [string, any]) => (
                                <div key={id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{t.title}</p>
                                        <p className="text-xs text-muted-foreground">Quantity: {t.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-medium text-foreground">{formatCurrency(t.price * t.quantity)}</p>
                                        {t.quantity > 1 && <p className="text-xs text-muted-foreground">{formatCurrency(t.price)} each</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Metadata / Gateway Info */}
                {(transaction.metadata || transaction.gateway_response) && (
                    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Payment Details
                        </h3>
                         <div className="space-y-4">
                            {transaction.payment_method && (
                                 <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Payment Method</p>
                                    <p className="text-foreground font-medium capitalize">{transaction.payment_method}</p>
                                </div>
                            )}
                            
                            {/* Render metadata as key-value pairs if it's an object */}
                            {transaction.metadata && typeof transaction.metadata === 'object' && Object.keys(transaction.metadata).length > 0 && (
                                <div className="p-4 bg-muted/50 rounded-lg overflow-x-auto">
                                    <pre className="text-xs text-muted-foreground font-mono">{JSON.stringify(transaction.metadata, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar Relationships */}
            <div className="space-y-6">
                
                {/* Related User */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Related User
                    </h3>
                    {transaction.wallet?.user ? (
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0 uppercase">
                                {(transaction.wallet.user.first_name || transaction.wallet.user.user_name || "U").charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-foreground truncate">
                                    {transaction.wallet.user.first_name} {transaction.wallet.user.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mb-2">{transaction.wallet.user.email}</p>
                                <Link 
                                    href={`/admin/users/${transaction.wallet.user.id}`}
                                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                                >
                                    View User Profile <ExternalLink className="w-3 h-3 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No user information available.</p>
                    )}
                </div>

                {/* Related Event */}
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                     <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Related Event
                    </h3>
                    {transaction.event ? (
                         <div>
                             {transaction.event.image_url && (
                                 <div className="w-full h-32 rounded-lg bg-muted mb-3 overflow-hidden">
                                     <img src={transaction.event.image_url} alt="" className="w-full h-full object-cover" />
                                 </div>
                             )}
                            <p className="font-bold text-foreground truncate mb-1">{transaction.event.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <Calendar className="w-3 h-3" />
                                {new Date(transaction.event.start_date).toLocaleDateString()}
                            </div>
                            <Link 
                                href={`/admin/events/${transaction.event.id}`}
                                className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                            >
                                View Event Details <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                         </div>
                    ) : transaction.event_id ? (
                        // Fallback if we only have ID but not object (though backend usually includes it via WITH)
                         <div>
                            <p className="text-sm text-muted-foreground mb-2">Event ID: <span className="font-mono">{transaction.event_id}</span></p>
                             <Link 
                                href={`/admin/events/${transaction.event_id}`}
                                className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                            >
                                View Event <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                         </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">This transaction is not directly linked to a specific event.</p>
                    )}
                </div>

            </div>
        </div>
    </div>
  );
}
