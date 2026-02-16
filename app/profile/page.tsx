"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, User, Edit2, LogOut, Star, Calendar, Users, Mail, ShieldCheck, BadgeCheck, Clock, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getClubColor, getClubIcon, getClubTextColor } from "@/components/club/ClubUtils";
import { useClubData } from "@/components/club/ClubUtils";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("No bio available.");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const clubData = useClubData();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        window.location.href = "/";
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          clubs:club_memberships (
            role,
            club:clubs (*)
          ),
          achievements (*),
          events:event_participants (
            event:events!event_id_fkey (*)
          )
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
      setEditMode(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  // Filter events
  const now = new Date();
  const allEvents = user.events?.map((e: any) => e.event).filter(Boolean) || [];
  const upcomingEvents = allEvents.filter((e: any) => new Date(e.date) >= now).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = allEvents.filter((e: any) => new Date(e.date) < now).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 mt-20">
      <GlassCard className="w-full max-w-5xl mx-auto p-0 overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-xl">

        {/* Header Section */}
        <div className="relative bg-zinc-100/50 dark:bg-zinc-900/50 p-8 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 text-4xl shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left w-full">
              <div className="flex items-center justify-center md:justify-between gap-4">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  {user.name}
                  {!editMode && (
                    <Button size="icon" variant="ghost" onClick={() => setEditMode(true)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                      <Edit2 size={16} />
                    </Button>
                  )}
                </h2>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
              </div>

              {editMode ? (
                <div className="space-y-3 bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-zinc-200 dark:border-white/10">
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    placeholder="Display Name"
                  />
                  <Input
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    placeholder="Bio"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setEditMode(false)} className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10">Cancel</Button>
                    <Button variant="neon" size="sm" onClick={updateProfile}>Save</Button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">{bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-white/10 px-8 bg-white/30 dark:bg-zinc-900/30">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upcoming'
              ? 'border-neon-blue text-neon-blue'
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
              }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'past'
              ? 'border-neon-purple text-neon-purple'
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
              }`}
          >
            Past Events ({pastEvents.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 min-h-[400px] bg-white/30 dark:bg-zinc-900/30">
          {/* Main Content (Events) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className={activeTab === 'upcoming' ? "text-neon-blue" : "text-neon-purple"} size={20} />
              <h3 className="text-xl font-bold text-zinc-800 dark:text-white capitalize">{activeTab} Events</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length > 0 ? (
                (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event: any) => (
                  <GlassCard key={event.id} className="p-0 overflow-hidden group hover:bg-white/50 dark:hover:bg-white/5 transition-colors border border-zinc-200 dark:border-white/5 shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image Placeholder / Date Box */}
                      <div className={`sm:w-32 h-32 sm:h-auto flex flex-col items-center justify-center p-4 ${activeTab === 'upcoming' ? 'bg-neon-blue/10 text-neon-blue' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}>
                        <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                        <span className="text-xs uppercase font-bold">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-neon-blue transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                          <span className="flex items-center gap-1"><Clock size={12} /> {event.time || "TBA"}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {event.location || "TBA"}</span>
                        </div>
                        {/* Get Club Name safely if available, or just ID */}
                        {/* Note: We would need to join club data in the query to show club name here properly if not in event */}
                        <div className="flex justify-between items-center mt-auto">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${activeTab === 'upcoming' ? 'border-neon-blue/30 text-neon-blue bg-neon-blue/5' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                            }`}>
                            {activeTab === 'upcoming' ? 'Registered' : 'Attended'}
                          </span>
                          <Button size="sm" variant="ghost" className="text-xs h-8 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" onClick={() => router.push(`/events/${event.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5 border-dashed">
                  <Calendar size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No {activeTab} events found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Clubs & Achievements) */}
          <div className="space-y-8">
            {/* Clubs Widget */}
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
                <Users size={18} className="text-neon-green" /> My Clubs
              </h3>
              <div className="space-y-2">
                {user.clubs?.length > 0 ? user.clubs.map((membership: any) => (
                  <div key={membership.club.id}
                    onClick={() => router.push(`/clubs/${membership.club.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 cursor-pointer transition-colors border border-zinc-200 dark:border-white/5"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getClubColor(clubData, membership.club.id)} bg-opacity-20`}>
                      {/* Icon placeholder if needed, or just color */}
                      <div className={`w-3 h-3 rounded-full bg-current`}></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-900 dark:text-white">{membership.club.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{membership.role}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-zinc-500">Not a member of any clubs.</p>
                )}
              </div>
            </div>

            {/* Achievements Widget */}
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2">
                <BadgeCheck size={18} className="text-yellow-500" /> Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.achievements?.length > 0 ? user.achievements.map((ach: any, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> {ach.label}
                  </span>
                )) : (
                  <p className="text-sm text-zinc-500 italic">No achievements yet.</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-white/10">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
