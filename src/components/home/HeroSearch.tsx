"use client";

import { useRouter } from "next/navigation";
import { Search, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const POPULAR_DESTINATIONS = [
  "Mumbai", "Delhi", "Goa", "Jaipur", "Bangalore",
  "Kerala", "Manali", "Shimla", "Udaipur", "Agra",
];

export default function HeroSearch() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const today    = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [location, setLocation]           = useState("");
  const [checkIn, setCheckIn]             = useState<Date | null>(today);
  const [checkOut, setCheckOut]           = useState<Date | null>(tomorrow);
  const [adults, setAdults]               = useState(1);
  const [children, setChildren]           = useState(0);
  const [rooms, setRooms]                 = useState(1);
  const [pets, setPets]                   = useState(false);
  const [guestOpen, setGuestOpen]         = useState(false);
  const [suggestions, setSuggestions]     = useState<string[]>([]);
  const [locationError, setLocationError] = useState("");
  const [locationFocused, setLocationFocused] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationFocused(false);
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLocationChange = async (value: string) => {
    setLocation(value);
    setLocationError("");
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/search-location?q=${encodeURIComponent(value)}`);
      const result = await res.json();
      setSuggestions(result.data || []);
    } catch {
      setSuggestions([]);
    }
  };

  if (!mounted) return null;

  const handleSearch = () => {
    if (!location.trim()) {
      setLocationError("Please enter a destination first.");
      return;
    }
    setLocationError("");
    const query = new URLSearchParams({
      location,
      checkIn:  checkIn?.toISOString()  || "",
      checkOut: checkOut?.toISOString() || "",
      adults:   adults.toString(),
      children: children.toString(),
      rooms:    rooms.toString(),
      pets:     pets.toString(),
    });
    router.push(`/hotels?${query.toString()}`);
  };

  // What to show in the dropdown
  const showPopular   = locationFocused && !location.trim();
  const showSuggestions = suggestions.length > 0 && location.trim();
  const showDropdown  = showPopular || showSuggestions;

  const inputCls =
    "h-12 px-5 rounded-2xl border bg-[#c29b6a]/10 text-black outline-none transition-all w-full";

  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-[20px] px-6 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.8fr_0.8fr_1.3fr_0.6fr] gap-4 items-end">

        {/* LOCATION */}
        <div ref={locationRef} className="relative flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-1">Destination</label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => setLocationFocused(true)}
            className={`${inputCls} ${
              locationError
                ? "border-red-400 focus:border-red-400 bg-red-50/30"
                : "border-gray-300 hover:border-black focus:border-black focus:shadow-md"
            }`}
          />

          {locationError && (
            <p className="absolute left-5 p-1 top-20 mt-1 text-xs font-medium text-white bg-red-500 items-center">
              ⚠ {locationError}
            </p>
          )}

          {/* Dropdown — popular destinations OR search suggestions */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-50">

              {showPopular && (
                <>
                  <p className="px-5 pt-4 pb-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#c29b6a]">
                    Popular Destinations
                  </p>
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onMouseDown={() => {
                        setLocation(dest);
                        setSuggestions([]);
                        setLocationFocused(false);
                        setLocationError("");
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-amber-50 text-black text-sm transition flex items-center gap-3"
                    >
                      <MapPin size={14} className="text-[#c29b6a] shrink-0" />
                      {dest}
                    </button>
                  ))}
                </>
              )}

              {showSuggestions && suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => {
                    setLocation(item);
                    setSuggestions([]);
                    setLocationFocused(false);
                    setLocationError("");
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-amber-50 text-black text-sm transition flex items-center gap-3"
                >
                  <MapPin size={14} className="text-[#c29b6a] shrink-0" />
                  {item}
                </button>
              ))}

            </div>
          )}
        </div>

        {/* CHECK IN */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-1">Check In</label>
          <DatePicker
            selected={checkIn}
            onChange={(d: Date | null) => {
              setCheckIn(d);
              // If check-out is before new check-in, push check-out forward by 1 day
              if (d && checkOut && d >= checkOut) {
                const next = new Date(d);
                next.setDate(next.getDate() + 1);
                setCheckOut(next);
              }
            }}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            dateFormat="dd MMM yyyy"
            className={`${inputCls} border-gray-300 hover:border-black focus:border-black focus:shadow-md cursor-pointer`}
          />
        </div>

        {/* CHECK OUT */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-1">Check Out</label>
          <DatePicker
            selected={checkOut}
            onChange={(d: Date | null) => setCheckOut(d)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
            dateFormat="dd MMM yyyy"
            className={`${inputCls} border-gray-300 hover:border-black focus:border-black focus:shadow-md cursor-pointer`}
          />
        </div>

        {/* GUESTS */}
        <div className="relative flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-1">Guests & Rooms</label>
          <button
            type="button"
            onClick={() => setGuestOpen(!guestOpen)}
            className="h-12 px-6 rounded-2xl cursor-pointer border border-gray-300 bg-[#c29b6a]/10 flex items-center justify-between hover:border-black hover:shadow-md transition-all"
          >
            <div className="flex flex-col text-left">
              <span className="text-black font-semibold text-sm">
                {adults + children} Guests · {rooms} {rooms > 1 ? "Rooms" : "Room"}{pets ? " · 🐾" : ""}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Add guests & rooms</span>
            </div>
            <ChevronDown size={18} className={`transition-transform duration-300 text-black ${guestOpen ? "rotate-180" : ""}`} />
          </button>

          {guestOpen && (
            <div className="absolute top-full left-0 mt-3 w-[320px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-300 p-6 z-50 space-y-6">
              <CounterRow title="Adults"   subtitle="Age 18+"         value={adults}   onDecrease={() => setAdults(Math.max(1, adults - 1))}     onIncrease={() => setAdults(adults + 1)} />
              <CounterRow title="Children" subtitle="Age 0–18"        value={children} onDecrease={() => setChildren(Math.max(0, children - 1))} onIncrease={() => setChildren(children + 1)} />
              <CounterRow title="Rooms"    subtitle="Number of rooms" value={rooms}    onDecrease={() => setRooms(Math.max(1, rooms - 1))}       onIncrease={() => setRooms(rooms + 1)} />

              <div className="flex items-center justify-between border-t">
                <div>
                  <h4 className="font-semibold text-black flex flex-start">Pets</h4>
                  <p className="text-sm text-gray-500">Pet-friendly stays</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPets(!pets)}
                  className={`w-14 h-7 rounded-full px-1 flex cursor-pointer items-center transition-all ${pets ? "bg-[#d4b794] justify-end" : "bg-gray-300 justify-start"}`}
                >
                  <div className="w-5 h-5 bg-white rounded-full" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setGuestOpen(false)}
                className="w-full h-11 rounded-2xl bg-[#c29b6a]/30 cursor-pointer text-black font-medium border border-gray-200 hover:bg-[#d4b794]  hover:border-black transition"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="h-12 rounded-full bg-[#c29b6a]/10 text-black hover:bg-[#d4b794] hover:border-black flex cursor-pointer items-center justify-center gap-2 transition-all font-semibold shadow-lg border border-gray-300"
        >
          <Search size={18} /> Search
        </button>

      </div>
    </div>
  );
}

interface CounterRowProps {
  title: string; subtitle: string; value: number;
  onDecrease: () => void; onIncrease: () => void;
}

function CounterRow({ title, subtitle, value, onDecrease, onIncrease }: CounterRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-black flex flext-start">{title}</h4>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onDecrease} className="w-10 h-10 rounded-full border border-gray-300 text-xl bg-[#c29b6a]/30 hover:border-black transition cursor-pointer text-black">-</button>
        <span className="w-5 text-center font-medium text-black">{value}</span>
        <button type="button" onClick={onIncrease} className="w-10 h-10 rounded-full border bg-[#c29b6a]/30 border-gray-300 text-xl cursor-pointer hover:border-black transition text-black">+</button>
      </div>
    </div>
  );
}
