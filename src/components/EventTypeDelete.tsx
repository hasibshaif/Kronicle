"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventTypeDelete ({id}: {id:string}) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        await axios.delete('api/event-types?id='+id);
        router.push('/dashboard/event-types');
        router.refresh();
    }

    return (
        <div>
            {!showConfirmation && (
                <button 
                type="submit" 
                className="button-delete flex items-center gap-2"
                >
                    <Trash2 size={16}/>
                    DELETE
                </button>
            )}
            {showConfirmation && (
                <div>
                    <button 
                        onClick={() => setShowConfirmation(false)}
                        className="bg-gray"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleDelete()} 
                        className="button-delete"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}