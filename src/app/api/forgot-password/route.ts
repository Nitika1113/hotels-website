import { NextResponse } from "next/server";

import crypto from "crypto";

import nodemailer from "nodemailer";

import { connectedDB } from "@/lib/mongodb";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { email } = body;

    if (!email) {

      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const db = await connectedDB();

    const usersCollection =
      db.collection("users");

    // FIND USER
    const user =
      await usersCollection.findOne({
        email,
      });

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    // GENERATE TOKEN
    const resetToken =
      crypto.randomBytes(32).toString("hex");

    // TOKEN EXPIRY
    const resetTokenExpiry =
      Date.now() + 1000 * 60 * 60;

    // SAVE IN DATABASE
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    );

    // RESET LINK
    const resetLink =
      `http://localhost:3000/forgot-password?token=${resetToken}`;

    // EMAIL TRANSPORTER
    const transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    // SEND EMAIL
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Reset Your Password",

      html: `
        <div style="font-family:sans-serif;padding:20px">
          
          <h2>Password Reset</h2>

          <p>
            Click the button below to reset your password.
          </p>

          <a 
            href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:black;
              color:white;
              text-decoration:none;
              border-radius:8px;
              margin-top:10px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px">
            This link expires in 1 hour.
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Reset link sent to your email",
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