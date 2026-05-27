import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { token, password } = body;

    if (!token || !password) {

      return NextResponse.json(
        {
          success: false,
          message: "Missing fields",
        },
        {
          status: 400,
        }
      );
    }

    const db = await connectedDB();

    const usersCollection =
      db.collection("users");

    // FIND USER USING TOKEN
    const user =
      await usersCollection.findOne({
        resetToken: token,
      });

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK EXPIRY
    if (
      user.resetTokenExpiry < Date.now()
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Token expired",
        },
        {
          status: 400,
        }
      );
    }

    // HASH NEW PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // UPDATE PASSWORD
    await usersCollection.updateOne(
      {
        resetToken: token,
      },
      {
        $set: {
          password: hashedPassword,
        },

        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}