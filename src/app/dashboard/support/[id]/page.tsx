"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supportApi } from "@/api/support";
import { Send, ArrowLeft, Paperclip, Loader2, User } from "lucide-react";
import { SupportMessage, SupportTicket } from "@/types/models";

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const ticketId = params?.id as string;

    const fetchTicket = async () => {
        try {
            if (!ticketId) return;
            const res = await supportApi.getTicket(ticketId);
            setTicket(res);
            setMessages(res?.messages || []);
            setLoading(false);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load ticket", error);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await supportApi.replyTicket(ticketId, { message: newMessage });
            setNewMessage("");
            fetchTicket();
        } catch (error) {
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
    if (!ticket) return <div className="min-h-screen flex items-center justify-center text-red-500">Ticket not found</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"> 
            
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard/support')} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                             <h1 className="font-bold text-slate-900 text-lg truncate max-w-[200px] sm:max-w-md">{ticket.subject}</h1>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                ticket.status === 'open' ? 'bg-blue-50 text-blue-700' :
                                ticket.status === 'closed' ? 'bg-slate-100 text-slate-600' :
                                'bg-emerald-50 text-emerald-700'
                            }`}>
                                {ticket.status.replace(/_/g, ' ')}
                            </span>
                         </div>
                        <p className="text-xs text-slate-500">ticket #{ticket.id.toString().substring(0,8)}</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
                <div className="text-center">
                    <span className="text-xs text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                        Today
                    </span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${msg.is_admin ? 'items-start' : 'items-end'}`}>
                             <div className={`flex items-end gap-2 ${msg.is_admin ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold ${
                                    msg.is_admin ? 'bg-violet-100 text-violet-600' : 'bg-slate-800 text-white'
                                }`}>
                                    {msg.is_admin ? 'SP' : <User className="w-4 h-4" />}
                                </div>

                                <div className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                                    msg.is_admin 
                                    ? 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm' 
                                    : 'bg-violet-600 text-white rounded-tr-sm'
                                }`}>
                                    {msg.message}
                                </div>
                            </div>
                            <div className={`text-[10px] text-slate-400 mt-1 px-11 opacity-70 ${msg.is_admin ? 'text-left' : 'text-right'}`}>
                                {msg.is_admin ? 'Support Agent' : 'You'} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                ))}
                
                {ticket.status === 'closed' && (
                    <div className="flex justify-center py-6">
                        <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            This ticket has been closed.
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {ticket.status !== 'closed' && (
                <div className="bg-white border-t border-slate-100 p-4 shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                         <button type="button" className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 placeholder:text-slate-400 transition-all font-medium"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim() || sending}
                            className="bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-200 active:scale-95"
                        >
                            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
