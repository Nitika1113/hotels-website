"use client";

import useHotels from "@/hooks/useHotels";

import HotelCard from "./HotelCard";

export default function HotelList() {
  const {
    hotels,
    loading,
  } = useHotels();

  if (loading) {
    return (
      <p className="text-center py-20 text-lg">
        Loading Hotels...
      </p>
    );
  }

  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-14">

          <div>

            <h2 className="text-4xl font-bold mb-2">
              The Collection
            </h2>

            <p className="text-gray-500">
              Handpicked luxury retreats.
            </p>

          </div>

        </div>

        {/* HOTELS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
            />
          ))}

        </div>

      </div>
    </section>
  );
}