"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useDestinations from "@/hooks/useDestinations";

export default function PopularDestinations() {
  const { destinations, loading } = useDestinations();
  const router = useRouter();

  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-8xl px-15">
          <div className="mb-10 animate-pulse">
            <div className="mb-3 h-3 w-32 rounded-full bg-stone-200" />
            <div className="mb-4 h-10 w-80 rounded-xl bg-stone-200" />
            <div className="h-4 w-full max-w-xl rounded-full bg-stone-200" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-105 animate-pulse rounded-3xl bg-stone-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-8xl px-15">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-[#faf7f2] px-4 py-1.5 text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
              Explore Places
            </span>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-black md:text-5xl">
              Popular Destinations
            </h2>
            <p className="mt-2.5 text-base leading-relaxed text-stone-500">
              Discover breathtaking locations and premium stays designed for your next unforgettable escape.
            </p>
          </div>
        </div>

        {/* SLIDER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1.1}
          breakpoints={{
            640:  { slidesPerView: 2   },
            768:  { slidesPerView: 3   },
            1280: { slidesPerView: 4   },
          }}
          className="destination-slider"
        >
          {destinations.map((destination) => (
            <SwiperSlide key={destination.name}>
              <article
                onClick={() => router.push(`/hotels?location=${destination.name}`)}
                className="group relative h-105 cursor-pointer overflow-hidden rounded-3xl border border-stone-200 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              >
                {/* Image */}
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                {/* Top badge */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-medium text-amber-500 backdrop-blur-md border border-white/20">
                  <MapPin size={12} className="text-amber-400" />
                  Trending Destination
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-white leading-tight">{destination.name}</h3>
                      <p className="mt-1 text-sm text-white/75">{destination.count} Luxury Properties</p>
                    </div>

                    {/* Arrow button */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-md transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
