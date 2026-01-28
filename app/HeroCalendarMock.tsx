"use client"

import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
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
  // Generate a static month grid (Sun-Sat, 5 weeks)
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // Start on Sun, Jan 28
  const startDate = new Date('2026-01-28');
  startDate.setDate(1 - startDate.getDay()); // Go to the previous Sunday

  // Sidebar open state for both mobile and desktop
  const [sidebarOpen, setSidebarOpen] = useState(true); // default open on desktop

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="flex-1 w-full flex">
        {/* Hamburger button for mobile, toggle button for desktop */}
        {!sidebarOpen && (
          <button
            className="z-40 p-2 rounded-full bg-zinc-900/80 border border-white/10 hover:bg-white/10 transition shadow-lg"
            style={{ position: 'fixed', top: 80, left: 8 }} // fixed for all screens
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
        )}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/* Main calendar area */}
        <main
          className={
            `flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-8 max-w-full transition-all duration-300 ` +
            (
              sidebarOpen
                ? 'md:ml-56' // Sidebar open: offset on desktop
                : 'md:ml-56 md:justify-start' // Sidebar closed: offset on desktop, center on mobile
            )
          }
        >
          <GlassCard className="w-full max-w-3xl mx-auto">
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
