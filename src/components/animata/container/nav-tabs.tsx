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

export default function NavTabs({
  tabs,
}: {
  tabs: { text: string; href: string }[];
}) {
  const pathname = usePathname(); // Get the current path
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-md bg-transparent p-6">
      {tabs.map((tab) => (
        <Tab
          key={tab.text}
          text={tab.text}
          href={tab.href}
          isActive={isActiveTab(tab.href, pathname)} // Updated logic
          onClick={() => router.push(tab.href)} // Navigation on click
        />
      ))}
    </div>
  );
}

function isActiveTab(href: string, pathname: string) {
  const tabPaths: Record<string, (pathname: string) => boolean> = {
    "/dashboard": (path) => path === "/dashboard",
    "/dashboard/booked-events": (path) => path.startsWith("/dashboard/booked-events"),
    "/dashboard/event-types": (path) =>
      path.startsWith("/dashboard/event-types") && !path.startsWith("/dashboard/booked-events"),
  };

  const isMatch = tabPaths[href]?.(pathname) ?? false;
  return isMatch;
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
