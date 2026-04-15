export interface Ticket {
  id?: number;
  type: string;
  price: string;
  quantity: string;
  description?: string;
  is_price_tbd?: boolean;
}

export interface MediaPreview {
  id?: number;
  url: string;
  type: "image" | "video";
  file?: File;
}

export interface EventFormData {
  title: string;
  category: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  location: string;
  lat: number | null;
  lng: number | null;
  image_url: string;
  tags: string[];
  absorb_fees: boolean;
  is_date_tbd: boolean;
  is_location_tbd: boolean;
  is_online: boolean;
  online_link: string;
}

export interface WizardState {
  formData: EventFormData;
  tickets: Ticket[];
  mediaPreviews: MediaPreview[];
  deletedMediaIds: number[];
  mediaFiles: File[];
  coverIndex: number;
  ticketsSold: number;
}
