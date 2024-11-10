import { NextApiRequest } from "next";
import { nylasConfig, nylas } from "@/lib/nylasConfig";
import { session } from "@/lib/session";
import { redirect } from "next/navigation";

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
        clientId: nylasConfig.clientId,
        redirectUri: nylasConfig.callbackUri,
        code,
    };
  
    const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload)
    const { grantId, email } = response;

    await session().set('grantId', grantId);
    await session().set('email', email);

    redirect('/');
}