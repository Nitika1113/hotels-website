// // Run this ONCE to make yourself admin
// // POST /api/make-admin  { "email": "nitika@silverferndigital.com", "secret": "MAKE_ME_ADMIN" }
// // Then DELETE this file

// import { connectedDB } from "@/lib/mongodb";

// export async function POST(req: Request) {
//   const body = await req.json();

//   if (body.secret !== "MAKE_ME_ADMIN") {
//     return Response.json({ success: false }, { status: 403 });
//   }

//   const db = await connectedDB();
//   await db.collection("users").updateOne(
//     { email: body.email },
//     { $set: { role: "admin" } }
//   );

//   return Response.json({ success: true, message: `${body.email} is now admin` });
// }
