"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/api/admin";
import { ContactMessage } from "@/types/models";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  Reply,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminContactDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [message, setMessage] = useState<ContactMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchMessage = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getContactMessage(id as string);
            setMessage(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch message details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMessage();
    }, [id]);

    const handleUpdateStatus = async (status: 'unread' | 'read' | 'replied') => {
        setUpdating(true);
        try {
            await adminApi.updateContactStatus(id as string, status);
            toast.success(`Marked as ${status}`);
            if (message) setMessage({ ...message, status });
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await adminApi.deleteContactMessage(id as string);
            toast.success("Message deleted");
            router.push("/bugtst/contact");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!message) {
        return (
            <div className="min-h-screen bg-background p-8 text-center mt-20">
                <h2 className="text-xl font-bold">Message not found</h2>
                <button 
                    onClick={() => router.push("/bugtst/contact")}
                    className="mt-4 text-primary hover:underline"
                >
                    Back to all messages
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8 pb-20">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Messages
                </button>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-muted/20 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">{message.subject}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                        message.status === 'unread' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                        message.status === 'read' ? 'bg-slate-50 text-slate-600 ring-slate-600/10' :
                                        'bg-emerald-50 text-emerald-700 ring-emerald-700/10'
                                    }`}>
                                        {message.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Received on {new Date(message.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleUpdateStatus('replied')}
                                disabled={updating}
                                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <Reply className="w-4 h-4" />
                                Mark Replied
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-border"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-semibold text-foreground">{message.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a>
                                </div>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</h3>
                            <div className="bg-muted/30 p-6 rounded-xl border border-border whitespace-pre-wrap text-foreground leading-relaxed">
                                {message.message}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-6 border-t border-border flex flex-wrap gap-4">
                            <button
                                onClick={() => handleUpdateStatus('read')}
                                disabled={updating || message.status === 'read'}
                                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                Mark as Read
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('unread')}
                                disabled={updating || message.status === 'unread'}
                                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                Mark as Unread
                            </button>
                            <a 
                                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                className="ml-auto px-6 py-2 bg-violet-600 text-white text-sm font-bold rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                Reply via Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
