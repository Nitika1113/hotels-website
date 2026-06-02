import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Hotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

      {/* IMAGE */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={hotel.featuredImage || "/placeholder.jpg"}
          alt={hotel.name}
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {hotel.propertyType && (
          <div className="absolute top-5 left-5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-semibold text-white tracking-wide">
            {hotel.propertyType}
          </div>
        )}

        <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-md shadow-md">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-stone-800">{hotel.reviewScore ?? "N/A"}</span>
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-1.5 text-white">
          <MapPin size={15} className="text-amber-400 shrink-0" />
          <p className="text-sm font-medium tracking-wide">
            {hotel.location?.city
              ? `${hotel.location.city}${hotel.location.country ? ", " + hotel.location.country : ""}`
              : hotel.location?.country ?? ""}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {hotel.starRating > 0 && (
          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12}
                className={i < hotel.starRating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
              />
            ))}
            <span className="ml-1.5 text-xs text-stone-400">({hotel.reviewCount ?? 0} reviews)</span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-xl font-semibold text-[#1f1f1f] mb-1.5 line-clamp-1">{hotel.name}</h3>
          <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
            {hotel.description ?? "Experience premium comfort with beautifully designed rooms and exceptional hospitality."}
          </p>
        </div>

        <div className="h-px bg-stone-100 mb-5" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#1f1f1f]">
                ₹{hotel.startingPrice?.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-gray-400">/ night</span>
            </div>
          </div>

          <Link
            href={`/hotels/${hotel.slug}`}
            className="rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#c29b6a] hover:shadow-lg hover:shadow-amber-200/50 active:scale-95 cursor-pointer"
          >
            View Stay
          </Link>
        </div>
      </div>
    </article>
  );
}
