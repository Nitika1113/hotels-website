import { connectedDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q");

    if (!query) {
      return Response.json({
        success: true,
        data: [],
      });
    }

    const db = await connectedDB();

    const hotels = await db
      .collection("hotels")
      .find({
        location: {
          $regex: query,
          $options: "i",
        },
      })
      .limit(5)
      .toArray();

    const locations = [
      ...new Set(
        hotels.map((hotel) => hotel.location)
      ),
    ];

    return Response.json({
      success: true,
      data: locations,
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}