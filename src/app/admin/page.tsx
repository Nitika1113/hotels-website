import Link from "next/link";

const cards = [
  {
    title: "Hotels",
    href: "/admin/hotels",
  },
  {
    title: "Rooms",
    href: "/admin/rooms",
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
  },
];

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-[#faf7f2] p-10">
      <h1 className="mb-10 text-5xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="
              rounded-3xl
              bg-white
              p-10
              shadow-md
              hover:shadow-xl
              transition
            "
          >
            <h2 className="text-2xl font-semibold">
              {card.title}
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}