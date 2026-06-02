import { ObjectId } from "mongodb";
import { connectedDB } from "@/lib/mongodb";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// GET SINGLE HOTEL
export async function GET(
  req: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const db = await connectedDB();

    const hotel = await db
      .collection("hotels")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!hotel) {
      return Response.json(
        {
          success: false,
          message: "Hotel not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch hotel",
      },
      { status: 500 }
    );
  }
}

// UPDATE HOTEL
export async function PUT(
  req: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const db = await connectedDB();

    const result = await db
      .collection("hotels")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            ...body,
            updatedAt: new Date(),
          },
        }
      );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update hotel",
      },
      { status: 500 }
    );
  }
}

// DELETE HOTEL
export async function DELETE(
  req: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const db = await connectedDB();

    await db.collection("hotels").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete hotel",
      },
      { status: 500 }
    );
  }
}