// import Image from "next/image";
// import{Room} from "../../../types/room"

// interface Props {
//   rooms: Room[];
// }

// export default function HotelRooms({
//   rooms,
// }: Props) {
//   if (!rooms.length) {
//     return (
//       <section className="mt-16">
//         <h2 className="mb-6 text-3xl font-bold">
//           Available Rooms
//         </h2>

//         <div className="rounded-3xl border p-10 text-center">
//           <p className="text-gray-500">
//             No rooms available.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="mt-16">
//       <h2 className="mb-6 text-3xl font-bold">
//         Available Rooms
//       </h2>

//       <div className="space-y-6">
//         {rooms.map((room) => (
//           <div
//             key={room._id?.toString()}
//             className="
//               overflow-hidden
//               rounded-3xl
//               border
//               bg-white
//             "
//           >
//             <div className="grid md:grid-cols-[320px_1fr]">
//               {/* IMAGE */}
//               <div className="relative h-72">
//                 <Image
//                   src={
//                     room.featuredImage ||
//                     "/placeholder.jpg"
//                   }
//                   alt={room.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               {/* CONTENT */}
//               <div className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-2xl font-bold">
//                       {room.name}
//                     </h3>

//                     <p className="mt-2 text-gray-500">
//                       {room.description}
//                     </p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">
//                       Per Night
//                     </p>

//                     <p className="text-3xl font-bold">
//                       ₹
//                       {room.price.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* DETAILS */}
//                 <div className="mt-6 flex flex-wrap gap-3">
//                   <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
//                     {room.maxGuests} Guests
//                   </span>

//                   <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
//                     {room.beds.count}{" "}
//                     {room.beds.type}
//                   </span>

//                   <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
//                     {room.bathrooms} Bathroom
//                   </span>

//                   <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
//                     {room.size}{" "}
//                     {room.sizeUnit}
//                   </span>
//                 </div>

//                 {/* FEATURES */}
//                 <div className="mt-6 flex flex-wrap gap-2">
//                   {room.roomFeatures.map(
//                     (feature) => (
//                       <span
//                         key={feature}
//                         className="
//                           rounded-full
//                           border
//                           px-3
//                           py-1
//                           text-sm
//                         "
//                       >
//                         {feature}
//                       </span>
//                     )
//                   )}
//                 </div>

//                 {/* BENEFITS */}
//                 <div className="mt-6 flex flex-wrap gap-3">
//                   {room.breakfastIncluded && (
//                     <span className="rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
//                       Breakfast Included
//                     </span>
//                   )}

//                   {room.freeCancellation && (
//                     <span className="rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
//                       Free Cancellation
//                     </span>
//                   )}
//                 </div>

//                 {/* CTA */}
//                 <div className="mt-8">
//                   <button
//                     className="
//                       rounded-xl
//                       bg-black
//                       px-6
//                       py-3
//                       text-white
//                       transition
//                       hover:opacity-90
//                     "
//                   >
//                     Reserve Room
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

import Image from "next/image";
import { Room } from "@/types/room";
import { Users, BedDouble, Bath, Maximize2, Check } from "lucide-react";

interface Props {
  rooms: Room[];
}

export default function HotelRooms({ rooms }: Props) {
  if (!rooms.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="text-amber-500 text-base">▣</span>
        <h2 className="text-lg font-semibold text-black">Available Rooms</h2>
        <span className="ml-auto text-xs text-stone-400">{rooms.length} options</span>
      </div>

      <div className="space-y-5">
        {rooms.map((room) => (
          <div
            key={room._id?.toString()}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white hover:border-amber-200 hover:shadow-md transition-all duration-300"
          >
            <div className="grid md:grid-cols-[280px_1fr]">

              {/* IMAGE */}
              <div className="relative h-56 md:h-full overflow-hidden">
                <Image
                  src={room.featuredImage || "/placeholder.jpg"}
                  alt={room.name}
                  fill
                  sizes="280px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                {room.breakfastIncluded && (
                  <div className="absolute top-3 left-3 rounded-full bg-green-500 px-2.5 py-1 text-[0.65rem] font-bold text-white uppercase tracking-wide">
                    Breakfast Incl.
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-black">{room.name}</h3>
                      <p className="text-sm text-stone-500 mt-1 line-clamp-2">{room.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Per Night</p>
                      <p className="text-2xl font-bold text-black">₹{room.price?.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Stat icon={<Users size={13} />} label={`${room.maxGuests} Guests`} />
                    <Stat icon={<BedDouble size={13} />} label={`${room.beds?.count} ${room.beds?.type}`} />
                    <Stat icon={<Bath size={13} />} label={`${room.bathrooms} Bath`} />
                    <Stat icon={<Maximize2 size={13} />} label={`${room.size} ${room.sizeUnit}`} />
                  </div>

                  {/* Features */}
                  {room.roomFeatures?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.roomFeatures.map((f) => (
                        <span key={f} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {room.freeCancellation && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
                        <Check size={11} /> Free Cancellation
                      </span>
                    )}
                    {room.breakfastIncluded && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
                        <Check size={11} /> Breakfast Included
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                  <p className="text-xs text-stone-400">Taxes & fees may apply</p>
                  <button className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200/50 active:scale-95">
                    Reserve Room
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
      <span className="text-amber-500">{icon}</span>
      {label}
    </div>
  );
}
