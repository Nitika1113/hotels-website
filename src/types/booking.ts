export interface Booking {
  _id?: string;
  hotelId:   string;
  hotelName: string;
  hotelSlug: string;
  roomId:    string;
  roomName:  string;

  // Guest info
  guestName:  string;
  guestEmail: string;
  guestPhone: string;

  // Stay details
  checkIn:    string; // ISO date string
  checkOut:   string;
  nights:     number;
  adults:     number;
  children:   number;
  rooms:      number;

  // Pricing
  pricePerNight: number;
  totalPrice:    number;

  // Status
  status: "pending" | "confirmed" | "cancelled" | "completed";

  // Special requests
  specialRequests?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
