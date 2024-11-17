import { session } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(req: NextRequest) {
  const sessionHandler = session();

  // Example: Access or manipulate session data (if needed)
  const grantId = await sessionHandler.get("grantId");
  console.log("Session Grant ID:", grantId);

  // Proceed to the next middleware or route handler
  return NextResponse.next();
}

// Specify paths where the middleware should run
export const config = {
  matcher: [
    "/api/oauth/exchange", // Ensure session cookies for the OAuth flow
    "/dashboard/:path*",   // Protect the dashboard and related paths
  ],
};
