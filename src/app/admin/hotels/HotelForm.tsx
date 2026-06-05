"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Toggle from "./Toggle";
import CheckboxGroup from "./CheckboxGroup";
import RoomEditor from "./RoomEditor";
import { CATEGORY_BADGE } from "@/constants/room";
import {
  PROPERTY_TYPES,
  FACILITIES,
  ROOM_FACILITIES,
  TRAVEL_GROUPS,
  MEALS,
  POPULAR_FILTERS,
} from "@/constants/hotel";
import type { Room, HotelFormProps } from "@/types/room";



const emptyRoom = (): Room => ({
  name: "", slug: "", category: "Standard", description: "",
  price: 0, quantity: 1, maxGuests: 2, adults: 2, children: 0,
  beds: { count: 1, type: "King" },
  bathrooms: 1, size: 0, sizeUnit: "sqft",
  freeCancellation: false, breakfastIncluded: false,
  featuredImage: "", images: [], roomFeatures: [], active: true,
});


const input =
  "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none transition-all duration-150 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const label =
  "block text-[0.8rem] font-bold tracking-[0.13em] uppercase text-black mb-1.5";

const card =
  "bg-white border border-stone-100 rounded-2xl p-5 shadow-sm scroll-mt-4 mb-5";

const cardTitle =
  "flex items-center gap-2.5 text-xl font-extrabold text-black pb-4 mb-5 border-b border-stone-100";

// ─── Component ────────────────────────────────────────────────────────────────

export default function HotelForm({ initialData, initialRooms = [], mode = "create" }: HotelFormProps) {
  const router = useRouter();
  const [loading, setLoading]             = useState(false);
  const [gallery, setGallery]             = useState<string[]>(initialData?.gallery || []);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [activeSection, setActiveSection] = useState("basic");
  const [rooms, setRooms]                 = useState<Room[]>(initialRooms.length ? initialRooms : []);
  const [roomStatus, setRoomStatus]       = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [removedRoomIds, setRemovedRoomIds] = useState<string[]>([]);

  const updateRoom = (i: number, r: Room) => setRooms((p) => p.map((x, j) => (j === i ? r : x)));
  const removeRoom = (i: number) => {
    const room = rooms[i];
    // If this room has an _id it lives in the DB — queue it for deletion on submit
    if (room?._id) setRemovedRoomIds((prev) => [...prev, room._id!]);
    setRooms((p) => p.filter((_, j) => j !== i));
  };
  const addRoom = () => setRooms((p) => [...p, emptyRoom()]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;

    const checked = (name: string) =>
      Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`))
        .map((el) => el.value);

    const hotel = {
      name:          (form.hotelName    as HTMLInputElement).value,
      slug:          (form.slug         as HTMLInputElement).value,
      description:   (form.description  as HTMLTextAreaElement).value,
      featuredImage,
      gallery,
      propertyType:  (form.propertyType as HTMLSelectElement).value,
      starRating:    Number((form.starRating    as HTMLInputElement).value),
      reviewScore:   Number((form.reviewScore   as HTMLInputElement).value),
      reviewCount:   Number((form.reviewCount   as HTMLInputElement).value),
      startingPrice: Number((form.startingPrice as HTMLInputElement).value),
      roomCount:     Number((form.roomCount     as HTMLInputElement).value),
      featured:      (form.featured      as HTMLInputElement).checked,
      active:        (form.active        as HTMLInputElement).checked,
      mostBooked:    (form.mostBooked    as HTMLInputElement).checked,
      location: {
        country: (form.country as HTMLInputElement).value,
        state:   (form.state   as HTMLInputElement).value,
        city:    (form.city    as HTMLInputElement).value,
        address: (form.address as HTMLInputElement).value,
      },
      amenities: {
        facilities:     checked("facilities"),
        roomFacilities: checked("roomFacilities"),
        travelGroups:   checked("travelGroups"),
        meals:          checked("meals"),
        popularFilters: checked("popularFilters"),
      },
      highlights: [], nearbyPlaces: [],
      policies: {
        checkIn:        (form.checkIn        as HTMLInputElement).value,
        checkOut:       (form.checkOut       as HTMLInputElement).value,
        petsAllowed:    (form.petsAllowed    as HTMLInputElement).checked,
        smokingAllowed: (form.smokingAllowed as HTMLInputElement).checked,
      },
    };

    // 1 — save hotel
    const url = mode === "create" ? "/api/hotels" : `/api/hotels/${initialData?._id?.toString()}`;
    const hotelRes = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotel),
    });

    if (!hotelRes.ok) {
      alert("Failed to save hotel");
      setLoading(false);
      return;
    }

    // 2 — resolve hotelId — always a clean string
    let hotelId: string;
    if (mode === "create") {
      const created = await hotelRes.json();
      hotelId = (created._id ?? created.insertedId ?? created.data?.insertedId)?.toString() ?? "";
    } else {
      hotelId = initialData?._id?.toString() ?? "";
    }

    if (!hotelId) {
      alert("Could not resolve hotel ID — rooms not saved");
      setLoading(false);
      return;
    }

    // 3 — delete removed rooms
    setRoomStatus("saving");
    try {
      if (removedRoomIds.length > 0) {
        await Promise.all(
          removedRoomIds.map((rid) =>
            fetch(`/api/rooms/${rid.toString().trim()}`, { method: "DELETE" })
          )
        );
      }

      // 4 — upsert remaining rooms
      if (rooms.length > 0) {
        const results = await Promise.all(
          rooms.map((r) => {
            const roomId = r._id?.toString().trim();
            return fetch(roomId ? `/api/rooms/${roomId}` : "/api/rooms", {
              method: roomId ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...r,
                _id: undefined,   // never send _id in body — MongoDB rejects it
                hotelId,
              }),
            });
          })
        );

        const anyFailed = results.some((r) => !r.ok);
        if (anyFailed) {
          setRoomStatus("error");
          setLoading(false);
          return;
        }
      }

      setRoomStatus("saved");
    } catch (err) {
      console.error(err);
      setRoomStatus("error");
      setLoading(false);
      return;
    }

    router.push("/admin/hotels");
    setLoading(false);
  }
  const sections = [
    { id: "basic",     label: "Basic Info",  icon: "✦" },
    { id: "images",    label: "Images",      icon: "◈" },
    { id: "location",  label: "Location",    icon: "◎" },
    { id: "property",  label: "Property",    icon: "▣" },
    { id: "amenities", label: "Amenities",   icon: "◆" },
    { id: "policies",  label: "Policies",    icon: "◷" },
    { id: "rooms",     label: "Rooms",       icon: "🛏" },
  ];

  const byCategory = rooms.reduce<Record<string, Room[]>>((acc, r) => {
    const cat = r.category || "Standard";
    (acc[cat] ??= []).push(r);
    return acc;
  }, {});

  const prices = rooms.filter((r) => r.price > 0).map((r) => r.price);
 return (
    <div className="min-h-screen text-stone-900">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[1rem] font-bold tracking-[0.22em] uppercase text-amber-500 mb-1">
          {mode === "create" ? "New Property" : "Edit Property"}
        </p>
        <h1 className="text-3xl font-semibold text-black">
          {mode === "create" ? "Add Hotel" : initialData?.name ?? "Update Hotel"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6 items-start">

          {/* Sidebar nav */}
          <aside className="hidden lg:block w-44 shrink-0 sticky top-20">
            <nav className="bg-white border border-stone-200 shadow-sm rounded-2xl p-2 flex flex-col gap-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-left text-[0.82rem] font-bold transition-all duration-150 ${
                    activeSection === s.id
                      ? "bg-amber-500/[0.14] text-amber-600"
                      : "text-stone-600 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                >
                  <span className="text-[0.8rem]">{s.icon}</span>
                  {s.label}
                  {s.id === "rooms" && rooms.length > 0 && (
                    <span className="ml-auto text-[0.65rem] bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {rooms.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* ── BASIC INFO ── */}
            <section id="section-basic" className={card}>
              <div className={cardTitle}><span className="text-amber-500">✦</span> Basic Information</div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Hotel Name</label>
                    <input name="hotelName" defaultValue={initialData?.name} placeholder="The Grand Meridian" className={input} required />
                  </div>
                  <div>
                    <label className={label}>URL Slug</label>
                    <input name="slug" defaultValue={initialData?.slug} placeholder="grand-meridian" className={input} required />
                  </div>
                </div>
                <div>
                  <label className={label}>Description</label>
                  <textarea rows={5} name="description" defaultValue={initialData?.description} placeholder="A timeless escape nestled in the heart of the city…" className={`${input} resize-y`} required />
                </div>
              </div>
            </section>

            {/* ── IMAGES ── */}
            <section id="section-images" className={card}>
              <div className={cardTitle}><span className="text-amber-500">◈</span> Images</div>
              <div className="grid gap-4">
                <div>
                  <label className={label}>Featured Image URL</label>
                  <input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://…" className={input} />
                  {featuredImage && (
                    <div className="mt-3 rounded-xl overflow-hidden h-40 bg-stone-100 border border-stone-200">
                      <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}
                </div>
                <div>
                  <label className={label}>Gallery — Press Enter to Add</label>
                  <input
                    placeholder="Paste image URL and press Enter…"
                    className={input}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (!val) return;
                      setGallery((p) => [...p, val]);
                      e.currentTarget.value = "";
                    }}
                  />
                  {gallery.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {gallery.map((img, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md px-2.5 py-1 text-[0.7rem] text-amber-600">
                          {img.length > 38 ? img.slice(0, 35) + "…" : img}
                          <button type="button" onClick={() => setGallery((p) => p.filter((_, j) => j !== i))} className="text-amber-400 hover:text-amber-700 text-base leading-none">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── LOCATION ── */}
            <section id="section-location" className={card}>
              <div className={cardTitle}><span className="text-amber-500">◎</span> Location</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "country", lbl: "Country",          val: initialData?.location?.country },
                  { name: "state",   lbl: "State / Province", val: initialData?.location?.state   },
                  { name: "city",    lbl: "City",             val: initialData?.location?.city    },
                  { name: "address", lbl: "Street Address",   val: initialData?.location?.address },
                ].map((f) => (
                  <div key={f.name}>
                    <label className={label}>{f.lbl}</label>
                    <input name={f.name} defaultValue={f.val} placeholder={f.lbl} className={input} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── PROPERTY DETAILS ── */}
            <section id="section-property" className={card}>
              <div className={cardTitle}><span className="text-amber-500">▣</span> Property Details</div>
              <div className="grid gap-4">
                <div>
                  <label className={label}>Property Type</label>
                  <select name="propertyType" defaultValue={initialData?.propertyType} className={input}>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "starRating",    lbl: "Star Rating",        ph: "5",    val: initialData?.starRating    },
                    { name: "startingPrice", lbl: "Starting Price (₹)", ph: "4999", val: initialData?.startingPrice },
                    { name: "roomCount",     lbl: "Room Count",         ph: "120",  val: initialData?.roomCount     },
                    { name: "reviewScore",   lbl: "Review Score",       ph: "8",    val: initialData?.reviewScore   },
                    { name: "reviewCount",   lbl: "Review Count",       ph: "240",  val: initialData?.reviewCount   },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className={label}>{f.lbl}</label>
                      <input type="number" name={f.name} defaultValue={f.val} placeholder={f.ph} className={input} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── AMENITIES ── */}
            <section id="section-amenities" className={card}>
              <div className={cardTitle}><span className="text-amber-500">◆</span> Amenities</div>
              <CheckboxGroup title="Facilities"      items={FACILITIES}      name="facilities"     selected={initialData?.amenities?.facilities     ?? []} />
              <CheckboxGroup title="Room Facilities" items={ROOM_FACILITIES} name="roomFacilities" selected={initialData?.amenities?.roomFacilities ?? []} />
              <CheckboxGroup title="Travel Groups"   items={TRAVEL_GROUPS}   name="travelGroups"   selected={initialData?.amenities?.travelGroups   ?? []} />
              <CheckboxGroup title="Meals"           items={MEALS}           name="meals"          selected={initialData?.amenities?.meals          ?? []} />
              <CheckboxGroup title="Popular Filters" items={POPULAR_FILTERS} name="popularFilters" selected={initialData?.amenities?.popularFilters ?? []} />
            </section>

            {/* ── POLICIES ── */}
            <section id="section-policies" className={card}>
              <div className={cardTitle}><span className="text-amber-500">◷</span> Policies & Status</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                <div>
                  <label className={label}>Check-In Time</label>
                  <input name="checkIn" defaultValue={initialData?.policies?.checkIn} placeholder="14:00" className={input} />
                </div>
                <div>
                  <label className={label}>Check-Out Time</label>
                  <input name="checkOut" defaultValue={initialData?.policies?.checkOut} placeholder="11:00" className={input} />
                </div>
              </div>
              <p className="text-[0.75rem] font-bold tracking-[0.13em] uppercase text-stone-500 mb-4">Flags & Permissions</p>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <Toggle name="petsAllowed"    label="Pets Allowed"    checked={initialData?.policies?.petsAllowed}    />
                <Toggle name="smokingAllowed" label="Smoking Allowed" checked={initialData?.policies?.smokingAllowed} />
                <Toggle name="featured"       label="Featured"        checked={initialData?.featured}                 />
                <Toggle name="active"         label="Active"          checked={initialData?.active ?? true}           />
                <Toggle name="mostBooked"     label="Most Booked"     checked={initialData?.mostBooked}               />
              </div>
            </section>

            {/* ── ROOMS ── */}
            <section id="section-rooms" className={card}>
              <div className={cardTitle}>
                <span className="text-amber-500">🛏</span> Room Types
                <span className="ml-auto text-sm font-normal text-stone-400">
                  {rooms.length} type{rooms.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Status banners */}
              {roomStatus === "error" && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  ⚠️ Some rooms failed to save. Please check and try again.
                </div>
              )}
              {roomStatus === "saved" && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  ✓ All rooms saved successfully.
                </div>
              )}

              {/* Empty state */}
              {rooms.length === 0 && (
                <div className="text-center py-12 rounded-2xl border-2 border-dashed border-stone-200 mb-4">
                  <p className="text-4xl mb-3">🛏️</p>
                  <p className="text-stone-600 font-semibold mb-1">No room types yet</p>
                  <p className="text-sm text-stone-400">Add Standard, Deluxe, Suite, Villa types…</p>
                </div>
              )}

              {/* Room editors */}
              {rooms.map((room, i) => (
                <RoomEditor key={i} room={room} index={i} onChange={(r) => updateRoom(i, r)} onRemove={() => removeRoom(i)} />
              ))}

              {/* Add room */}
              <button
                type="button"
                onClick={addRoom}
                className="w-full py-3.5 rounded-xl border-2 border-dashed border-amber-300 text-amber-600 text-sm font-bold hover:border-amber-500 hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl leading-none">+</span> Add Room Type
              </button>

              {/* Summary grouped by category */}
              {rooms.length > 0 && (
                <div className="mt-6 rounded-2xl bg-stone-50 border border-stone-200 overflow-hidden">
                  <div className="px-5 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                    <p className="text-[0.75rem] font-bold uppercase tracking-widest text-stone-500">Room Summary</p>
                    <p className="text-[0.7rem] text-stone-400">
                      {Object.keys(byCategory).length} categor{Object.keys(byCategory).length !== 1 ? "ies" : "y"}
                    </p>
                  </div>

                  {Object.entries(byCategory).map(([cat, catRooms]) => (
                    <div key={cat}>
                      <div className="px-5 py-2 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
                        <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_BADGE[cat] ?? "bg-stone-100 text-stone-600"}`}>
                          {cat}
                        </span>
                        <span className="text-[0.7rem] text-stone-400">{catRooms.length} room type{catRooms.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="divide-y divide-stone-100">
                        {catRooms.map((r, i) => (
                          <div key={i} className="flex items-center justify-between px-5 py-3.5 text-sm">
                            <div>
                              <p className="font-semibold text-stone-800">{r.name || "Unnamed"}</p>
                              <p className="text-xs text-stone-400 mt-0.5">
                                {r.beds.count} {r.beds.type} · {r.maxGuests} guests
                                {r.size > 0 ? ` · ${r.size} ${r.sizeUnit}` : ""}
                                {r.breakfastIncluded ? " · 🍳 Breakfast" : ""}
                                {r.freeCancellation ? " · ✓ Free cancel" : ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-stone-900">₹{(r.price || 0).toLocaleString("en-IN")}</p>
                              <p className="text-xs text-stone-400">{r.quantity} avail.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="px-5 py-3 bg-white border-t border-stone-200 flex justify-between text-sm">
                    <span className="text-stone-500">Starting from</span>
                    <span className="font-bold text-amber-600">
                      {prices.length ? `₹${Math.min(...prices).toLocaleString("en-IN")}` : "—"}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2 pb-12">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold tracking-widest uppercase hover:bg-stone-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3.5 rounded-xl bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 text-stone-950 text-xs font-bold tracking-widest uppercase shadow-lg shadow-amber-900/30 hover:-translate-y-0.5 hover:shadow-amber-700/40 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? "Saving…" : mode === "create" ? "Create Hotel" : "Update Hotel"}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
