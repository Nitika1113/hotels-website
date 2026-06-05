
export interface Room {
  _id?: string;
  hotelId?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  maxGuests: number;
  adults: number;
  children: number;
  beds: { count: number; type: string };
  bathrooms: number;
  size: number;
  sizeUnit: "sqft" | "sqm";
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  featuredImage: string;
  images: string[];
  roomFeatures: string[];
  active: boolean;
}

export interface HotelFormData {
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  featuredImage?: string;
  gallery?: string[];
  propertyType?: string;
  starRating?: number;
  reviewScore?: number;
  reviewCount?: number;
  startingPrice?: number;
  roomCount?: number;
  featured?: boolean;
  active?: boolean;
  mostBooked?: boolean;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    address?: string;
  };
  amenities?: {
    facilities?: string[];
    roomFacilities?: string[];
    travelGroups?: string[];
    meals?: string[];
    popularFilters?: string[];
  };
  policies?: {
    checkIn?: string;
    checkOut?: string;
    petsAllowed?: boolean;
    smokingAllowed?: boolean;
  };
}

export interface HotelFormProps {
  initialData?: HotelFormData;
  initialRooms?: Room[];
  mode?: "create" | "edit";
}
