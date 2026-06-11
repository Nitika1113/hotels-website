import { connectedDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectedDB();
    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return Response.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["hotelId","hotelName","hotelSlug","roomId","roomName","guestName","guestEmail","guestPhone","checkIn","checkOut","nights","adults","rooms","pricePerNight","totalPrice"];
    for (const field of required) {
      if (!body[field]) {
        return Response.json({ success: false, message: `${field} is required` }, { status: 400 });
      }
    }

    const db = await connectedDB();

    const booking = {
      hotelId:         body.hotelId,
      hotelName:       body.hotelName,
      hotelSlug:       body.hotelSlug,
      roomId:          body.roomId,
      roomName:        body.roomName,
      guestName:       body.guestName,
      guestEmail:      body.guestEmail,
      guestPhone:      body.guestPhone,
      checkIn:         body.checkIn,
      checkOut:        body.checkOut,
      nights:          Number(body.nights),
      adults:          Number(body.adults),
      children:        Number(body.children || 0),
      rooms:           Number(body.rooms),
      pricePerNight:   Number(body.pricePerNight),
      totalPrice:      Number(body.totalPrice),
      specialRequests: body.specialRequests || "",
      status:          "pending",
      createdAt:       new Date(),
      updatedAt:       new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);
    return Response.json({ success: true, bookingId: result.insertedId });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to create booking" }, { status: 500 });
  }
}
