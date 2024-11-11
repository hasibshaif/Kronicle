import DashboardTabs from "@/components/DashboardTabs";
import mongoose from "mongoose";
import { session } from "@/lib/session";
import { EventTypeModel } from "@/models/EventType";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function EventTypesPage() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }
  await mongoose.connect(mongoUri);
  const email = await session().get('email');
  const eventTypes = await EventTypeModel.find({email});

  return (
    <div>
      <DashboardTabs />
      {JSON.stringify(eventTypes)}
      <br />
      <Link href="/dashboard/event-types/new" className="button-gradient inline-flex gap-1 items-center">
        <Plus size={16} />
        New Event Type
      </Link>
    </div>
  );
}
