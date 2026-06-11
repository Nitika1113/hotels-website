import { connectedDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

interface Props {
  params: Promise<{ id: string }>;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// PUT — admin sends reply → saves to DB + emails the user
export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!ObjectId.isValid(id.trim())) {
      return Response.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    if (!body.reply?.trim()) {
      return Response.json({ success: false, message: "Reply cannot be empty" }, { status: 400 });
    }

    const db = await connectedDB();

    // Fetch contact so we have the user's name, email, subject, message
    const contact = await db.collection("contacts").findOne({ _id: new ObjectId(id.trim()) });
    if (!contact) {
      return Response.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    // Save reply to DB
    await db.collection("contacts").updateOne(
      { _id: new ObjectId(id.trim()) },
      {
        $set: {
          reply:     body.reply.trim(),
          status:    "replied",
          repliedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Send email to the user
    await transporter.sendMail({
      from: `"DreamStay Support" <${process.env.EMAIL_USER}>`,
      to:   contact.email,
      subject: `Re: ${contact.subject || "Your Enquiry"} — DreamStay`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf7f2; padding: 40px 32px; border-radius: 16px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; font-weight: 600; color: #1f1f1f; margin: 0;">Dream Stay</h1>
            <p style="font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #c29b6a; margin: 4px 0 0;">Luxury Hotel Booking</p>
          </div>

          <!-- Body card -->
          <div style="background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e7e5e4;">
            
            <p style="font-size: 15px; color: #57534e; margin: 0 0 8px;">Hello <strong style="color: #1f1f1f;">${contact.name}</strong>,</p>
            <p style="font-size: 15px; color: #57534e; margin: 0 0 24px;">Thank you for reaching out. Our team has reviewed your message and here is our response:</p>

            <!-- Original message -->
            <div style="background: #faf7f2; border-left: 3px solid #d4b896; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a8a29e; margin: 0 0 8px;">Your Message</p>
              <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">${contact.message}</p>
            </div>

            <!-- Reply -->
            <div style="background: #fffbeb; border-left: 3px solid #c29b6a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c29b6a; margin: 0 0 8px;">Our Response</p>
              <p style="font-size: 15px; color: #1f1f1f; margin: 0; line-height: 1.7;">${body.reply.trim().replace(/\n/g, "<br/>")}</p>
            </div>

            <p style="font-size: 14px; color: #57534e; margin: 0;">If you have any further questions, please don't hesitate to reply to this email or contact us again through our website.</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 28px;">
            <p style="font-size: 12px; color: #a8a29e; margin: 0;">© ${new Date().getFullYear()} StayLuxx · <a href="mailto:${process.env.EMAIL_USER}" style="color: #c29b6a; text-decoration: none;">${process.env.EMAIL_USER}</a></p>
          </div>

        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Reply error:", error);
    return Response.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 }
    );
  }
}

// PATCH — mark as read
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
    return Response.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

// DELETE — remove message
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
    return Response.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}
