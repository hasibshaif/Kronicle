import { NextRequest, NextResponse } from "next/server";
import { nylasConfig, nylas } from "@/lib/nylasConfig";
import { session } from "@/lib/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");

  const url = new URL(req.url);
  console.log("Full callback URL:", url.toString());
  const code = url.searchParams.get("code");
  console.log("Authorization Code:", code);

  if (!code) {
    console.error("No code found in the callback URL:", url.toString());
    return NextResponse.json({ error: "No authorization code found" }, { status: 400 });
}
console.log("Authorization code received:", code);

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  console.log("Payload for Code Exchange:", codeExchangePayload);

  try {
    // Exchange authorization code for tokens
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    console.log("Nylas Response:", response);

    const { grantId, email } = response;

    if (!grantId || !email) {
      console.error("Invalid response from Nylas:", response);
      return NextResponse.json("Nylas Exchange Failed", { status: 500 });
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("Database connected successfully");
  } catch (dbError) {
      console.error("Database connection error:", dbError);
  }
  

    // Update or create user profile
    try {
      const profileDoc = await ProfileModel.findOne({ email });
      if (profileDoc) {
        console.log("Profile found, updating grantId");
        profileDoc.grantId = grantId;
        await profileDoc.save();
      } else {
        console.log("No profile found, creating new profile");
        await ProfileModel.create({ email, grantId });
      }
    } catch (dbWriteError) {
      console.error("Error writing to database:", dbWriteError);
      return NextResponse.json("Database Write Error", { status: 500 });
    }

    // Set session
    try {
      await session().set("grantId", grantId);
      await session().set("email", email);
      console.log("Session set successfully");
  } catch (error) {
      console.error("Error setting session:", error);
  }
  
    // Redirect after successful flow
    console.log("Redirecting to homepage");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/`);
  } catch (error) {
    console.error("Error during Nylas OAuth exchange:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
