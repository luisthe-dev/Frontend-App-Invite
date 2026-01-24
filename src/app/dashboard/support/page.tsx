"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { supportApi } from "@/api/support";
import { Plus, MessageSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { SupportTicket } from "@/types/models";

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
        transaction_id: ''
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await supportApi.getTickets();
            setTickets(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await supportApi.createTicket(formData);
            setShowModal(false);
            setFormData({ subject: '', category: 'general', priority: 'medium', message: '', transaction_id: '' });
            fetchTickets();
        } catch (error) {
            alert('Failed to create ticket');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">Open</span>;
            case 'agent_reply': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase">Agent Replied</span>;
            case 'customer_reply': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold uppercase">Pending Agent</span>;
            case 'closed': return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">Closed</span>;
            case 'resolved': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Resolved</span>;
            default: return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
                    <p className="text-gray-500">Track your inquiries and disputes</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm shadow-violet-200"
                >
                    <Plus className="w-5 h-5" />
                    New Ticket
                </button>
            </div>

            {/* Content */}
            <div>
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                        <p className="text-gray-500 mb-6">Need help? Open a new support ticket to get started.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="text-violet-600 font-medium hover:underline"
                        >
                            Create your first ticket &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {tickets.map(ticket => (
                                <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block hover:bg-gray-50 transition-colors group">
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                ticket.status === 'closed' ? 'bg-gray-100 text-gray-400' : 
                                                ticket.category === 'dispute' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                                {ticket.category === 'dispute' ? <AlertCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">{ticket.subject}</h3>
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="capitalize">{ticket.category}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(ticket.updated_at).toLocaleDateString()}
                                                    </span>
                                                    {ticket.transaction_id && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Ref: {ticket.transaction_id.toString().substring(0,8)}...</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-gray-400 group-hover:transform group-hover:translate-x-1 transition-transform">
                                            &rarr;
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Open New Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select 
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="billing">Billing</option>
                                        <option value="dispute">Dispute Transaction</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select 
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            
                            {formData.category === 'dispute' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Transaction ID (Optional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter transaction reference"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none font-mono text-sm"
                                        value={formData.transaction_id}
                                        onChange={e => setFormData({...formData, transaction_id: e.target.value})}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea 
                                    required
                                    rows={4}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
                                >
                                    Create Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
