import mongoose from "mongoose";
import { session } from "@/lib/session";
import { EventTypeModel } from "@/models/EventType";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { ProfileModel } from "@/models/Profile";

export default async function EventTypesPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Explicitly retrieve cookies and ensure they're handled correctly
  const sessionInstance = await session();
  const email = await sessionInstance.get("email");

  if (!email) {
    return (
      <p className="text-red-500 text-center">
        You must be logged in to access this page.
      </p>
    );
  }

  const eventTypes = await EventTypeModel.find({ email });
  const profile = await ProfileModel.findOne({ email });

  return (
    <div>
      <div className="border border-b-0 rounded-xl overflow-hidden mb-4">
        {eventTypes.map((e) => (
          <div key={e.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <span>{e.title}</span>
              <span className="text-gray-500 ml-4 text-sm">
                {process.env.NEXT_PUBLIC_URL}/{profile?.username}/{e.uri}
              </span>
            </div>
            <Link
              href={`/dashboard/event-types/edit/${e._id}`}
              className="text-white hover:text-orange-400 duration-200"
            >
              <Pencil size={24} />
            </Link>
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
