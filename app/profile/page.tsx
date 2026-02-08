"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, User, Edit2, LogOut, Star, Calendar, Users, Mail, ShieldCheck, BadgeCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("No bio available.");
  const [name, setName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("User is not logged in. Redirecting to landing page.");
        window.location.href = "/"; // Redirect to landing page
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }

      const userId = session?.user?.id;

      if (!userId) {
        console.error("No user is logged in.");
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          clubs:club_memberships (
            role,
            club:clubs (*)
          ),
          achievements (*),
          upcomingEvents:event_participants (event:events!event_id_fkey (*)),
          pastEvents:event_participants (event:events!event_id_fkey (*))
        `)
        .eq('id', userId);

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        if (data && data.length > 0) {
          setUser(data[0]);
          setBio(data[0].bio || "No bio available.");
          setName(data[0].name || "New User");
        }
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update({ name, bio })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log('Profile updated successfully');
      setEditMode(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error);
    } else {
      console.log('User logged out successfully');
      window.location.href = '/'; // Redirect to the landing page
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-2 mt-24">
        <GlassCard className="w-full max-w-4xl mx-auto p-0 overflow-visible glass-card text-zinc-800 dark:text-zinc-300">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-zinc-700 dark:text-white">
              Welcome to UniSync!
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4">
              It looks like your profile is not set up yet. Please complete your profile to get started.
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

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
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                {user.name}
              </h2>
              <Button size="icon" variant="ghost" onClick={() => setEditMode((v) => !v)}>
                <Edit2 size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-zinc-400 text-sm">
              <span className="flex items-center gap-1"><Mail size={16} /> {user.email}</span>
              <span className="flex items-center gap-1"><User size={16} /> {user.role}</span>
            </div>
            {editMode ? (
              <>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-lg p-2 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Enter your name"
                  maxLength={50}
                />
                <Input
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="mt-2 bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white rounded-lg p-2 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Enter your bio"
                  maxLength={120}
                />
                <Button onClick={updateProfile} className="mt-4 bg-neon-blue text-white px-4 py-2 rounded-lg hover:bg-neon-blue-dark transition-all">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">{bio}</p>
              </>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {user.interests?.map((interest) => (
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
              {user.clubs?.map(({ club, role }) => (
                <li key={club.id} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-gray-500`}></span> {/* Placeholder color */}
                  <span className="text-zinc-700 dark:text-zinc-100 text-sm">
                    {club.name} ({role})
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Achievements */}
          <div>
            <h3 className="text-lg font-bold text-zinc-700 dark:text-white mb-2 flex items-center gap-2"><Star size={18} />Achievements</h3>
            <ul className="space-y-2">
              {user.achievements?.map((ach, i) => (
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
              {user.upcomingEvents?.map((event, i) => (
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
            {user.pastEvents?.map((event, i) => (
              <div key={i} className="glass rounded-lg p-3 min-w-[180px]">
                <span className="font-semibold text-neon-purple text-sm">{event.title}</span>
                <div className="text-xs text-zinc-400">{event.date} • {event.club}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 pt-0">
          <Button variant="ghost" className="border-white/10 text-zinc-400 hover:text-white" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />Logout
          </Button>
          <Button variant="neon" className="font-bold"><Sparkles size={16} className="mr-2" />Upgrade</Button>
        </div>
      </GlassCard>
    </div>
  );
}
