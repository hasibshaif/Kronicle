import { NextRequest, NextResponse } from "next/server";
import { nylasConfig, nylas } from "@/lib/nylasConfig";
import { session } from "@/lib/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json("No authorization code returned from Nylas", { status: 400 });
  }

  const codeExchangePayload = {
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  };

  try {
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    const { grantId, email } = response;

    await mongoose.connect(process.env.MONGODB_URI as string);

    const profileDoc = await ProfileModel.findOne({ email });
    if (profileDoc) {
      profileDoc.grantId = grantId;
      await profileDoc.save();
    } else {
      await ProfileModel.create({ email, grantId });
    }

    await session().set("grantId", grantId);
    await session().set("email", email);
    redirect("/");
    
  } catch (error) {
    console.error("Error during Nylas OAuth exchange:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
