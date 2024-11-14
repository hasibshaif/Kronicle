import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { withSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const body = await req.json();
  const { username } = body;

  // Access session data
  const email = req.session?.email;
  if (!email) return NextResponse.json({ error: "No email found in session" }, { status: 400 });

  const profileDoc = await ProfileModel.findOne({ email });
  if (profileDoc) {
    profileDoc.username = username;
    await profileDoc.save();
  } else {
    await ProfileModel.create({ email, username });
  }

  return NextResponse.json({ success: true });
}

// Apply the session wrapper to the PUT request
export const PUT = withSession(PUT);
