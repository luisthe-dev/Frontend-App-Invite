"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import usePlacesAutocompleteNew from "@/hooks/usePlacesAutocompleteNew";

export default function EventsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value: locationValue,
    suggestions: { status: locationStatus, data: locationSuggestions, loading: locationLoading },
    setValue: setLocationValue,
    clearSuggestions: clearLocationSuggestions,
  } = usePlacesAutocompleteNew({
    requestOptions: {
      includedRegionCodes: ["ng"],
    },
    debounce: 300,
  });

  useEffect(() => {
    setLocationValue(location, false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");

    if (locationValue) params.set("location", locationValue);
    else params.delete("location");

    router.push(`/events?${params.toString()}`);
  };

  const handleSelectLocation = (description: string) => {
    setLocationValue(description, false);
    setLocation(description);
    clearLocationSuggestions();
    setIsDropdownVisible(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 bg-white p-2.5 md:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 relative z-40"
    >
      <div className="flex-[1.5] relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
        <input
          type="text"
          placeholder="Search events (e.g., 'Music Festival')"
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-50 transition-all text-sm md:text-base outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex-1 relative group" ref={dropdownRef}>
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
        <input
          type="text"
          placeholder="Location (e.g., 'Lagos')"
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-50 transition-all text-sm md:text-base outline-none"
          value={locationValue}
          onChange={(e) => {
            setLocationValue(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
          disabled={!ready}
        />
        
        {/* Autocomplete Results */}
        {isDropdownVisible && locationStatus === "OK" && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-64 overflow-y-auto py-2 z-50">
            {locationSuggestions.map(({ placeId, description }) => (
              <div
                key={placeId}
                className="px-4 py-3 hover:bg-violet-50 cursor-pointer text-sm flex items-center gap-3 transition-colors text-gray-700"
                onClick={() => handleSelectLocation(description)}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                   <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <span className="truncate">{description}</span>
              </div>
            ))}
            <div className="px-4 py-2 border-t border-gray-50 mt-2 flex justify-end">
               <img 
                 src="https://developers.google.com/static/maps/images/google_on_white.png" 
                 alt="Powered by Google" 
                 className="h-3 opacity-50"
               />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-8 py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
      >
        Find Events
      </button>
    </form>
  );
}
