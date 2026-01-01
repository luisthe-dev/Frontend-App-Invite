"use client";

import { Upload, Calendar, MapPin, Plus, Trash2, Image as ImageIcon, CheckCircle2, ChevronRight, Hash, Clock, Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CreateEventPage() {
  const [tickets, setTickets] = useState([
    { name: 'General Admission', price: '0', quantity: '100' }
  ]);

  const addTicket = () => {
    setTickets([...tickets, { name: '', price: '', quantity: '' }]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-500 text-sm">Fill in the details below to publish your event.</p>
        </div>

        <div className="space-y-6">

            {/* 1. Basic Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">1</div>
                    <h2>Basic Information</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Event Title <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="e.g. Annual Tech Conference 2025" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all placeholder:text-gray-400 text-gray-900 text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Category <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm appearance-none bg-white">
                                    <option>Select Category</option>
                                    <option>Music</option>
                                    <option>Technology</option>
                                    <option>Business</option>
                                    <option>Food & Drink</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tags</label>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-violet-600/20 focus-within:border-violet-600 transition-all bg-white">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Add tags..." className="flex-1 focus:outline-none text-sm placeholder:text-gray-400" />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Networking</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Business</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Time & Venue */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">2</div>
                    <h2>Time & Venue</h2>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input type="time" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">End Date</label>
                            <div className="relative">
                                <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1.5">End Time</label>
                            <div className="relative">
                                <input type="time" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-1.5">Location <span className="text-red-500">*</span></label>
                        <div className="relative mb-3">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search venue or address" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm" />
                        </div>
                        {/* Map Placeholder */}
                        <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-gray-200">
                             Map Preview
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Tickets */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                 <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">3</div>
                    <h2>Tickets</h2>
                </div>

                <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative group">
                            <button onClick={() => removeTicket(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Ticket Name</label>
                                    <input type="text" placeholder="e.g. VIP" defaultValue={ticket.name} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₦)</label>
                                    <input type="number" placeholder="0.00" defaultValue={ticket.price} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                                    <input type="number" placeholder="100" defaultValue={ticket.quantity} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-600 text-sm bg-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button onClick={addTicket} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-violet-400 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Ticket Type
                    </button>
                </div>
            </div>

            {/* 4. Media */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-violet-600 font-medium">
                    <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-sm font-bold">4</div>
                    <h2>Media</h2>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>

                <div className="flex gap-4 mt-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 relative overflow-hidden group">
                           {/* Placeholder for uploaded preview */}
                           <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-6 h-6" />
                           </div>
                        </div>
                    ))}
                    <button className="w-24 h-24 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Preview Card Section */}
            <div>
                 <h2 className="text-lg font-bold text-gray-900 mb-4">Preview Event</h2>
                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:flex">
                     <div className="md:w-1/3 bg-gray-800 h-48 md:h-auto relative">
                        {/* Image Preview */}
                        <div className="absolute inset-0 flex items-center justify-center text-white/30">Event Image</div>
                     </div>
                     <div className="p-6 md:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-gray-900 text-lg">Annual Tech Conference 2025</h3>
                                <p className="text-violet-600 text-sm font-medium">Sat, Aug 12 • 9:00 AM</p>
                            </div>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Draft</span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-500 mb-4">
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Convention Center, San Francisco</p>
                            <p className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Technology</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                             <span className="font-bold text-gray-900">$299 - $599</span>
                             <button className="text-sm font-medium text-gray-500 underline">Preview Full Page</button>
                        </div>
                     </div>
                 </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
                 <button className="px-6 py-3 font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Save Draft
                </button>
                <button className="px-6 py-3 font-bold text-white bg-violet-600 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Event
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}
