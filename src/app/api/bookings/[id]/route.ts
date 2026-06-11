import { connectedDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Props { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }
    const db = await connectedDB();
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id.trim()) },
      { $set: { status: body.status, updatedAt: new Date() } }
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }
    const db = await connectedDB();
    await db.collection("bookings").deleteOne({ _id: new ObjectId(id.trim()) });
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
