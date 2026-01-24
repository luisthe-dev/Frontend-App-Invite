"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import {
  Send,
  ArrowLeft,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Loader2,
  Calendar,
  Mail,
  Tag,
} from "lucide-react";

export default function AdminTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<any>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const ticketId = params?.id as string;

    const fetchTicket = async () => {
        try {
            if (!ticketId) return;
            const res = await adminApi.getTicket(ticketId);
            setTicket(res);
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
          await adminApi.replyTicket(ticketId, { message: newMessage });
          setNewMessage("");
          fetchTicket();
        } catch (error) {
          alert("Failed to send message");
        } finally {
          setSending(false);
        }
    };

    const updateStatus = async (status: string) => {
        if (!confirm(`Are you sure you want to mark this ticket as ${status.toUpperCase()}?`)) return;
        try {
            await adminApi.updateTicketStatus(ticketId, status);
            fetchTicket();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading)
      return (
        <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-50">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      );
    if (!ticket)
      return (
        <div className="min-h-screen flex items-center justify-center text-red-500 bg-slate-50">
          Ticket not found
        </div>
      );

    const isActive = ticket.status !== "closed" && ticket.status !== "resolved";

    return (
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Left Panel - Ticket Info & User Context (Hidden on small screens, can be toggleable) */}
        <div className="w-80 bg-card border-r border-border hidden lg:flex flex-col shrink-0 z-20">
          <div className="p-6 border-b border-border">
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to tickets
            </button>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {ticket.subject}
            </h2>
            <div className="mt-3 flex gap-2">
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset uppercase ${
                  ticket.status === "open"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-700/10 dark:ring-blue-400/20"
                    : ticket.status === "resolved"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-700/10 dark:ring-emerald-400/20"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-600/10 dark:ring-slate-400/20"
                }`}
              >
                {ticket.status.replace(/_/g, " ")}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset uppercase ${
                  ticket.priority === "urgent"
                    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 ring-red-600/10 dark:ring-red-400/20"
                    : "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 ring-slate-600/10 dark:ring-slate-400/20"
                }`}
              >
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* User Card */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Customer
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {ticket.user?.first_name?.[0]}
                  {ticket.user?.last_name?.[0]}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {ticket.user?.first_name} {ticket.user?.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {ticket.user?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{ticket.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Created {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {ticket.transaction && (
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Linked Transaction
                  </h3>
                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{ticket.transaction.id.substring(0, 8)}
                      </span>
                      <span className="font-bold text-foreground">
                        ${Number(ticket.transaction.total_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs capitalize flex items-center gap-1 mt-2 text-muted-foreground">
                      <div
                        className={`w-2 h-2 rounded-full ${ticket.transaction.status === "payment_successful" ? "bg-emerald-500" : "bg-neutral-300"}`}
                      />
                      {ticket.transaction.status.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex flex-col gap-2">
              {isActive ? (
                <>
                  <button
                    onClick={() => updateStatus("resolved")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve Ticket
                  </button>
                  <button
                    onClick={() => updateStatus("closed")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border hover:bg-accent text-muted-foreground rounded-lg text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Close Ticket
                  </button>
                </>
              ) : (
                <button
                  onClick={() => updateStatus("open")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Reopen Ticket
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-border px-4 py-3 flex items-center justify-between bg-card shadow-sm z-10 transition-colors">
            <button
              onClick={() => router.back()}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="font-bold text-foreground truncate px-4">
              {ticket.subject}
            </div>
            <div className="w-5"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-muted/10">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Ticket started on {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>

            {ticket.messages?.map((msg: any) => {
              const isAdmin = msg.is_admin;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`flex items-end gap-2 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold ${
                          isAdmin
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isAdmin ? "ME" : ticket.user?.first_name?.[0]}
                      </div>
                      <div
                        className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                          isAdmin
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card text-foreground border border-border rounded-tl-sm"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                    <div
                      className={`text-[10px] text-muted-foreground mt-1 px-11 ${isAdmin ? "text-right" : "text-left"}`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {ticket.status === "closed" && (
              <div className="flex justify-center py-4">
                <div className="bg-muted border border-border text-muted-foreground px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> This ticket is closed.
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

            {/* Input Area */}
          {ticket.status !== "closed" && (
            <div className="p-4 bg-background border-t border-border transition-colors">
              <form
                onSubmit={handleSend}
                className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 bg-accent/30 border border-border rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm"
              >
                <button
                  type="button"
                  className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  className="flex-1 bg-transparent border-none focus:ring-0 p-3 min-h-[48px] max-h-[120px] resize-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                  placeholder="Type your reply..."
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Press <span className="font-mono">Enter</span> to send,{" "}
                <span className="font-mono">Shift + Enter</span> for new line
              </p>
            </div>
          )}
        </div>
      </div>
    );
}
