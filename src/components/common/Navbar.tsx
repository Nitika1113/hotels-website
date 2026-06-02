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
      <div className="backdrop-blur-xl  bg-[#c29b6a]/20 border-white/10">
        <Container>
          <nav className="flex items-center justify-between h-18">

            {/* LOGO */}
            <Link href="/" className="flex mt-3 items-center gap-1">
              <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={10}
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </Link>

            {/* CENTER LINKS */}
            {!authPage && (
              <div className="hidden md:flex items-center gap-1 bg-white px-2 py-1 text-black  rounded-full border border-white/10">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-1.5 text-md  hover:text-[#b37f3f] text-black hover:bg-white/10 rounded-full transition"
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
                    className="text-md text-black hover:text-[#b37f3f] transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-full text-md font-semibold bg-white text-black hover:scale-105 hover:bg-[#d4b794] hover:shadow-xl transition"
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