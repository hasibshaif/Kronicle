"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventTypeDelete({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      await axios.delete(`/api/event-types?id=${id}`);
      router.push("/dashboard/event-types");
      router.refresh();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="button-delete flex items-center gap-2"
      >
        <Trash2 size={16} />
        DELETE
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
