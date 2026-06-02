import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { connectedDB } from "@/lib/mongodb";
import HotelForm from "../../HotelForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: Props) {
  const { id } = await params;

  let hotel = null;

  try {
    const db = await connectedDB();
    hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) });
  } catch {
    notFound();
  }

  if (!hotel) notFound();

  const initialData = {
    ...hotel,
    _id: hotel._id.toString(),
  };

  return (
    <section className="mx-auto max-w-7xl p-8">
      <HotelForm mode="edit" initialData={initialData} />
    </section>
  );
}
