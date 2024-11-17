import DashboardTabs from "@/components/DashboardTabs";
import { session } from "@/lib/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const sessionHandler = session();
    const email = await sessionHandler.get("email");
    const grantId = await sessionHandler.get("grantId");    

    console.log("Session grantId:", grantId); // Debugging log
    console.log("Session email:", email); // Debugging log

    if (!email) {
        console.error("Session missing or email not set.");
        return (
            <p className="text-red-500 text-center">You must be logged in to access this page.</p>
        );
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Database connected successfully");
    } catch (dbError) {
        console.error("Database connection error:", dbError);
        return (
            <p className="text-red-500 text-center">
                An error occurred while connecting to the database. Please try again later.
            </p>
        );
    }

    const profileDoc = await ProfileModel.findOne({ email });
    console.log("Profile document:", profileDoc); // Debugging log

    return (
        <div>
            <DashboardTabs username={profileDoc?.username || ""} />
            {children}
        </div>
    );
}
