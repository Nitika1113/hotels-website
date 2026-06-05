interface Props {
  amenities: {
    facilities?: string[];
    roomFacilities?: string[];
    travelGroups?: string[];
    meals?: string[];
    popularFilters?: string[];
  };
}

function AmenityGroup({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mb-6 last:mb-0">
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-amber-600 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-colors"
          >
            <span className="text-amber-500 text-[0.6rem]">✓</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HotelAmenities({ amenities }: Props) {
  const hasAny = Object.values(amenities).some((arr) => arr && arr.length > 0);
  if (!hasAny) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="text-amber-500 text-base">◆</span>
        <h2 className="text-lg font-semibold text-black">Amenities & Facilities</h2>
      </div>
      <AmenityGroup title="Facilities"      items={amenities.facilities      || []} />
      <AmenityGroup title="Room Facilities" items={amenities.roomFacilities  || []} />
      <AmenityGroup title="Meals"           items={amenities.meals           || []} />
      <AmenityGroup title="Great For"       items={amenities.travelGroups    || []} />
      <AmenityGroup title="Popular Filters" items={amenities.popularFilters  || []} />
    </section>
  );
}
