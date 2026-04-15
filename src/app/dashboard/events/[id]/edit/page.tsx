"use client";

import { Loader2, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { eventsApi } from "@/api/events";
import { hostApi } from "@/api/host";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import EventWizard from "@/components/events/wizard/EventWizard";
import { WizardState } from "@/components/events/wizard/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [initialData, setInitialData] = useState<WizardState | null>(null);

  // Fetch Event Data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await hostApi.getEventDetails(id);

        const startDateObj = new Date(data.event.start_date);
        const endDateObj = data.event.end_date
          ? new Date(data.event.end_date)
          : null;

        const formData = {
          title: data.event.title,
          category: data.event.category,
          description: data.event.description,
          start_date: data.event.is_date_tbd || !data.event.start_date ? "" : startDateObj.toISOString().split("T")[0],
          start_time: data.event.is_date_tbd || !data.event.start_date ? "" : startDateObj.toTimeString().slice(0, 5),
          end_date: endDateObj ? endDateObj.toISOString().split("T")[0] : "",
          end_time: endDateObj ? endDateObj.toTimeString().slice(0, 5) : "",
          location: data.event.location || "",
          lat: data.event.lat ? data.event.lat : null,
          lng: data.event.lng ? data.event.lng : null,
          image_url: data.event.image_url || "",
          tags: data.event.tags || [],
          absorb_fees: !!data.event.absorb_fees,
          is_date_tbd: !!data.event.is_date_tbd,
          is_location_tbd: !!data.event.is_location_tbd,
          is_online: !!data.event.is_online,
          online_link: data.event.online_link || "",
        };

        const mediaPreviews = [];
        if (data.event.media && data.event.media.length > 0) {
          mediaPreviews.push(
            ...data.event.media.map((m: any) => ({
              id: m.id,
              url: m.file_url,
              type: m.file_type || "image",
            }))
          );
        } else if (data.event.image_url) {
          mediaPreviews.push({ url: data.event.image_url, type: "image" as const });
        }

        const tickets = data.tickets && data.tickets.length > 0 
          ? data.tickets.map((t: any) => ({
              id: t.id,
              type: t.title,
              price: String(t.price),
              quantity: String(t.quantity || t.available_count),
              description: t.description || "",
              is_price_tbd: !!t.is_price_tbd,
            }))
          : [{ type: "", price: "", quantity: "", description: "", is_price_tbd: false }];

        const ticketsSold = data.stats?.tickets_sold || 0;

        setInitialData({
          formData,
          tickets,
          mediaPreviews,
          mediaFiles: [],
          deletedMediaIds: [],
          coverIndex: 0,
          ticketsSold,
        });
      } catch (err) {
        console.error("Failed to fetch event", err);
        setErrorMsg("Failed to load event details.");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleSubmit = async (submissionData: FormData, deletedMediaIds: number[]) => {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");

    try {
      deletedMediaIds.forEach((deletedId) => {
         submissionData.append("deleted_media_ids[]", String(deletedId));
      });

      await eventsApi.update(id, submissionData);
      success("Event updated successfully");
      router.push("/dashboard/events");
    } catch (err: any) {
      console.error("Update failed", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to update event. Please check all fields."
      );
      toastError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground text-sm">
            Update the details of your event.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-medium flex items-center gap-2">
            <X className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        <EventWizard 
          initialData={initialData} 
          isEdit 
          onSubmit={handleSubmit} 
          loading={loading} 
          errorMsg={errorMsg} 
        />
      </div>
    </div>
  );
}
