"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    category: "Bookings",
    items: [
      {
        q: "How do I make a booking?",
        a: "Browse our hotels, select your preferred property, choose a room, and click 'Reserve Room'. Follow the booking steps to confirm your stay. You'll receive a confirmation email shortly after.",
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Yes, you can modify your booking up to 48 hours before check-in. Contact our support team via email or phone and we'll assist you with changes to dates, room type, or guest details.",
      },
      {
        q: "How do I cancel a reservation?",
        a: "You can cancel through your booking confirmation email or by contacting us directly. Cancellation policies vary by property — free cancellation is available on select rooms up to 24 hours before check-in.",
      },
      {
        q: "Will I receive a booking confirmation?",
        a: "Yes, a confirmation email with your booking details, check-in instructions, and hotel contact information will be sent to your registered email address within minutes of booking.",
      },
    ],
  },
  {
    category: "Payments & Pricing",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, and popular wallets like Paytm and PhonePe. All payments are secured with 256-bit SSL encryption.",
      },
      {
        q: "Are there any hidden charges?",
        a: "The price shown includes base room charges. Applicable taxes (GST) are shown at checkout. Some properties may charge resort fees or city taxes directly — this will always be clearly mentioned before you confirm.",
      },
      {
        q: "When will I be charged?",
        a: "For most bookings, payment is collected at the time of reservation. For 'Pay at Hotel' options, you'll be charged upon check-in. Refundable deposits, if any, are returned within 5–7 business days after checkout.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 3–5 business days after cancellation approval. The amount will reflect in your original payment source within 5–10 business days depending on your bank.",
      },
    ],
  },
  {
    category: "Check-In & Check-Out",
    items: [
      {
        q: "What is the standard check-in and check-out time?",
        a: "Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in or late check-out may be available on request and subject to availability — contact the property directly.",
      },
      {
        q: "What documents do I need at check-in?",
        a: "Please carry a valid government-issued photo ID (Aadhaar, Passport, Driving Licence, or Voter ID) along with your booking confirmation. International guests must present a valid passport.",
      },
      {
        q: "Can I request early check-in or late check-out?",
        a: "Yes, early check-in and late check-out requests can be made when booking or by contacting the hotel directly. These are subject to room availability and may incur additional charges.",
      },
    ],
  },
  {
    category: "Hotel Policies",
    items: [
      {
        q: "Are pets allowed?",
        a: "Pet policies vary by property. You can check whether a hotel allows pets on its listing page under the 'Policies' section. Always inform the hotel in advance if you're travelling with a pet.",
      },
      {
        q: "Is smoking allowed in rooms?",
        a: "Most of our properties are non-smoking. Designated smoking areas may be available. Smoking in non-smoking rooms may result in a cleaning fee. Check the individual hotel's policy page for details.",
      },
      {
        q: "Are children allowed? Is there an extra charge?",
        a: "Yes, children are welcome at all our properties. Children below 5 years stay free when using existing bedding. Extra beds or cribs for older children may be available at an additional charge.",
      },
    ],
  },
  {
    category: "Account & Support",
    items: [
      {
        q: "How do I contact customer support?",
        a: "You can reach us via the Contact page, email us at nitika@silverferndigital.com, or call +91 98765 43210. Our team is available Monday–Saturday, 9am–7pm IST.",
      },
      {
        q: "I didn't receive my confirmation email. What should I do?",
        a: "Check your spam/junk folder first. If it's not there, contact our support team with your name and booking date and we'll resend the confirmation immediately.",
      },
      {
        q: "Can I book for someone else?",
        a: "Yes, you can book on behalf of someone else. Enter the guest's name and contact details during booking. Please ensure the primary guest carries valid ID matching the booking name at check-in.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
        open ? "border-amber-200 shadow-sm shadow-amber-50" : "border-stone-100 hover:border-amber-200/60"
      } bg-white`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-amber-600" : "text-[#1f1f1f]"}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-400 transition-transform duration-300 ${open ? "rotate-180 text-amber-500" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div className="h-px bg-stone-100 mb-4" />
          <p className="text-sm leading-relaxed text-stone-500">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filtered = faqs
    .filter((f) => activeCategory === "All" || f.category === activeCategory)
    .map((f) => ({
      ...f,
      items: search.trim()
        ? f.items.filter(
            (i) =>
              i.q.toLowerCase().includes(search.toLowerCase()) ||
              i.a.toLowerCase().includes(search.toLowerCase())
          )
        : f.items,
    }))
    .filter((f) => f.items.length > 0);

  const totalResults = filtered.reduce((sum, f) => sum + f.items.length, 0);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* HERO */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-6 md:px-15 py-16">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-[#faf7f2] px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-amber-600">
            Help Center
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[#1f1f1f]">
            Frequently Asked Questions
          </h1>
          <p className="mt-2.5 text-base leading-relaxed text-stone-500 max-w-xl">
            Find instant answers to the most common questions about bookings, payments, policies, and more.
          </p>

          {/* Search */}
          <div className="mt-8 relative max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-white border border-stone-200 rounded-full pl-11 pr-5 py-3 text-sm text-black placeholder:text-stone-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-7xl px-6 md:px-15 py-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

          {/* Category sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-[20px] bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-3">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-stone-400 px-3 py-2">Categories</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeCategory === cat
                      ? "bg-amber-500/10 text-amber-600 font-semibold"
                      : "text-stone-600 hover:bg-stone-50 hover:text-[#1f1f1f]"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Still need help */}
              <div className="mt-4 mx-1 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs font-bold text-amber-700 mb-1">Still need help?</p>
                <p className="text-xs text-stone-500 mb-3">Our team is ready to assist you.</p>
                <Link
                  href="/contact"
                  className="block w-full text-center rounded-full bg-[#1f1f1f] py-2 text-xs font-semibold text-white hover:bg-[#c29b6a] transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </aside>

          {/* FAQ content */}
          <div>
            {/* Mobile category pills */}
            <div className="flex gap-2 flex-wrap mb-6 lg:hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold border transition-all ${
                    activeCategory === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-stone-500 border-stone-200 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Result count when searching */}
            {search && (
              <p className="text-sm text-stone-400 mb-5">
                {totalResults} result{totalResults !== 1 ? "s" : ""} for <span className="font-semibold text-stone-700">"{search}"</span>
              </p>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-[20px] bg-white border border-stone-100 p-16 text-center">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-lg font-semibold text-[#1f1f1f] mb-1">No results found</p>
                <p className="text-sm text-stone-400 mb-5">Try a different search term or browse by category.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c29b6a] transition-all">
                  Ask Us Directly
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {filtered.map((section) => (
                  <div key={section.category}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-amber-600">
                        {section.category}
                      </span>
                      <div className="flex-1 h-px bg-stone-100" />
                      <span className="text-xs text-stone-400">{section.items.length} questions</span>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <AccordionItem key={item.q} q={item.q} a={item.a} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 rounded-[20px] bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f1f] mb-1">Didn't find your answer?</h3>
                <p className="text-sm text-stone-500">Our support team is available Mon-Sat, 9am-7pm IST.</p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 rounded-full bg-[#1f1f1f] px-7 py-3 text-sm font-semibold text-white hover:bg-[#c29b6a] hover:shadow-lg transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
