"use client";

import { useState } from "react";
import Toggle from "./Toggle";
import { BED_TYPES, ROOM_CATEGORIES, CATEGORY_BADGE, ROOM_FEATURES } from "@/constants/room";
import type { Room } from "@/types/room";

const inputCls =
  "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none transition-all duration-150 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

const labelCls =
  "block text-[0.8rem] font-bold tracking-[0.13em] uppercase text-black mb-1.5";

const sectionLabel =
  "text-[0.75rem] font-bold tracking-widest uppercase text-amber-500 mb-3";

interface Props {
  room: Room;
  index: number;
  onChange: (r: Room) => void;
  onRemove: () => void;
}

export default function RoomEditor({ room, index, onChange, onRemove }: Props) {
  const [expanded, setExpanded] = useState(index === 0);
  const [galleryInput, setGalleryInput] = useState("");

  const update = (patch: Partial<Room>) => onChange({ ...room, ...patch });
  const namePreview = room.name || `Room Type ${index + 1}`;
  const badgeCls = CATEGORY_BADGE[room.category] ?? "bg-stone-100 text-stone-600";

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden mb-4">

      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((p) => !p)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-amber-50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-stone-800">{namePreview}</p>
              {room.category && (
                <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeCls}`}>
                  {room.category}
                </span>
              )}
            </div>
            {room.price > 0 && (
              <p className="text-xs text-stone-400 mt-0.5">
                ₹{room.price.toLocaleString("en-IN")} / night · {room.beds.count} {room.beds.type} · {room.maxGuests} guests
                {room.size > 0 ? ` · ${room.size} ${room.sizeUnit}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${room.active ? "bg-green-100 text-green-700" : "bg-stone-200 text-stone-500"}`}>
            {room.active ? "Active" : "Inactive"}
          </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
          <span className="text-stone-400 text-base">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="p-5 grid gap-5 border-t border-stone-100">

          {/* Name · Slug · Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Room Name</label>
              <input value={room.name} onChange={(e) => update({ name: e.target.value })} placeholder="Deluxe King Room" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL Slug</label>
              <input value={room.slug} onChange={(e) => update({ slug: e.target.value })} placeholder="deluxe-king-room" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Room Category</label>
              <select value={room.category} onChange={(e) => update({ category: e.target.value })} className={inputCls}>
                {ROOM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Category quick-pick */}
          <div className="rounded-xl bg-stone-50 border border-stone-200 px-4 py-3">
            <p className={`${sectionLabel} mb-2`}>Quick-Select Category</p>
            <div className="flex flex-wrap gap-1.5">
              {ROOM_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ category: c })}
                  className={`text-[0.65rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all ${
                    room.category === c
                      ? "border-amber-500 bg-amber-500 text-white"
                      : `${CATEGORY_BADGE[c] ?? "bg-stone-100 text-stone-500"} border-transparent hover:border-amber-300`
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} value={room.description} onChange={(e) => update({ description: e.target.value })} placeholder="Spacious room with panoramic city views…" className={`${inputCls} resize-y`} />
          </div>

          {/* Pricing & Inventory */}
          <div>
            <p className={sectionLabel}>Pricing & Inventory</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Price / Night (₹)</label>
                <input type="number" value={room.price || ""} onChange={(e) => update({ price: Number(e.target.value) })} placeholder="4999" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Quantity (Rooms)</label>
                <input type="number" value={room.quantity || ""} onChange={(e) => update({ quantity: Number(e.target.value) })} placeholder="10" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Room Size</label>
                <div className="flex gap-2">
                  <input type="number" value={room.size || ""} onChange={(e) => update({ size: Number(e.target.value) })} placeholder="350" className={inputCls} />
                  <select value={room.sizeUnit} onChange={(e) => update({ sizeUnit: e.target.value as "sqft" | "sqm" })} className="bg-white border border-stone-300 rounded-xl px-3 text-sm text-black outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
                    <option value="sqft">sqft</option>
                    <option value="sqm">sqm</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Capacity */}
          <div>
            <p className={sectionLabel}>Guest Capacity</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {([
                { label: "Max Guests", key: "maxGuests" as const, val: room.maxGuests },
                { label: "Adults",     key: "adults"    as const, val: room.adults    },
                { label: "Children",   key: "children"  as const, val: room.children  },
              ]).map((f) => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="number" value={f.val || ""} onChange={(e) => update({ [f.key]: Number(e.target.value) })} placeholder="2" className={inputCls} />
                </div>
              ))}
            </div>
          </div>

          {/* Beds & Bathrooms */}
          <div>
            <p className={sectionLabel}>Beds & Bathrooms</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Bed Count</label>
                <input type="number" value={room.beds.count || ""} onChange={(e) => update({ beds: { ...room.beds, count: Number(e.target.value) } })} placeholder="1" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bed Type</label>
                <select value={room.beds.type} onChange={(e) => update({ beds: { ...room.beds, type: e.target.value } })} className={inputCls}>
                  {BED_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Bathrooms</label>
                <input type="number" value={room.bathrooms || ""} onChange={(e) => update({ bathrooms: Number(e.target.value) })} placeholder="1" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Room Features */}
          <div>
            <p className={sectionLabel}>Room Features & Amenities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {ROOM_FEATURES.map((feat) => (
                <label key={feat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-sm text-black cursor-pointer hover:border-amber-500/60 hover:bg-amber-50 hover:text-amber-700 transition-all select-none">
                  <input
                    type="checkbox"
                    checked={room.roomFeatures.includes(feat)}
                    onChange={(e) => update({ roomFeatures: e.target.checked ? [...room.roomFeatures, feat] : room.roomFeatures.filter((f) => f !== feat) })}
                    className="accent-amber-500 w-3.5 h-3.5 shrink-0"
                  />
                  {feat}
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <p className={sectionLabel}>Images</p>
            <div className="grid gap-3">
              <div>
                <label className={labelCls}>Featured Image URL</label>
                <input value={room.featuredImage} onChange={(e) => update({ featuredImage: e.target.value })} placeholder="https://…" className={inputCls} />
                {room.featuredImage && (
                  <div className="mt-2 rounded-xl overflow-hidden h-36 bg-stone-100 border border-stone-200">
                    <img src={room.featuredImage} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Gallery — Press Enter to Add</label>
                <input
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  placeholder="Paste image URL and press Enter…"
                  className={inputCls}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = galleryInput.trim();
                      if (!val) return;
                      update({ images: [...room.images, val] });
                      setGalleryInput("");
                    }
                  }}
                />
                {room.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {room.images.map((img, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md px-2.5 py-1 text-[0.7rem] text-amber-600">
                        {img.length > 38 ? img.slice(0, 35) + "…" : img}
                        <button type="button" onClick={() => update({ images: room.images.filter((_, j) => j !== i) })} className="text-amber-400 hover:text-amber-700 text-base leading-none">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Flags */}
          <div>
            <p className={sectionLabel}>Options</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Toggle name={`room_freeCancellation_${index}`}  label="Free Cancellation"  checked={room.freeCancellation}  onChange={(v) => update({ freeCancellation: v })}  />
              <Toggle name={`room_breakfastIncluded_${index}`} label="Breakfast Included" checked={room.breakfastIncluded} onChange={(v) => update({ breakfastIncluded: v })} />
              <Toggle name={`room_active_${index}`}            label="Active / Visible"   checked={room.active}            onChange={(v) => update({ active: v })}            />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
