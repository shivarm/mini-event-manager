"use client"

import { useForm } from "react-hook-form";
import { create } from "zustand";

interface EventItem {
  id: string;
  name: string;
  date: string;
}

interface EventState {
  events: EventItem[];
  addEvent: (event: Omit<EventItem, "id">) => void;
  deleteEvent: (id: string) => void;
  search: string;
  setSearch: (search: string) => void;
}

const getInitialEvents = (): EventItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("events");
    if (stored) return JSON.parse(stored);
  }
  return [];
};

const useEventStore = create<EventState>((set) => ({
  events: getInitialEvents(),
  addEvent: (event) =>
    set((state) => {
      const newEvents = [
        ...state.events,
        { id: Date.now().toString(), ...event },
      ];
      if (typeof window !== "undefined") {
        localStorage.setItem("events", JSON.stringify(newEvents));
      }
      return { events: newEvents };
    }),
  deleteEvent: (id) =>
    set((state) => {
      const newEvents = state.events.filter((e) => e.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("events", JSON.stringify(newEvents));
      }
      return { events: newEvents };
    }),
  search: "",
  setSearch: (search) => set(() => ({ search })),
}));



export default function EventsPage() {
  const { register, handleSubmit, reset } = useForm<{ name: string; date: string }>();
  const events = useEventStore((state) => state.events);
  const addEvent = useEventStore((state) => state.addEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const search = useEventStore((state) => state.search);
  const setSearch = useEventStore((state) => state.setSearch);

  const onSubmit = (data: { name: string; date: string }) => {
    addEvent(data);
    reset();
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-2">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Add Event</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full items-center">
          <input
            type="text"
            placeholder="Event Name"
            {...register("name", { required: true })}
            required
            className="border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg w-full text-center"
          />
          <input
            type="date"
            {...register("date", { required: true })}
            required
            className="border border-indigo-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg w-full text-center"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-indigo-600 transition w-full"
          >
            Add Event
          </button>
        </form>
        <input
          type="text"
          placeholder="Search events by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 border border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg w-full text-center"
        />
        <ul className="mt-8 space-y-3 w-full flex flex-col items-center">
          {filteredEvents.length === 0 && (
            <li className="text-center text-gray-400">No events found.</li>
          )}
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-indigo-50 rounded-lg px-4 py-3 shadow w-full"
            >
              <span className="flex flex-col sm:flex-row sm:items-center gap-1 justify-center items-center w-full">
                <span className="font-bold text-indigo-700 text-center w-full">{event.name}</span>
                <span className="text-gray-500 text-sm sm:ml-2 text-center w-full">{event.date}</span>
              </span>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-500 mt-2 sm:mt-0 sm:ml-4 text-sm font-medium w-full text-center"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
