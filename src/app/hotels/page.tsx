import Image from "next/image";

import { connectedDB } from "@/lib/mongodb";

interface HotelsPageProps {
  searchParams: Promise<{
    location?: string;
  }>;
}

export default async function HotelsPage({
  searchParams,
}: HotelsPageProps) {
  const params = await searchParams;

  const location = params.location;

  const db = await connectedDB();

  // ✅ FILTER BY LOCATION
  const hotels = await db
    .collection("hotels")
    .find(
      location
        ? {
            location: {
              $regex: new RegExp(
                `^${location}$`,
                "i"
              ),
            },
          }
        : {}
    )
    .toArray();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        {/* HEADING */}
        <h1 className="text-4xl font-bold mb-10">
          Hotels in {location}
        </h1>

        {/* HOTELS */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >
          {hotels.map((hotel: any) => (
            <div
              key={hotel._id.toString()}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-sm
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
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >
                  <p className="text-gray-500">
                    {hotel.location}
                  </p>

                  <span>
                    ⭐ {hotel.rating}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold mb-4">
                  {hotel.name}
                </h2>

                <p className="font-bold text-xl">
                  ₹{hotel.price}/night
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {hotels.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-3xl font-bold">
              No Hotels Found
            </h2>

            <p className="text-gray-500 mt-3">
              No properties available in{" "}
              {location}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}