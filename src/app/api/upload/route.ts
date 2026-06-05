import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No File Found",
        },
        {
          status: 400,
        }
      );
    }

    // convert file into buffer
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // upload to cloudinary
    const result: any = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "dream-stay",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      }
    );

    console.log("CLOUDINARY RESULT:", result);

    // IMPORTANT
    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Image Upload Failed",
      },
      {
        status: 500,
      }
    );
  }
}