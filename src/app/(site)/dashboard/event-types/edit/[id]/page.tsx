import EventTypeForm from "@/components/EventTypeForm";
import { EventTypeModel } from "@/models/EventType";
import mongoose from "mongoose";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditEventTypePage({ params }: PageProps) {
  const { id } = await params; // Access params asynchronously

  await mongoose.connect(process.env.MONGODB_URI as string);
  const eventTypeDoc = await EventTypeModel.findOne({ _id: id });

  if (!eventTypeDoc) {
    return '404';
  }

  return (
    <div>
      <EventTypeForm doc={JSON.parse(JSON.stringify(eventTypeDoc))} />
    </div>
  );
}
