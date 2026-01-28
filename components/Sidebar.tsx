"use client";

import { Menu, X } from "lucide-react";
import React from "react";

const clubs = [
  { name: 'ASDD Club', color: 'bg-pink-500' },
  { name: 'Cultural Club', color: 'bg-yellow-400' },
  { name: 'ACH Club', color: 'bg-blue-500' },
  { name: 'IEEE Club', color: 'bg-green-500' },
];

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Mobile hamburger */}
      {!open && (
        <button
          className="md:hidden fixed top-20 left-2 z-40 p-2 rounded-full bg-zinc-900/80 border border-white/10 hover:bg-white/10 transition shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      )}
      {/* Sidebar */}
      {open && (
        <aside
          className="z-30 fixed md:static top-0 left-0 h-full w-56 max-w-[16rem] bg-zinc-900/80 backdrop-blur-md border-r border-white/10 p-4 transition-transform duration-300 md:relative"
        >
          <button className="md:hidden absolute top-4 left-4 p-1 z-50" onClick={() => setOpen(false)}><X /></button>
          <div className="flex items-center mb-6 mt-8 md:mt-0">
            <span className="font-bold text-lg text-zinc-100">Clubs</span>
          </div>
          <ul className="space-y-3">
            {clubs.map((club) => (
              <li key={club.name} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${club.color}`}></span>
                <span className="text-zinc-100">{club.name}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
