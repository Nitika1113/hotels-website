import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return Response.json(
        { success: false, message: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const db = await connectedDB();

    await db.collection("contacts").insertOne({
      name:    body.name.trim(),
      email:   body.email.trim(),
      phone:   body.phone?.trim() || "",
      subject: body.subject?.trim() || "General",
      message: body.message.trim(),
      status:  "unread",   // unread | read | replied
      reply:   null,
      repliedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to submit message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectedDB();
    const contacts = await db
      .collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ success: true, data: contacts });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
