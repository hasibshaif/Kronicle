"use client";

import { weekDaysShortenedNames } from "@/lib/shared";
import { BookingTimes, WeekdayName } from "@/lib/types";
import axios from "axios";
import clsx from "clsx";
import {
  addDays,
  addMonths,
  format,
  getDay,
  isEqual,
  isFuture,
  isLastDayOfMonth,
  isToday,
  subMonths,
  startOfDay,
  isBefore,
  addMinutes,
  endOfDay,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TimeSlot } from "nylas";
import { useEffect, useState } from "react";
import RippleWaveLoader from "./RippleWaveLoader";

export default function TimePicker({
  bookingTimes,
  length,
  meetingUri,
  username,
}: {
  bookingTimes: BookingTimes;
  length: number;
  meetingUri: string;
  username: string;
}) {
  const currentDate = startOfDay(new Date());
  const [activeMonthDate, setActiveMonthDate] = useState(currentDate);
  const [activeMonthIndex, setActiveMonthIndex] = useState(
    activeMonthDate.getMonth()
  );
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<null | Date>(null);
  const [busySlots, setBusySlots] = useState<TimeSlot[]>([]);
  const [busySlotsLoaded, setBusySlotsLoaded] = useState(false);

  // Debugging: Log selected day
  useEffect(() => {
    console.log("Selected Day:", selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay) {
      setBusySlots([]);
      setBusySlotsLoaded(false);

      const params = new URLSearchParams();
      params.set("username", username);
      params.set("from", startOfDay(selectedDay).toISOString());
      params.set("to", endOfDay(selectedDay).toISOString());

      console.log("Fetching busy slots with params:", params.toString());

      axios
        .get(`/api/busy?` + params.toString())
        .then((response) => {
          console.log("Busy slots response:", response.data);
          setBusySlots(response.data);
          setBusySlotsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching busy slots:", error);
          setBusySlotsLoaded(true); // Avoid indefinite loading state
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  function withinBusySlots(time: Date) {
    const bookingFrom = time;
    const bookingTo = addMinutes(new Date(time), length);

    if (!busySlots.length) {
      console.log("No busy slots available.");
      return false; // No busy slots
    }

    // eslint-disable-next-line prefer-const
    for (let busySlot of busySlots) {
      const busyFrom = new Date(parseInt(busySlot.startTime) * 1000);
      const busyTo = new Date(parseInt(busySlot.endTime) * 1000);
      console.log({ busyFrom, busyTo, busySlot, bookingFrom, bookingTo });

      if (isAfter(bookingTo, busyFrom) && isBefore(bookingTo, busyTo)) {
        return true;
      }
      if (isAfter(bookingFrom, busyFrom) && isBefore(bookingFrom, busyTo)) {
        return true;
      }
      if (isEqual(bookingFrom, busyFrom)) {
        return true;
      }
      if (isEqual(bookingTo, busyTo)) {
        return true;
      }
    }

    return false;
  }

  const firstDayOfCurrentMonth = new Date(activeYear, activeMonthIndex, 1);
  const firstDayOfCurrentMonthWeekdayIndex = getDay(firstDayOfCurrentMonth);
  const emptyDaysCount =
    firstDayOfCurrentMonthWeekdayIndex === 0
      ? 6
      : firstDayOfCurrentMonthWeekdayIndex - 1;
  const emptyDaysArr = new Array(emptyDaysCount).fill("", 0, emptyDaysCount);
  const daysNumbers = [firstDayOfCurrentMonth];
  do {
    const lastAddedDay = daysNumbers[daysNumbers.length - 1];
    daysNumbers.push(addDays(lastAddedDay, 1));
  } while (!isLastDayOfMonth(daysNumbers[daysNumbers.length - 1]));

  let selectedDayConfig = null;
  const bookingHours: Date[] = [];
  if (selectedDay) {
    const weekdayNameIndex = format(selectedDay, "EEEE") as WeekdayName;
    selectedDayConfig = bookingTimes?.[weekdayNameIndex];
    if (selectedDayConfig?.active) {
      const [hoursFrom, minutesFrom] = selectedDayConfig.from.split(":");
      const selectedDayFrom = new Date(selectedDay);
      selectedDayFrom.setHours(parseInt(hoursFrom));
      selectedDayFrom.setMinutes(parseInt(minutesFrom));

      const selectedDayTo = new Date(selectedDay);
      const [hoursTo, minutesTo] = selectedDayConfig.to.split(":");
      selectedDayTo.setHours(parseInt(hoursTo));
      selectedDayTo.setMinutes(parseInt(minutesTo));

      let a = selectedDayFrom;
      do {
        if (!withinBusySlots(a)) {
          bookingHours.push(a);
        }
        a = addMinutes(a, 30);
      } while (isBefore(addMinutes(a, length), selectedDayTo));
    }
  }

  function prevMonth() {
    setActiveMonthDate((prev) => {
      const newActiveMonthDate = subMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());
      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function nextMonth() {
    setActiveMonthDate((prev) => {
      const newActiveMonthDate = addMonths(prev, 1);
      setActiveMonthIndex(newActiveMonthDate.getMonth());
      setActiveYear(newActiveMonthDate.getFullYear());
      return newActiveMonthDate;
    });
  }

  function handleDayClick(day: Date) {
    console.log("Day clicked:", day);
    setSelectedDay(startOfDay(day));
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-screen-md mx-auto bg-gray-900 p-4 md:p-8 gap-4 rounded-lg shadow-lg">
      {/* Calendar Section */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Month Navigation */}
        <div className="flex items-center justify-between w-full text-gray-300">
          <button onClick={prevMonth} aria-label="Previous Month">
            <ChevronLeft className="text-orange-400 hover:text-orange-300 w-6 h-6 md:w-8 md:h-8" />
          </button>
          <span className="text-lg md:text-2xl font-semibold text-orange-400">
            {format(new Date(activeYear, activeMonthIndex, 1), "MMMM yyyy")}
          </span>
          <button onClick={nextMonth} aria-label="Next Month">
            <ChevronRight className="text-orange-400 hover:text-orange-300 w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
  
        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 w-full">
          {/* Weekdays */}
          {weekDaysShortenedNames.map((day, idx) => (
            <div
              key={idx}
              className="uppercase text-xs md:text-sm text-center text-orange-400 font-bold"
            >
              {day}
            </div>
          ))}
          {/* Empty Days */}
          {emptyDaysArr.map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {/* Month Days */}
          {daysNumbers.map((n, idx) => {
            const weekdayNameIndex = format(n, "EEEE") as WeekdayName;
            const weekdayConfig = bookingTimes?.[weekdayNameIndex];
            const isActiveInBookingTimes = weekdayConfig?.active;
            const canBeBooked = isFuture(n) && isActiveInBookingTimes;
            const isSelected = selectedDay && isEqual(startOfDay(n), selectedDay);
  
            return (
              <div key={idx} className="text-center">
                <button
                  disabled={!canBeBooked}
                  onClick={() => handleDayClick(n)}
                  className={clsx(
                    "w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold transition-all",
                    canBeBooked
                      ? "bg-orange-600 hover:bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed",
                    isToday(n) && !isSelected ? "ring-2 ring-orange-400" : "",
                    isSelected
                      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white ring-4 ring-yellow-200"
                      : ""
                  )}
                >
                  {format(n, "d")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
  
      {/* Time Selector Section */}
      {selectedDay && (
        <div className="pt-4 px-8 w-full md:w-1/3 overflow-auto">
          <p className="text-center text-sm md:text-base pb-1 border-b">
            {format(selectedDay, "EEEE, MMMM d")}
          </p>
          <div className="grid gap-1 mt-2 max-h-72">
            {!busySlotsLoaded && (
              <div className="mt-8">
                <RippleWaveLoader />
              </div>
            )}
            {busySlotsLoaded &&
              bookingHours.map((bookingTime, idx) => (
                <div key={`booking-${idx}`}>
                  <Link
                    className="block border-2 border-orange-600 rounded-xl text-white font-bold text-sm md:text-base p-2 text-center"
                    href={`/${username}/${meetingUri}/${bookingTime.toISOString()}`}
                  >
                    {format(bookingTime, "HH:mm")}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );  
}  