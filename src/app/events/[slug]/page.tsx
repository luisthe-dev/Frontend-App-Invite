"use client";

import { Calendar, MapPin, Share2, Users, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventsApi } from "@/api/events";
import { formatCurrency } from "@/lib/utils";

export default function EventDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const faqs = [
    {
      q: "Is there a dress code for the event?",
      a: "Unless specified in the event description, the dress code is usually smart casual. Please check the 'About' section for specific details.",
    },
    {
      q: "Are meals included with the ticket?",
      a: "This depends on the ticket type. VIP tickets often include meal vouchers. Standard tickets may not.",
    },
    {
      q: "Will presentations be available after the event?",
      a: "Yes, presentation slides and recordings will be emailed to all attendees within 48 hours after the event concludes.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventsApi.getBySlug(slug as string);
        setEvent(data);

        // Initialize ticket counts
        const counts: Record<string, number> = {};
        if (data.tickets) {
          data.tickets.forEach((t: any) => (counts[t.id] = 0));
        }
        setTicketCounts(counts);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  const updateCount = (ticketId: string, delta: number) => {
    setTicketCounts((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const calculateTotal = () => {
    if (!event || !event.tickets) return 0;
    return event.tickets.reduce((acc: number, ticket: any) => {
      return acc + ticket.price * (ticketCounts[ticket.id] || 0);
    }, 0);
  };

  const total = calculateTotal();
  const paymentUrl = `/payment?event=${slug}&tickets=${encodeURIComponent(
    JSON.stringify(ticketCounts)
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">{error || "Event not found."}</p>
        <Link
          href="/events"
          className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors">
      {/* Hero Gallery */}
      <div className="relative w-full h-[500px] md:h-[600px] bg-muted/20 group">
        {event.media && event.media.length > 0 ? (
          <>
            {/* Active Media */}
            {event.media[activeMediaIndex || 0].file_type === "video" ? (
              <video
                src={event.media[activeMediaIndex || 0].file_url}
                controls
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <Image
                src={event.media[activeMediaIndex || 0].file_url}
                alt={event.title}
                fill
                className="object-cover opacity-80"
              />
            )}

            {/* Thumbnails */}
            {event.media.length > 1 && (
              <div className="absolute bottom-24 left-0 right-0 p-4 flex justify-center gap-2 overflow-x-auto z-20">
                {event.media.map((media: any, index: number) => (
                  <button
                    key={media.id}
                    onClick={() => setActiveMediaIndex(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeMediaIndex === index
                        ? "border-primary scale-110"
                        : "border-white/50 hover:border-white"
                    }`}
                  >
                    {media.file_type === "video" ? (
                      <video
                        src={media.file_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={media.file_url}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          // Fallback to old image_url or placeholder
          <>
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 opacity-80"></div>
            )}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Header Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-primary">
                <span className="bg-primary/10 px-3 py-1 rounded-full">
                  {event.category}
                </span>
                {event.status === "published" && (
                  <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">
                    Live
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location || "Online"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span>1,500+ Expected</span>
                </div>
              </div>
            </div>
            <div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                About This Event
              </h2>
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Host */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Host
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-muted rounded-full shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold text-muted-foreground">
                  {event.user ? (
                    <>
                      {(event.user.first_name?.[0] || "") +
                        (event.user.last_name?.[0] || "") ||
                        event.user.user_name?.[0]?.toUpperCase() ||
                        "H"}
                    </>
                  ) : (
                    <Users className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">
                      {event.user
                        ? `${event.user.first_name || ""} ${
                            event.user.last_name || ""
                          }`.trim() || event.user.user_name
                        : "Event Organizer"}
                    </h3>
                    <Check className="w-4 h-4 text-white bg-blue-500 rounded-full p-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    @{event.user?.user_name || "organizer"} • Verified Host
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This event is organized by a verified host on MyInvite.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <div
                      onClick={() => toggleFAQ(i)}
                      className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center group"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform ${
                          openFAQ === i ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFAQ === i && (
                      <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground bg-muted/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date & Time */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">
                Date & Time
              </h3>
              <div className="mb-4">
                <p className="font-semibold text-foreground">
                  {new Date(event.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_date).toLocaleTimeString()} -{" "}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
              </div>
              <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Add to Calendar
              </button>
            </div>

            {/* Location */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">
                Location
              </h3>
              <div className="bg-muted rounded-xl h-48 w-full mb-4 relative overflow-hidden flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <MapPin className="w-8 h-8 opacity-50" />
                  <span className="text-sm font-medium">
                    Map View Unavailable
                  </span>
                </div>
              </div>
              <p className="font-semibold text-foreground text-sm mb-4">
                {event.location || "Online"}
              </p>
              <div className="flex gap-4">
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Copy Address
                </button>
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Get Directions
                </button>
              </div>
            </div>

            {/* Tickets */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-foreground mb-6">
                Tickets
              </h3>

              <div className="space-y-6">
                {event.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket: any) => (
                    <div key={ticket.id}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-foreground">
                          {ticket.title}
                        </span>
                        <span className="font-bold text-foreground">
                          {formatCurrency(ticket.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between bg-muted rounded-lg p-1">
                        <button
                          onClick={() => updateCount(ticket.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-card rounded shadow-sm text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
                        >
                          -
                        </button>
                        <span className="font-medium text-sm w-8 text-center text-foreground">
                          {ticketCounts[ticket.id] || 0}
                        </span>
                        <button
                          onClick={() => updateCount(ticket.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-card rounded shadow-sm text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tickets available for this event.
                  </p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground font-medium">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {`₦${total.toLocaleString()}`}
                  </span>
                </div>
                <Link
                  href={paymentUrl}
                  className={`block w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-center shadow-lg shadow-primary/20 transition-all active:scale-[0.98] ${
                    total === 0 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  Purchase Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">
              {`₦${total.toLocaleString()}`}
            </p>
          </div>
          <Link
            href={paymentUrl}
            className={`px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 ${
              total === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Purchase Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
