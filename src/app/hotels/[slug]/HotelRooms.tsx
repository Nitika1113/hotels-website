"use client";

import { useState } from "react";
import Image from "next/image";
import { Room } from "@/types/room";
import { Users, BedDouble, Bath, Maximize2, Check, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { CATEGORY_BADGE } from "@/constants/room";

interface Props {
  rooms: Room[];
}
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {idx + 1} / {images.length}
      </p>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full max-w-4xl mx-16 aspect-4/3"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[idx]}
          alt={`Image ${idx + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-full overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx ? "border-amber-400 opacity-100" : "border-white/20 opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function isValidUrl(src: string): boolean {
  if (!src || typeof src !== "string") return false;
  try {
    return /^https?:\/\//.test(src);
  } catch {
    return false;
  }
}

function RoomGallery({
  featuredImage,
  images,
  name,
}: {
  featuredImage: string;
  images: string[];
  name: string;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const allImages = [
    ...(isValidUrl(featuredImage) ? [featuredImage] : []),
    ...images.filter((img) => img && img !== featuredImage && isValidUrl(img)),
  ];

  const extras = allImages.length - 4;

   if (allImages.length === 0) {
    return (
      <div className="relative flex items-center justify-center bg-stone-100 text-stone-300 text-4xl min-h-55 h-full">
        🛏
      </div>
    );
  }

  return (
    <>
      <div className="relative h-full flex flex-col gap-1 min-h-55">
        <div
          className="relative flex-1 cursor-pointer overflow-hidden group min-h-40"
          onClick={() => setLightboxIdx(0)}
        >
          <Image
            src={allImages[0]}
            alt={name}
            fill
            sizes="280px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {allImages.length > 1 && (
          <div className="grid grid-cols-3 gap-1 h-16">
            {allImages.slice(1, 4).map((src, i) => {
              const isLast = i === 2 && extras > 0;
              const actualIdx = i + 1;
              return (
                <div
                  key={i}
                  className="relative cursor-pointer overflow-hidden group"
                  onClick={() => setLightboxIdx(isLast ? 3 : actualIdx)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-0.5">
                      <span className="text-white text-xs font-bold">+{extras} more</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
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
export default function HotelRooms({ rooms }: Props) {
  if (!rooms.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100">
        <span className="text-amber-500 text-base">🛏</span>
        <h2 className="text-lg font-semibold text-black">Available Rooms</h2>
        <span className="ml-auto text-xs text-stone-400">{rooms.length} option{rooms.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-4">
        {rooms.map((room) => {
          const badgeCls = CATEGORY_BADGE[room.category ?? ""] ?? "bg-stone-100 text-stone-600";

          return (
            <div
              key={room._id?.toString()}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[280px_1fr]">

                {/* GALLERY */}
                <RoomGallery
                  featuredImage={room.featuredImage}
                  images={room.images ?? []}
                  name={room.name}
                />

                {/* CONTENT */}
                <div className="p-5 flex flex-col justify-between">
                  <div>

                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-semibold text-black">{room.name}</h3>
                          {room.category && (
                            <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeCls}`}>
                              {room.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 line-clamp-2">{room.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[0.55rem] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Per Night</p>
                        <p className="text-2xl font-bold text-black">₹{room.price?.toLocaleString("en-IN")}</p>
                        <p className="text-[0.65rem] text-stone-400">{room.quantity} room{room.quantity !== 1 ? "s" : ""} left</p>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Stat icon={<Users size={12} />}     label={`${room.maxGuests} Guests`} />
                      <Stat icon={<BedDouble size={12} />} label={`${room.beds?.count} ${room.beds?.type}`} />
                      <Stat icon={<Bath size={12} />}      label={`${room.bathrooms} Bath`} />
                      {room.size > 0 && (
                        <Stat icon={<Maximize2 size={12} />} label={`${room.size} ${room.sizeUnit}`} />
                      )}
                    </div>

                    {/* Room features */}
                    {room.roomFeatures?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {room.roomFeatures.slice(0, 8).map((f) => (
                          <span key={f} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">
                            {f}
                          </span>
                        ))}
                        {room.roomFeatures.length > 8 && (
                          <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-400">
                            +{room.roomFeatures.length - 8} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {room.freeCancellation && (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
                          <Check size={10} /> Free Cancellation
                        </span>
                      )}
                      {room.breakfastIncluded && (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700">
                          <Check size={10} /> Breakfast Included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                    <p className="text-xs text-stone-400">Taxes &amp; fees may apply</p>
                    <button
                      type="button"
                      className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200/50 active:scale-95"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
