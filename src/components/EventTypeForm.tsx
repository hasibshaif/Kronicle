"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import TimeSelect from "@/components/TimeSelect";
import { FormEvent, useState } from "react";
import { BookingTimes, WeekdayName } from "@/lib/types";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IEventType } from "@/models/EventType";
import { Check, Copy } from "lucide-react";
import EventTypeDelete from "./EventTypeDelete";
import { weekDaysNames } from "@/lib/shared";

const titlePlaceholders = [
  "Monday Momentum",
  "Project Power-Up",
  "Weekly Win Session",
  "Idea Generator",
  "Coffee & Collaboration",
  "Big Picture Meeting",
  "Retro Reset",
  "Client Connection Call",
  "Marketing Mastermind",
  "Innovation Lab",
  "Team Huddle",
  "Sync & Share",
  "Brain Boost Session",
  "Creative Jam",
  "Game Plan Gathering",
  "Idea Sprint",
  "All Hands Check-In",
  "Progress Pulse",
  "Lightning Sync",
  "Future Planning Party",
];

const descriptionPlaceholders = [
  "Kickstart the week with fresh ideas.",
  "Find solutions and map out next steps.",
  "Brainstorm big ideas and creative fixes.",
  "Recharge and realign with the team.",
  "Get everyone on the same wavelength.",
  "Catch up and set goals for the week ahead.",
  "Reflect, improve, and share some laughs.",
  "Keep clients excited about our progress.",
  "Bring bold ideas to life for the next campaign.",
  "Shake things up and plan the future.",
  "Boost collaboration and team energy.",
  "Set the stage for big wins.",
  "Unleash creativity and explore new options.",
  "Recap, reset, and re-energize.",
  "Strategize and map out the next big move.",
];

const MAX_TITLE_LENGTH = 50;

export default function EventTypeForm({
  doc,
  username = "",
}: {
  doc?: IEventType;
  username?: string;
}) {
  const [title, setTitle] = useState(doc?.title || "");
  const [description, setDescription] = useState(doc?.description || "");
  const [length, setLength] = useState(doc?.length || 30);
  const [bookingTimes, setBookingTimes] = useState<BookingTimes>(
    doc?.bookingTimes || {
      Monday: { from: "00:00", to: "00:00", active: false },
      Tuesday: { from: "00:00", to: "00:00", active: false },
      Wednesday: { from: "00:00", to: "00:00", active: false },
      Thursday: { from: "00:00", to: "00:00", active: false },
      Friday: { from: "00:00", to: "00:00", active: false },
      Saturday: { from: "00:00", to: "00:00", active: false },
      Sunday: { from: "00:00", to: "00:00", active: false },
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [titleRemaining, setTitleRemaining] = useState(MAX_TITLE_LENGTH);
  const router = useRouter();

  function validateForm() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    for (const day of weekDaysNames) {
      const { from, to, active } = bookingTimes[day] || {};
      if (active && from && to) {
        const fromTime = parseInt(from.replace(":", ""), 10);
        const toTime = parseInt(to.replace(":", ""), 10);
        if (fromTime >= toTime) {
          newErrors[day] = "Start time must be before end time.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validateForm()) return;

    const id = doc?._id;
    const request = id ? axios.put : axios.post;
    const data = { title, description, length, bookingTimes };
    const response = await request("/api/event-types", { ...data, id });
    if (response.data) {
      router.push("/dashboard/event-types");
      router.refresh();
    }
  }

  function handleTitleChange(value: string) {
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitle(value);
      setTitleRemaining(MAX_TITLE_LENGTH - value.length);
    }
  }

  function handleBookingTimeChange(
    day: WeekdayName,
    val: string | boolean,
    prop: "from" | "to" | "active"
  ) {
    setBookingTimes((oldBookingTimes) => {
      const newBookingTimes: BookingTimes = { ...oldBookingTimes };
      if (!newBookingTimes[day]) {
        newBookingTimes[day] = { from: "00:00", to: "00:00", active: false };
      }

      if (prop === "from" || prop === "to") {
        newBookingTimes[day][prop] = val as string;
      } else if (prop === "active") {
        newBookingTimes[day][prop] = val as boolean;
      }

      return newBookingTimes;
    });
    setErrors((prev) => ({ ...prev, [day]: "" }));
  }

  async function copyToClipboard() {
    const url = `${process.env.NEXT_PUBLIC_URL}/${username}/${doc?.uri}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="mt-4 bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-center text-2xl text-white font-semibold mb-6">
        CREATE NEW EVENT TYPE
      </h2>
      {errors.title && (
        <div className="text-red-400 text-center mb-4">{errors.title}</div>
      )}
      <form
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          {doc && (
            <div
              onClick={copyToClipboard}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition duration-200"
            >
              <p className="text-sm text-yellow-400 break-all">
                {`${process.env.NEXT_PUBLIC_URL}/${username}/${doc.uri}`}
              </p>
              {copied ? (
                <Check
                  size={16}
                  className="text-green-400 transition duration-200"
                />
              ) : (
                <Copy
                  size={16}
                  className="text-yellow-400 transition duration-200"
                />
              )}
            </div>
          )}
          <label className="text-yellow-400 font-semibold">TITLE</label>
          <PlaceholdersAndVanishInput
            value={title}
            placeholders={titlePlaceholders}
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <div className="text-right text-sm text-gray-400">
            {titleRemaining} characters remaining
          </div>
          <label className="text-yellow-400 font-semibold">DESCRIPTION</label>
          <PlaceholdersAndVanishInput
            value={description}
            placeholders={descriptionPlaceholders}
            className="w-full h-24 px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setDescription(e.target.value)}
            as="textarea"
            rows={4}
          />
          <label className="text-yellow-400 font-semibold">
            EVENT LENGTH (minutes)
          </label>
          <input
            type="number"
            placeholder="30"
            className="w-full h-auto px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-4">
          {weekDaysNames.map((day) => (
            <div
              key={day}
              className="flex flex-wrap gap-4 items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-sm"
            >
              <label className="flex gap-2 uppercase items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={bookingTimes[day]?.active || false}
                  onChange={(e) =>
                    handleBookingTimeChange(day, e.target.checked, "active")
                  }
                />
                <span className="text-yellow-400 font-semibold">{day}</span>
              </label>
              <div
                className={clsx(
                  "flex flex-wrap gap-3 items-center justify-between w-full md:w-auto",
                  bookingTimes[day]?.active ? "" : "opacity-40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">FROM</span>
                  <TimeSelect
                    value={bookingTimes[day]?.from || "00:00"}
                    onChange={(val) =>
                      handleBookingTimeChange(day, val, "from")
                    }
                    step={30}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">TO</span>
                  <TimeSelect
                    value={bookingTimes[day]?.to || "00:00"}
                    onChange={(val) => handleBookingTimeChange(day, val, "to")}
                    step={30}
                  />
                </div>
              </div>
              {errors[day] && (
                <div className="text-red-400 text-sm mt-2">{errors[day]}</div>
              )}
            </div>
          ))}
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 mt-4 items-center">
          {doc && <EventTypeDelete id={doc._id as string} />}
          <button
            type="submit"
            className="button-gradient flex items-center gap-2"
          >
            <Check size={16} />
            SAVE EVENT
          </button>
        </div>
      </form>
    </div>
  );
}
