"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProfileForm({ existingUsername = '' }: { existingUsername?: string }) {
  const [username, setUsername] = useState(existingUsername);
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For displaying specific errors
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSaved(false);
    setIsError(false);
    setErrorMessage(null);

    // Validate input before making the request
    if (!username.trim()) {
      setIsError(true);
      setErrorMessage("Username cannot be empty.");
      return;
    }

    // Use async behavior inside the function but avoid making the function async itself
    (async () => {
      try {
        const response = await axios.put("/api/profile", { username });
        if (response.data) {
          setIsSaved(true);
          if (!existingUsername && username) {
            router.push('/dashboard/event-types');
            router.refresh();
          }
        } else {
          setIsError(true);
          setErrorMessage("Failed to save the profile. Please try again.");
        }
      } catch (error) {
        setIsError(true);
        setErrorMessage("Failed to save profile (username taken).");
        console.error("Failed to save profile:", error);
      }
    })();
  }

  return (
    <form
      className="flex flex-col gap-4 bg-gray-800 p-6 rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      {isSaved && <p className="text-green-400">Settings saved!</p>}
      {isError && <p className="text-red-400">{errorMessage}</p>}
      <label className="flex flex-col gap-2 text-yellow-400 font-semibold">
        Username
        <input
          type="text"
          className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="mt-4 button-gradient px-4 py-2 rounded-md font-semibold text-white flex items-center justify-center transition duration-200 hover:bg-orange-500"
      >
        Save
      </button>
    </form>
  );
}
