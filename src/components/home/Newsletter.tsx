"use client";

import { Mail } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Never Miss an Event
            </h2>
            <p className="text-gray-500 mb-6">
                Subscribe to our newsletter and be the first to know about upcoming events, exclusive offers, and personalized recommendations sent straight to your inbox.
            </p>
            
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Weekly Updates</h4>
                    <p className="text-sm text-gray-500">Curated events based on your interests.</p>
                </div>
            </div>
        </div>

        <div className="w-full md:w-5/12 bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-4">Join Our Newsletter</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email" 
                        placeholder="you@example.com" 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                </div>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Interests</label>
                     <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-gray-700">
                        <option>Select your interests</option>
                        <option>Music</option>
                        <option>Sports</option>
                        <option>Arts</option>
                     </select>
                </div>
                <button className="w-full py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                    Subscribe Now
                </button>
            </div>
        </div>

      </div>
    </section>
  );
}
