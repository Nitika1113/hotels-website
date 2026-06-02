"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2X2 } from "lucide-react";

interface Props {
  images: string[];
}

export default function HotelGallery({ images }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!images.length) return null;

  const visible = images.slice(0, 5);
  const remaining = images.length - 5;

  const prev = () => setLightbox((i) => (i! > 0 ? i! - 1 : images.length - 1));
  const next = () => setLightbox((i) => (i! < images.length - 1 ? i! + 1 : 0));

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="text-amber-500 text-base">◈</span>
        <h2 className="text-lg font-semibold text-black">Photo Gallery</h2>
        <span className="ml-auto text-xs text-stone-400">{images.length} photos</span>
      </div>

      {/* 5-photo grid layout */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-105">

        {/* Large first photo */}
        <div
          onClick={() => setLightbox(0)}
          className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
        >
          <Image
            src={visible[0]}
            alt="Gallery 1"
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>

        {/* Photos 2-4 */}
        {visible.slice(1, 4).map((img, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i + 1)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group"
          >
            <Image
              src={img}
              alt={`Gallery ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>
        ))}

        {/* 5th photo with "View All" overlay */}
        {visible[4] && (
          <div
            onClick={() => { setShowAll(true); setLightbox(4); }}
            className="relative overflow-hidden rounded-2xl cursor-pointer group"
          >
            <Image
              src={visible[4]}
              alt="Gallery 5"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark overlay with count */}
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 group-hover:bg-black/65 transition-all duration-300">
              <Grid2X2 size={22} className="text-white" />
              <span className="text-white font-bold text-sm">View All</span>
              {remaining > 0 && (
                <span className="text-white/70 text-xs">+{remaining} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-all"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Main image */}
          <div
            className="relative w-full max-w-5xl h-[78vh] px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`Photo ${lightbox + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-all"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail strip */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-2xl px-4 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightbox(i)}
                className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  i === lightbox
                    ? "border-amber-400 scale-110"
                    : "border-transparent opacity-40 hover:opacity-75"
                }`}
              >
                <Image src={img} alt={`Thumb ${i + 1}`} fill sizes="56px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
