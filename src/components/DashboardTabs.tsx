// DashboardTabs.tsx
import NavTabs from "./animata/container/nav-tabs";

export default function DashboardTabs() {
  const tabs = [
    { text: "Booked Events", href: "/dashboard" },
    { text: "Event Types", href: "/dashboard/event-types" },
  ];

  return (
    <div className="mb-8">
      <NavTabs tabs={tabs} />
    </div>
  );
}
