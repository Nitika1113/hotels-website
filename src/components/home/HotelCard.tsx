import Image from "next/image";

import { Hotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({
  hotel,
}: HotelCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative h-72">
        <Image
  src={hotel.image}
  alt={hotel.name}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-sm">
            {hotel.location}
          </p>

          <span className="text-sm">
            ⭐ {hotel.rating ?? "N/A"}
          </span>
        </div>

        <h3 className="text-2xl font-semibold mb-4">
          {hotel.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">
            ₹{hotel.price}/night
          </p>

          <button
            className="
              border
              px-5
              py-2
              rounded-lg
              hover:bg-black
              hover:text-white
              transition
            "
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}