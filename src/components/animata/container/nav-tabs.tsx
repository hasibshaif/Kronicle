// animata/container/nav-tabs.tsx
"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabProps {
  text: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavTabs({ tabs }: { tabs: { text: string; href: string }[] }) {
  const pathname = usePathname(); // Get the current path
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-md bg-transparent p-6">
      {tabs.map((tab) => (
        <Tab
          key={tab.text}
          text={tab.text}
          href={tab.href}
          isActive={isActiveTab(tab.href, pathname)} // Updated logic for active tab
          onClick={() => router.push(tab.href)}
        />
      ))}
    </div>
  );
}

// Function to determine if the current path matches or starts with the tab's href
function isActiveTab(href: string, pathname: string) {
  // Highlight "Event Types" tab on all "/dashboard/event-types/*" routes
  if (href === "/dashboard/event-types" && pathname.startsWith("/dashboard/event-types")) {
    return true;
  }
  // Highlight "Profile" for the root /dashboard route
  if (href === "/dashboard" && pathname === "/dashboard") {
    return true;
  }
  // Highlight "Booked Events" for any path under "/dashboard/booked-events/*"
  if (href === "/dashboard/booked-events" && pathname.startsWith("/dashboard/booked-events")) {
    return true;
  }
  return pathname === href;
}

const Tab = ({ text, isActive, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={cn(
      "relative rounded-md px-4 py-2 text-sm font-semibold transition-all",
      isActive ? "text-white" : "text-white hover:text-yellow-500"
    )}
  >
    <p className="relative z-50 min-w-20">{text}</p>
    {isActive && (
      <motion.span
        layoutId="tabs"
        transition={{ type: "spring", duration: 0.5 }}
        className="absolute inset-0 button-gradient"
      />
    )}
  </button>
);
