import { format } from "date-fns";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
    "booking-time": string;
  };
};

export default function BookingFormPage(props: PageProps) {
  const username = props.params.username;
  const bookingUri = props.params["booking-uri"];
  const bookingTime = new Date(decodeURIComponent(props.params["booking-time"]));

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-md">
      {/* Booking Time */}
      <h2 className="text-xl md:text-2xl font-bold text-orange-400 mb-6">
        {format(bookingTime, "EEEE, MMMM d, HH:mm")}
      </h2>

      {/* Form */}
      <form className="flex flex-col gap-6">
        <label className="flex flex-col text-gray-300">
          <span className="text-sm text-orange-400 mb-1">Your Name</span>
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-gray-300">
          <span className="text-sm text-orange-400 mb-1">Your Email</span>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-gray-300">
          <span className="text-sm text-orange-400 mb-1">Additional Info</span>
          <textarea
            placeholder="Anything else you want to include? (optional)"
            rows={4}
            className="px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </label>
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-md font-bold hover:from-orange-500 hover:to-red-500 transition"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
