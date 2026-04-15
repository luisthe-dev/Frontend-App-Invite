"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import usePlacesAutocompleteNew from "@/hooks/usePlacesAutocompleteNew";

interface PlaceAutocompleteProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export default function PlaceAutocomplete({ onSelect, defaultValue = "", className = "", placeholder }: PlaceAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocompleteNew({
    requestOptions: {
      includedRegionCodes: ["ng"], // Limit to Nigeria
    },
    debounce: 300,
  });

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultValue) {
        setValue(defaultValue, false);
    }
  }, [defaultValue, setValue]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = async (suggestion: any) => {
    const { description } = suggestion;
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          description
        )}&key=${apiKey}`
      );

      if (geocodeResponse.data.results.length > 0) {
        const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
        onSelect(description, lat, lng);
      }
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
    }
  };

  // Close on click outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (ref.current && !ref.current.contains(event.target as Node)) {
              setIsOpen(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={placeholder || "Search venue or address"}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-gray-900 text-sm ${className}`}
        />
        {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {status === "OK" && isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto py-1">
          {data.map((suggestion) => {
            const {
              placeId,
              mainText,
              secondaryText,
            } = suggestion;

            return (
              <li
                key={placeId}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
              >
                <p className="font-medium text-gray-900 text-sm">{mainText}</p>
                <p className="text-xs text-gray-500">{secondaryText}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
