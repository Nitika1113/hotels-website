import bcrypt from "bcryptjs";

import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      fullName,
      email,
      password,
    } = body;

    const db =
      await connectedDB();

    const usersCollection =
      db.collection("users");

    // CHECK EXISTING USER
    const existingUser =
      await usersCollection.findOne({
        email,
      });

    if (existingUser) {

      return Response.json(
        {
          success: false,
          message:
            "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE USER
    const newUser = {

      fullName,

      email,

      password:
        hashedPassword,

      createdAt:
        new Date(),
    };

    // SAVE TO DATABASE
    await usersCollection.insertOne(
      newUser
    );

    return Response.json({
      success: true,
      message:
        "Registration successful",
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        success: false,
        message:
          "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}