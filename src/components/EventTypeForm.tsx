// src/components/EventForm.tsx
"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import TimeSelect from "@/components/TimeSelect";
import { FormEvent, useState } from "react";
import { BookingTimes, WeekdayName } from "@/lib/types";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IEventType } from "@/models/EventType";
import { Check, Trash2 } from "lucide-react";
import EventTypeDelete from "./EventTypeDelete";

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

const weekDaysNames:WeekdayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function EventTypeForm({doc}: {doc?:IEventType}) {
  const [title, setTitle] = useState(doc?.title || '');
  const [description, setDescription] = useState(doc?.description || '');
  const [length, setLength] = useState(doc?.length || 30);
  const [bookingTimes, setBookingTimes] = useState<BookingTimes>(
    doc?.bookingTimes || {
      Monday: { from: '00:00', to: '00:00', active: false },
      Tuesday: { from: '00:00', to: '00:00', active: false },
      Wednesday: { from: '00:00', to: '00:00', active: false },
      Thursday: { from: '00:00', to: '00:00', active: false },
      Friday: { from: '00:00', to: '00:00', active: false },
      Saturday: { from: '00:00', to: '00:00', active: false },
      Sunday: { from: '00:00', to: '00:00', active: false },
    });
  const router = useRouter();

  async function handleSubmit(event:FormEvent) {
    event.preventDefault();
    const id = doc?._id;
    const request = id ? axios.put : axios.post;
    const data = {
      title, description, length, bookingTimes
    };
    const response = await request('/api/event-types', {...data, id});
    if (response.data) {
      router.push('/dashboard/event-types');
      router.refresh();
    }
  }

  function handleBookingTimeChange(
    day: WeekdayName,
    val: string | boolean,
    prop: 'from' | 'to' | 'active'
  ) {
    setBookingTimes((oldBookingTimes) => {
      const newBookingTimes: BookingTimes = { ...oldBookingTimes };
      if (!newBookingTimes[day]) {
        newBookingTimes[day] = { from: '00:00', to: '00:00', active: false };
      }
      
      if (prop === 'from' || prop === 'to') {
        newBookingTimes[day][prop] = val as string;
      } else if (prop === 'active') {
        newBookingTimes[day][prop] = val as boolean;
      }
  
      return newBookingTimes;
    });
  }

  return (
    <div className="mt-4 bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-center text-2xl text-white font-semibold mb-6">CREATE NEW EVENT TYPE</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Event Info Inputs */}
        <div className="flex flex-col gap-4">
          <label className="text-yellow-400 font-semibold">TITLE</label>
          <PlaceholdersAndVanishInput
            value={title}
            placeholders={titlePlaceholders}
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="text-yellow-400 font-semibold">DESCRIPTION</label>
          <PlaceholdersAndVanishInput
            value={description}
            placeholders={descriptionPlaceholders}
            className="w-full h-24 px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setDescription(e.target.value)}
            as="textarea"
            rows={4}
          />
          <label className="text-yellow-400 font-semibold">EVENT LENGTH (minutes)</label>
          <input 
            type="number" 
            placeholder="30"
            className="w-full h-auto px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </div>

        {/* Day-Specific Availability */}
        <div className="flex flex-col gap-3">
          {weekDaysNames.map((day) => (
            <div 
              key={day} 
              className="flex flex-col sm:flex-row items-center justify-between gap-8 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-sm"
            >
              <label className="flex gap-2 uppercase">
                <input
                  type="checkbox" 
                  value={day}
                  checked={bookingTimes[day]?.active || false}
                  onChange={(e) => handleBookingTimeChange(day, e.target.checked, 'active')}
                />
                <label className="text-yellow-400 font-semibold w-20">{day}</label>
              </label>
              <div className={clsx("flex items-center gap-3", bookingTimes[day]?.active ? '' : 'opacity-40')}>
              <span className="text-gray-400">FROM</span>
                <div className="select-container">
                  <TimeSelect 
                    value={bookingTimes[day]?.from || '00:00'}
                    onChange={(val) => handleBookingTimeChange(day, val, 'from')}
                    step={30}
                  />
                </div>
                <span className="text-gray-400">TO</span>
                <div className="select-container">
                  <TimeSelect 
                    value={bookingTimes[day]?.to || '00:00'}
                    onChange={(val) => handleBookingTimeChange(day, val, 'to')}
                    step={30} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="col-span-2 flex justify-center gap-4 mt-4">
          {doc && (
            <EventTypeDelete id={doc._id as string} />
          )}
          <button type="submit" className="button-gradient flex items-center gap-2">
            <Check size={16} />
            SAVE EVENT
          </button>
        </div>
      </form>
    </div>
  );
}