import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { connectedDB } from "@/lib/mongodb";
import HotelForm from "../../HotelForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: Props) {
  const { id } = await params;

  const db = await connectedDB();

  const hotel = await db
    .collection("hotels")
    .findOne({ _id: new ObjectId(id) });

  if (!hotel) notFound();

  const rooms = await db
    .collection("rooms")
    .find({
      $or: [
        { hotelId: id },
        { hotelId: new ObjectId(id) },
      ],
    })
    .toArray();

  const serializedHotel = JSON.parse(JSON.stringify(hotel));
  const serializedRooms = JSON.parse(JSON.stringify(rooms));

  return (
    <section className="mx-auto max-w-7xl p-8">
      <HotelForm
        mode="edit"
        initialData={serializedHotel}
        initialRooms={serializedRooms}
      />
    </section>
  );
}
