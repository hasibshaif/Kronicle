import DashboardTabs from "@/components/DashboardTabs";
import { session } from "@/lib/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const email = await session().get("email");
    if (!email) {
        return (
            <p className="text-red-500 text-center">You must be logged in to access this page.</p>
        );
    }

    await mongoose.connect(process.env.MONGODB_URI as string);
    const profileDoc = await ProfileModel.findOne({ email });

    return (
        <div>
            <DashboardTabs username={profileDoc?.username || ''} />
            {children}
        </div>
    );
}
