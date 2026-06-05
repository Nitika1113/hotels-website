import { connectedDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Props {
  params: Promise<{ id: string }>;
}

// Admin replies to a contact message
export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const db = await connectedDB();

    await db.collection("contacts").updateOne(
      { _id: new ObjectId(id.trim()) },
      {
        $set: {
          reply:     body.reply?.trim() || "",
          status:    "replied",
          repliedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 }
    );
  }
}

// Mark as read
export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const db = await connectedDB();

    await db.collection("contacts").updateOne(
      { _id: new ObjectId(id.trim()) },
      { $set: { status: "read", updatedAt: new Date() } }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}

// Delete a contact message
export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const db = await connectedDB();
    await db.collection("contacts").deleteOne({ _id: new ObjectId(id.trim()) });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to delete message" },
      { status: 500 }
    );
  }
}
