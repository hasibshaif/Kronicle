import "./../globals.css";
import MinimalHeader from "@/components/MinimalHeader";

export const metadata = {
  title: "Kronicle - Booking",
  description: "Schedule your events with Kronicle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <MinimalHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
