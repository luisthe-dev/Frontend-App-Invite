"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { hostApi } from "@/api/host";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Calendar,
  DollarSign,
  Ticket,
  Users,
  Settings,
  ArrowLeft,
  ExternalLink,
  Download,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import WithdrawalLimitModal from "../../components/WithdrawalLimitModal";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null); // { event, stats, attendees, tickets }
  const [activeTab, setActiveTab] = useState("overview");
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) fetchDetails();
  }, [eventId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await hostApi.getEventDetails(eventId);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>;
  if (!data) return <div className="p-8 text-center text-slate-500">Event not found</div>;

  const { event, stats, attendees, tickets } = data;

  const filteredAttendees = attendees.filter((a: any) => 
     a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.ticket_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefund = async (ticketId: string) => {
    if(!confirm("Are you sure you want to refund this ticket? This action cannot be undone.")) return;
    try {
        await hostApi.refundTicket(ticketId);
        toast.success("Ticket refunded successfully");
        // Remove from list
        const newAttendees = data.attendees.filter((a: any) => a.id !== ticketId);
        setData({ ...data, attendees: newAttendees });
    } catch (error) {
        console.error(error);
        toast.error("Failed to refund ticket");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
            <Link href="/dashboard/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden relative shrink-0">
                         {event.image_url ? (
                            <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                         ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground"><Calendar className="w-6 h-6" /></div>
                         )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                             <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${event.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                                 {event.status}
                             </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                             <div className="flex items-center gap-1">
                                 <Calendar className="w-3.5 h-3.5" />
                                 {new Date(event.start_date).toLocaleDateString()} at {new Date(event.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </div>
                             <div className="hidden md:block w-1 h-1 rounded-full bg-border"></div>
                             <div>
                                 {event.location || 'Online Event'}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <Link href={`/events/${event.slug}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="w-4 h-4" /> View Page
                        </Button>
                     </Link>
                     <Link href={`/events/${event.slug}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <Settings className="w-4 h-4" /> Edit
                        </Button>
                     </Link>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border mb-8">
            <nav className="flex gap-6">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('attendees')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attendees' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Attendees
                </button>
                 <button 
                    onClick={() => setActiveTab('tickets')}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Ticket Types
                </button>
            </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <h2 className="text-2xl font-bold text-foreground">{formatCurrency(stats.revenue || 0)}</h2>
                            {stats.withdrawable > 0 && (
                                <button 
                                    onClick={() => setWithdrawalModalOpen(true)}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    Withdraw {formatCurrency(stats.withdrawable)}
                                </button>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Ticket className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Tickets Sold</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{stats.tickets_sold}</h2>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Users className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Attendees</span>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{attendees.length}</h2>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Ticket Sales Breakdown */}
                     <Card className="p-6">
                         <h3 className="font-bold text-foreground mb-4">Ticket Sales by Type</h3>
                         <div className="space-y-4">
                             {tickets.map((t: any) => (
                                 <div key={t.id} className="flex items-center justify-between">
                                      <div>
                                          <p className="font-medium text-sm text-foreground">{t.title}</p>
                                          <p className="text-xs text-muted-foreground">{t.sold} / {t.quantity} sold</p>
                                      </div>
                                      <div className="text-right">
                                           <p className="font-bold text-sm text-foreground">{formatCurrency(t.revenue)}</p>
                                           <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                               <div className="h-full bg-primary rounded-full" style={{ width: `${(t.sold / t.quantity) * 100}%`}}></div>
                                           </div>
                                      </div>
                                 </div>
                             ))}
                         </div>
                     </Card>

                     {/* Recent Attendees Preview */}
                     <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-foreground">Recent Registrations</h3>
                            <button onClick={() => setActiveTab('attendees')} className="text-xs font-bold text-primary hover:text-primary/80">View All</button>
                        </div>
                        <div className="space-y-4">
                             {attendees.slice(0, 5).map((attendee: any) => (
                                 <div key={attendee.id} className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                          {attendee.name.charAt(0)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm text-foreground truncate">{attendee.name}</p>
                                          <p className="text-xs text-muted-foreground truncate">{attendee.ticket_type}</p>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{new Date(attendee.date).toLocaleDateString()}</span>
                                 </div>
                             ))}
                             {attendees.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No attendees yet.</p>}
                        </div>
                     </Card>
                </div>
            </div>
        )}

        {activeTab === 'attendees' && (
             <Card className="overflow-hidden">
                 <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                              type="text" 
                              placeholder="Search attendees..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                          />
                      </div>
                      <Button variant="outline" className="gap-2">
                          <Download className="w-4 h-4" /> Export CSV
                      </Button>
                 </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-muted-foreground">
                         <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px]">
                             <tr>
                                 <th className="px-6 py-4">Name</th>
                                 <th className="px-6 py-4">Email</th>
                                 <th className="px-6 py-4">Ticket Type</th>
                                 <th className="px-6 py-4">Price</th>
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-border">
                             {filteredAttendees.map((a: any) => (
                                 <tr key={a.id} className="hover:bg-accent/50">
                                     <td className="px-6 py-4 font-medium text-foreground">{a.name}</td>
                                     <td className="px-6 py-4">{a.email}</td>
                                     <td className="px-6 py-4">
                                         <span className="px-2 py-1 rounded bg-violet-500/10 text-violet-600 text-xs font-bold">{a.ticket_type}</span>
                                     </td>
                                     <td className="px-6 py-4">{formatCurrency(a.price)}</td>
                                     <td className="px-6 py-4">{new Date(a.date).toLocaleDateString()}</td>
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                             <CheckCircle2 className="w-3 h-3" /> Paid
                                         </div>
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <button 
                                            onClick={() => handleRefund(a.id)}
                                            className="text-xs font-bold text-destructive hover:text-destructive/80 hover:underline"
                                         >
                                            Refund
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                             {filteredAttendees.length === 0 && (
                                 <tr>
                                     <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                         No attendees found matching your search.
                                     </td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
             </Card>
        )}

        {activeTab === 'tickets' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tickets.map((ticket: any) => (
                     <Card key={ticket.id} className="p-6 relative overflow-hidden">
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                                  <Ticket className="w-5 h-5" />
                              </div>
                              <span className={`px-2 py-1 text-xs font-bold rounded ${ticket.sold >= ticket.quantity ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                  {ticket.sold >= ticket.quantity ? 'Sold Out' : 'Available'}
                              </span>
                          </div>
                          <h3 className="font-bold text-lg mb-1 text-foreground">{ticket.title}</h3>
                          <p className="text-2xl font-bold text-primary mb-4">{formatCurrency(ticket.price)}</p>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                               <div className="flex justify-between">
                                   <span>Sold</span>
                                   <span className="font-medium text-foreground">{ticket.sold}</span>
                               </div>
                               <div className="flex justify-between">
                                   <span>Capacity</span>
                                   <span className="font-medium text-foreground">{ticket.quantity}</span>
                               </div>
                               <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                                   <div className="h-full bg-primary rounded-full" style={{ width: `${(ticket.sold / ticket.quantity) * 100}%`}}></div>
                               </div>
                          </div>
                     </Card>
                 ))}
             </div>
        )}

      </div>

      <WithdrawalLimitModal 
         isOpen={withdrawalModalOpen} 
         onClose={() => setWithdrawalModalOpen(false)} 
         eventId={eventId} 
      />
    </div>
  );
}
