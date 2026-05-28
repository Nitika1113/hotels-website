// "use client";

// import Link from "next/link";

// import useHotels from "@/hooks/useHotels";

// import HotelCard from "./HotelCard";

// interface HotelListProps {
//   showAll?: boolean;
// }

// export default function HotelList({
//   showAll = false,
// }: HotelListProps) {

//   const {
//     hotels,
//     loading,
//   } = useHotels(showAll);

//   if (loading) {
//     return (
//       <p className="text-center py-20 text-lg">
//         Loading Hotels...
//       </p>
//     );
//   }

//   return (
//     <section className="py-24">

//       <div className="max-w-7xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-14">

//           <div>

//             <h2 className="text-4xl font-bold mb-2">
//               {showAll
//                 ? "All Hotels"
//                 : "The Collection"}
//             </h2>

//             <p className="text-gray-500">
//               Luxury stays crafted for unforgettable moments.
//             </p>

//           </div>

//         </div>

//         {/* HOTELS */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

//           {hotels.map((hotel) => (
//             <HotelCard
//               key={hotel._id}
//               hotel={hotel}
//             />
//           ))}

//         </div>

//         {/* VIEW ALL BUTTON */}
//         {!showAll && (
//           <div className="flex justify-center mt-14">

//             <Link
//               href="/hotels"
//               className="
//                 px-8
//                 py-4
//                 rounded-full
//                 bg-black
//                 text-white
//                 hover:bg-gray-800
//                 transition
//               "
//             >
//               View All Hotels
//             </Link>

//           </div>
//         )}

//       </div>

//     </section>
//   );
// }


"use client";

import Link from "next/link";

import useHotels from "@/hooks/useHotels";

import HotelCard from "./HotelCard";

export default function HotelList() {

  // ONLY 6 HOTELS
  const {
    hotels,
    loading,
  } = useHotels(6);

  if (loading) {
    return (
      <section className="py-24 bg-[#f8f8f8]">
        <p className="text-center text-lg text-gray-500">
          Loading Hotels...
        </p>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#d3d3d3]">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-14">

          <div>

            <p className="text-md font-extrabold uppercase tracking-[0.3em] text-gray-800 mb-4">
              Luxury Collection
            </p>

            <h2 className="text-5xl font-bold text-black mb-3">
              Featured Hotels
            </h2>

            <p className="text-gray-500 text-lg max-w-2xl">
              Discover premium destinations crafted for unforgettable stays and timeless experiences.
            </p>

          </div>

          <Link
            href="/hotels"
            className="
              hidden md:flex
              items-center
              justify-center
              px-6
              py-3
              rounded-full
              border
              border-black
              text-black
              text-sm
              font-medium
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
            "
          >
            View All Hotels
          </Link>

        </div>

        {/* HOTELS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
            />
          ))}

        </div>

        {/* MOBILE BUTTON */}
        <div className="flex justify-center mt-12 md:hidden">

          <Link
            href="/hotels"
            className="
              px-6
              py-3
              rounded-full
              bg-black
              text-white
              text-sm
              font-medium
              hover:bg-gray-800
              transition
            "
          >
            View All Hotels
          </Link>

        </div>

      </div>
    </section>
  );
}