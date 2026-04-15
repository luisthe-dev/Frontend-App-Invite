"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";

const PLACES_AUTOCOMPLETE_URL =
  "https://places.googleapis.com/v1/places:autocomplete";

interface AutocompleteSuggestionItem {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface UsePlacesAutocompleteOptions {
  debounce?: number;
  requestOptions?: {
    includedRegionCodes?: string[];
    includedPrimaryTypes?: string[];
    locationBias?: object;
  };
}

export default function usePlacesAutocompleteNew({
  debounce = 300,
  requestOptions = {},
}: UsePlacesAutocompleteOptions = {}) {
  const [value, setValueState] = useState("");
  const [suggestions, setSuggestions] = useState<{
    status: string;
    data: AutocompleteSuggestionItem[];
    loading: boolean;
  }>({
    status: "",
    data: [],
    loading: false,
  });

  const requestOptionsKey = JSON.stringify(requestOptions);
  const fetchActiveRef = useRef(true);

  const fetchSuggestions = useCallback(
    async (val: string) => {
      if (!val) {
        setSuggestions({ status: "", data: [], loading: false });
        return;
      }

      setSuggestions((prev) => ({ ...prev, loading: true }));

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

        const response = await axios.post(
          PLACES_AUTOCOMPLETE_URL,
          {
            input: val,
            ...JSON.parse(requestOptionsKey),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
            },
          }
        );

        const results: any[] = response.data?.suggestions ?? [];

        const formattedSuggestions: AutocompleteSuggestionItem[] = results.map(
          (s: any) => {
            const pred = s.placePrediction;
            return {
              placeId: pred.placeId,
              description: pred.text?.text ?? "",
              mainText:
                pred.structuredFormat?.mainText?.text ?? pred.text?.text ?? "",
              secondaryText: pred.structuredFormat?.secondaryText?.text ?? "",
            };
          }
        );

        setSuggestions({
          status: formattedSuggestions.length > 0 ? "OK" : "ZERO_RESULTS",
          data: formattedSuggestions,
          loading: false,
        });
      } catch (error) {
        console.error("Places Autocomplete API error:", error);
        setSuggestions({ status: "ERROR", data: [], loading: false });
      }
    },
    [requestOptionsKey]
  );

  // Debounce logic using useEffect for rock stability
  useEffect(() => {
    // If we've programmatically set the value and shouldn't fetch, skip.
    if (!fetchActiveRef.current) {
      if (!value) {
        setSuggestions({ status: "", data: [], loading: false });
      }
      return;
    }

    if (!value || value.trim().length === 0) {
      setSuggestions({ status: "", data: [], loading: false });
      return;
    }

    const handler = setTimeout(() => {
      fetchSuggestions(value);
    }, debounce);

    return () => clearTimeout(handler);
  }, [value, debounce, fetchSuggestions]);

  const setValue = useCallback((val: string, shouldFetchData = true) => {
    fetchActiveRef.current = shouldFetchData;
    setValueState(val);
    
    // Immediately clear suggestions if fetching is disabled or value is empty
    if (!shouldFetchData || val.trim().length === 0) {
      setSuggestions({ status: "", data: [], loading: false });
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions({ status: "", data: [], loading: false });
  }, []);

  return {
    ready: true,
    value,
    suggestions,
    setValue,
    clearSuggestions,
  };
}
