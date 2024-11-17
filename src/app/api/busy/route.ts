import { nylas } from "@/lib/nylasConfig";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { TimeSlot } from "nylas";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const from = new Date(url.searchParams.get("from") as string);
    const to = new Date(url.searchParams.get("to") as string);

    console.log("Received API request:", { username, from, to });

    // Validate input
    if (!username || isNaN(from.getTime()) || isNaN(to.getTime())) {
      console.error("Invalid parameters received:", { username, from, to });
      return Response.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Find the user's profile
    const profileDoc = await ProfileModel.findOne({ username });
    if (!profileDoc) {
      console.error("Profile not found for username:", username);
      return Response.json({ error: "Invalid username" }, { status: 404 });
    }

    // Ensure profile has grantId and email
    if (!profileDoc.grantId || !profileDoc.email) {
      console.error("Missing grantId or email for profile:", profileDoc);
      return Response.json(
        { error: "Missing grantId or email for the profile" },
        { status: 400 }
      );
    }

    // Call Nylas API to get busy slots
    console.log("Fetching busy slots from Nylas...");
    const nylasBusyResult = await nylas.calendars.getFreeBusy({
      identifier: profileDoc.grantId,
      requestBody: {
        emails: [profileDoc.email],
        startTime: Math.round(from.getTime() / 1000),
        endTime: Math.round(to.getTime() / 1000),
      },
    });

    console.log("Nylas Response:", nylasBusyResult);

    // Filter busy slots
    const busySlots: TimeSlot[] = [];
    if (nylasBusyResult.data?.[0]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      const slots = nylasBusyResult.data?.[0].timeSlots as TimeSlot[];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      busySlots.push(...slots.filter((slot) => slot.status === "busy"));
    }

    console.log("Filtered Busy Slots:", busySlots);

    return Response.json(busySlots);
  } catch (error) {
    console.error("Error in /api/busy route:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
