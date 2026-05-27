import { Hotel } from "@/types/hotel";

export async function getHotels(): Promise<Hotel[]> {
  const response = await fetch("/api/hotels");

  const result = await response.json();

  return result.data;
}