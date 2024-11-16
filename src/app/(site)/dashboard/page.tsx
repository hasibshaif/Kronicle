import ProfileForm from "@/components/ProfileForm";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { session } from "@/lib/session";

export default async function DashboardPage() {
  // Server-side logic for fetching profile data
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session().get("email");
  const profileDoc = await ProfileModel.findOne({ email });

  return (
    <div>
      <ProfileForm existingUsername={profileDoc?.username || ''} />
    </div>
  );
}
