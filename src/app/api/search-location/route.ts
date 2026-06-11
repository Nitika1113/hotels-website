import { connectedDB } from "@/lib/mongodb";
 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
 
    if (!query) {
      return Response.json({ success: true, data: [] });
    }
 
    const db = await connectedDB();
 
    const hotels = await db
      .collection("hotels")
      .find({
        $or: [
          { "location.city":    { $regex: query, $options: "i" } },
          { "location.state":   { $regex: query, $options: "i" } },
          { "location.country": { $regex: query, $options: "i" } },
        ],
      })
      .limit(10)
      .toArray();
 
    // Build unique location strings like "Chandigarh, Punjab, India"
    const locations = [
      ...new Set(
        hotels.map((hotel) => {
          const { city, state, country } = hotel.location || {};
          return [city, state, country].filter(Boolean).join(", ");
        })
      ),
    ].filter(Boolean);
 
    return Response.json({ success: true, data: locations });
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Failed" },
      { status: 500 }
    );
  }
}