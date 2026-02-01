"use client";

import React from "react";

export default function EventTable() {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Event Name</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Club</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Date</th>
            <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <td className="py-2 px-4 text-zinc-800 dark:text-white">Hackathon</td>
            <td className="py-2 px-4 text-zinc-800 dark:text-white">IEEE Club</td>
            <td className="py-2 px-4 text-zinc-800 dark:text-white">2026-02-15</td>
            <td className="py-2 px-4">
              <button className="text-green-500 hover:underline mr-2">Approve</button>
              <button className="text-red-500 hover:underline">Reject</button>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 text-zinc-800 dark:text-white">Workshop</td>
            <td className="py-2 px-4 text-zinc-800 dark:text-white">ASDD Club</td>
            <td className="py-2 px-4 text-zinc-800 dark:text-white">2026-02-20</td>
            <td className="py-2 px-4">
              <button className="text-green-500 hover:underline mr-2">Approve</button>
              <button className="text-red-500 hover:underline">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}