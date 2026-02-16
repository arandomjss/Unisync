"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { FaCalendarAlt, FaClock, FaAlignLeft, FaBuilding, FaTag } from "react-icons/fa";

interface EventSubmissionFormProps {
  className?: string; // Allow custom class names
  onSuccess?: () => void;
}

export default function EventSubmissionForm({ className, onSuccess }: EventSubmissionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [club, setClub] = useState("");
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("User is not authenticated");
        return;
      }

      const { user } = session;

      const { data, error } = await supabase
        .from("club_memberships")
        .select("club_id, clubs(name)")
        .eq("user_id", user.id)
        .eq("role", "admin"); // Filter by user_id and role as head

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        const filteredClubs = data.map((membership: any) => {
          // Handle case where clubs might be returned as an array or object
          const clubData = Array.isArray(membership.clubs) ? membership.clubs[0] : membership.clubs;
          return {
            id: membership.club_id,
            name: clubData?.name || "Unknown Club",
          };
        });
        setClubs(filteredClubs || []);
      }
    };

    fetchClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date || !time || !club || !location || !capacity) {
      console.error("All fields are required.");
      return;
    }

    const { data, error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        time,
        club_id: club,
        location,
        capacity: parseInt(capacity, 10),
      },
    ]);

    if (error) {
      console.error("Error submitting event:", error);
    } else {
      console.log("Event submitted successfully:", data);
      // Optionally, clear the form after successful submission
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setClub("");
      setLocation("");
      setCapacity("");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} space-y-6 bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg`}
    >
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Submit New Event</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Event Title</label>
          <div className="relative">
            <FaTag className="absolute left-3 top-3 text-zinc-500" />
            <Input
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Event Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-zinc-500" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Event Time</label>
          <div className="relative">
            <FaClock className="absolute left-3 top-3 text-zinc-500" />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Club</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-3 text-zinc-500" />
            <select
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-md border border-zinc-300 dark:border-zinc-600 p-2"
            >
              <option value="" disabled>Select a club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Event Location</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-3 text-zinc-500" />
            <Input
              type="text"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-800 dark:text-white mb-2">Event Capacity</label>
          <div className="relative">
            <FaAlignLeft className="absolute left-3 top-3 text-zinc-500" />
            <Input
              type="number"
              placeholder="Enter event capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-zinc-800 dark:text-white mb-2">Event Description</label>
        <div className="relative">
          <FaAlignLeft className="absolute left-3 top-3 text-zinc-500" />
          <textarea
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 pl-10 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-md border border-zinc-300 dark:border-zinc-600 p-2"
          />
        </div>
      </div>

      <Button type="submit" variant="neon" className="w-full">
        Submit Event
      </Button>
    </form>
  );
}