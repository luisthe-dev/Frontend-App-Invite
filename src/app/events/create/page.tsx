"use client";

import { Upload, Calendar, MapPin, Plus, Trash2, Image as ImageIcon, CheckCircle2, ChevronRight, Hash, Clock, Globe, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { eventsApi } from "@/api/events";
import { useRouter } from "next/navigation";
export default function CreateEventPage() {
  const router = useRouter();
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

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData({ ...formData, location: address, lat, lng });
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

    if (files.length > remainingSlots) {
      // Optional: Notify user about limit
    }

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

    // Adjust cover index if needed
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

      // Append array of files
      mediaFiles.forEach((file) => {
        submissionData.append("media[]", file);
      });

      // Append tickets manually as array of objects for PHP
      tickets.forEach((ticket, index) => {
        submissionData.append(`tickets[${index}][type]`, ticket.type);
        submissionData.append(`tickets[${index}][price]`, ticket.price);
        submissionData.append(`tickets[${index}][quantity]`, ticket.quantity);
      });

      await eventsApi.create(submissionData);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Create failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please check all fields."
      );
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 text-sm">
            Fill in the details below to publish your event.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2>Basic Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Annual Tech Conference 2025"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your event..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm appearance-none bg-white"
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
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Tags
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-violet-600/20 focus-within:border-violet-600 transition-all bg-white">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Add tags (Press Enter)..."
                      className="flex-1 focus:outline-none text-sm placeholder:text-gray-400"
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
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Time & Venue */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h2>Time & Venue</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="start_date"
                      min={minStartDate}
                      value={formData.start_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      name="end_date"
                      min={formData.start_date}
                      value={formData.end_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-3">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter event location or address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tickets */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h2>Tickets</h2>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group"
                >
                  <button
                    onClick={() => removeTicket(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Ticket Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VIP"
                        value={ticket.type}
                        onChange={(e) =>
                          updateTicket(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Price (₦)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicket(index, "price", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={ticket.quantity}
                        onChange={(e) =>
                          updateTicket(index, "quantity", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addTicket}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-violet-400 hover:text-violet-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Ticket Type
              </button>
            </div>
          </div>

          {/* 4. Media */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
              <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <h2>Media (Max 8)</h2>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaPick}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={mediaFiles.length >= 8}
              />
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-medium text-gray-900">
                Click or drag images/videos here
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
                        ? "border-violet-600 ring-2 ring-violet-200"
                        : "border-gray-100"
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
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-white shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setCoverIndex(index)}
                          className={`text-xs px-2 py-1 rounded-md font-medium shadow-sm ${
                            index === coverIndex
                              ? "bg-violet-600 text-white"
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
                      <div className="absolute top-2 left-2 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Card Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Preview Event
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:flex">
              <div className="md:w-1/3 bg-gray-100 h-48 md:h-auto relative">
                {mediaPreviews.length > 0 &&
                mediaPreviews[coverIndex]?.type === "image" ? (
                  <img
                    src={mediaPreviews[coverIndex].url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                    Event Image
                  </div>
                )}
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {formData.title || "Event Title"}
                    </h3>
                    <p className="text-violet-600 text-sm font-medium">
                      {formData.start_date
                        ? new Date(formData.start_date).toLocaleDateString()
                        : "Date"}{" "}
                      • {formData.start_time || "Time"}
                    </p>
                  </div>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    Draft
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-500 mb-4">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />{" "}
                    {formData.location || "Location"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />{" "}
                    {formData.category || "Category"}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-bold text-gray-900">
                    {tickets.length > 0
                      ? `₦${Math.min(
                          ...tickets.map((t) => parseFloat(t.price) || 0)
                        )} - ₦${Math.max(
                          ...tickets.map((t) => parseFloat(t.price) || 0)
                        )}`
                      : "Price Range"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="px-6 py-3 font-bold text-white bg-violet-600 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
