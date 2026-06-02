export interface Hotel {
  _id?: string;

  name: string;
  slug: string;
  description: string;

  featuredImage: string;
  gallery: string[];

  propertyType: string;

  starRating: number;

  reviewScore: number;
  reviewCount: number;

  startingPrice: number;

  featured: boolean;
  active: boolean;

  location: {
    country: string;
    state: string;
    city: string;
    address: string;

    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  amenities: {
    facilities: string[];
    roomFacilities: string[];
    travelGroups: string[];
    meals: string[];
    popularFilters: string[];
  };

  policies: {
    checkIn: string;
    checkOut: string;

    petsAllowed: boolean;
    smokingAllowed: boolean;
  };

  nearbyPlaces: {
    name: string;
    type: string;
    distance: number;
  }[];

  roomCount: number;

  highlights: string[];

  mostBooked?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}