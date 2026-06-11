import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectedDB } from "@/lib/mongodb";
import { Hotel } from "@/types/hotel";
import { MapPin, Star, SlidersHorizontal } from "lucide-react";
import HotelFilters from "@/components/hotels/HotelFilters";


interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

function getArr(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default async function HotelsPage({ searchParams }: Props) {
  const params = await searchParams;

  const location      = (params.location      as string)?.trim() || "";
  const minPrice      = Number(params.minPrice  || 0);
  const maxPrice      = Number(params.maxPrice  || 0);
  const propertyTypes = getArr(params.propertyType);
  const starRatings   = getArr(params.star).map(Number);
  const facilities    = getArr(params.facility);
  const roomFacilities= getArr(params.roomFacility);
  const meals         = getArr(params.meal);
  const travelGroups  = getArr(params.travelGroup);
  const popularFilters= getArr(params.popularFilter);

  const db = await connectedDB();

  // Build MongoDB filter
  const filter: Record<string, any> = { active: true };

  if (location) {
    filter["$or"] = [
      { "location.city":    { $regex: location, $options: "i" } },
      { "location.state":   { $regex: location, $options: "i" } },
      { "location.country": { $regex: location, $options: "i" } },
    ];
  }

  if (propertyTypes.length)  filter.propertyType = { $in: propertyTypes };
  if (starRatings.length)    filter.starRating    = { $in: starRatings };
  if (minPrice)              filter.startingPrice = { ...filter.startingPrice, $gte: minPrice };
  if (maxPrice)              filter.startingPrice = { ...filter.startingPrice, $lte: maxPrice };
  if (facilities.length)     filter["amenities.facilities"]     = { $all: facilities };
  if (roomFacilities.length) filter["amenities.roomFacilities"] = { $all: roomFacilities };
  if (meals.length)          filter["amenities.meals"]          = { $all: meals };
  if (travelGroups.length)   filter["amenities.travelGroups"]   = { $all: travelGroups };
  if (popularFilters.length) filter["amenities.popularFilters"] = { $all: popularFilters };

  const hotels = (await db
    .collection("hotels")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()) as unknown as Hotel[];

  const totalFilters =
    propertyTypes.length + starRatings.length + facilities.length +
    roomFacilities.length + meals.length + travelGroups.length +
    popularFilters.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* PAGE HEADER */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-8xl px-6 md:px-10 py-5">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-amber-600">
            Luxury Stays
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-[#1f1f1f]">
            Hotels{" "}
            {location && (
              <>in <span className="italic text-[#c29b6a]">{location}</span></>
            )}
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            {hotels.length} propert{hotels.length !== 1 ? "ies" : "y"} found
            {totalFilters > 0 && ` · ${totalFilters} filter${totalFilters !== 1 ? "s" : ""} applied`}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-8xl px-6 md:px-10 py-10">
        <div className="flex gap-8 items-start">

          {/* LEFT — FILTERS */}
          <HotelFilters />

          {/* RIGHT — RESULTS */}
          <div className="flex-1 min-w-0">

            {/* Active filter pills */}
            {totalFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {propertyTypes.map((v) => <FilterPill key={v} label={v} params={params} removeKey="propertyType" removeVal={v} />)}
                {starRatings.map((v) => <FilterPill key={v} label={`${v}★`} params={params} removeKey="star" removeVal={String(v)} />)}
                {facilities.map((v) => <FilterPill key={v} label={v} params={params} removeKey="facility" removeVal={v} />)}
                {roomFacilities.map((v) => <FilterPill key={v} label={v} params={params} removeKey="roomFacility" removeVal={v} />)}
                {meals.map((v) => <FilterPill key={v} label={v} params={params} removeKey="meal" removeVal={v} />)}
                {travelGroups.map((v) => <FilterPill key={v} label={v} params={params} removeKey="travelGroup" removeVal={v} />)}
                {popularFilters.map((v) => <FilterPill key={v} label={v} params={params} removeKey="popularFilter" removeVal={v} />)}
                {minPrice > 0 && <FilterPill label={`Min ₹${minPrice}`} params={params} removeKey="minPrice" removeVal="" />}
                {maxPrice > 0 && <FilterPill label={`Max ₹${maxPrice}`} params={params} removeKey="maxPrice" removeVal="" />}
              </div>
            )}

            {/* EMPTY STATE */}
            {hotels.length === 0 ? (
              <div className="rounded-[30px] bg-white border border-black/5 shadow-sm p-16 text-center">
                <p className="text-4xl mb-4">🏨</p>
                <h2 className="text-2xl font-semibold text-[#1f1f1f] mb-2">No Hotels Found</h2>
                <p className="text-stone-500 mb-6">
                  Try adjusting your filters or search a different location.
                </p>
                <Link href="/hotels" className="rounded-full bg-[#1f1f1f] px-8 py-3 text-sm font-semibold text-white hover:bg-[#c29b6a] transition-all">
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id?.toString()} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter pill (remove one filter) ──────────────────────────
function FilterPill({
  label, params, removeKey, removeVal,
}: {
  label: string;
  params: Record<string, string | string[]>;
  removeKey: string;
  removeVal: string;
}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((val) => {
        if (!(k === removeKey && val === removeVal)) q.append(k, val);
      });
    } else {
      if (k !== removeKey) q.append(k, v);
    }
  });

  return (
    <Link
      href={`/hotels?${q.toString()}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
    >
      {label}
      <span className="text-base leading-none">×</span>
    </Link>
  );
}

// ── Hotel Card ────────────────────────────────────────────────
function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={hotel.featuredImage || "/placeholder.jpg"}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {hotel.propertyType && (
          <div className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {hotel.propertyType}
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-md">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-stone-800">{hotel.reviewScore ?? "N/A"}</span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white">
          <MapPin size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs font-medium">
            {hotel.location?.city
              ? `${hotel.location.city}${hotel.location.country ? ", " + hotel.location.country : ""}`
              : hotel.location?.country ?? ""}
          </p>
        </div>
      </div>

      <div className="p-5">
        {hotel.starRating > 0 && (
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11}
                className={i < hotel.starRating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
              />
            ))}
            <span className="ml-1.5 text-xs text-stone-400">({hotel.reviewCount ?? 0})</span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-[#1f1f1f] mb-1 line-clamp-1">{hotel.name}</h3>
        <p className="text-xs leading-relaxed text-stone-500 line-clamp-2 mb-4">{hotel.description}</p>

        <div className="h-px bg-stone-100 mb-4" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">From</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#1f1f1f]">₹{hotel.startingPrice?.toLocaleString("en-IN")}</span>
              <span className="text-xs text-stone-400">/ night</span>
            </div>
          </div>
          <Link
            href={`/hotels/${hotel.slug}`}
            className="rounded-full bg-[#1f1f1f] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#c29b6a] hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            View Stay
          </Link>
        </div>
      </div>
    </article>
  );
}
