
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectedDB } from "@/lib/mongodb";
import { MapPin, Star, BedDouble, ChevronRight, Clock, Shield, Phone } from "lucide-react";
import HotelOverview from "./HotelOverview";
import HotelAmenities from "./HotelAmenities";
import HotelGallery from "./HotelGallery";
import HotelRooms from "./HotelRooms";
import { serialize } from "@/lib/serialize";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function HotelPage({ params }: Props) {
  const { slug } = await params;
  const db = await connectedDB();

  const rawHotel = await db.collection("hotels").findOne({ slug });

if (!rawHotel) {
  notFound();
}

const rawRooms = await db
  .collection("rooms")
  .find({
    hotelId: rawHotel._id.toString(),
    active: true,
  })
  .toArray();

const hotel = serialize(rawHotel);

const rooms = serialize(rawRooms);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── HERO ── */}
      <div className="relative h-[92vh] min-h-150 w-full overflow-hidden">
        <Image
          src={hotel.featuredImage || "/placeholder.jpg"}
          alt={hotel.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />

        {/* Breadcrumb */}
        <div className="absolute top-8 left-8 flex items-center gap-2 text-white/60 text-xs">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link>
          <ChevronRight size={12} />
          <span className="text-white/90">{hotel.name}</span>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-14 pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white">
                {hotel.propertyType}
              </span>
              {hotel.mostBooked && (
                <span className="rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 text-[0.65rem] font-semibold text-white">
                  Most Booked
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              {hotel.name}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-400" />
                {[hotel.location?.address, hotel.location?.city, hotel.location?.country].filter(Boolean).join(", ")}
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{hotel.reviewScore}</span>
                <span>({hotel.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble size={14} className="text-amber-400" />
                {hotel.roomCount} Rooms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* LEFT */}
          <div className="space-y-0">

            {/* Score bar */}
            <div className="flex items-center gap-3 rounded-2xl bg-white border border-stone-100 px-6 py-4 shadow-sm mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16}
                    className={i < hotel.starRating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-600">{hotel.starRating}-Star</span>
              <div className="ml-auto flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-bold text-white">{hotel.reviewScore}</div>
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    {hotel.reviewScore >= 9 ? "Exceptional" : hotel.reviewScore >= 8 ? "Excellent" : "Very Good"}
                  </p>
                  <p className="text-xs text-stone-400">{hotel.reviewCount} verified reviews</p>
                </div>
              </div>
            </div>

            {/* Each section in its own card */}
            <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm mb-6">
              <HotelOverview description={hotel.description} highlights={hotel.highlights} />
            </div>
{hotel.gallery?.length > 0 && (
              <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm mb-6">
                <HotelGallery images={hotel.gallery} />
              </div>
            )}

            <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm mb-6">
              <HotelAmenities amenities={hotel.amenities || {}} />
            </div>

            {rooms.length > 0 && (
              <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm mb-6">
                <HotelRooms rooms={rooms as any} />
              </div>
            )}

            {/* Policies */}
            <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm mb-6">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
                <Shield size={16} className="text-amber-500" />
                <h2 className="text-lg font-semibold text-black">Policies</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Check-In",  value: hotel.policies?.checkIn    || "14:00", icon: <Clock size={14} /> },
                  { label: "Check-Out", value: hotel.policies?.checkOut   || "11:00", icon: <Clock size={14} /> },
                  { label: "Pets",      value: hotel.policies?.petsAllowed    ? "Allowed" : "Not Allowed", icon: "🐾" },
                  { label: "Smoking",   value: hotel.policies?.smokingAllowed ? "Allowed" : "Not Allowed", icon: "🚬" },
                ].map((p) => (
                  <div key={p.label} className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400 mb-1">{p.label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-500 text-sm">{p.icon}</span>
                      <span className="text-sm font-semibold text-stone-800">{p.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
                <MapPin size={16} className="text-amber-500" />
                <h2 className="text-lg font-semibold text-black">Location</h2>
              </div>
              <div className="space-y-2 text-sm text-stone-600">
                {hotel.location?.address && <p>📍 {hotel.location.address}</p>}
                {hotel.location?.city    && <p>🏙️ {hotel.location.city}{hotel.location.state ? `, ${hotel.location.state}` : ""}</p>}
                {hotel.location?.country && <p>🌍 {hotel.location.country}</p>}
              </div>
            </div>

          </div>

          {/* RIGHT — sticky booking card */}
          <aside>
            <div className="sticky top-8 space-y-4">

              {/* Main booking card */}
              <div className="rounded-2xl bg-white border border-stone-200 p-7 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-stone-400 mb-1">Starting From</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-black">₹{hotel.startingPrice?.toLocaleString("en-IN")}</span>
                  <span className="text-stone-400 text-sm">/ night</span>
                </div>
                <div className="flex items-center gap-1.5 mb-6">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-stone-700">{hotel.reviewScore}</span>
                  <span className="text-sm text-stone-400">· {hotel.reviewCount} reviews</span>
                </div>
                <Link
                  href={`/booking/${hotel._id}?checkIn=${new Date().toISOString().slice(0,10)}&checkOut=${new Date(Date.now()+86400000).toISOString().slice(0,10)}&adults=2&rooms=1`}
                  className="w-full block text-center rounded-xl bg-black py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200/50 active:scale-[0.98]"
                >
                  Reserve Now
                </Link>

                <Link
                  href={`/booking/${hotel._id}?checkIn=${new Date().toISOString().slice(0,10)}&checkOut=${new Date(Date.now()+86400000).toISOString().slice(0,10)}&adults=2&rooms=1`}
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-stone-200 py-3.5 text-sm font-semibold text-stone-700 transition-all hover:border-amber-400 hover:text-amber-600"
                >
                  Check Availability
                </Link>

                <div className="mt-6 space-y-3 border-t border-stone-100 pt-5">
                  {[
                    { label: "Property Type", value: hotel.propertyType },
                    { label: "Star Rating",   value: `${"⭐".repeat(Math.min(hotel.starRating, 5))}` },
                    { label: "Total Rooms",   value: `${hotel.roomCount} rooms` },
                    { label: "Review Score",  value: `${hotel.reviewScore} / 10` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-stone-400">{item.label}</span>
                      <span className="font-semibold text-stone-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact card */}
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                    <Phone size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Need Help?</p>
                    <p className="text-sm text-stone-500">Contact our booking team</p>
                  </div>
                </div>
                <Link href="/contact" className="flex w-full items-center justify-center rounded-xl border border-amber-200 bg-white py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
                  Get in Touch
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
