import DashboardTabs from "@/components/DashboardTabs";
import mongoose from "mongoose";
import { session } from "@/lib/session";
import { EventTypeModel } from "@/models/EventType";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getEmail() {
  const userSession = await session();
  return await userSession.get("email");
}

export default async function EventTypesPage() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(mongoUri);
  const email = await getEmail();
  const eventTypes = await EventTypeModel.find({ email });

  return (
    <div>
      <DashboardTabs />
      <div className="border border-b-0 rounded-xl overflow-hidden mb-4">
        {eventTypes.map((e) => (
          <div key={e._id} className="block p-2 border-b">
            <Link href={`/dashboard/event-types/edit/${e._id}`}>
              {e.title} 
            </Link>
            <span className="text-gray-500 ml-4 text-sm">
              {process.env.NEXT_PUBLIC_URL}/username/{e.uri}
            </span>
          </div>
        ))}
      </div>
      <Link href="/dashboard/event-types/new" className="button-gradient inline-flex gap-1 items-center">
        <Plus size={16} />
        New Event Type
      </Link>
    </div>
  );
}
