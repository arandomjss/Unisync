"use client";

import { useState } from "react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, User, Edit2, LogOut, Star, Calendar, Users, Mail, ShieldCheck, BadgeCheck } from "lucide-react";

const mockUser = {
  name: "Alex Morgan",
  university: "Springfield University",
  course: "B.Tech Computer Science",
  email: "alex.morgan@springfield.edu",
  bio: "Passionate about tech, music, and making campus life awesome!",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  verified: true,
  interests: ["Tech", "Music", "Art", "Sports"],
  clubs: [
    { name: "IEEE Club", color: "bg-green-500" },
    { name: "Cultural Club", color: "bg-yellow-400" },
    { name: "ASDD Club", color: "bg-pink-500" },
  ],
  achievements: [
    { icon: <Star className="text-yellow-400" />, label: "Top Volunteer" },
    { icon: <BadgeCheck className="text-neon-blue" />, label: "Event Winner" },
    { icon: <ShieldCheck className="text-green-500" />, label: "Verified Student" },
  ],
  upcomingEvents: [
    { title: "Tech Talk: AI in 2026", date: "2026-02-10", club: "IEEE Club" },
    { title: "Spring Fest", date: "2026-03-05", club: "Cultural Club" },
  ],
  pastEvents: [
    { title: "Open Mic Night", date: "2026-01-28", club: "Cultural Club" },
    { title: "Codathon", date: "2026-01-31", club: "ASDD Club" },
  ],
};

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(mockUser.bio);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-2 mt-24">
      <GlassCard className="w-full max-w-4xl mx-auto p-0 overflow-visible glass-card text-zinc-800 dark:text-zinc-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 pb-4">
          {/* Avatar Placeholder */}
          <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-zinc-800 flex items-center justify-center text-zinc-500 text-4xl">
            {/* Empty for now */}
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                {mockUser.name}
                {mockUser.verified && <BadgeCheck className="text-neon-blue" size={22} />}
              </h2>
              <Button size="icon" variant="ghost" className="ml-2" onClick={() => setEditMode((v) => !v)}>
                <Edit2 size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-zinc-400 text-sm">
              <span className="flex items-center gap-1"><Users size={16} /> {mockUser.university}</span>
              <span className="flex items-center gap-1"><User size={16} /> {mockUser.course}</span>
              <span className="flex items-center gap-1"><Mail size={16} /> {mockUser.email}</span>
            </div>
            {editMode ? (
              <Input
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="mt-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white"
                maxLength={120}
              />
            ) : (
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">{bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {mockUser.interests.map((interest) => (
                <span key={interest} className="px-3 py-1 rounded-full bg-white/10 text-neon-purple text-xs font-semibold border border-white/10">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-white/10 my-4" />
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 pt-0">
          {/* Clubs */}
          <div>
            <h3 className="text-lg font-bold text-zinc-700 dark:text-white mb-2 flex items-center gap-2"><Users size={18} />Clubs</h3>
            <ul className="space-y-2">
              {mockUser.clubs.map((club) => (
                <li key={club.name} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${club.color}`}></span>
                  <span className="text-zinc-700 dark:text-zinc-100 text-sm">{club.name}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Achievements */}
          <div>
            <h3 className="text-lg font-bold text-zinc-700 dark:text-white mb-2 flex items-center gap-2"><Star size={18} />Achievements</h3>
            <ul className="space-y-2">
              {mockUser.achievements.map((ach, i) => (
                <li key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-100 text-sm">
                  {ach.icon}
                  {ach.label}
                </li>
              ))}
            </ul>
          </div>
          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-bold text-zinc-700 dark:text-white mb-2 flex items-center gap-2"><Calendar size={18} />Upcoming Events</h3>
            <ul className="space-y-2">
              {mockUser.upcomingEvents.map((event, i) => (
                <li key={i} className="flex flex-col gap-1 glass rounded-lg p-2">
                  <span className="font-semibold text-neon-blue text-sm">{event.title}</span>
                  <span className="text-xs text-zinc-400">{event.date} • {event.club}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Past Events */}
        <div className="p-8 pt-0">
          <h3 className="text-lg font-bold text-zinc-700 dark:text-white mb-2 flex items-center gap-2"><Calendar size={18} />Past Events</h3>
          <div className="flex flex-wrap gap-4">
            {mockUser.pastEvents.map((event, i) => (
              <div key={i} className="glass rounded-lg p-3 min-w-[180px]">
                <span className="font-semibold text-neon-purple text-sm">{event.title}</span>
                <div className="text-xs text-zinc-400">{event.date} • {event.club}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 pt-0">
          <Button variant="ghost" className="border-white/10 text-zinc-400 hover:text-white"><LogOut size={16} className="mr-2" />Logout</Button>
          <Button variant="neon" className="font-bold"><Sparkles size={16} className="mr-2" />Upgrade</Button>
        </div>
      </GlassCard>
    </div>
  );
}
