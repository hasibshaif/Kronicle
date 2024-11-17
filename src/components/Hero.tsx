"use client";

import AnimatedGradientText from "@/components/animata/text/animated-gradient-text";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulated login status check
  async function checkLoginStatus() {
    try {
      const response = await fetch("/api/auth/session"); // Example endpoint for session check
      const data = await response.json();
      if (data?.email) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <section className="relative mt-36 z-10">
      {/* Constrain Vortex animation */}
      <Vortex
        backgroundColor="transparent"
        className="text-center flex flex-col items-center justify-center w-full h-[400px]"
        containerClassName="relative w-full h-full z-0"
        rangeHue={0}
      >
        <AnimatedGradientText className="text-5xl font-bold mb-5 pb-2 leading-tight">
          Aligning time, every time.
        </AnimatedGradientText>
        <p className="text-3xl">
          Effortless scheduling that keeps everyone in sync, wherever they are.
        </p>
        <div className="mt-4 flex gap-6 justify-center items-center">
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="bg-orange-600 py-2 px-4 rounded-full"
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </Vortex>
    </section>
  );
}
