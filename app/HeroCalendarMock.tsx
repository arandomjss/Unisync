"use client"

import GlassCard from '../components/GlassCard';
import { CalendarDays, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const clubs = [
  { name: 'ASDD Club', color: 'bg-pink-500' },
  { name: 'Cultural Club', color: 'bg-yellow-400' },
  { name: 'ACH Club', color: 'bg-blue-500' },
  { name: 'IEEE Club', color: 'bg-green-500' },
];

const mockEvents = [
  { date: '2026-01-28', title: 'Open Mic Night', club: 'Cultural Club' },
  { date: '2026-01-29', title: 'Tech Talk', club: 'IEEE Club' },
  { date: '2026-01-30', title: 'Art Expo', club: 'ASDD Club' },
  { date: '2026-01-31', title: 'Chess Tournament', club: 'ACH Club' },
];

function getClubColor(clubName: string) {
  return clubs.find((c) => c.name === clubName)?.color || 'bg-zinc-500';
}

export default function HeroCalendarMock() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Generate a static month grid (Sun-Sat, 5 weeks)
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // Start on Sun, Jan 28
  const startDate = new Date('2026-01-28');
  startDate.setDate(1 - startDate.getDay()); // Go to the previous Sunday

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-indigo-400" />
          <span className="text-2xl font-extrabold tracking-tight">UniSync</span>
        </div>
        {/* Desktop sidebar toggle */}
        <button
          className="hidden md:block p-2 rounded-full hover:bg-white/10 transition"
          onClick={() => setShowSidebar((v) => !v)}
        >
          {showSidebar ? <X /> : <Menu />}
        </button>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </button>
      </header>
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        {(showSidebar || sidebarOpen) && (
          <aside
            className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-zinc-900/80 backdrop-blur-md border-r border-white/10 p-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full md:translate-x-0'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Clubs</span>
              <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}><X /></button>
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
        {/* Main calendar area */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 md:ml-0 ml-0">
          <GlassCard className="w-full max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 rounded-full hover:bg-white/10 transition"><ChevronLeft /></button>
              <span className="font-semibold text-lg">January 2026</span>
              <button className="p-2 rounded-full hover:bg-white/10 transition"><ChevronRight /></button>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="text-center text-zinc-400 font-semibold pb-2">{d}</div>
              ))}
              {days.map((offset, i) => {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + offset);
                const day = date.getDate();
                const isCurrentMonth = date.getMonth() === 0; // January
                const events = mockEvents.filter(e => new Date(e.date).getDate() === day && isCurrentMonth);
                return (
                  <div
                    key={i}
                    className={`h-24 rounded-xl p-2 flex flex-col gap-1 border border-white/10 ${isCurrentMonth ? 'bg-white/5' : 'bg-zinc-900/30 text-zinc-500'} relative`}
                  >
                    <span className="text-xs font-bold mb-1">{day}</span>
                    {events.map((event) => (
                      <div
                        key={event.title}
                        className={`text-xs px-2 py-1 rounded-lg text-white font-semibold shadow ${getClubColor(event.club)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
