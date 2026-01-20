"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { adminApi } from "@/api/admin";
import { Loader2, ArrowLeft, Calendar, MapPin, User, Mail, DollarSign, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import RestockModal from "../../components/RestockModal";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminEventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  
  // Modal States
  const [restockTicket, setRestockTicket] = useState<any>(null);
  const [actionModal, setActionModal] = useState<{
      isOpen: boolean;
      type: 'approve' | 'reject' | 'delete' | null;
  }>({ isOpen: false, type: null });

  const fetchEvent = async () => {
    if (!id) return;
    try {
      const data = await adminApi.getEvent(id);
      setEvent(data.data);
    } catch (error) {
      console.error("Failed to fetch event", error);
      // router.push("/admin/events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const handleActionConfirm = async () => {
      const action = actionModal.type;
      if (!action) return;
      
      try {
          if (action === 'approve') await adminApi.approveEvent(id);
          if (action === 'reject') await adminApi.rejectEvent(id);
          if (action === 'delete') {
              await adminApi.deleteEvent(id);
              router.push("/admin/events");
              return;
          }
          await fetchEvent(); // Refresh state
      } catch (error) {
          console.error(`Failed to ${action} event`, error);
          // Ideally show a toast here
      }
  };

  const openActionModal = (type: 'approve' | 'reject' | 'delete') => {
      setActionModal({ isOpen: true, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!event) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
            <p className="mb-4">Event not found</p>
            <button 
                onClick={() => router.push("/admin/events")}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-900"
            >
                Back to Events
            </button>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      {/* Modals */}
      <RestockModal
        isOpen={!!restockTicket}
        onClose={() => setRestockTicket(null)}
        ticketTitle={restockTicket?.title}
        onConfirm={async (qty) => {
          await adminApi.restockTicket(restockTicket.id, qty);
          await fetchEvent();
        }}
      />

      <ConfirmationModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleActionConfirm}
        title={
          actionModal.type === "delete"
            ? "Delete Event"
            : actionModal.type === "approve"
              ? "Approve Event"
              : "Suspend Event"
        }
        message={
          actionModal.type === "delete"
            ? "Are you sure you want to permanently delete this event? This action cannot be undone."
            : actionModal.type === "approve"
              ? "Are you sure you want to approve this event? It will become visible to all users."
              : "Are you sure you want to suspend this event? Users will no longer be able to purchase tickets."
        }
        variant={
          actionModal.type === "delete"
            ? "danger"
            : actionModal.type === "approve"
              ? "primary"
              : "warning"
        }
        confirmLabel={
          actionModal.type === "delete"
            ? "Delete"
            : actionModal.type === "approve"
              ? "Approve"
              : "Suspend"
        }
      />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {event.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold tracking-wide border 
                        ${event.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ""}
                        ${event.status === "draft" ? "bg-slate-100 text-slate-700 border-slate-200" : ""}
                        ${event.status === "suspended" ? "bg-red-50 text-red-700 border-red-100" : ""}
                    `}
            >
              {event.status}
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(event.start_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {event.status !== "published" && (
            <button
              onClick={() => openActionModal("approve")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          )}
          {event.status === "published" && (
            <button
              onClick={() => openActionModal("reject")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium border border-orange-200"
            >
              <XCircle className="w-4 h-4" />
              Suspend
            </button>
          )}
          <button
            onClick={() => openActionModal("delete")}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 shadow-sm group">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                No Cover Image
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-lg">
              Description
            </h3>
            <div className="prose prose-sm text-slate-600 max-w-none leading-relaxed">
              {event.description}
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Tickets
              </h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-xs uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {event.tickets?.map((ticket: any) => {
                  const sold = ticket.purchased_tickets_count || 0;
                  const remaining = ticket.quantity;

                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {ticket.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">
                          {ticket.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {formatCurrency(ticket.price)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{sold}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${remaining > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}
                        >
                          {remaining} left
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setRestockTicket(ticket)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg hover:shadow-sm border border-transparent hover:border-blue-100 transition-all"
                            title="Restock"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!event.tickets || event.tickets.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No tickets created for this event.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Host Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-600" />
              Host Details
            </h3>
            <Link
              href={`/admin/users/${event.user?.id}`}
              className="flex items-start gap-4 group hover:bg-slate-50 -m-2 p-2 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg border-2 border-white shadow-sm group-hover:bg-white transition-colors">
                {(event.user?.name || "U").charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                  {event.user?.name || "Unknown"}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Mail className="w-3 h-3" />
                  {event.user?.email}
                </div>
              </div>
            </Link>
          </div>

          {/* Sales Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                  Sold
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {event.purchased_tickets_count || 0}
                </p>
              </div>
              {/* We'd need total sales amount from backend to make this accurate per event */}
              <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <p className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider mb-1">
                  Revenue
                </p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(event.total_revenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
