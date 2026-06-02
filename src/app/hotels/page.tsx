import Image from "next/image";
import { connectedDB } from "@/lib/mongodb";
import { Hotel } from "../../types/hotel";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
interface HotelsPageProps {
  searchParams: Promise<{
    location?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const params = await searchParams;
  const location = params.location?.trim();

  const db = await connectedDB();

  const hotels = (await db
    .collection("hotels")
    .find(
      location
        ? {
            $or: [
              { "location.city":    { $regex: new RegExp(`^${location}$`, "i") } },
              { "location.state":   { $regex: new RegExp(`^${location}$`, "i") } },
              { "location.country": { $regex: new RegExp(`^${location}$`, "i") } },
            ],
          }
        : {}
    )
    .toArray()) as unknown as Hotel[];

  return (
    <section className="min-h-screen bg-[#faf7f2] py-10">
      <div className="mx-auto max-w-7xl px-5">
        <PageHeader location={location} />

        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id?.toString()} hotel={hotel} />
            ))}
          </div>
        ) : (
          <EmptyState location={location} />
        )}
      </div>
    </section>
  );
}

function PageHeader({ location }: { location?: string }) {
  return (
    <div className="mb-10">
      <p className="mb-3 text-sm uppercase tracking-[4px] text-gray-500">
        Luxury Stays
      </p>
      <h1 className="text-4xl font-semibold leading-tight text-[#1f1f1f] md:text-6xl">
        Hotels in{" "}
        <span className="italic text-[#c29b6a]">
          {location || "Worldwide"}
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-500">
        Discover premium stays with elegant interiors, world-class comfort, and unforgettable experiences.
      </p>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="group overflow-hidden rounded-4xl border border-white/40 bg-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

      {/* IMAGE */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={hotel.featuredImage || "/placeholder.jpg"}
          alt={hotel.name}
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* RATING */}
        <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-md backdrop-blur-md">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold">{hotel.reviewScore ?? "N/A"}</span>
        </div>

        {/* LOCATION */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
          <MapPin size={16} className="text-amber-400 shrink-0" />
          <span className="text-sm tracking-wide">
            {hotel.location?.city
              ? `${hotel.location.city}${hotel.location.country ? ", " + hotel.location.country : ""}`
              : hotel.location?.country ?? ""}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-7">
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-[#1f1f1f]">{hotel.name}</h2>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
            {hotel.description ?? "Elegant rooms with premium amenities and exceptional hospitality experience."}
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#1f1f1f]">
                ₹{hotel.startingPrice?.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
          </div>

          <Link
            href={`/hotels/${hotel.slug}`}
            className="rounded-full
    bg-[#1f1f1f] px-6  py-3  text-sm  font-medium  text-white  transition-all  duration-300  hover:bg-[#c29b6a]  hover:shadow-lg  "
          >
            View Stay
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ location }: { location?: string }) {
  return (
    <div className="rounded-4xl bg-white p-16 text-center shadow-sm">
      <h2 className="text-4xl font-semibold text-[#1f1f1f]">No Hotels Found</h2>
      <p className="mt-4 text-lg text-gray-500">
        We couldn't find stays in{" "}
        <span className="font-medium">{location}</span>
      </p>
      <button className="mt-8 rounded-full bg-[#1f1f1f] px-8 py-4 text-white transition-all hover:bg-[#c29b6a]">
        Explore Other Locations
      </button>
    </div>
  );
}
