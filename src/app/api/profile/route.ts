import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { session } from "@/lib/session";

export async function PUT(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), { status: 400 });
    }

    const email = await session().get("email");
    if (!email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const profileDoc = await ProfileModel.findOne({ email });
    if (profileDoc) {
      profileDoc.username = username;
      await profileDoc.save();
    } else {
      await ProfileModel.create({ email, username });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
