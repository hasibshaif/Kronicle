// NavTabs.tsx
"use client";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TabProps {
  text: string;
  href: string;
  isActive: boolean;
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
          isActive={pathname === tab.href} // Check if tab's href matches the current path
          onClick={() => router.push(tab.href)}
        />
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tab = ({ text, href, isActive, onClick }: TabProps & { onClick: () => void }) => {
  return (
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
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-orange-500"
        />
      )}
    </button>
  );
};
