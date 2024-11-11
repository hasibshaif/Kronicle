// src/pages/api/event-types.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";
import { session } from "@/lib/session";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(500).json({ error: "MONGODB_URI environment variable is not defined." });
  }
  await mongoose.connect(mongoUri);

  const email = req.headers["x-user-email"] as string; // Or handle email differently if needed
  const eventTypes = await EventTypeModel.find({ email });

  res.status(200).json(eventTypes);
}

export async function POST(req: NextRequest) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  await mongoose.connect(mongoUri);

  const data = await req.json();

  // Await the result of session().get('email') to ensure it is a string and not a Promise
  const email = await session().get('email');

  if (!email) {
    return new Response("User email not found in session.", { status: 401 });
  }

  try {
    const eventTypeDoc = await EventTypeModel.create({ email, ...data });
    return new Response(JSON.stringify(eventTypeDoc), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating event type:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
