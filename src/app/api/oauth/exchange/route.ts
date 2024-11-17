import { NextApiRequest } from "next";
import { nylasConfig, nylas } from "@/lib/nylasConfig";
import { session } from "@/lib/session";
import { redirect } from "next/navigation";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

export async function GET(req: NextApiRequest) {
    console.log("Received callback from Nylas");
    
    if (!req.url) {
        return Response.json("Invalid request URL", {status: 400});
    }
    
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
  
    if (!code) {
        return Response.json("No authorization code returned from Nylas", {status: 400});
    }

    const codeExchangePayload = {
        clientSecret: nylasConfig.apiKey,
        clientId: nylasConfig.clientId as string,
        redirectUri: nylasConfig.callbackUri,
        code,
    };
  
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload)
    const { grantId, email } = response;

    await mongoose.connect(process.env.MONGODB_URI as string);

    const profileDoc = await ProfileModel.findOne({email});
    if (profileDoc) {
        profileDoc.grantId = grantId;
        await profileDoc.save();
    } else {
        await ProfileModel.create({email, grantId});
    }

    await session().set('grantId', grantId);
    await session().set('email', email);

    redirect('/');
}