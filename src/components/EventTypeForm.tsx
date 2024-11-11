// src/components/EventForm.tsx
"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import TimeSelect from "@/components/TimeSelect";
import { useState } from "react";
import { BookingTimes, WeekdayName } from "@/lib/types";
import clsx from "clsx";
import axios from "axios";

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

export default function EventTypeForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [length, setLength] = useState(30);
  const [bookingTimes, setBookingTimes] = useState<BookingTimes>(() => {
    const initialBookingTimes: BookingTimes = {
      Monday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Tuesday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Wednesday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Thursday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Friday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Saturday: {
        from: '00:00', to: '00:00',
        active: false
      },
      Sunday: {
        from: '00:00', to: '00:00',
        active: false
      },
    };
    return initialBookingTimes;
  });

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    try {
      const response = await axios.post('/api/event-types', {
        title, description, length, bookingTimes
      });
      console.log('Event created:', response);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }

  function handleBookingTimeChange(day: WeekdayName, val: string | boolean, prop: 'from' | 'to' | 'active') {
    setBookingTimes(oldBookingTimes => ({
      ...oldBookingTimes,
      [day]: {
        ...oldBookingTimes[day],
        [prop]: val,
      },
    }));
  }

  return (
    <div className="mt-4 bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-center text-2xl text-white font-semibold mb-6">CREATE NEW EVENT TYPE</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        
        {/* Left Column - Event Info */}
        <div className="flex flex-col gap-4">
          <label className="text-yellow-400 font-semibold">TITLE</label>
          <PlaceholdersAndVanishInput
            placeholders={titlePlaceholders}
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-yellow-400 font-semibold">DESCRIPTION</label>
          <PlaceholdersAndVanishInput
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
            onChange={e => setLength(parseInt(e.target.value))}
          />
        </div>

        {/* Right Column - Availability by Day */}
        <div className="flex flex-col gap-3">
          {weekDaysNames.map((day) => {
            const active = bookingTimes?.[day].active;
            return (
              <div 
                key={day} 
                className="flex flex-col sm:flex-row items-center justify-between gap-8 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-sm"
              >
              <label className="flex gap-2 uppercase">
                <input
                  type="checkbox" 
                  value={day}
                  checked={bookingTimes?.[day]?.active}
                  onChange={e => handleBookingTimeChange(day, e.target.checked, 'active')}
                />
                <label className="text-yellow-400 font-semibold w-20">{day}</label>
              </label>
              <div className={
                clsx(
                  "flex items-center gap-3",
                  active ? '' : 'opacity-40'
              )}>
                <span className="text-gray-400">FROM</span>
                <div className="select-container">
                  <TimeSelect 
                    value={bookingTimes?.[day]?.from || '00:00'}
                    onChange={val => handleBookingTimeChange(day, val, 'from')}
                    step={30}
                  />
                </div>
                <span className="text-gray-400">TO</span>
                <div className="select-container">
                  <TimeSelect 
                    value={bookingTimes?.[day]?.to || '00:00'}
                    onChange={val => handleBookingTimeChange(day, val, 'to')}
                    step={30} 
                  />
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* Save Event Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button type="submit" className="button-gradient">
            SAVE EVENT
          </button>
        </div>
      </form>
    </div>
  );
}
