import Image from "next/image";

import { Hotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({
  hotel,
}: HotelCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-xl
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative h-72">
        <Image
  src={hotel.image}
  alt={hotel.name}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className="object-cover"
/>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-500 text-sm">
            {hotel.location}
          </p>

          <span className="text-sm">
            ⭐ {hotel.rating ?? "N/A"}
          </span>
        </div>

        <h3 className="text-2xl font-semibold mb-4">
          {hotel.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">
            ₹{hotel.price}/night
          </p>

          <button
            className="
              border
              px-5
              py-2
              rounded-lg
              hover:bg-black
              hover:text-white
              transition
            "
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}


// import Image from "next/image";
// import Link from "next/link";

// import { Hotel } from "@/types/hotel";

// interface HotelCardProps {
//   hotel: Hotel;
// }

// export default function HotelCard({
//   hotel,
// }: HotelCardProps) {
//   return (
//     <div
//       className="
//         group
//         bg-white
//         border
//         border-gray-200
//         rounded-3xl
//         overflow-hidden
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:shadow-2xl
//       "
//     >
//       {/* IMAGE */}
//       <div className="relative h-72 overflow-hidden">

//         <Image
//           src={hotel.image}
//           alt={hotel.name}
//           fill
//           sizes="(max-width: 768px) 100vw, 33vw"
//           className="
//             object-cover
//             transition-transform
//             duration-500
//             group-hover:scale-105
//           "
//         />

//         {/* OVERLAY */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

//         {/* RATING */}
//         <div
//           className="
//             absolute
//             top-4
//             right-4
//             px-3
//             py-1.5
//             rounded-full
//             bg-white/90
//             backdrop-blur-md
//             text-black
//             text-sm
//             font-medium
//             shadow-md
//           "
//         >
//           ⭐ {hotel.rating ?? "N/A"}
//         </div>

//       </div>

//       {/* CONTENT */}
//       <div className="p-6">

//         {/* LOCATION */}
//         <p className="text-sm text-gray-500 mb-3">
//           {hotel.location}
//         </p>

//         {/* NAME */}
//         <h3
//           className="
//             text-2xl
//             font-semibold
//             text-black
//             mb-6
//             line-clamp-1
//           "
//         >
//           {hotel.name}
//         </h3>

//         {/* FOOTER */}
//         <div className="flex items-center justify-between">

//           <div>
//             <p className="text-sm text-gray-500">
//               Starting from
//             </p>

//             <p className="text-2xl font-bold text-black">
//               ₹{hotel.price}
//               <span className="text-sm text-gray-500 font-medium">
//                 /night
//               </span>
//             </p>
//           </div>

//           <Link
//             href={`/hotels/${hotel._id}`}
//             className="
//               px-5
//               py-2.5
//               rounded-full
//               bg-black
//               text-white
//               text-sm
//               font-semibold
//               hover:bg-gray-800
//               transition
//             "
//           >
//             View
//           </Link>

//         </div>
//       </div>
//     </div>
//   );
// }