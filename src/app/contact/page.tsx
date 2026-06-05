"use client";

import { useState } from "react";
import { Send, CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;

    const body = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      phone:   (form.elements.namedItem("phone")   as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const inputCls =
    "w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-black placeholder:text-stone-400 outline-none transition-all duration-150 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20";

  const labelCls =
    "block text-[0.68rem] font-bold tracking-[0.13em] uppercase text-stone-600 mb-1.5";

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* HERO */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-6 md:px-15 py-16">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-[#faf7f2] px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.3em] text-amber-600">
            We'd Love to Hear From You
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[#1f1f1f]">
            Contact Us
          </h1>
          <p className="mt-2.5 text-base leading-relaxed text-stone-500 max-w-xl">
            Have a question about a booking, property, or partnership? Our team is here to help and will respond within 24 hours.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-7xl px-6 md:px-15 py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* FORM CARD */}
          <div className="rounded-[30px] bg-white border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8">
            <h2 className="text-xl font-semibold text-[#1f1f1f] mb-1">Send a Message</h2>
            <p className="text-sm text-stone-400 mb-7">Our team will get back to you within 24 hours.</p>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200 mb-4">
                  <CheckCircle size={30} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f1f1f] mb-2">Message Sent!</h3>
                <p className="text-sm text-stone-500 max-w-sm">
                  Thank you for reaching out. We'll get back to you on your email shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full border border-stone-200 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input name="name" placeholder="John Doe" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input type="email" name="email" placeholder="john@example.com" className={inputCls} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <select name="subject" className={inputCls}>
                      <option value="">Select a topic…</option>
                      <option>Booking Enquiry</option>
                      <option>Property Information</option>
                      <option>Partnership / Listing</option>
                      <option>Cancellation & Refund</option>
                      <option>General Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className={`${inputCls} resize-none`}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#1f1f1f] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#c29b6a] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — CONTACT DETAILS */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <Phone size={18} />,  title: "Phone",        lines: ["+91 98765 43210", "+91 11 2345 6789"], sub: "Mon–Sat, 9am–7pm IST" },
              { icon: <Mail size={18} />,   title: "Email",        lines: ["support@stayluxx.com", "bookings@stayluxx.com"], sub: "We reply within 24 hours" },
              { icon: <MapPin size={18} />, title: "Head Office",  lines: ["12, Connaught Place", "New Delhi, India – 110001"], sub: "Visit by appointment only" },
              { icon: <Clock size={18} />,  title: "Working Hours",lines: ["Mon–Fri: 9:00 AM – 7:00 PM", "Sat: 10:00 AM – 5:00 PM"], sub: "Closed Sundays & holidays" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-[20px] bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-amber-200/60 transition-all duration-300">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-500">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-amber-600 mb-1">{item.title}</p>
                  {item.lines.map((l) => (
                    <p key={l} className="text-sm font-semibold text-[#1f1f1f] leading-snug">{l}</p>
                  ))}
                  <p className="text-xs text-stone-400 mt-1">{item.sub}</p>
                </div>
              </div>
            ))}

            {/* FAQ nudge */}
            <div className="rounded-[20px] bg-amber-50 border border-amber-100 p-6 mt-1">
              <p className="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-amber-600 mb-1">Quick Help</p>
              <h3 className="text-base font-semibold text-[#1f1f1f] mb-1.5">Need instant answers?</h3>
              <p className="text-sm text-stone-500 mb-4">Browse our FAQ for common questions about bookings, policies, and more.</p>
              <button className="w-full rounded-full border border-amber-200 bg-white py-2.5 text-sm font-semibold text-amber-700 hover:bg-[#c29b6a] hover:text-white hover:border-[#c29b6a] transition-all duration-200">
                View FAQ
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
