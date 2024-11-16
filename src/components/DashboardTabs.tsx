// DashboardTabs.tsx
import NavTabs from "./animata/container/nav-tabs";

export default function DashboardTabs({ username }: { username?: string }) {
  const tabs = username
    ? [
        { text: "Profile", href: "/dashboard" }, // Profile tab is always visible
        { text: "Booked Events", href: "/dashboard/booked-events" }, // Only accessible when logged in
        { text: "Event Types", href: "/dashboard/event-types" }, // Only accessible when logged in
      ]
    : [{ text: "Profile", href: "/dashboard" }]; // Only Profile if no username exists

  return (
    <div className="mb-8">
      <NavTabs tabs={tabs} />
    </div>
  );
}
