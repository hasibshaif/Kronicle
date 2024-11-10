// src/pages/api/event-types.ts
import { NextApiRequest, NextApiResponse } from "next";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(500).json({ error: "MONGODB_URI environment variable is not defined." });
  }
  await mongoose.connect(mongoUri);

  const email = req.headers["x-user-email"] as string; // Or handle email differently if needed
  const eventTypes = await EventTypeModel.find({ email });

  res.status(200).json(eventTypes);
}
