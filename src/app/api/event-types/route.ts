// src/pages/api/event-types.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";
import { session } from "@/lib/session";
import { revalidatePath } from "next/cache";

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
  await mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  const email = await session().get('email');
  if (email) {
    const eventTypeDoc = await EventTypeModel.create({email, ...data});
    revalidatePath('/dashboard/event-types', 'layout');
    return Response.json(eventTypeDoc);
  }
  return Response.json(false);
}

export async function PUT(req: NextRequest) {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  const email = await session().get('email');
  const id = data.id;
  if (email && id) {
    const eventTypeDoc = await EventTypeModel.updateOne(
      {email, _id: id},
      data,
    );
    revalidatePath('/dashboard/event-types', 'layout');
    return Response.json(eventTypeDoc);
  }
  return Response.json(false);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  await mongoose.connect(process.env.MONGODB_URI as string);
  await EventTypeModel.deleteOne({_id: id})
  return Response.json(true);
}