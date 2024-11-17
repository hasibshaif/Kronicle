/* eslint-disable react/jsx-key */
import { session } from "@/lib/session";
import { BookingModel } from "@/models/Booking";
import { EventTypeModel } from "@/models/EventType";
import { format } from "date-fns";
import { Calendar, NotepadText, User } from "lucide-react";
import mongoose from "mongoose";

export default async function DashboardPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session().get("email");
  const eventTypeDocs = await EventTypeModel.find({ email });
  const bookedEvents = await BookingModel.find(
    {
      eventTypeId: eventTypeDocs.map((doc) => doc._id),
    },
    {},
    { sort: "when" }
  );

  return (
    <div className="min-h-screen text-gray-200 p-6">
      <div className="grid grid-cols-1 gap-6">
        {bookedEvents.map((booking) => {
          const eventTypeDoc = eventTypeDocs.find(
            (etd) => (etd._id as string).toString() === booking.eventTypeId
          );
          return (
            <div className="p-6 bg-gray-800 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-orange-400">
                {eventTypeDoc?.title}
              </h3>
              <div className="flex gap-2 items-center my-3">
                <User size={18} className="text-orange-400" />
                <span className="font-semibold">{booking.guestName}</span>
                <span className="text-gray-300">{booking.guestEmail}</span>
              </div>
              <div className="flex gap-2 items-center my-3">
                <Calendar size={18} className="text-orange-400" />
                <span>{format(booking.when, "EEEE, MMMM d, HH:mm")}</span>
              </div>
              {booking.guestNotes && (
                <div className="flex gap-2 items-center my-3">
                  <NotepadText size={18} className="text-orange-400" />
                  <span>{booking.guestNotes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
