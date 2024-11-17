import { EventTypeModel } from "@/models/EventType";
import { ProfileModel } from "@/models/Profile";
import { Clock, Info } from "lucide-react";
import mongoose from "mongoose";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    username: string;
    "booking-uri": string;
  }>;
};

export default async function BookingBoxLayout(props: LayoutProps) {
  const resolvedParams = await props.params;

  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({
    username: resolvedParams.username,
  });
  if (!profileDoc) {
    return "404";
  }
  const etDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: resolvedParams["booking-uri"],
  });
  if (!etDoc) {
    return "404";
  }

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-900 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
          {/* Side Panel */}
          <div className="bg-gray-700 p-4 sm:p-6 md:p-8 w-full md:w-96 flex flex-col gap-4 md:gap-6">
            {/* Title */}
            <h1 className="text-left text-lg md:text-3xl font-bold text-orange-400 leading-normal">
              {etDoc.title}
            </h1>
            <hr className="text-left mx-8" style={{ marginLeft: 0 }} />
            {/* Details Section */}
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex items-center gap-3">
                <Clock className="text-orange-400 w-5 h-5 md:w-6 md:h-6" />
                <p className="text-md md:text-lg text-gray-300 font-semibold">
                  {etDoc.length} minutes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Info className="text-orange-400 w-5 h-5 mt-1 md:w-6 md:h-6" />
                <p className="text-sm md:text-lg text-gray-400 leading-relaxed">
                  {etDoc.description}
                </p>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-700 w-full mt-2 md:mt-4"></div>
          </div>

          {/* TimePicker */}
          <div className="bg-gray-800 grow p-4 md:p-6">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
