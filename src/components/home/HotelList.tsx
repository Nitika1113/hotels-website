"use client";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import useHotels from "@/hooks/useHotels";

import HotelCard from "./HotelCard";

export default function HotelList() {
  const {
    hotels,
    loading,
  } = useHotels(6);

  // LOADING STATE
  if (loading) {
    return (
      <section className="bg-[#f7f5f2] py-28">
        <div className="mx-auto max-w-8xl px-10">
          {/* HEADER SKELETON */}
          <div className="mb-16 animate-pulse">
            <div className="mb-5 h-4 w-40 rounded-full bg-gray-200" />

            <div className="mb-4 h-14 w-[320px] rounded-xl bg-gray-200" />

            <div className="h-5 w-full max-w-2xl rounded-full bg-gray-200" />
          </div>

          {/* CARDS SKELETON */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-4xl bg-white shadow-sm"
                >
                  {/* IMAGE */}
                  <div className="h-80 animate-pulse bg-gray-200" />

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="mb-4 h-7 w-3/4 animate-pulse rounded-lg bg-gray-200" />

                    <div className="mb-3 h-4 w-full animate-pulse rounded-full bg-gray-200" />

                    <div className="mb-8 h-4 w-2/3 animate-pulse rounded-full bg-gray-200" />

                    <div className="flex items-center justify-between">
                      <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />

                      <div className="h-11 w-28 animate-pulse rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f7f5f2] py-20">
      <div className="mx-auto max-w-8xl px-15">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* LEFT CONTENT */}
          <div className="max-w-2xl">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-black/10
                bg-white/80
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#8b6b45]
                backdrop-blur-md
              "
            >
              Luxury Collection
            </span>

            <h2
              className="
                mt-3
                text-4xl
                font-semibold
                leading-tight
                tracking-tight
                text-[#1f1f1f]
                md:text-6xl
              "
            >
              Featured Hotels
            </h2>

            <p
              className="
                mt-2
                text-lg
                leading-relaxed
                text-gray-500
              "
            >
              Discover premium destinations crafted
              for unforgettable stays, timeless
              elegance, and elevated hospitality
              experiences.
            </p>
          </div>

          {/* DESKTOP BUTTON */}
          <Link
            href="/hotels"
            className="
              hidden
              md:inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-black/10
              bg-white
              px-6
              py-3
              text-sm
              font-medium
              text-[#1f1f1f]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#1f1f1f]
              hover:text-white
              hover:shadow-lg
            "
          >
            View All Hotels

            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* HOTELS GRID */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
            />
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <div className="mt-14 flex justify-center md:hidden">
          <Link
            href="/hotels"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#1f1f1f]
              px-7
              py-3.5
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              hover:bg-[#c29b6a]
              hover:shadow-xl
            "
          >
            View All Hotels

            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}