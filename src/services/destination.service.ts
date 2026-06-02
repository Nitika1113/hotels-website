import { POPULAR_DESTINATIONS } from "@/constants/destination";

export async function getDestinations() {
  const response = await fetch("/api/hotels");
  const result = await response.json();
  const hotels = result.data;

  return POPULAR_DESTINATIONS.map((destination) => {
    const count = hotels.filter((hotel: any) => {
      const city    = hotel.location?.city?.toLowerCase()    ?? "";
      const state   = hotel.location?.state?.toLowerCase()   ?? "";
      const country = hotel.location?.country?.toLowerCase() ?? "";
      const name    = destination.name.toLowerCase();

      return city === name || state === name || country === name;
    }).length;

    return { ...destination, count };
  });
}
