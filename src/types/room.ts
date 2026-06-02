export interface Room {
    _id?: string;
    hotelId: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    maxGuests: number;
    adults: number;
    children: number;
    beds: {
        count: number;
        type: string;
    };
    bathrooms: number;

    size: number;
    sizeUnit: "sqft" | "sqm";
    freeCancellation: boolean;
    breakfastIncluded: boolean;
    featuredImage: string;
    images: string[];
    roomFeatures: string[];
    active: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}