import Link from "next/link";
import Image from "next/image";
import HotelSearch from "../HotelSearch";

import { connectedDB } from "@/lib/mongodb";
interface Hotel {
  _id: string;
  name: string;
  gallery?: string[];
  featuredImage?: string;
  propertyType?: string;
  starRating?: number;
  startingPrice?: number;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    address?: string;
  };
}
interface Props {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function AdminHotelsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const search = params.q?.trim();

  const db = await connectedDB();

  const query = search
    ? {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            "location.city": {
              $regex: search,
              $options: "i",
            },
          },
         {
  "location.address": {
    $regex: search,
    $options: "i",
  },
},
{
  "location.state": {
    $regex: search,
    $options: "i",
  },
},
{
  "location.country": {
    $regex: search,
    $options: "i",
  },
},
          {
            propertyType: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const hotels = await db
    .collection("hotels")
    .find(query)
    .sort({
      createdAt: -1,
    })
    .toArray();

  const normalizedHotels = hotels.map(
    (hotel) => ({
      ...hotel,

      displayImage:
        typeof hotel.gallery?.[0] ===
          "string" &&
        hotel.gallery[0].trim() !== ""
          ? hotel.gallery[0]
          : typeof hotel.image ===
                "string" &&
              hotel.image.trim() !== ""
            ? hotel.image
            : "https://placehold.co/400x300/png",

     displayCity: [
  hotel.location?.city,
  hotel.location?.state,
]
  .filter(Boolean)
  .join(", ") || "Unknown",

      displayPrice:
        hotel.startingPrice ||
        hotel.price ||
        0,

      displayRating:
        hotel.starRating ||
        hotel.rating ||
        0,

      displayType:
        hotel.propertyType ||
        "Hotel",
    })
  );

  return (
    <section className="mx-auto max-w-7xl p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Hotels
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all hotel properties
          </p>
        </div>

        <Link
          href="/admin/hotels/create"
          className="
            rounded-xl
            bg-black
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:opacity-90
          "
        >
          Add Hotel
        </Link>
      </div>

      {/* SEARCH */}
     <HotelSearch defaultValue={search} />

      {/* COUNT */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          {normalizedHotels.length} hotel(s)
          found
        </p>
      </div>

      {/* EMPTY */}
      {normalizedHotels.length === 0 && (
        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-gray-300
            p-20
            text-center
          "
        >
          <h2 className="text-2xl font-semibold">
            No Hotels Found
          </h2>

          <p className="mt-2 text-gray-500">
            Try another search term.
          </p>
        </div>
      )}

      {/* TABLE */}
      {normalizedHotels.length > 0 && (
        <div className="overflow-hidden rounded-3xl border bg-white">
          {/* HEADER */}
          <div
            className="
              grid
              grid-cols-[100px_2fr_1fr_1fr_1fr_180px]
              gap-4
              border-b
              bg-gray-50
              p-5
              text-sm
              font-semibold
            "
          >
            <span>Image</span>
            <span>Hotel</span>
            <span>City</span>
            <span>Type</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          {/* ROWS */}
          {normalizedHotels.map(
            (hotel: any) => (
              <div
                key={hotel._id.toString()}
                className="
                  grid
                  grid-cols-[100px_2fr_1fr_1fr_1fr_180px]
                  gap-4
                  border-b
                  p-5
                  items-center
                "
              >
                {/* IMAGE */}
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={
                      hotel.displayImage
                    }
                    alt={hotel.name}
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* HOTEL */}
                <div>
                  <h3 className="font-semibold">
                    {hotel.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {
                      hotel.displayRating
                    }{" "}
                    Star Hotel
                  </p>
                </div>

                {/* CITY */}
                <span>
                  {
                    hotel.displayCity
                  }
                </span>

                {/* TYPE */}
                <span>
                  {
                    hotel.displayType
                  }
                </span>

                {/* PRICE */}
                <span>
                  ₹
                  {hotel.displayPrice.toLocaleString()}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/hotels/edit/${hotel._id}`}
                    className="
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-sm
                      transition
                      hover:bg-gray-100
                    "
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/admin/hotels/delete/${hotel._id}`}
                    className="
                      rounded-lg
                      bg-red-500
                      px-4
                      py-2
                      text-sm
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    Delete
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}