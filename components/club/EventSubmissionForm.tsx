"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EventSubmissionFormProps {
  className?: string; // Allow custom class names
}

export default function EventSubmissionForm({ className }: EventSubmissionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [club, setClub] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, date, time, club });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} space-y-4 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md`}
    >
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">Submit New Event</h2>
      <Input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
      />
      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-md border border-zinc-300 dark:border-zinc-600 p-2"
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
      />
      <Input
        type="text"
        placeholder="Club Name"
        value={club}
        onChange={(e) => setClub(e.target.value)}
        className="w-full bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-white"
      />
      <Button type="submit" variant="neon" className="w-full">
        Submit Event
      </Button>
    </form>
  );
}