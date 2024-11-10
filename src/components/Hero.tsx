"use client"

import AnimatedGradientText from "@/components/animata/text/animated-gradient-text";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect } from "react";

export default function Hero() {
  async function reloadIfLoggedOut() {
    if (location.href.includes('logged-out')) {
      location.href = '/';
    }
  }
  
  useEffect(() => {
    reloadIfLoggedOut();
  }, []);

  return (
    <section className="relative mt-36 z-10">
      {/* Constrain Vortex animation */}
      <Vortex
        backgroundColor="transparent"
        className="text-center flex flex-col items-center justify-center w-full h-[400px]"
        containerClassName="relative w-full h-full z-0" // Removed pointer-events-none
        rangeHue={0}
      >
        <AnimatedGradientText className="text-5xl font-bold mb-5 pb-2 leading-tight">
          Aligning time, every time.
        </AnimatedGradientText>
        <p className="text-3xl">
          Effortless scheduling that keeps everyone in sync, wherever they are.
        </p>
        <div className="mt-4 flex gap-6 justify-center items-center">
          <Link href={"/"} className="bg-orange-600 py-2 px-4 rounded-full">
            Get Started
          </Link>
          <Link
            href={"/"}
            className="flex items-center gap-1 border border-yellow-300 rounded-full py-2 px-4"
          >
            <Play size={18} />
            Watch
          </Link>
        </div>
      </Vortex>
    </section>
  );
}
