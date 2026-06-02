"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HOTEL_FILTERS } from "../../../constants/amenties";

interface Props {
  initialData?: any;
  mode?: "create" | "edit";
}

export default function HotelForm({ initialData, mode = "create" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [activeSection, setActiveSection] = useState("basic");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const getCheckedValues = (name: string) =>
      Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(
        (el) => (el as HTMLInputElement).value
      );

    const hotel = {
      name: (form.hotelName as HTMLInputElement).value,
      slug: (form.slug as HTMLInputElement).value,
      description: (form.description as HTMLTextAreaElement).value,
      featuredImage,
      gallery,
      propertyType: (form.propertyType as HTMLSelectElement).value,
      starRating: Number((form.starRating as HTMLInputElement).value),
      reviewScore: Number((form.reviewScore as HTMLInputElement).value),
      reviewCount: Number((form.reviewCount as HTMLInputElement).value),
      startingPrice: Number((form.startingPrice as HTMLInputElement).value),
      roomCount: Number((form.roomCount as HTMLInputElement).value),
      featured: (form.featured as HTMLInputElement).checked,
      active: (form.active as HTMLInputElement).checked,
      mostBooked: (form.mostBooked as HTMLInputElement).checked,
      location: {
        country: (form.country as HTMLInputElement).value,
        state: (form.state as HTMLInputElement).value,
        city: (form.city as HTMLInputElement).value,
        address: (form.address as HTMLInputElement).value,
      },
      amenities: {
        facilities: getCheckedValues("facilities"),
        roomFacilities: getCheckedValues("roomFacilities"),
        travelGroups: getCheckedValues("travelGroups"),
        meals: getCheckedValues("meals"),
        popularFilters: getCheckedValues("popularFilters"),
      },
      highlights: [],
      nearbyPlaces: [],
      policies: {
        checkIn: (form.checkIn as HTMLInputElement).value,
        checkOut: (form.checkOut as HTMLInputElement).value,
        petsAllowed: (form.petsAllowed as HTMLInputElement).checked,
        smokingAllowed: (form.smokingAllowed as HTMLInputElement).checked,
      },
    };

    const url = mode === "create" ? "/api/hotels" : `/api/hotels/${initialData._id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotel),
    });

    if (response.ok) router.push("/admin/hotels");
    else alert("Failed to save hotel");
    setLoading(false);
  }

  const sections = [
    { id: "basic",     label: "Basic Info",  icon: "✦" },
    { id: "images",    label: "Images",      icon: "◈" },
    { id: "location",  label: "Location",    icon: "◎" },
    { id: "property",  label: "Property",    icon: "▣" },
    { id: "amenities", label: "Amenities",   icon: "◆" },
    { id: "policies",  label: "Policies",    icon: "◷" },
  ];

  // Shared input classes — white bg, black text, gold focus/hover
  const inputCls =
    "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none transition-all duration-150 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

  const labelCls =
    "block text-[0.8rem] font-bold tracking-[0.13em] uppercase text-black mb-1.5";

  const cardCls =
    "bg-white border border-white/[0.09] rounded-2xl p-5 scroll-mt-4";

  const cardTitleCls =
    "flex items-center gap-2.5 text-xl font-extrabold text-black pb-4 mb-2 border-b border-white/[0.08]";

  const CheckboxGroup = ({ title, items, name, selected = [] }: any) => (
    <div className="mb-7 last:mb-0">
      <p className="text-[0.8rem] font-bold tracking-[0.16em] uppercase text-amber-500 mb-3">
        {title}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item: string) => (
          <label
            key={item}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-white/10 text-sm text-black cursor-pointer hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-600 transition-all duration-150 select-none"
          >
            <input
              type="checkbox"
              name={name}
              value={item}
              defaultChecked={selected.includes(item)}
              className="accent-amber-500 w-3.5 h-3.5 shrink-0"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  const Toggle = ({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) => (
    <label className="group inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-10 h-5.5 rounded-full bg-white/ border border-white/[0.14] peer-checked:bg-amber-500/25 peer-checked:border-amber-500 transition-all duration-200" />
        <div className="absolute top-0.75 left-0.75 w-4 h-4 rounded-full bg-stone-800 peer-checked:translate-x-4.5 peer-checked:bg-amber-500 transition-all duration-200" />
      </div>
      <span className="text-[0.8rem] text-stone-900 group-hover:text-amber-500 transition-colors duration-150">
        {label}
      </span>
    </label>
  );

  return (
    <div className="min-h-screen text-stone-900">

      {/* Page header */}
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

          {/* Sticky sidebar nav */}
          <aside className="hidden lg:block w-44 shrink-0 sticky top-20">
            <nav className="bg-white/2.5 border border-white/8 rounded-2xl p-2 flex flex-col gap-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-left text-md font-bold transition-all duration-150 ${
                    activeSection === s.id
                      ? "bg-amber-500/[0.14] text-amber-400"
                      : "text-stone-900 hover:bg-amber-500/8 hover:text-amber-500"
                  }`}
                >
                  <span className="text-[0.8rem] opacity-60">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* BASIC INFO */}
            <section id="section-basic" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">✦</span>
                Basic Information
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Hotel Name</label>
                    <input name="hotelName" defaultValue={initialData?.name} placeholder="The Grand Meridian" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>URL Slug</label>
                    <input name="slug" defaultValue={initialData?.slug} placeholder="grand-meridian" className={inputCls} required />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={5} name="description" defaultValue={initialData?.description} placeholder="A timeless escape nestled in the heart of the city…" className={`${inputCls} resize-y`} required />
                </div>
              </div>
            </section>

            {/* IMAGES */}
            <section id="section-images" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">◈</span>
                Images
              </div>
              <div className="grid gap-4">
                <div>
                  <label className={labelCls}>Featured Image URL</label>
                  <input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://…" className={inputCls} />
                  {featuredImage && (
                    <div className="mt-3 rounded-xl overflow-hidden h-40 bg-black/40 border border-white/10">
                      <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Gallery — Press Enter to Add</label>
                  <input
                    placeholder="Paste image URL and press Enter…"
                    className={inputCls}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (!val) return;
                        setGallery((p) => [...p, val]);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  {gallery.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {gallery.map((img, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md px-2.5 py-1 text-[0.7rem] text-amber-400">
                          {img.length > 38 ? img.slice(0, 35) + "…" : img}
                          <button type="button" onClick={() => setGallery((p) => p.filter((_, j) => j !== i))} className="text-amber-500/60 hover:text-amber-300 text-base leading-none transition-colors">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* LOCATION */}
            <section id="section-location" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">◎</span>
                Location
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "country", label: "Country",          val: initialData?.location?.country },
                  { name: "state",   label: "State / Province", val: initialData?.location?.state   },
                  { name: "city",    label: "City",             val: initialData?.location?.city    },
                  { name: "address", label: "Street Address",   val: initialData?.location?.address },
                ].map((f) => (
                  <div key={f.name}>
                    <label className={labelCls}>{f.label}</label>
                    <input name={f.name} defaultValue={f.val} placeholder={f.label} className={inputCls} />
                  </div>
                ))}
              </div>
            </section>

            {/* PROPERTY DETAILS */}
            <section id="section-property" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">▣</span>
                Property Details
              </div>
              <div className="grid gap-4">
                <div>
                  <label className={labelCls}>Property Type</label>
                  <select name="propertyType" defaultValue={initialData?.propertyType} className={inputCls}>
                    {HOTEL_FILTERS.propertyTypes.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "starRating",    label: "Star Rating",        ph: "5",    val: initialData?.starRating    },
                    { name: "startingPrice", label: "Starting Price (₹)", ph: "4999", val: initialData?.startingPrice },
                    { name: "roomCount",     label: "Room Count",         ph: "120",  val: initialData?.roomCount     },
                    { name: "reviewScore",   label: "Review Score",       ph: "8",  val: initialData?.reviewScore   },
                    { name: "reviewCount",   label: "Review Count",       ph: "240",  val: initialData?.reviewCount   },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="number" name={f.name} defaultValue={f.val} placeholder={f.ph} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AMENITIES */}
            <section id="section-amenities" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">◆</span>
                Amenities
              </div>
              <CheckboxGroup title="Facilities"      items={HOTEL_FILTERS.facilities}     name="facilities"     selected={initialData?.amenities?.facilities     || []} />
              <CheckboxGroup title="Room Facilities" items={HOTEL_FILTERS.roomFacilities} name="roomFacilities" selected={initialData?.amenities?.roomFacilities || []} />
              <CheckboxGroup title="Travel Groups"   items={HOTEL_FILTERS.travelGroups}   name="travelGroups"   selected={initialData?.amenities?.travelGroups   || []} />
              <CheckboxGroup title="Meals"           items={HOTEL_FILTERS.meals}          name="meals"          selected={initialData?.amenities?.meals          || []} />
              <CheckboxGroup title="Popular Filters" items={HOTEL_FILTERS.popularFilters} name="popularFilters" selected={initialData?.amenities?.popularFilters || []} />
            </section>

            {/* POLICIES */}
            <section id="section-policies" className={cardCls}>
              <div className={cardTitleCls}>
                <span className="text-amber-500 text-lg">◷</span>
                Policies & Status
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                <div>
                  <label className={labelCls}>Check-In Time</label>
                  <input name="checkIn" defaultValue={initialData?.policies?.checkIn} placeholder="14:00" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Check-Out Time</label>
                  <input name="checkOut" defaultValue={initialData?.policies?.checkOut} placeholder="11:00" className={inputCls} />
                </div>
              </div>
              <p className="text-[0.75rem] font-bold tracking-[0.13em] uppercase text-black mb-4">
                Flags & Permissions
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <Toggle name="petsAllowed"    label="Pets Allowed"    defaultChecked={initialData?.policies?.petsAllowed}    />
                <Toggle name="smokingAllowed" label="Smoking Allowed" defaultChecked={initialData?.policies?.smokingAllowed} />
                <Toggle name="featured"       label="Featured"        defaultChecked={initialData?.featured}                 />
                <Toggle name="active"         label="Active"          defaultChecked={initialData?.active}                   />
                <Toggle name="mostBooked"     label="Most Booked"     defaultChecked={initialData?.mostBooked}               />
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end pt-2 pb-12">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3.5 rounded-xl bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 text-stone-950 text-xs font-bold tracking-widest uppercase shadow-lg shadow-amber-900/30 hover:-translate-y-0.5 hover:shadow-amber-700/40 hover:shadow-xl active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
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
