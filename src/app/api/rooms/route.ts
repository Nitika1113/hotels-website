import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const db = await connectedDB();

    const room = {
      hotelId: body.hotelId,

      name: body.name,
      slug: body.slug,
      category: body.category,

      description: body.description,

      price: Number(body.price || 0),
      quantity: Number(body.quantity || 0),

      maxGuests: Number(body.maxGuests || 0),
      adults: Number(body.adults || 0),
      children: Number(body.children || 0),

      beds: body.beds || {
        count: 1,
        type: "King",
      },

      bathrooms: Number(body.bathrooms || 1),

      size: Number(body.size || 0),
      sizeUnit: body.sizeUnit || "sqft",

      freeCancellation: Boolean(body.freeCancellation),
      breakfastIncluded: Boolean(body.breakfastIncluded),

      featuredImage: body.featuredImage || "",
      images: body.images || [],

      roomFeatures: body.roomFeatures || [],

      active: Boolean(body.active ?? true),

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("rooms").insertOne(room);

    return Response.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create room",
      },
      {
        status: 500,
      }
    );
  }
}