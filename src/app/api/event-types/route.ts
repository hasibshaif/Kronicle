import { NextResponse } from "next/server";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";
import { session } from "@/lib/session";
import { revalidatePath } from "next/cache";

function uriFromTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Connect to MongoDB
async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  await mongoose.connect(mongoUri);
}

// GET Method
export async function GET(req: Request) {
  await connectToDatabase();
  const email = req.headers.get("x-user-email") as string; // Modify as needed to fetch the email
  const eventTypes = await EventTypeModel.find({ email });
  return NextResponse.json(eventTypes);
}

// POST Method
export async function POST(req: Request) {
  await connectToDatabase();
  const data = await req.json();

  const email = await session().get("email");
  if (email) {
    data.uri = uriFromTitle(data.title || "");
    const eventTypeDoc = await EventTypeModel.create({ email, ...data });
    revalidatePath("/dashboard/event-types");
    return NextResponse.json(eventTypeDoc);
  }
  return NextResponse.json(false, { status: 401 });
}

// PUT Method
export async function PUT(req: Request) {
  await connectToDatabase();
  const data = await req.json();
  data.uri = uriFromTitle(data.title);

  const email = await session().get("email");
  const id = data.id;
  if (email && id) {
    const eventTypeDoc = await EventTypeModel.updateOne({ email, _id: id }, data);
    revalidatePath("/dashboard/event-types");
    return NextResponse.json(eventTypeDoc);
  }
  return NextResponse.json(false, { status: 401 });
}

// DELETE Method
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  await connectToDatabase();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await EventTypeModel.deleteOne({ _id: id });
  return NextResponse.json(true);
}
