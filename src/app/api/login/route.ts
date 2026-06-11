import bcrypt from "bcryptjs";

import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {

  try {

    const body =
      await req.json();

    const {
      email,
      password,
    } = body;

    const db =
      await connectedDB();

    const usersCollection =
      db.collection("users");

    // FIND USER
    const user =
      await usersCollection.findOne({
        email,
      });

    // USER NOT FOUND
    if (!user) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        {
          status: 400,
        }
      );
    }

    // PASSWORD CHECK
    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json({
      success: true,
      message:
        "Login successful",

      user: {
        id: user._id,

        fullName:
          user.fullName,

        email:
          user.email,
      },
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}