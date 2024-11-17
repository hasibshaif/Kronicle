import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Create a response object to clear the cookie
    const response = NextResponse.redirect("/");
    
    // Set the "kronicle-session" cookie to expire
    response.cookies.set("kronicle-session", "", { path: "/", maxAge: 0 });

    const url = new URL(request.url);
    url.searchParams.set("logged-out", "1");
    response.headers.set("Location", url.toString());

    return response;
  } catch (error) {
    console.error("Error in logout route:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
