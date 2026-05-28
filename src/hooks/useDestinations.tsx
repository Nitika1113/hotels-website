"use client";

import { useEffect, useState } from "react";

import { getDestinations } from "@/services/destination.service";

export default function useDestinations() {
  const [destinations, setDestinations] =
    useState<Awaited<ReturnType<typeof getDestinations>>>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await getDestinations();

        setDestinations(data);

      } catch (error) {
        console.log(error);

      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
  };
}