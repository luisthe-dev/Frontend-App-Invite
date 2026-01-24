"use client";

import { Upload, Calendar, MapPin, Plus, Trash2, CheckCircle2, ChevronRight, Hash, Loader2, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { eventsApi } from "@/api/events";
import { hostApi } from "@/api/host";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { success, error: toastError } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
      title: '',
      category: '',
      description: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      location: '',
      lat: null as number | null,
      lng: null as number | null,
      image_url: '',
      tags: [] as string[]
  });

  const [tickets, setTickets] = useState([
    { type: 'General Admission', price: '0', quantity: '100', description: '' }
  ]);

  const [tagInput, setTagInput] = useState('');

  // Fetch Event Data
  useEffect(() => {
      const fetchEvent = async () => {
          try {
              // Use hostApi to get full details for editing
              const data = await hostApi.getEventDetails(id);
              
              // Parse dates
              const startDateObj = new Date(data.event.start_date);
              const endDateObj = data.event.end_date ? new Date(data.event.end_date) : null;

              setFormData({
                  title: data.event.title,
                  category: data.event.category,
                  description: data.event.description,
                  start_date: startDateObj.toISOString().split('T')[0],
                  start_time: startDateObj.toTimeString().slice(0, 5),
                  end_date: endDateObj ? endDateObj.toISOString().split('T')[0] : '',
                  end_time: endDateObj ? endDateObj.toTimeString().slice(0, 5) : '',
                  location: data.event.location,
                  lat: data.event.lat ? data.event.lat : null,
                  lng: data.event.lng ? data.event.lng : null,
                  image_url: data.event.image_url || '',
                  tags: data.event.tags || [] 
              });

              if (data.tickets && data.tickets.length > 0) {
                  setTickets(data.tickets.map((t: any) => ({
                      id: t.id, // Keep ID for updates
                      type: t.title, // Map title back to type
                      price: t.price,
                      quantity: t.quantity || t.available_count, // Fallback
                      description: t.description || ''
                  })));
              }

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

  const handleChange = (e: any) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTicket = () => {
    setTickets([...tickets, { type: '', price: '', quantity: '', description: '' }]);
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

  const handleImageUpload = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
          const res = await eventsApi.uploadImage(file);
          setFormData({ ...formData, image_url: res.file_url });
      } catch (err) {
          console.error("Upload failed", err);
          toastError("Failed to upload image");
      } finally {
          setUploading(false);
      }
  };

  const handleAddTag = (e: any) => {
      if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
          e.preventDefault();
          setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
          setTagInput('');
      }
  };

  const handleTagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const paste = e.clipboardData.getData('text');
      const newTags = paste.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      if (newTags.length > 0) {
          const uniqueNewTags = newTags.filter(tag => !formData.tags.includes(tag));
          setFormData({ ...formData, tags: [...formData.tags, ...uniqueNewTags] });
      }
  };

  const removeTag = (tagToRemove: string) => {
      setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async () => {
      if (!id) return;
      setLoading(true);
      setErrorMsg('');

      try {
          // Combine date and time
          const startDateTime = `${formData.start_date} ${formData.start_time}`;
          const endDateTime = formData.end_date && formData.end_time ? `${formData.end_date} ${formData.end_time}` : null;

          const payload = {
              title: formData.title,
              category: formData.category,
              description: formData.description,
              start_date: startDateTime,
              end_date: endDateTime, 
              location: formData.location,
              lat: formData.lat,
              lng: formData.lng,
              image_url: formData.image_url,
              tags: formData.tags,
              tickets: tickets.map(t => ({
                  id: (t as any).id, // Send ID for updates
                  type: t.type,
                  price: parseFloat(t.price),
                  quantity: parseInt(t.quantity),
                  description: t.description
              }))
          };
          await eventsApi.update(id, payload);
          success("Event updated successfully");
          router.push('/dashboard/events');
      } catch (err: any) {
          console.error("Update failed", err);
          setErrorMsg(err.response?.data?.message || "Failed to update event. Please check all fields.");
          toastError("Failed to update event");
      } finally {
          setLoading(false);
      }
  };

  const isFormValid = useMemo(() => {
    return (
        formData.title.trim() !== '' &&
        formData.category !== '' &&
        formData.description.trim() !== '' &&
        formData.start_date !== '' &&
        formData.start_time !== '' &&
        formData.location.trim() !== '' &&
        tickets.length > 0 &&
        tickets.every(t => t.type.trim() !== '' && t.quantity.toString().trim() !== '')
    );
  }, [formData, tickets]);

  if (fetching) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
        
        {/* Header */}
        <div className="mb-8">
            <Link href="/dashboard/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
            <p className="text-muted-foreground text-sm">Update the details of your event.</p>
        </div>

        {errorMsg && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-medium flex items-center gap-2">
                <X className="w-4 h-4" />
                {errorMsg}
            </div>
        )}

        <div className="space-y-6">

            {/* 1. Basic Information */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-primary font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">1</div>
                    <h2>Basic Information</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">Event Title <span className="text-destructive">*</span></label>
                        <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Annual Tech Conference 2025" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">Description <span className="text-destructive">*</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe your event..." className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">Category <span className="text-destructive">*</span></label>
                            <div className="relative">
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm appearance-none">
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
                            <label className="block text-sm font-semibold text-foreground mb-1.5">Tags</label>
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
                                {formData.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                                        {tag}
                                        <button onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-destructive"/></button>
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
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">2</div>
                    <h2>Time & Venue</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">Start Date <span className="text-destructive">*</span></label>
                            <div className="relative">
                                <input name="start_date" value={formData.start_date} onChange={handleChange} type="date" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">Start Time <span className="text-destructive">*</span></label>
                            <div className="relative">
                                <input name="start_time" value={formData.start_time} onChange={handleChange} type="time" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">End Date</label>
                            <div className="relative">
                                <input name="end_date" min={formData.start_date} value={formData.end_date} onChange={handleChange} type="date" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1.5">End Time</label>
                            <div className="relative">
                                <input name="end_time" value={formData.end_time} onChange={handleChange} type="time" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">Location <span className="text-destructive">*</span></label>
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
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">3</div>
                    <h2>Tickets</h2>
                </div>

                <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border bg-muted/30 relative group">
                            <button onClick={() => removeTicket(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Ticket Name</label>
                                    <input type="text" placeholder="e.g. VIP" value={ticket.type} onChange={(e) => updateTicket(index, 'type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground" />
                                </div>
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (₦)</label>
                                    <input type="number" placeholder="0.00" value={ticket.price} onChange={(e) => updateTicket(index, 'price', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground" />
                                </div>
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Quantity</label>
                                    <input type="number" placeholder="100" value={ticket.quantity} onChange={(e) => updateTicket(index, 'quantity', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground" />
                                </div>
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                                    <input type="text" placeholder="Short description" value={ticket.description} onChange={(e) => updateTicket(index, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:border-primary text-sm text-foreground" />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button onClick={addTicket} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground font-medium hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Ticket Type
                    </button>
                </div>
            </div>

            {/* 4. Media */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-primary font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">4</div>
                    <h2>Media</h2>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <p className="font-medium text-foreground">{uploading ? 'Uploading...' : 'Click to update image or drag and drop'}</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>

                {formData.image_url && (
                    <div className="mt-6 w-full h-48 rounded-xl overflow-hidden relative border border-input">
                        <img src={formData.image_url} alt="Event Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => setFormData({...formData, image_url: ''})}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-destructive hover:bg-white"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
                 <button onClick={() => router.push('/dashboard/events')} className="px-6 py-3 font-bold text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors">
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit} 
                    disabled={loading || !isFormValid}
                    className="px-6 py-3 font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Update Event
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}
