"use client";

import { useEffect, useState } from "react";

import { getHotels } from "@/services/hotel.service";

import { Hotel } from "@/types/hotel";

export default function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const data = await getHotels();

        setHotels(data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, []);

  return {
    hotels,
    loading,
  };
}