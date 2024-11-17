import type { Metadata } from "next";
import localFont from "next/font/local";
import "./../globals.css";
import Header from "@/components/Header";

const funnelDisplay = localFont({
  src: "./../fonts/FunnelDisplay-VariableFont_wght.ttf",
  variable: "--font-funnel-display",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kronicle",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.variable} antialiased`}>
        <main className="container">
          <Header className="z-[200]" />
          {children}
        </main>
      </body>
    </html>
  );
}
