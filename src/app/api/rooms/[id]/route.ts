
import { ObjectId } from "mongodb";
import { connectedDB } from "@/lib/mongodb";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function toObjectId(id: string): ObjectId {
  const clean = id.trim();

  if (!ObjectId.isValid(clean)) {
    throw new Error(`Invalid ObjectId: ${clean}`);
  }

  return new ObjectId(clean);
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const db = await connectedDB();

    const result = await db
      .collection("rooms")
      .updateOne(
        {
          _id: toObjectId(id),
        },
        {
          $set: {
            ...body,
            hotelId: String(body.hotelId),
            updatedAt: new Date(),
          },
        }
      );

    return Response.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "PUT /api/rooms/[id] error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update room",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const db = await connectedDB();

    const result = await db
      .collection("rooms")
      .deleteOne({
        _id: toObjectId(id),
      });

    return Response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "DELETE /api/rooms/[id] error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete room",
      },
      {
        status: 500,
      }
    );
  }
}