
// import { connectedDB } from "@/lib/mongodb";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     console.log("BODY:", body);

//     const db = await connectedDB();

//     const hotelData = {
//       name: body.name,

//       location: body.location,


//       price: Number(body.price),
//       rating: Number(body.rating),

//       // ✅ image url
//       image: body.image,

//       createdAt: new Date(),
//     };

//     console.log("HOTEL DATA:", hotelData);

//     const result = await db
//       .collection("hotels")
//       .insertOne(hotelData);

//     return Response.json({
//       success: true,
//       message: "Hotel Added Successfully",
//       data: result,
//     });

//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       {
//         success: false,
//         message: "Failed To Add Hotel",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const db = await connectedDB();

//     const hotels = await db
//       .collection("hotels")
//       .find({})
//       .limit(6)
//       .toArray();

//     return Response.json({
//       success: true,
//       data: hotels,
//     });

//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       {
//         success: false,
//         message: "Failed To Fetch Hotels",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }


import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const db = await connectedDB();

    const hotelData = {
      name: body.name,
      location: body.location,
      price: Number(body.price),
      rating: Number(body.rating),
      image: body.image,
      createdAt: new Date(),
    };

    const result = await db
      .collection("hotels")
      .insertOne(hotelData);

    return Response.json({
      success: true,
      message: "Hotel Added Successfully",
      data: result,
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed To Add Hotel",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const db = await connectedDB();

    // GET URL PARAMS
    const { searchParams } = new URL(req.url);

    const limit = searchParams.get("limit");

    let query = db.collection("hotels").find({});

    // HOMEPAGE → only 6 hotels
    if (limit) {
      query = query.limit(Number(limit));
    }

    const hotels = await query.toArray();

    return Response.json({
      success: true,
      data: hotels,
    });

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed To Fetch Hotels",
      },
      {
        status: 500,
      }
    );
  }
}