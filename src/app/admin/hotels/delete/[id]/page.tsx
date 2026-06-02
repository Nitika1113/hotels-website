import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { connectedDB } from "@/lib/mongodb";

interface Props {
  params: Promise<{ id: string }>;
}

async function deleteHotel(id: string) {
  "use server";
  const db = await connectedDB();
  await db.collection("hotels").deleteOne({ _id: new ObjectId(id) });
  redirect("/admin/hotels");
}

export default async function DeleteHotelPage({ params }: Props) {
  const { id } = await params;

  let hotel = null;

  try {
    const db = await connectedDB();
    hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) });
  } catch {
    notFound();
  }

  if (!hotel) notFound();

  const deleteWithId = deleteHotel.bind(null, id);

  return (
    <section className="mx-auto max-w-2xl p-8">
      <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">

        {/* HEADER */}
        <div className="mb-6">
          <p className="text-[0.62rem] font-bold tracking-[0.2em] uppercase text-red-500 mb-1">
            Danger Zone
          </p>
          <h1 className="text-2xl font-semibold text-black">Delete Hotel</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* HOTEL PREVIEW */}
        <div className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50 p-4 mb-8">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-200">
            {hotel.featuredImage ? (
              <Image
                src={hotel.featuredImage}
                alt={hotel.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone-400 text-2xl">
                🏨
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-black">{hotel.name}</h2>
            <p className="text-sm text-stone-500">
              {hotel.location?.city}{hotel.location?.country ? `, ${hotel.location.country}` : ""}
            </p>
            <p className="text-sm text-stone-400">
              ₹{hotel.startingPrice?.toLocaleString("en-IN")} / night · {hotel.propertyType}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <form action={deleteWithId} className="flex-1">
            <button
              type="submit"
              className="w-full rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 active:scale-[0.98] cursor-pointer"
            >
              Yes, Delete Hotel
            </button>
          </form>

          <Link
            href="/admin/hotels"
            className="flex-1 rounded-xl border border-stone-200 bg-white px-6 py-3 text-center text-sm font-semibold text-black transition-all duration-200 hover:bg-stone-50 hover:border-stone-300"
          >
            Cancel
          </Link>
        </div>

      </div>
    </section>
  );
}
