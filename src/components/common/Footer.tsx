import Link from "next/link";
import { Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">

      {/* TOP CTA BAND */}
      <div className="bg-[#c29b6a] px-6 md:px-15 py-10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-white/70 mb-1">
              Start Your Journey
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
              Find Your Perfect Luxury Stay
            </h2>
          </div>
          <Link
            href="/hotels"
            className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#c29b6a] hover:bg-[#1f1f1f] hover:text-white transition-all duration-300"
          >
            Explore Hotels
          </Link>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-6 md:px-15 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-1">Dream Stay</h2>
            <p className="text-[0.6rem] font-bold tracking-[0.25em] uppercase text-[#c29b6a] mb-4">
              Luxury Hotel Booking
            </p>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Discover handpicked luxury properties across India. Exceptional stays, unforgettable experiences.
            </p>
            {/* Socials — only real links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Globe size={15} />,         href: "/",        label: "Website" },
                { icon: <MessageCircle size={15} />, href: "/contact", label: "Contact" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-[#c29b6a] hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#c29b6a] mb-5">
              Quick Links
            </p>
            <ul className="space-y-3">
              {[
                { label: "Home",       href: "/"            },
                { label: "Hotels",     href: "/hotels"      },
                { label: "Bookings",   href: "/bookings"    },
                { label: "Contact Us", href: "/contact"     },
                { label: "FAQ",        href: "/contact/faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-[#c29b6a] transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#c29b6a] mb-5">
              Support
            </p>
            <ul className="space-y-3">
              {[
                { label: "Booking Help",        href: "/contact/faq" },
                { label: "Cancellation Policy", href: "/contact/faq" },
                { label: "Refund Policy",       href: "/contact/faq" },
                { label: "Privacy Policy",      href: "/privacy"     },
                { label: "Terms of Service",    href: "/terms"       },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-[#c29b6a] transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#c29b6a] mb-5">
              Contact
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Phone size={13} />,  line1: "+91 98765 43210",            line2: "Mon–Sat, 9am–7pm"      },
                { icon: <Mail size={13} />,   line1: "nitika@silverferndigital.com", line2: "Reply within 24 hours" },
                { icon: <MapPin size={13} />, line1: "12, Connaught Place",         line2: "New Delhi – 110001"    },
              ].map((item) => (
                <li key={item.line1} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#c29b6a]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{item.line1}</p>
                    <p className="text-xs text-white/35">{item.line2}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-15 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Dream Stay. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy",  href: "/privacy" },
              { label: "Terms of Service",href: "/terms"   },
              { label: "Cookie Policy",   href: "/privacy" },
            ].map((t) => (
              <Link key={t.label} href={t.href} className="text-xs text-white/30 hover:text-[#c29b6a] transition-colors">
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
