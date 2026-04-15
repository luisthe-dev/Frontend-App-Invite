"use client";

import { useState, useEffect } from "react";
import { MapPin, CalendarDays, Calendar, Globe, Clock, Monitor } from "lucide-react";
import { EventFormData } from "./types";
import axios from "axios";
import usePlacesAutocompleteNew from "@/hooks/usePlacesAutocompleteNew";

interface Props {
  formData: EventFormData;
  handleChange: (e: any) => void;
  setFormData: (data: EventFormData) => void;
  minStartDate?: string;
}

export default function TimeVenueStep({
  formData,
  handleChange,
  setFormData,
  minStartDate,
}: Props) {

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
    debounce: 700,
  });

  // Sync autocomplete value with formData.location
  useEffect(() => {
    setLocationValue(formData.location, false);
  }, [formData.location]);

  const handleSelectLocation = async (description: string) => {
    setLocationValue(description, false);
    clearLocationSuggestions();

    setFormData({
      ...formData,
      location: description,
    });

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          description
        )}&key=${apiKey}`
      );

      if (geocodeResponse.data.results.length > 0) {
        const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
        setFormData({
          ...formData,
          location: description,
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
    }
  };

  // Determine initial mode: if end_date exists and differs from start_date, it's multi-day
  const [isMultiDay, setIsMultiDay] = useState(() => {
    if (formData.end_date && formData.start_date) {
      return formData.end_date !== formData.start_date;
    }
    return false;
  });

  // When toggling to single day, sync end_date = start_date
  useEffect(() => {
    if (!isMultiDay && formData.start_date && !formData.is_date_tbd) {
      setFormData({ ...formData, end_date: formData.start_date });
    }
  }, [isMultiDay]);

  // When start_date changes in single-day mode, keep end_date in sync
  useEffect(() => {
    if (!isMultiDay && formData.start_date && !formData.is_date_tbd) {
      if (formData.end_date !== formData.start_date) {
        setFormData({ ...formData, end_date: formData.start_date });
      }
    }
  }, [formData.start_date]);

  const toggleDateTbd = () => {
    setFormData({
      ...formData,
      is_date_tbd: !formData.is_date_tbd,
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
    });
  };

  const toggleLocationTbd = () => {
    setFormData({
      ...formData,
      is_location_tbd: !formData.is_location_tbd,
      location: "",
      lat: null,
      lng: null,
      is_online: false,
    });
  };

  const toggleOnline = () => {
    setFormData({
      ...formData,
      is_online: !formData.is_online,
      is_location_tbd: false,
      location: formData.is_online ? "" : "Online",
      lat: null,
      lng: null,
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          2
        </div>
        <h2>Time & Venue</h2>
      </div>

      <div className="space-y-8">
        {/* Date Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              Event Date & Time
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={formData.is_date_tbd}
                onChange={toggleDateTbd}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Date is TBD
            </label>
          </div>

          {!formData.is_date_tbd && (
            <div className="space-y-5 p-4 bg-muted/30 rounded-2xl border border-border/50">
              {/* Single / Multi-day toggle */}
              <div>
                <div className="flex bg-muted p-1 rounded-xl w-full sm:w-fit">
                  <button
                    type="button"
                    onClick={() => setIsMultiDay(false)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                      !isMultiDay
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Single Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMultiDay(true)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                      isMultiDay
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    Multiple Days
                  </button>
                </div>
              </div>

              {isMultiDay ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Start Date
                    </label>
                    <input
                      name="start_date"
                      min={minStartDate}
                      value={formData.start_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Start Time
                    </label>
                    <input
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      End Date
                    </label>
                    <input
                      name="end_date"
                      min={formData.start_date}
                      value={formData.end_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      End Time
                    </label>
                    <input
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      type="time"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Event Date
                    </label>
                    <input
                      name="start_date"
                      min={minStartDate}
                      value={formData.start_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        Start Time
                      </label>
                      <input
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        type="time"
                        className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                        End Time
                      </label>
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
              )}
            </div>
          )}
        </div>

        {/* Venue Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Venue & Location
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_online}
                  onChange={toggleOnline}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Online Event
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={formData.is_location_tbd}
                  onChange={toggleLocationTbd}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Location is TBD
              </label>
            </div>
          </div>

          {!formData.is_location_tbd && !formData.is_online && (
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Enter event location or address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                value={locationValue}
                onChange={(e) => {
                  setLocationValue(e.target.value);
                  handleChange(e);
                }}
                name="location"
                disabled={!ready}
              />
              {/* Autocomplete Results */}
              {locationStatus === "OK" && (
                <ul className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto py-2">
                  {locationSuggestions.map(({ placeId, description }) => (
                    <li
                      key={placeId}
                      className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm flex items-center gap-3 transition-colors"
                      onClick={() => handleSelectLocation(description)}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="truncate">{description}</span>
                    </li>
                  ))}
                  {/* <li className="px-4 py-2 border-t border-border mt-2">
                    <div className="flex items-center justify-end">
                      <img
                        src="https://developers.google.com/static/maps/images/google_on_white.png"
                        alt="Powered by Google"
                        className="h-3"
                      />
                    </div>
                  </li> */}
                </ul>
              )}
            </div>
          )}

          {formData.is_online && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                <Monitor className="w-4 h-4" />
                <span>Online Event Coordination</span>
              </div>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  name="online_link"
                  value={formData.online_link}
                  onChange={handleChange}
                  type="url"
                  placeholder="Paste Zoom, Google Meet, or Event URL here"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                />
              </div>
              <p className="text-[10px] text-muted-foreground px-1 italic">
                Attendees will receive this link in their confirmation email and
                on their dashboard.
              </p>
            </div>
          )}

          {formData.is_location_tbd && (
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Location will be announced closer to the event date.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
