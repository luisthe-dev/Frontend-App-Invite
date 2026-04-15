"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import BasicInfoStep from "./BasicInfoStep";
import TimeVenueStep from "./TimeVenueStep";
import TicketsStep from "./TicketsStep";
import MediaStep from "./MediaStep";
import { EventFormData, Ticket, MediaPreview, WizardState } from "./types";
import { eventsApi } from "@/api/events";

interface Props {
  initialData?: WizardState;
  isEdit?: boolean;
  onSubmit: (formData: FormData, deletedMediaIds: number[]) => Promise<void>;
  loading: boolean;
  errorMsg: string;
}

export default function EventWizard({
  initialData,
  isEdit = false,
  onSubmit,
  loading,
  errorMsg,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<EventFormData>(
    initialData?.formData || {
      title: "",
      category: "",
      description: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      location: "",
      lat: null,
      lng: null,
      image_url: "",
      tags: [],
      absorb_fees: false,
      is_date_tbd: false,
      is_location_tbd: false,
      is_online: false,
      online_link: "",
    }
  );

  const [tickets, setTickets] = useState<Ticket[]>(
    initialData?.tickets || [{ type: "", price: "", quantity: "", description: "", is_price_tbd: false }]
  );

  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>(
    initialData?.mediaPreviews || []
  );
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>(
    initialData?.deletedMediaIds || []
  );
  const [mediaFiles, setMediaFiles] = useState<File[]>(initialData?.mediaFiles || []);
  const [coverIndex, setCoverIndex] = useState(initialData?.coverIndex || 0);
  const [ticketsSold, setTicketsSold] = useState(initialData?.ticketsSold || 0);

  const [tagInput, setTagInput] = useState("");
  const [fees, setFees] = useState({ service: 5, tax: 8 });

  useEffect(() => {
    eventsApi
      .getPricingMeta()
      .then((data) => {
        if (data)
          setFees({
            service: data.service_fee_percentage,
            tax: data.tax_percentage,
          });
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = (e: any) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const newTags = paste
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    if (newTags.length > 0) {
      const uniqueNewTags = newTags.filter((tag) => !formData.tags.includes(tag));
      setFormData({ ...formData, tags: [...formData.tags, ...uniqueNewTags] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addTicket = () => {
    setTickets([...tickets, { type: "", price: "", quantity: "", description: "", is_price_tbd: false }]);
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

  const handleMediaPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Optional Max checks if needed (create vs edit logic varies slightly, limit to 8 sum total)
    const existingCount = mediaPreviews.length;
    const remainingSlots = 8 - existingCount;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => ({
      url: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as "image" | "video",
      file,
    }));

    setMediaFiles([...mediaFiles, ...filesToAdd]);
    setMediaPreviews([...mediaPreviews, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    const item = mediaPreviews[index];
    if (item.id) {
      setDeletedMediaIds([...deletedMediaIds, item.id]);
    } else if (item.file) {
      setMediaFiles(mediaFiles.filter((f) => f !== item.file));
    }
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));

    if (index === coverIndex) setCoverIndex(0);
    else if (index < coverIndex) setCoverIndex(coverIndex - 1);
  };

  const today = new Date();
  today.setDate(today.getDate() + 7);
  const minStartDate = today.toISOString().split("T")[0];

  const validateStep1 = () =>
    formData.title.trim() !== "" &&
    formData.category !== "" &&
    formData.description.trim() !== "";

  const validateStep2 = () =>
    (formData.is_date_tbd || (formData.start_date !== "" && formData.start_time !== "")) &&
    (formData.is_location_tbd || formData.is_online || formData.location.trim() !== "") &&
    (!formData.is_online || formData.online_link.trim() !== "");

  const validateStep3 = () =>
    tickets.length > 0 &&
    tickets.every(
      (t) => t.type.trim() !== "" && t.quantity.toString().trim() !== ""
    );

  const validateStep4 = () => mediaPreviews.length > 0;

  const canGoNext = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return false;
  };

  const isFormValid = useMemo(() => {
    return validateStep1() && validateStep2() && validateStep3() && validateStep4();
  }, [formData, tickets, mediaPreviews]);

  const handleSubmit = () => {
    if (!isFormValid) return;

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
    submissionData.append("absorb_fees", formData.absorb_fees ? "1" : "0");
    submissionData.append("is_date_tbd", formData.is_date_tbd ? "1" : "0");
    submissionData.append("is_location_tbd", formData.is_location_tbd ? "1" : "0");
    submissionData.append("is_online", formData.is_online ? "1" : "0");
    if (formData.online_link) submissionData.append("online_link", formData.online_link);

    formData.tags.forEach((tag) => {
      submissionData.append("tags[]", tag);
    });

    if (!isEdit) {
      submissionData.append("cover_index", String(coverIndex));
      mediaFiles.forEach((file) => {
        submissionData.append("media[]", file);
      });
      tickets.forEach((ticket, index) => {
        submissionData.append(`tickets[${index}][type]`, ticket.type);
        submissionData.append(`tickets[${index}][price]`, ticket.price);
        submissionData.append(`tickets[${index}][is_price_tbd]`, ticket.is_price_tbd ? "1" : "0");
        submissionData.append(`tickets[${index}][quantity]`, ticket.quantity);
      });
    } else {
      submissionData.append("_method", "PUT");
      tickets.forEach((t, index) => {
        if (t.id) submissionData.append(`tickets[${index}][id]`, String(t.id));
        submissionData.append(`tickets[${index}][type]`, t.type);
        submissionData.append(`tickets[${index}][price]`, String(t.price));
        submissionData.append(`tickets[${index}][is_price_tbd]`, t.is_price_tbd ? "1" : "0");
        submissionData.append(`tickets[${index}][quantity]`, String(t.quantity));
        if (t.description)
          submissionData.append(`tickets[${index}][description]`, t.description);
      });
      mediaFiles.forEach((file) => {
        submissionData.append("new_media[]", file);
      });
    }

    onSubmit(submissionData, deletedMediaIds);
  };

  const nextStep = () => {
    if (canGoNext()) setCurrentStep((prev) => prev + 1);
  };
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const stepNames = ["Basic Info", "Time & Venue", "Tickets", "Media"];

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative mb-2">
          {stepNames.map((name, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;

            return (
              <div
                key={stepNumber}
                className="flex flex-col items-center relative z-10"
              >
                <button
                  type="button"
                  onClick={() => {
                    // Allow navigating back instantly. Navigating forward requires validation.
                    if (stepNumber < currentStep) setCurrentStep(stepNumber);
                    if (
                      stepNumber > currentStep &&
                      stepNumber === currentStep + 1 &&
                      canGoNext()
                    )
                      setCurrentStep(stepNumber);
                  }}
                  disabled={
                    stepNumber > currentStep &&
                    !(stepNumber === currentStep + 1 && canGoNext())
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : isCompleted
                      ? "bg-primary text-primary-foreground cursor-pointer"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                </button>
                <div
                  className={`text-xs mt-2 font-medium hidden md:block ${
                    isActive || isCompleted
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {name}
                </div>
              </div>
            );
          })}
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-10 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleTagPaste={handleTagPaste}
            removeTag={removeTag}
          />
        )}
        {currentStep === 2 && (
          <TimeVenueStep
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            minStartDate={minStartDate}
          />
        )}
        {currentStep === 3 && (
          <TicketsStep
            formData={formData}
            setFormData={setFormData}
            tickets={tickets}
            addTicket={addTicket}
            removeTicket={removeTicket}
            updateTicket={updateTicket}
            fees={fees}
            ticketsSold={ticketsSold}
          />
        )}
        {currentStep === 4 && (
          <MediaStep
            mediaPreviews={mediaPreviews}
            mediaFilesLength={mediaFiles.length}
            coverIndex={coverIndex}
            setCoverIndex={setCoverIndex}
            handleMediaPick={handleMediaPick}
            removeMedia={removeMedia}
            uploading={loading}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1 || loading}
          className={`px-6 py-3 font-bold text-muted-foreground bg-card border border-border rounded-xl transition-colors ${
            currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:bg-muted"
          }`}
        >
          Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!canGoNext() || loading}
            className="px-6 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Next Step
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="px-6 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {isEdit ? "Update Event" : "Publish Event"}
          </button>
        )}
      </div>
    </div>
  );
}
