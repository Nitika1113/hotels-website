
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Users, BedDouble, MapPin, Star,
  CheckCircle, ChevronRight, Clock, Shield
} from "lucide-react";

interface Room {
  _id: string; name: string; price: number; featuredImage: string;
  maxGuests: number; beds: { count: number; type: string };
  breakfastIncluded: boolean; freeCancellation: boolean;
}

interface Hotel {
  _id: string; name: string; slug: string; featuredImage: string;
  starRating: number; reviewScore: number;
  location: { city: string; country: string };
  policies: { checkIn: string; checkOut: string };
}

export default function BookingPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();

  const hotelId = params.hotelId as string;

  // Pre-filled from search params, fallback to today/tomorrow
  const today    = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [checkIn,  setCheckIn]  = useState(searchParams.get("checkIn")?.slice(0,10)  || today);
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut")?.slice(0,10) || tomorrow);
  const [adults,   setAdults]   = useState(Number(searchParams.get("adults")  || 1));
  const [children, setChildren] = useState(Number(searchParams.get("children")|| 0));
  const [rooms,    setRooms]    = useState(Number(searchParams.get("rooms")   || 1));

  const [hotel,         setHotel]         = useState<Hotel | null>(null);
  const [availableRooms,setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom,  setSelectedRoom]  = useState<Room | null>(null);
  const [step,          setStep]          = useState<1|2|3>(1); // 1=select room, 2=guest info, 3=confirm
  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [booked,        setBooked]        = useState(false);
  const [bookingId,     setBookingId]     = useState("");

  // Guest form
  const [guestName,        setGuestName]        = useState("");
  const [guestEmail,       setGuestEmail]        = useState("");
  const [guestPhone,       setGuestPhone]        = useState("");
  const [specialRequests,  setSpecialRequests]  = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`/api/hotels?id=${hotelId}`),
          fetch(`/api/rooms?hotelId=${hotelId}`),
        ]);
        const hotelData = await hotelRes.json();
        const roomsData = await roomsRes.json();
        // API returns single hotel object when ?id= is used
        const hotelObj = hotelData.data;
        setHotel(Array.isArray(hotelObj) ? hotelObj[0] : hotelObj);
        setAvailableRooms(roomsData.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [hotelId]);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  const totalPrice = selectedRoom ? selectedRoom.price * nights * rooms : 0;

  async function handleConfirm() {
    if (!selectedRoom || !hotel) return;
    if (!guestName || !guestEmail || !guestPhone) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId:       hotel._id,
          hotelName:     hotel.name,
          hotelSlug:     hotel.slug,
          roomId:        selectedRoom._id,
          roomName:      selectedRoom.name,
          guestName, guestEmail, guestPhone,
          checkIn, checkOut, nights, adults, children, rooms,
          pricePerNight: selectedRoom.price,
          totalPrice,
          specialRequests,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingId(data.bookingId);
        setBooked(true);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (e) { alert("Something went wrong."); }
    finally { setSubmitting(false); }
  }

  const inputCls = "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all";
  const labelCls = "block text-[0.68rem] font-bold tracking-[0.13em] uppercase text-black mb-1.5";

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-stone-500 text-sm">Loading booking details…</p>
      </div>
    </div>
  );

  // ── SUCCESS STATE ──
  if (booked) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-200 mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-semibold text-black mb-2">Booking Confirmed!</h1>
        <p className="text-stone-500 mb-2">Your stay at <strong>{hotel?.name}</strong> is confirmed.</p>
        <p className="text-xs text-stone-400 mb-8">Booking ID: <span className="font-mono font-bold text-stone-600">{bookingId}</span></p>
        <div className="rounded-2xl bg-white border border-stone-100 p-6 text-left mb-6 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-stone-400">Room</span><span className="font-semibold">{selectedRoom?.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-stone-400">Check-In</span><span className="font-semibold">{checkIn}</span></div>
          <div className="flex justify-between text-sm"><span className="text-stone-400">Check-Out</span><span className="font-semibold">{checkOut}</span></div>
          <div className="flex justify-between text-sm"><span className="text-stone-400">Guests</span><span className="font-semibold">{adults + children}</span></div>
          <div className="h-px bg-stone-100" />
          <div className="flex justify-between text-base font-bold"><span>Total Paid</span><span className="text-amber-600">₹{totalPrice.toLocaleString("en-IN")}</span></div>
        </div>
        <p className="text-sm text-stone-400 mb-6">A confirmation has been sent to <strong>{guestEmail}</strong>.</p>
        <Link href="/" className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-amber-500 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* HEADER */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-6 md:px-15 py-6">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/hotels" className="hover:text-black transition-colors">Hotels</Link>
            <ChevronRight size={12} />
            {hotel && <Link href={`/hotels/${hotel.slug}`} className="hover:text-black transition-colors">{hotel.name}</Link>}
            <ChevronRight size={12} />
            <span className="text-black">Book</span>
          </div>
          <h1 className="text-2xl font-semibold text-black">Complete Your Booking</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[{ n: 1, label: "Select Room" }, { n: 2, label: "Guest Info" }, { n: 3, label: "Confirm" }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= s.n ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-400"
                }`}>{s.n}</div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.n ? "text-black" : "text-stone-400"}`}>{s.label}</span>
                {i < 2 && <ChevronRight size={14} className="text-stone-300 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-15 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* MAIN CONTENT */}
          <div>

            {/* STEP 1 — Select Room */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-black mb-4">Choose Your Room</h2>

                {/* Date & Guest selector */}
                <div className="rounded-2xl bg-white border border-stone-100 p-5 shadow-sm mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelCls}>Check-In</label>
                      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().slice(0,10)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Check-Out</label>
                      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Adults</label>
                      <input type="number" value={adults} min={1} onChange={e => setAdults(Number(e.target.value))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Rooms</label>
                      <input type="number" value={rooms} min={1} onChange={e => setRooms(Number(e.target.value))} className={inputCls} />
                    </div>
                  </div>
                </div>

                {availableRooms.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-stone-100 p-12 text-center">
                    <p className="text-stone-400">No rooms available for this hotel.</p>
                  </div>
                ) : availableRooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => setSelectedRoom(room)}
                    className={`cursor-pointer rounded-2xl border bg-white transition-all duration-200 overflow-hidden hover:shadow-md ${
                      selectedRoom?._id === room._id ? "border-amber-400 shadow-md shadow-amber-50" : "border-stone-200 hover:border-amber-200"
                    }`}
                  >
                    <div className="grid md:grid-cols-[220px_1fr]">
                      <div className="relative h-48 md:h-full bg-stone-100">
                        {room.featuredImage ? (
                          <Image src={room.featuredImage} alt={room.name} fill sizes="220px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl">🛏</div>
                        )}
                        {selectedRoom?._id === room._id && (
                          <div className="absolute top-3 right-3 rounded-full bg-amber-500 p-1">
                            <CheckCircle size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-semibold text-black text-lg">{room.name}</h3>
                          <div className="text-right shrink-0">
                            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Per Night</p>
                            <p className="text-2xl font-bold text-black">₹{room.price?.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
                            <Users size={12} className="text-amber-500" /> {room.maxGuests} Guests
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs text-stone-600">
                            <BedDouble size={12} className="text-amber-500" /> {room.beds?.count} {room.beds?.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.freeCancellation && <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">✓ Free Cancellation</span>}
                          {room.breakfastIncluded && <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">✓ Breakfast Included</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => selectedRoom && setStep(2)}
                    disabled={!selectedRoom || !checkIn || !checkOut}
                    className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Guest Info →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Guest Info */}
            {step === 2 && (
              <div className="rounded-2xl bg-white border border-stone-100 p-7 shadow-sm">
                <h2 className="text-lg font-semibold text-black mb-6">Guest Information</h2>
                <div className="grid gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" className={inputCls} required />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@example.com" className={inputCls} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Special Requests</label>
                    <textarea rows={3} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Any special requests or preferences…" className={`${inputCls} resize-none`} />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className="rounded-full border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-all">
                    ← Back
                  </button>
                  <button
                    onClick={() => { if (guestName && guestEmail && guestPhone) setStep(3); }}
                    disabled={!guestName || !guestEmail || !guestPhone}
                    className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Review Booking →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-stone-100 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-black mb-5 pb-4 border-b border-stone-100">Booking Summary</h2>
                  <div className="space-y-3 text-sm">
                    <Row label="Hotel"       value={hotel?.name || ""} />
                    <Row label="Room"        value={selectedRoom?.name || ""} />
                    <Row label="Check-In"    value={checkIn} />
                    <Row label="Check-Out"   value={checkOut} />
                    <Row label="Nights"      value={String(nights)} />
                    <Row label="Adults"      value={String(adults)} />
                    <Row label="Rooms"       value={String(rooms)} />
                    <div className="h-px bg-stone-100 my-2" />
                    <Row label="Price / Night" value={`₹${selectedRoom?.price?.toLocaleString("en-IN")}`} />
                    <Row label="Total"       value={`₹${totalPrice.toLocaleString("en-IN")}`} bold />
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-stone-100 p-6 shadow-sm">
                  <h2 className="text-base font-semibold text-black mb-4">Guest Details</h2>
                  <div className="space-y-2 text-sm">
                    <Row label="Name"  value={guestName} />
                    <Row label="Email" value={guestEmail} />
                    <Row label="Phone" value={guestPhone} />
                    {specialRequests && <Row label="Requests" value={specialRequests} />}
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-start gap-3">
                  <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-600 leading-relaxed">
                    By confirming this booking you agree to the hotel's cancellation policy and our Terms of Service. Your details are securely handled.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="rounded-full border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-all">
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="rounded-full bg-black px-10 py-3 text-sm font-bold text-white hover:bg-amber-500 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : null}
                    {submitting ? "Confirming…" : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Hotel Summary Card */}
          <aside>
            <div className="sticky top-6 space-y-4">
              {hotel && (
                <div className="rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
                  <div className="relative h-44">
                    <Image src={hotel.featuredImage || "/placeholder.jpg"} alt={hotel.name} fill sizes="360px" className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-semibold text-lg leading-tight">{hotel.name}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-white/80">
                        <MapPin size={12} className="text-amber-400" />
                        {hotel.location?.city}{hotel.location?.country ? `, ${hotel.location.country}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < hotel.starRating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
                      ))}
                      <span className="text-xs text-stone-400 ml-1">{hotel.reviewScore} / 10</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock size={13} className="text-amber-500" />
                      Check-in: {hotel.policies?.checkIn} · Check-out: {hotel.policies?.checkOut}
                    </div>
                    {checkIn && checkOut && selectedRoom && (
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mt-2">
                        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-amber-600 mb-2">Price Breakdown</p>
                        <div className="space-y-1.5 text-xs text-stone-600">
                          <div className="flex justify-between"><span>₹{selectedRoom.price?.toLocaleString("en-IN")} × {nights} night{nights !== 1 ? "s" : ""} × {rooms} room{rooms !== 1 ? "s" : ""}</span></div>
                          <div className="h-px bg-amber-100 my-1" />
                          <div className="flex justify-between font-bold text-sm text-black">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-400">{label}</span>
      <span className={`${bold ? "font-bold text-base text-amber-600" : "font-semibold text-stone-800"}`}>{value}</span>
    </div>
  );
}



