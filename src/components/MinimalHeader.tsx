"use client";

import Link from "next/link";
import { Hourglass } from "lucide-react";

export default function MinimalHeader() {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-gray-900 shadow-md">
      <Link href="/" className="flex items-center gap-2 text-orange-400 text-2xl font-bold">
        <Hourglass size={28} />
        Cronus
      </Link>
    </header>
  );
}
