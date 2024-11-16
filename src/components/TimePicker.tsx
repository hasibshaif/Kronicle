"use client";

import { weekDaysShortenedNames } from "@/lib/shared";
import { BookingTimes, WeekdayName } from "@/lib/types";
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
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TimePicker({
  bookingTimes,
  length,
  meetingUri,
  username,
}: {
  bookingTimes: BookingTimes;
  length: number;
  meetingUri:string;
  username:string;
}) {
  const currentDate = startOfDay(new Date());
  const [activeMonthDate, setActiveMonthDate] = useState(currentDate);
  const [activeMonthIndex, setActiveMonthIndex] = useState(
    activeMonthDate.getMonth()
  );
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<null | Date>(null);
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
        bookingHours.push(new Date(a)); // Push a copy of the date to avoid mutation
        a = addMinutes(a, length);
      } while (isBefore(a, selectedDayTo));
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
    setSelectedDay(startOfDay(day));
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-center gap-8 p-12">
        {/* Month Navigation */}
        <div className="flex items-center gap-6 text-gray-300">
          <button onClick={prevMonth} aria-label="Previous Month">
            <ChevronLeft className="text-orange-400 hover:text-orange-300 w-8 h-8" />
          </button>
          <span className="text-2xl font-semibold text-orange-400">
            {format(new Date(activeYear, activeMonthIndex, 1), "MMMM yyyy")}
          </span>
          <button onClick={nextMonth} aria-label="Next Month">
            <ChevronRight className="text-orange-400 hover:text-orange-300 w-8 h-8" />
          </button>
        </div>

        {/* Days Grid */}
        <div className="inline-grid gap-4 grid-cols-7">
          {/* Weekdays */}
          {weekDaysShortenedNames.map((day, idx) => (
            <div
              key={idx}
              className="uppercase text-sm md:text-base text-center text-orange-400 font-bold"
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
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all",
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
      {selectedDay && (
        <div className="pt-8 pl-2 pr-8 w-56 overflow-auto">
          <p className="text-left text-sm text-center pb-1 border-b">
            {format(selectedDay, "EEEE, MMMM d")}
          </p>
          <div className="grid gap-1 mt-2 max-h-52">
            {bookingHours.map((bookingTime, idx) => (
              <div key={`booking-${idx}`}>
                <Link 
                  className="w-full block border-2 border-orange-600 rounded-xl text-white font-bold"
                  href={`/${username}/${meetingUri}/${bookingTime.toISOString()}`}
                >
                  {format(bookingTime, "HH:mm")}
                </Link>
              </div>
            ))}
            <div className="mb-8">&nbsp;</div>
          </div>
        </div>
      )}
    </div>
  );
}
