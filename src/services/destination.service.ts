import { POPULAR_DESTINATIONS } from "@/constants/destination";

export async function getDestinations() {
  const response = await fetch("/api/hotels");

  const result = await response.json();

  const hotels = result.data;

  return POPULAR_DESTINATIONS.map(
    (destination) => {
      const count = hotels.filter(
        (hotel: any) =>
          hotel.location.toLowerCase() ===
          destination.name.toLowerCase()
      ).length;

      return {
        ...destination,
        count,
      };
    }
  );
}