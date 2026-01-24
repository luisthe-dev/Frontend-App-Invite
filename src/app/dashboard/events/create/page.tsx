"use client";

import { Upload, Calendar, MapPin, Plus, Trash2, CheckCircle2, ChevronRight, Hash, Loader2, X, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { eventsApi } from "@/api/events";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function CreateEventPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    lat: null as number | null,
    lng: null as number | null,
    tags: [] as string[],
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const [tickets, setTickets] = useState([
    { type: "General Admission", price: "0", quantity: "100" },
  ]);

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTicket = () => {
    setTickets([...tickets, { type: "", price: "", quantity: "" }]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicket = (index: number, field: string, value: string) => {
    const newTickets = [...tickets];
    // @ts-ignore
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  const handleMediaPick = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (!files.length) return;

    const remainingSlots = 8 - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/")
        ? "video"
        : ("image" as "image" | "video"),
    }));

    setMediaFiles([...mediaFiles, ...filesToAdd]);
    setMediaPreviews([...mediaPreviews, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);

    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);

    if (index === coverIndex) setCoverIndex(0);
    else if (index < coverIndex) setCoverIndex(coverIndex - 1);
  };

  const handleAddTag = (e: any) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const newTags = paste
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    if (newTags.length > 0) {
      const uniqueNewTags = newTags.filter(
        (tag) => !formData.tags.includes(tag)
      );
      setFormData({ ...formData, tags: [...formData.tags, ...uniqueNewTags] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const startDateTime = `${formData.start_date} ${formData.start_time}`;
      const endDateTime =
        formData.end_date && formData.end_time
          ? `${formData.end_date} ${formData.end_time}`
          : null;

      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("category", formData.category);
      submissionData.append("description", formData.description);
      submissionData.append("start_date", startDateTime);
      if (endDateTime) submissionData.append("end_date", endDateTime);
      submissionData.append("location", formData.location);
      if (formData.lat) submissionData.append("lat", String(formData.lat));
      if (formData.lng) submissionData.append("lng", String(formData.lng));

      submissionData.append("cover_index", String(coverIndex));

      mediaFiles.forEach((file) => {
        submissionData.append("media[]", file);
      });

      tickets.forEach((ticket, index) => {
        submissionData.append(`tickets[${index}][type]`, ticket.type);
        submissionData.append(`tickets[${index}][price]`, ticket.price);
        submissionData.append(`tickets[${index}][quantity]`, ticket.quantity);
      });

      await eventsApi.create(submissionData);
      success("Event created successfully!");
      router.push("/dashboard/events");
    } catch (err: any) {
      console.error("Create failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please check all fields."
      );
      toastError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setDate(today.getDate() + 7);
  const minStartDate = today.toISOString().split('T')[0];

  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() !== "" &&
      formData.category !== "" &&
      formData.description.trim() !== "" &&
      formData.start_date !== "" &&
      formData.start_time !== "" &&
      formData.location.trim() !== "" &&
      tickets.length > 0 &&
      tickets.every((t) => t.type.trim() !== "" && t.quantity.trim() !== "") &&
      mediaFiles.length > 0
    );
  }, [formData, tickets, mediaFiles]);

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
        <div className="mb-8">
           <Link href="/dashboard/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
           </Link>
          <h1 className="text-2xl font-bold text-foreground">Create New Event</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the details below to publish your event.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-medium flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 1. Basic Information */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-primary font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2>Basic Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Event Title <span className="text-destructive">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Annual Tech Conference 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your event..."
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Music">Music</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Food & Drink">Food & Drink</option>
                      <option value="Arts">Arts</option>
                      <option value="Sports">Sports</option>
                      <option value="Wellness">Wellness</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Tags
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Add tags (Press Enter)..."
                      className="flex-1 focus:outline-none text-sm placeholder:text-muted-foreground bg-transparent text-foreground"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      onPaste={handleTagPaste}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3 hover:text-destructive" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Time & Venue */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-primary font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h2>Time & Venue</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Start Date <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="start_date"
                      min={minStartDate}
                      value={formData.start_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Start Time <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      name="end_date"
                      min={formData.start_date}
                      value={formData.end_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Location <span className="text-destructive">*</span>
                </label>
                <div className="relative mb-3">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter event location or address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tickets */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-primary font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h2>Tickets</h2>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border bg-muted/30 relative group"
                >
                  <button
                    onClick={() => removeTicket(index)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Ticket Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP"
                        value={ticket.type}
                        onChange={(e) =>
                          updateTicket(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicket(index, "price", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={ticket.quantity}
                        onChange={(e) =>
                          updateTicket(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addTicket}
                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground font-medium hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Ticket Type
              </button>
            </div>
          </div>

          {/* 4. Media */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-primary font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <h2>Media (Max 8)</h2>
            </div>

            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaPick}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={mediaFiles.length >= 8}
              />
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-medium text-foreground">
                Click or drag images/videos here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                First image is the cover. Max 8 files.
              </p>
            </div>

            {/* Media Grid */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {mediaPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 ${
                      index === coverIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    {preview.type === "video" ? (
                      <video
                        src={preview.url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors group">
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-destructive hover:bg-white shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setCoverIndex(index)}
                          className={`text-xs px-2 py-1 rounded-md font-medium shadow-sm ${
                            index === coverIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {index === coverIndex
                            ? "Cover Image"
                            : "Set as Cover"}
                        </button>
                      </div>
                    </div>
                    {index === coverIndex && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => router.push("/dashboard/events")}
              className="px-6 py-3 font-bold text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="px-6 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Publish Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
