// src/app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Manually clear the session cookie
    const cookieStore = cookies();
    await cookieStore.delete("cronus-session");

    const url = new URL(request.url);
    url.pathname = "/";
    url.searchParams.set("logged-out", "1");

    return NextResponse.redirect(url.toString());
  } catch (error) {
    console.error("Error in logout route:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
