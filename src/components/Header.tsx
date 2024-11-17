// src/components/Header.tsx
"use server";

import Link from "next/link";
import { Hourglass } from "lucide-react";
import HeaderClient from "./HeaderClient";
import { cookies } from "next/headers";

interface HeaderProps {
  className?: string;
}

export default async function Header({ className }: HeaderProps) {
  const cookieStore = await cookies();
  const email = await cookieStore.get("kronicle-session");

  return (
    <header className={`relative flex items-center justify-between py-6 px-4 text-yellow-300 font-light ${className}`}>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-yellow-500 font-bold text-3xl flex gap-2 items-center">
          <Hourglass size={24} />
          Kronicle
        </Link>
      </div>

      {/* Render the client component with the email prop */}
      <HeaderClient email={email ? email.value : null} />
    </header>
  );
}
