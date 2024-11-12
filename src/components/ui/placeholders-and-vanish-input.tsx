"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  value,
  placeholders,
  onChange,
  className,
  as = "input",
  rows = 1,
}: {
  value: string;
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const Component = as;

  return (
    <Component
      value={value}
      onChange={onChange}
      placeholder={placeholders[currentPlaceholder]}
      className={cn("transition duration-200", className)}
      rows={as === "textarea" ? rows : undefined}
    />
  );
}
