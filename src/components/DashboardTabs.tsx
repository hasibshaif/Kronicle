// DashboardTabs.tsx
import NavTabs from "./animata/container/nav-tabs";

export default function DashboardTabs() {
  const tabs = [
    { text: "Profile", href: "/dashboard" }, // New default tab
    { text: "Booked Events", href: "/dashboard/booked-events" }, // Updated path
    { text: "Event Types", href: "/dashboard/event-types" },
  ];

  return (
    <div className="mb-8">
      <NavTabs tabs={tabs} />
    </div>
  );
}
