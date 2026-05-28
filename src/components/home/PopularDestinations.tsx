"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import {
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css/navigation";

import useDestinations from "@/hooks/useDestinations";

export default function PopularDestinations() {
  const { destinations, loading } =
    useDestinations();

  const router = useRouter();

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* HEADING */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold">
            Popular Destinations
          </h2>
        </div>

        {/* SLIDER */}
       <Swiper
  modules={[Navigation, Autoplay]}

  navigation

  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}

  loop={true}

  spaceBetween={20}

  slidesPerView={1.2}

  breakpoints={{
    640: {
      slidesPerView: 2,
    },

    768: {
      slidesPerView: 3,
    },

    1024: {
      slidesPerView: 4,
    },

    1280: {
      slidesPerView: 5,
    },
  }}
>
          {destinations.map((destination) => (
            <SwiperSlide
              key={destination.name}
            >
              <div
                onClick={() =>
                  router.push(
                    `/hotels?location=${destination.name}`
                  )
                }
                className="
                  relative
                  h-90
                  rounded-3xl
                  overflow-hidden
                  cursor-pointer
                  group
                "
              >
                {/* IMAGE */}
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 20vw"
                  className="
                    object-cover
                    group-hover:scale-110
                    transition
                    duration-500
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/25
                  "
                />

                {/* CONTENT */}
                <div
                  className="
                    absolute
                    bottom-6
                    left-6
                    text-white
                  "
                >
                  <h3 className="text-3xl font-bold">
                    {destination.name}
                  </h3>

                  <p className="mt-1 text-lg">
                    {destination.count} Properties
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}