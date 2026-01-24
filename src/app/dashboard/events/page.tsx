"use client";

import { useState, useEffect, MouseEvent } from "react";
import { hostApi } from "@/api/host";
import { authService } from "@/api/auth";
import { eventsApi } from "@/api/events";
import { Plus, Search, Filter, MoreVertical, Calendar, DollarSign, Users, Trash2, Globe, FileEdit, Eye, Ban, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { formatCurrency } from "@/lib/utils";


export default function MyEventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [showKycModal, setShowKycModal] = useState(false);

    const handleCreateEvent = (e: React.MouseEvent) => {
        e.preventDefault();
        const currentUser = authService.getCurrentUser();
        if (currentUser?.kyc_status !== 'verified') {
            setShowKycModal(true);
        } else {
             router.push('/dashboard/events/create');
        }
    };

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'publish' | 'draft' | 'delete' | null;
        eventId: string | null;
        title: string;
        message: string;
        isDestructive: boolean;
    }>({
        isOpen: false,
        type: null,
        eventId: null,
        title: '',
        message: '',
        isDestructive: false
    });

    const fetchEvents = async () => {
        try {
            const data = await hostApi.getEvents();
            setEvents(data.data);
        } catch (error) {
            console.error("Failed to fetch host events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (e: MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const confirmAction = (type: 'publish' | 'draft' | 'delete', eventId: string) => {
        const config = {
            isOpen: true,
            type,
            eventId,
            title: '',
            message: '',
            isDestructive: false
        };

        if (type === 'publish') {
            config.title = 'Publish Event';
            config.message = 'Are you sure you want to publish this event? It will be visible to everyone.';
        } else if (type === 'draft') {
            config.title = 'Unpublish Event';
            config.message = 'Are you sure you want to unpublish this event? It will be hidden from the public.';
            config.isDestructive = true;
        } else if (type === 'delete') {
            config.title = 'Delete Event';
            config.message = 'Are you sure you want to delete this event? This action cannot be undone.';
            config.isDestructive = true;
        }

        setModalConfig(config);
        setOpenDropdownId(null); // Close dropdown
    };

    const executeAction = async () => {
        if (!modalConfig.eventId || !modalConfig.type) return;

        try {
            if (modalConfig.type === 'publish') {
                await eventsApi.publish(modalConfig.eventId);
            } else if (modalConfig.type === 'draft') {
                await eventsApi.update(modalConfig.eventId, { status: 'draft' });
            } else if (modalConfig.type === 'delete') {
                await eventsApi.delete(modalConfig.eventId);
            }
            fetchEvents();
        } catch (error) {
            console.error(error);
            // Optional: Show error toast instead of alert, but for now console log is safer than simple alert if requests fail
        }
    };

    return (
      <div className="min-h-screen bg-muted/10 pb-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Events
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your upcoming and past events.
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          {/* Filters */}
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <select className="px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted focus:outline-none">
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Ended</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-card rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  className="relative bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row items-center gap-6 hover:border-primary/20 transition-colors cursor-pointer group"
                >
                  <div className="w-full md:w-24 h-24 bg-muted rounded-lg shrink-0 overflow-hidden relative">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        <Calendar className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === "published"
                            ? "bg-green-500/10 text-green-600"
                            : event.status === "draft"
                              ? "bg-muted text-muted-foreground"
                              : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />{" "}
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />{" "}
                        {event.tickets_sold || 0} Sold
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />{" "}
                        {formatCurrency(event.revenue || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 relative">
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 md:flex-none px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-muted text-sm text-center transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => toggleDropdown(e, event.id)}
                      className={`p-2 rounded-lg transition-colors ${openDropdownId === event.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openDropdownId === event.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden transform origin-top-right">
                        <div className="py-1">
                          <Link
                            href={`/events/${event.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />{" "}
                            View Event
                          </Link>
                          {event.status !== "published" ? (
                            <button
                              onClick={() => confirmAction("publish", event.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted text-left transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                              Publish Event
                            </button>
                          ) : (
                            <button
                              onClick={() => confirmAction("draft", event.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted text-left transition-colors"
                            >
                              <Ban className="w-4 h-4 text-orange-500" />{" "}
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => confirmAction("delete", event.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 text-left border-t border-border transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Event
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No events found
              </h3>
              <p className="text-muted-foreground mt-2 mb-6">
                You haven't created any events yet.
              </p>
              <Link
                href="/dashboard/events/create"
                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create API Event
              </Link>
            </div>
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            onConfirm={executeAction}
            title={modalConfig.title}
            message={modalConfig.message}
            variant={modalConfig.isDestructive ? "danger" : "primary"}
          />

          <ConfirmationModal
            isOpen={showKycModal}
            onClose={() => setShowKycModal(false)}
            onConfirm={async () => router.push("/dashboard/settings")}
            title="Identity Verification Required"
            message="You need to verify your identity before creating events. Please go to Settings to complete the verification process."
            variant="primary"
            confirmLabel="Go to Settings"
          />
        </div>
      </div>
    );
}
