// interface Props {
//   description: string;
// }

// export default function HotelOverview({
//   description,
// }: Props) {
//   return (
//     <section className="mt-12">
//       <h2 className="mb-5 text-3xl font-bold">
//         Overview
//       </h2>

//       <p className="leading-8 text-gray-600">
//         {description}
//       </p>
//     </section>
//   );
// }

interface Props {
  description: string;
  highlights?: string[];
}

export default function HotelOverview({ description, highlights }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="text-amber-500 text-base">✦</span>
        <h2 className="text-lg font-semibold text-black">About This Property</h2>
      </div>

      <p className="text-stone-600 leading-relaxed text-[0.95rem]">{description}</p>

      {highlights && highlights.length > 0 && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-sm text-stone-700">
              <span className="text-amber-500">✓</span>
              {h}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
