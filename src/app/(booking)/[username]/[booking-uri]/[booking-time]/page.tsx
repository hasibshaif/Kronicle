"use client";

import axios from "axios";
import { format } from "date-fns";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";

export default function BookingFormPage() {
  const params = useParams();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const username = params.username as string;
  const bookingUri = params["booking-uri"] as string;
  const bookingTime = new Date(decodeURIComponent(params["booking-time"] as string));

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();

    // Validate fields
    if (!guestName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!guestEmail.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    setErrorMessage(""); // Clear errors

    const data = {
      guestName,
      guestEmail,
      guestNotes,
      username,
      bookingUri,
      bookingTime,
    };

    try {
      await axios.post("/api/bookings", data);
      setConfirmed(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-3xl lg:max-w-2xl mx-auto bg-gray-800 sm:p-6 p-4 rounded-lg">
      <h1 className="text-center text-2xl sm:text-3xl text-white font-bold mb-6">
        Booking Confirmation
      </h1>
      <h2 className="text-lg sm:text-xl font-semibold text-orange-400 mb-8 text-center sm:text-left">
        {format(bookingTime, "EEEE, MMMM d, HH:mm")}
      </h2>

      {confirmed ? (
        <div className="flex flex-col items-center gap-4 bg-gray-700 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-400">
            Thank you for booking!
          </h3>
          <p className="text-lg text-gray-300">
            Your booking has been confirmed successfully.
          </p>
          <p className="text-md text-gray-400">
            You may now close this page or return to the homepage.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="button-gradient"
              onClick={() => (window.location.href = "/")}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4 sm:gap-6"
          onSubmit={handleFormSubmit}
        >
          {errorMessage && (
            <div className="text-center text-red-400 font-medium mb-4">
              {errorMessage}
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm text-left text-yellow-400 font-semibold mb-2"
            >
              Your Name
            </label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              id="name"
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm text-left text-yellow-400 font-semibold mb-2"
            >
              Your Email
            </label>
            <input
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="additional-info"
              className="block text-sm text-left text-yellow-400 font-semibold mb-2"
            >
              Additional Info
            </label>
            <textarea
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              id="additional-info"
              placeholder="Anything else you want to include? (optional)"
              rows={4}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-center sm:justify-end">
            <button
              type="submit"
              className="button-gradient"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
