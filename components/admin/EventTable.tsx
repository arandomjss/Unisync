"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Event {
  id: string;
  title: string;
  club_name: string;
  date: string;
  location: string;
  capacity: string;
}

interface EventTableProps {
  className?: string; // Allow custom class names
}

export default function EventTable({ className }: EventTableProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date, clubs!inner(name), location, capacity")
        .eq("status", "pending")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          club_name: event.clubs?.name || "Unknown Club",
          date: event.date,
          location: event.location || "Location not specified",
          capacity: event.capacity || "Capacity not specified",
        }));
        setEvents(formattedEvents);
      }
    }

    fetchEvents();
  }, []);

  const handleApprove = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "approved" })
      .eq("id", eventId);

    if (error) {
      console.error("Error approving event:", error);
    } else {
      console.log("Event approved successfully");
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  };

  const handleReject = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "rejected" })
      .eq("id", eventId);

    if (error) {
      console.error("Error rejecting event:", error);
    } else {
      console.log("Event rejected successfully");
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className={`${className} bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md`}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Event Name</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Club</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Date</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Location</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Capacity</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-zinc-200 dark:border-zinc-700">
              <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.title}</td>
              <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.club_name}</td>
              <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.date}</td>
              <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.location}</td>
              <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.capacity}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleApprove(event.id)}
                  className="text-green-500 hover:underline mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event.id)}
                  className="text-red-500 hover:underline"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}