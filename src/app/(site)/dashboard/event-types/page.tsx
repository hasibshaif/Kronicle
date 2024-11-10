// src/app/dashboard/event-types/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardTabs from "@/components/DashboardTabs";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import TimeSelect from "@/components/TimeSelect";

// Define placeholder arrays for titles and descriptions
const titlePlaceholders = [
  "Monday Mojo Mixer", "Project Power Hour", "Sprint to Win",
  "Dreamstorm", "Coffee & Concepts", "Big Brain Bash",
  "Retrospective Rendezvous", "Client Connection", "Marketing Magic",
  "Innovation Jam Session", "Wizarding Workshop", "Epic Sync-Up",
  "Team Therapy", "Creative Chaos", "Strategy Soiree",
  "Brain Blast Bonanza", "All Ideas Welcome", "Retrograde Review",
  "Lightning Round", "Future Forecast"
];

const descriptionPlaceholders = [
  "Unlock fresh ideas and next steps!", 
  "Uncover insights and pave the path forward.", 
  "Bounce big ideas off each other and brainstorm.",
  "Recharge and review progress with the team.", 
  "Set our goals on the same page, together!", 
  "Get everyone in the loop with the latest updates.", 
  "Reflect, improve, and laugh along the way.", 
  "Keep clients thrilled with our progress.", 
  "Unleash our creativity for the next big campaign.", 
  "Cook up future ideas and shake things up!",
  "Master the art of collaboration!", 
  "Gather the squad for a creative reset.", 
  "Find new sparks for tomorrow's solutions!", 
  "Recap, relax, and re-energize.", 
  "Plan and strategize our next big play!",
];

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    async function fetchEventTypes() {
      const response = await fetch("/api/event-types");
      const data = await response.json();
      setEventTypes(data);
    }
    fetchEventTypes();
  }, []);

  return (
    <div>
      <DashboardTabs />
      <div className="mt-8 bg-gray-800 p-8 rounded-2xl shadow-lg">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column - Event Info */}
          <div className="flex flex-col gap-3">
            <label className="text-yellow-400 font-semibold">TITLE</label>
            <PlaceholdersAndVanishInput
              placeholders={titlePlaceholders}
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => console.log("Title:", e.target.value)}
            />

            <label className="text-yellow-400 font-semibold">DESCRIPTION</label>
            <PlaceholdersAndVanishInput
              placeholders={descriptionPlaceholders}
              className="w-full h-28 px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => console.log("Description:", e.target.value)}
              as="textarea"
              rows={5}
            />
          </div>

          {/* Right Column - Availability by Day */}
          <div className="flex flex-col gap-4">
            {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map((day) => (
              <div key={day} className="flex flex-col sm:flex-row items-center justify-evenly gap-8 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-sm">
                <label className="text-yellow-400 font-semibold w-20">{day}:</label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">FROM</span>
                  <TimeSelect step={30} />
                  <span className="text-gray-400">TO</span>
                  <TimeSelect step={30} />
                </div>
              </div>
            ))}
          </div>

        </form>
      </div>
    </div>
  );
}
