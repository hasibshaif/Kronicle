// src/pages/api/event-types.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";

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
  console.log(data);
  return Response.json('ok');
}
