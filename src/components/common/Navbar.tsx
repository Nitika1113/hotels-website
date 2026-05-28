// "use client";

// import Link from "next/link";
// import Image from "next/image";

// import Container from "../common/Container";

// interface NavbarProps {
//   overlay?: boolean;
//   authPage?: boolean;
// }

// export default function Navbar({
//   overlay = false,
//   authPage = false,
// }: NavbarProps) {
//   return (
//     <header
//       className={`
//         w-full
//         z-50
//         top-0
//         left-0
//         transition-all
//         duration-300

//         ${
//           overlay
//             ? "absolute bg-transparent text-white"
//             : "relative bg-white border-b text-black"
//         }
//       `}
//     >
//       <Container>
//         <nav className="h-20 flex items-center justify-between">

//           {/* LOGO */}
//           <Link href="/">
//             <Image
//               src="/logo.png"
//               alt="Dream Stay"
//               width={120}
//               height={40}
//                style={{ width: "auto", height: "auto" }}
//               priority
//             />
//           </Link>

//           {/* AUTH PAGE NAVBAR */}
//           {authPage ? (
//             <Link
//               href="/contact"
//               className="
//                 text-sm
//                 font-medium
//                 border
//                 border-gray-300
//                 px-5
//                 py-2
//                 rounded-lg
//                 hover:bg-gray-50
//                 transition
//               "
//             >
//               Contact
//             </Link>
//           ) : (
//             <>
//               {/* NAV LINKS */}
//               <div className="hidden md:flex items-center gap-8 text-sm font-medium">
//                 <Link href="/">Home</Link>

//                 <Link href="/search">
//                   Hotels
//                 </Link>

//                 <Link href="/booking">
//                   Booking
//                 </Link>

//                 <Link href="/contact">
//                   Contact
//                 </Link>
//               </div>

//               {/* ACTION BUTTONS */}
//               <div className="flex items-center gap-4">

//                 <Link
//                   href="/login"
//                   className="text-sm font-medium"
//                 >
//                   Sign In
//                 </Link>

//                 <Link
//                   href="/register"
//                   className={`
//                     px-5
//                     py-2
//                     rounded-full
//                     text-sm
//                     font-medium
//                     transition

//                     ${
//                       overlay
//                         ? "bg-white text-black hover:bg-gray-200"
//                         : "bg-black text-white hover:bg-gray-800"
//                     }
//                   `}
//                 >
//                   Join Now
//                 </Link>

//               </div>
//             </>
//           )}
//         </nav>
//       </Container>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "../common/Container";
import { NAV_LINKS } from "@/constants/navbar";

interface NavbarProps {
  authPage?: boolean;
}

export default function Navbar({ authPage = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glass background */}
      <div className="backdrop-blur-xl bg-black/40 border-b border-white/10">
        <Container>
          <nav className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={20}
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </Link>

            {/* CENTER LINKS */}
            {!authPage && (
              <div className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {authPage ? (
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-full text-sm bg-white text-black font-medium hover:opacity-80 transition"
                >
                  Contact
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-white/70 hover:text-white transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-black hover:scale-105 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}