"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, BedDouble, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

interface Booking {
  _id: string;
  hotelName: string; roomName: string;
  guestName: string; guestEmail: string; guestPhone: string;
  checkIn: string; checkOut: string; nights: number;
  adults: number; children: number; rooms: number;
  pricePerNight: number; totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  completed: "bg-blue-50 text-blue-600 border-blue-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending:   <Clock size={11} />,
  confirmed: <CheckCircle size={11} />,
  cancelled: <XCircle size={11} />,
  completed: <CheckCircle size={11} />,
};

export default function AdminBookingsPage() {
  const [bookings,  setBookings]  = useState<Booking[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Booking | null>(null);
  const [filter,    setFilter]    = useState<"all"|"pending"|"confirmed"|"cancelled"|"completed">("all");
  const [updating,  setUpdating]  = useState(false);

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => {
      setBookings(d.data || []);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(p => p.map(b => b._id === id ? { ...b, status: status as any } : b));
    if (selected?._id === id) setSelected(p => p ? { ...p, status: status as any } : p);
    setUpdating(false);
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    setBookings(p => p.filter(b => b._id !== id));
    if (selected?._id === id) setSelected(null);
  }

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.totalPrice, 0);

  return (
    <section className="mx-auto max-w-7xl p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Bookings</h1>
        <p className="mt-1 text-stone-500 text-sm">Manage all hotel reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total",     value: counts.all,       color: "text-black"     },
          { label: "Pending",   value: counts.pending,   color: "text-amber-600" },
          { label: "Confirmed", value: counts.confirmed, color: "text-green-600" },
          { label: "Completed", value: counts.completed, color: "text-blue-600"  },
          { label: "Revenue",   value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-stone-100 shadow-sm p-4">
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all","pending","confirmed","completed","cancelled"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
              filter === f ? "bg-black text-white border-black" : "bg-white text-stone-500 border-stone-200 hover:border-amber-400 hover:text-amber-600"
            }`}
          >
            {f} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-200 p-20 text-center">
          <p className="text-xl font-semibold text-stone-400">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* LIST */}
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b._id}
                onClick={() => setSelected(b)}
                className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all hover:shadow-md hover:border-amber-200 ${
                  selected?._id === b._id ? "border-amber-400 shadow-md" : "border-stone-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-black">{b.guestName}</p>
                      <span className={`inline-flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[b.status]}`}>
                        {statusIcons[b.status]} {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-1.5">{b.guestEmail}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1"><Calendar size={11} className="text-amber-500" />{b.checkIn} → {b.checkOut}</span>
                      <span className="flex items-center gap-1"><BedDouble size={11} className="text-amber-500" />{b.roomName}</span>
                      <span className="flex items-center gap-1"><Users size={11} className="text-amber-500" />{b.adults} adults</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-black">₹{b.totalPrice?.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-stone-400">{b.nights} night{b.nights !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DETAIL PANEL */}
          {selected ? (
            <div className="sticky top-6 rounded-2xl border border-stone-100 bg-white shadow-sm p-6 h-fit">
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-semibold text-black text-lg">{selected.guestName}</h3>
                  <p className="text-xs text-stone-400">{selected.guestEmail} · {selected.guestPhone}</p>
                </div>
                <button onClick={() => deleteBooking(selected._id)} className="p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="space-y-2.5 text-sm mb-5">
                {[
                  ["Hotel",       selected.hotelName],
                  ["Room",        selected.roomName],
                  ["Check-In",    selected.checkIn],
                  ["Check-Out",   selected.checkOut],
                  ["Nights",      String(selected.nights)],
                  ["Guests",      `${selected.adults} adults${selected.children ? `, ${selected.children} children` : ""}`],
                  ["Rooms",       String(selected.rooms)],
                  ["Price/Night", `₹${selected.pricePerNight?.toLocaleString("en-IN")}`],
                  ["Total",       `₹${selected.totalPrice?.toLocaleString("en-IN")}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-stone-400">{l}</span>
                    <span className="font-semibold text-stone-800">{v}</span>
                  </div>
                ))}
                {selected.specialRequests && (
                  <div className="pt-2 border-t border-stone-100">
                    <p className="text-[0.62rem] font-bold uppercase tracking-widest text-amber-600 mb-1">Special Requests</p>
                    <p className="text-stone-600 text-xs">{selected.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Status update */}
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-stone-400 mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {(["pending","confirmed","completed","cancelled"] as const).map(s => (
                  <button key={s} disabled={selected.status === s || updating}
                    onClick={() => updateStatus(selected._id, s)}
                    className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                      selected.status === s
                        ? `${statusStyles[s]} cursor-default`
                        : "bg-white border-stone-200 text-stone-500 hover:border-amber-400 hover:text-amber-600"
                    } disabled:opacity-50`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="sticky top-6 rounded-2xl border border-dashed border-stone-200 p-12 text-center text-stone-400">
              <Calendar size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a booking to view details</p>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
