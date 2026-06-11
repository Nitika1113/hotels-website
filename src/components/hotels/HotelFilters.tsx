"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import {
  PROPERTY_TYPES, FACILITIES, ROOM_FACILITIES,
  TRAVEL_GROUPS, MEALS, POPULAR_FILTERS,
} from "@/constants/hotel";

export default function HotelFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = useState(false); // mobile drawer

  // ── State mirrors URL params ──────────────────────────────
  const [propertyTypes,  setPropertyTypes]  = useState<string[]>(params.getAll("propertyType"));
  const [starRatings,    setStarRatings]    = useState<string[]>(params.getAll("star"));
  const [minPrice,       setMinPrice]       = useState(params.get("minPrice") || "");
  const [maxPrice,       setMaxPrice]       = useState(params.get("maxPrice") || "");
  const [facilities,     setFacilities]     = useState<string[]>(params.getAll("facility"));
  const [roomFacilities, setRoomFacilities] = useState<string[]>(params.getAll("roomFacility"));
  const [meals,          setMeals]          = useState<string[]>(params.getAll("meal"));
  const [travelGroups,   setTravelGroups]   = useState<string[]>(params.getAll("travelGroup"));
  const [popularFilters, setPopularFilters] = useState<string[]>(params.getAll("popularFilter"));

  // Collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    propertyType: false, star: false, price: false,
    facilities: true, roomFacilities: true,
    meals: false, travelGroups: true, popularFilters: false,
  });

  const toggle = (section: string) =>
    setCollapsed((p) => ({ ...p, [section]: !p[section] }));

  const totalActive =
    propertyTypes.length + starRatings.length +
    facilities.length + roomFacilities.length +
    meals.length + travelGroups.length + popularFilters.length +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  function applyFilters() {
    const q = new URLSearchParams();
    // Keep existing search params (location, checkIn, etc.)
    params.forEach((v, k) => {
      if (!["propertyType","star","minPrice","maxPrice","facility","roomFacility","meal","travelGroup","popularFilter"].includes(k)) {
        q.append(k, v);
      }
    });
    propertyTypes .forEach((v) => q.append("propertyType",   v));
    starRatings   .forEach((v) => q.append("star",           v));
    facilities    .forEach((v) => q.append("facility",       v));
    roomFacilities.forEach((v) => q.append("roomFacility",   v));
    meals         .forEach((v) => q.append("meal",           v));
    travelGroups  .forEach((v) => q.append("travelGroup",    v));
    popularFilters.forEach((v) => q.append("popularFilter",  v));
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    router.push(`/hotels?${q.toString()}`);
    setOpen(false);
  }

  function clearAll() {
    setPropertyTypes([]); setStarRatings([]); setMinPrice(""); setMaxPrice("");
    setFacilities([]); setRoomFacilities([]); setMeals([]); setTravelGroups([]); setPopularFilters([]);
    const q = new URLSearchParams();
    params.forEach((v, k) => {
      if (!["propertyType","star","minPrice","maxPrice","facility","roomFacility","meal","travelGroup","popularFilter"].includes(k)) {
        q.append(k, v);
      }
    });
    router.push(`/hotels?${q.toString()}`);
  }

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  // ── Reusable sub-components ──────────────────────────────

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-b border-stone-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => toggle(id)}
        className="flex w-full items-center justify-between mb-3"
      >
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-stone-500">{title}</span>
        <ChevronDown size={14} className={`text-stone-400 transition-transform ${collapsed[id] ? "" : "rotate-180"}`} />
      </button>
      {!collapsed[id] && children}
    </div>
  );

  const CheckItem = ({
    label, checked, onChange,
  }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-xs transition-all select-none ${
      checked ? "bg-amber-50 border border-amber-200 text-amber-700 font-semibold" : "text-stone-600 hover:bg-stone-50"
    }`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-amber-500 w-3.5 h-3.5 shrink-0" />
      {label}
    </label>
  );

  const filterPanel = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-amber-500" />
          <span className="font-bold text-black text-sm">Filters</span>
          {totalActive > 0 && (
            <span className="rounded-full bg-amber-500 text-white text-[0.6rem] font-bold w-5 h-5 flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button onClick={clearAll} className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* POPULAR FILTERS */}
      <Section id="popularFilters" title="Popular Filters">
        <div className="flex flex-col gap-1">
          {POPULAR_FILTERS.map((f) => (
            <CheckItem key={f} label={f} checked={popularFilters.includes(f)}
              onChange={() => toggleItem(popularFilters, setPopularFilters, f)} />
          ))}
        </div>
      </Section>

      {/* PROPERTY TYPE */}
      <Section id="propertyType" title="Property Type">
        <div className="flex flex-col gap-1">
          {PROPERTY_TYPES.map((t) => (
            <CheckItem key={t} label={t} checked={propertyTypes.includes(t)}
              onChange={() => toggleItem(propertyTypes, setPropertyTypes, t)} />
          ))}
        </div>
      </Section>

      {/* STAR RATING */}
      <Section id="star" title="Star Rating">
        <div className="flex flex-wrap gap-2">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleItem(starRatings, setStarRatings, String(s))}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                starRatings.includes(String(s))
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-400"
              }`}
            >
              {"⭐".repeat(s)}
            </button>
          ))}
        </div>
      </Section>

      {/* PRICE RANGE */}
      <Section id="price" title="Price Range (₹ / night)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-black outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          />
          <span className="text-stone-300 shrink-0">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-black outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          />
        </div>
      </Section>

      {/* MEALS */}
      <Section id="meals" title="Meals">
        <div className="flex flex-col gap-1">
          {MEALS.map((m) => (
            <CheckItem key={m} label={m} checked={meals.includes(m)}
              onChange={() => toggleItem(meals, setMeals, m)} />
          ))}
        </div>
      </Section>

      {/* FACILITIES */}
      <Section id="facilities" title="Facilities">
        <div className="flex flex-col gap-1">
          {FACILITIES.map((f) => (
            <CheckItem key={f} label={f} checked={facilities.includes(f)}
              onChange={() => toggleItem(facilities, setFacilities, f)} />
          ))}
        </div>
      </Section>

      {/* ROOM FACILITIES */}
      <Section id="roomFacilities" title="Room Facilities">
        <div className="flex flex-col gap-1">
          {ROOM_FACILITIES.map((f) => (
            <CheckItem key={f} label={f} checked={roomFacilities.includes(f)}
              onChange={() => toggleItem(roomFacilities, setRoomFacilities, f)} />
          ))}
        </div>
      </Section>

      {/* TRAVEL GROUPS */}
      <Section id="travelGroups" title="Great For">
        <div className="flex flex-col gap-1">
          {TRAVEL_GROUPS.map((g) => (
            <CheckItem key={g} label={g} checked={travelGroups.includes(g)}
              onChange={() => toggleItem(travelGroups, setTravelGroups, g)} />
          ))}
        </div>
      </Section>

      {/* Apply button */}
      <button
        onClick={applyFilters}
        className="mt-6 w-full rounded-full bg-black py-3 text-sm font-bold text-white hover:bg-[#c29b6a] hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
      >
        Apply Filters {totalActive > 0 ? `(${totalActive})` : ""}
      </button>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:block w-85 shrink-0">
        <div className="sticky top-6 rounded-[20px] bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 max-h-[calc(130vh-3rem)] overflow-y-auto">
          {filterPanel}
        </div>
      </aside>

      {/* ── MOBILE TRIGGER ── */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:border-amber-400 hover:text-amber-600 transition-all"
        >
          <SlidersHorizontal size={15} />
          Filters
          {totalActive > 0 && (
            <span className="rounded-full bg-amber-500 text-white text-[0.6rem] font-bold w-5 h-5 flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-black">Filters</span>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </>
  );
}
