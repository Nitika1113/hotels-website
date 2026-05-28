import { Hotel } from "@/types/hotel";

export async function getHotels(
  limit?: number
): Promise<Hotel[]> {

  const url = limit
    ? `/api/hotels?limit=${limit}`
    : "/api/hotels";

  const response = await fetch(url);

  const result = await response.json();

  return result.data;
}