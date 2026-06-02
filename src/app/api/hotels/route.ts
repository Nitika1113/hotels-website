

import { connectedDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    const db = await connectedDB();

    const query = db.collection("hotels").find({ active: true });

    if (limit) {
      query.limit(Number(limit));
    }

    const hotels = await query.toArray();

    return Response.json({ success: true, data: hotels });
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Failed To Fetch Hotels" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const db = await connectedDB();

    const hotelData = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      featuredImage: body.featuredImage || "",
      gallery: body.gallery || [],
      propertyType: body.propertyType,
      starRating: Number(body.starRating),
      reviewScore: Number(body.reviewScore || 0),
      reviewCount: Number(body.reviewCount || 0),
      startingPrice: Number(body.startingPrice),
      roomCount: Number(body.roomCount || 0),
      featured: Boolean(body.featured),
      active: Boolean(body.active ?? true),
      mostBooked: Boolean(body.mostBooked),
      location: {
        country: body.location.country,
        state: body.location.state,
        city: body.location.city,
        address: body.location.address,
      },
      amenities: body.amenities || {},
      policies: {
        checkIn: body.policies?.checkIn || "14:00",
        checkOut: body.policies?.checkOut || "11:00",
        petsAllowed: body.policies?.petsAllowed || false,
        smokingAllowed: body.policies?.smokingAllowed || false,
      },
      highlights: body.highlights || [],
      nearbyPlaces: body.nearbyPlaces || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("hotels").insertOne(hotelData);

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Failed To Add Hotel" },
      { status: 500 }
    );
  }
}