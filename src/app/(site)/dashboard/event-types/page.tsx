import mongoose from "mongoose";
import { session } from "@/lib/session";
import { EventTypeModel } from "@/models/EventType";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProfileModel } from "@/models/Profile";

export default async function EventTypesPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session().get('email');
  const eventTypes = await EventTypeModel.find({ email });
  const profile = await ProfileModel.findOne({email});

  return (
    <div>
      <div className="border border-b-0 rounded-xl overflow-hidden mb-4">
        {eventTypes.map((e) => (
          <div key={e._id} className="block p-2 border-b">
            <Link href={`/dashboard/event-types/edit/${e._id}`}>
              {e.title} 
            </Link>
            <span className="text-gray-500 ml-4 text-sm">
              {process.env.NEXT_PUBLIC_URL}/{profile.username}/{e.uri}
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
