// src/components/HeaderClient.tsx
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HeaderClientProps {
  email: string | null;
}

export default function HeaderClient({ email }: HeaderClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(!email);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout");
    setIsLoggedOut(true);
    router.refresh(); // Refresh the page to re-fetch header props
  };

  useEffect(() => {
    setIsLoggedOut(!email);
  }, [email]);

  return (
    <>
      <nav className="hidden lg:flex gap-4">
        <Link href="/features" className="text-yellow-500 hover:text-yellow-400">Features</Link>
        <Link href="/about" className="text-yellow-500 hover:text-yellow-400">About</Link>
        <Link href="/pricing" className="text-yellow-500 hover:text-yellow-400">Pricing</Link>
      </nav>

      <div className="hidden lg:flex gap-4 items-center">
        {isLoggedOut ? (
          <>
            <Link href="/api/auth" className="text-yellow-300 hover:text-yellow-400">Sign In</Link>
            <Link href="/features" className="bg-orange-600 text-white rounded-full py-2 px-4 hover:bg-red-600">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="bg-orange-600 text-white rounded-full py-2 px-4 hover:bg-red-600">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-yellow-300 hover:text-yellow-400">
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden ml-auto text-yellow-500"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black p-4 shadow-lg z-50 space-y-4">
          <nav className="flex flex-col gap-4 text-center">
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-500 hover:text-yellow-400">Features</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-500 hover:text-yellow-400">About</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-500 hover:text-yellow-400">Pricing</Link>
            {isLoggedOut ? (
              <>
                <Link href="/api/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-300 hover:text-yellow-400">Sign In</Link>
                <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="bg-orange-600 text-white rounded-full py-2 px-4 hover:bg-red-600 text-center">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-orange-600 text-white rounded-full py-2 px-4 hover:bg-red-600">
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-yellow-300 hover:text-yellow-400">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
