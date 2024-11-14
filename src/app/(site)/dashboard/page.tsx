"use client";

import DashboardTabs from "@/components/DashboardTabs";
import axios from "axios";
import { FormEvent, useState } from "react";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await axios.put("/api/profile", { username });
    setIsSaved(true);
  }

  return (
    <div>
      <DashboardTabs />
      <form
        className="flex flex-col gap-4 bg-gray-800 p-6 rounded-2xl shadow-lg"
        onSubmit={handleSubmit}
      >
        {isSaved && <p className="text-green-400">Settings saved!</p>}
        <label className="flex flex-col gap-2 text-yellow-400 font-semibold">
          Username
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your username"
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
    </div>
  );
}
