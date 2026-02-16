"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import EventSubmissionForm from "@/components/club/EventSubmissionForm";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Plus, Calendar, MapPin, Users, Clock, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  club_id: string;
  registration_count?: number;
  capacity?: number;
}

export default function ClubEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'pending' | 'all'>('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // 1. Get clubs
      const { data: memberships } = await supabase
        .from("club_memberships")
        .select("club_id")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!memberships || memberships.length === 0) {
        setLoading(false);
        return;
      }

      const clubIds = memberships.map((m) => m.club_id);

      // 2. Fetch Events
      // 2. Fetch Events
      const { data: eventsData, error } = await supabase
        .from("events")
        .select("id, title, date, time, location, status, club_id, capacity")
        .in("club_id", clubIds)
        .order('date', { ascending: false }); // Newest first

      if (error) {
        console.error("Error fetching events:", JSON.stringify(error, null, 2));
      } else {
        let processed: ClubEvent[] = [];
        if (eventsData && eventsData.length > 0) {
          const eventIds = eventsData.map(e => e.id);
          const { data: participants, error: partError } = await supabase
            .from("event_participants")
            .select("event_id")
            .in("event_id", eventIds);

          if (partError) console.error("Error fetching participants:", partError);

          const counts: Record<string, number> = {};
          participants?.forEach((p) => {
            counts[p.event_id] = (counts[p.event_id] || 0) + 1;
          });

          processed = eventsData.map((e) => ({
            ...e,
            registration_count: counts[e.id] || 0,
          }));
        }
        setEvents(processed);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [router]);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'upcoming') return eventDate >= today && event.status !== 'rejected';
    if (activeTab === 'past') return eventDate < today;
    if (activeTab === 'pending') return event.status === 'pending';
    return true; // all
  });

  return (
    <main className="min-h-screen bg-background p-6 pb-20 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
              Your Events
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">Create and manage your club's events.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="neon" className="gap-2">
            <Plus size={18} /> Create Event
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {['upcoming', 'past', 'pending', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap",
                activeTab === tab
                  ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <GlassCard className="p-12 text-center flex flex-col items-center justify-center text-zinc-500 min-h-[300px]">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p className="text-lg">No {activeTab} events found.</p>
            {activeTab === 'upcoming' && (
              <Button variant="ghost" className="mt-4 text-neon-blue" onClick={() => setIsModalOpen(true)}>
                Create your first event
              </Button>
            )}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/club/events/${event.id}`)}
                className="cursor-pointer"
              >
                <GlassCard className="h-full flex flex-col p-0 overflow-hidden group hover:bg-white/5 transition-colors">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                        event.status === 'approved' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                          event.status === 'pending' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                            'border-red-500/30 text-red-500 bg-red-500/5'
                      )}>
                        {event.status}
                      </span>
                      {/* Placeholder for edit action */}
                      <button className="text-zinc-400 hover:text-white transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1" title={event.title}>
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-neon-blue" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-neon-purple" />
                        {event.time || "TBA"}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-neon-green" />
                        {event.location || "Location TBA"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-black/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users size={16} className="text-zinc-400" />
                      <span className="text-zinc-600 dark:text-white">{event.registration_count}</span>
                      <span className="text-zinc-400 dark:text-zinc-500">/ {event.capacity || "∞"}</span>
                    </div>
                    {/* View Details Link could go here */}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Event"
        >
          <EventSubmissionForm
            onSuccess={() => {
              setIsModalOpen(false);
              fetchEvents();
            }}
          />
        </Modal>
      </div>
    </main>
  );
}