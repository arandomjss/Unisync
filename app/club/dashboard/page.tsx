"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Check, X, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  status: string;
  club_id: string;
  registration_count?: number;
}

interface MemberRequest {
  id: string; // membership id
  user_id: string;
  club_id: string;
  users: {
    name: string;
    email: string;
  };
}

export default function ClubDashboard() {
  const router = useRouter();
  const [clubStats, setClubStats] = useState({
    upcomingEvents: 0,
    totalMembers: 0,
    totalRegistrations: 0,
    pendingRequests: 0,
    events: [] as ClubEvent[],
  });
  const [requests, setRequests] = useState<MemberRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // 1. Get clubs where user is admin
      const { data: memberships, error: membershipsError } = await supabase
        .from("club_memberships")
        .select("club_id")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (membershipsError || !memberships) {
        console.error("Error fetching memberships:", membershipsError);
        return;
      }

      const clubIds = memberships.map((m) => m.club_id);

      if (clubIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch Events & Registration Counts
      // 2. Fetch Events
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, title, date, status, club_id")
        .in("club_id", clubIds)
        .order('date', { ascending: true });

      if (eventsError) {
        console.error("Error fetching events:", JSON.stringify(eventsError, null, 2));
      }

      // 2.1 Fetch Registration Counts separately if events exist
      let processedEvents: ClubEvent[] = [];
      if (events && events.length > 0) {
        const eventIds = events.map(e => e.id);

        // Using a raw count query or grouping by event_id manually
        const { data: participants, error: partError } = await supabase
          .from("event_participants")
          .select("event_id")
          .in("event_id", eventIds);

        if (partError) console.error("Error fetching participants:", partError);

        // Count participants per event locally
        const counts: Record<string, number> = {};
        participants?.forEach((p) => {
          counts[p.event_id] = (counts[p.event_id] || 0) + 1;
        });

        processedEvents = events.map((e) => ({
          ...e,
          registration_count: counts[e.id] || 0,
        }));
      } else {
        processedEvents = [];
      }

      // 3. Fetch Total Members Count
      const { count: membersCount, error: membersError } = await supabase
        .from("club_memberships")
        .select("*", { count: 'exact', head: true })
        .in("club_id", clubIds)
        .eq("status", "approved");

      if (membersError) console.error("Error fetching members count:", membersError);

      // 4. Fetch Pending Membership Requests
      const { data: pendingRequests, error: requestsError } = await supabase
        .from("club_memberships")
        .select(`
          id, user_id, club_id,
          users (name, email)
        `)
        .in("club_id", clubIds)
        .eq("status", "pending");

      if (requestsError) console.error("Error fetching requests:", requestsError);

      // Calculations
      const upcoming = processedEvents.filter(
        (e) => new Date(e.date) >= new Date() && e.status !== "rejected"
      );
      const totalRegistrations = processedEvents.reduce((sum, e) => sum + (e.registration_count || 0), 0);

      setClubStats({
        upcomingEvents: upcoming.length,
        totalMembers: membersCount || 0,
        totalRegistrations,
        pendingRequests: pendingRequests?.length || 0,
        events: upcoming.slice(0, 5), // Show top 5 upcoming
      });
      setRequests((pendingRequests as any[]) || []);
      setLoading(false);
    } catch (error) {
      console.error("Error in dashboard data fetch:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleMembershipAction = async (membershipId: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from("club_memberships")
      .update({ status: action })
      .eq("id", membershipId);

    if (error) {
      console.error(`Error ${action} membership:`, error);
      alert(`Failed to ${action} request`);
    } else {
      // Refresh data
      fetchDashboardData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-neon-blue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 pb-20 pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
            Club Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your club, approve members, and track events.</p>
        </header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <GlassCard className="p-6 flex flex-col items-start gap-4">
            <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Upcoming Events</h2>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{clubStats.upcomingEvents}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-start gap-4">
            <div className="p-3 rounded-xl bg-neon-purple/10 text-neon-purple">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Members</h2>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{clubStats.totalMembers}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-start gap-4">
            <div className="p-3 rounded-xl bg-neon-green/10 text-neon-green">
              <Check size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Registrations</h2>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{clubStats.totalRegistrations}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Requests</h2>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{clubStats.pendingRequests}</p>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Membership Requests */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
              <Users className="text-neon-blue" size={24} />
              Membership Requests
            </h2>

            {requests.length === 0 ? (
              <GlassCard className="p-8 text-center text-zinc-500">
                <p>No pending membership requests.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <GlassCard
                    key={req.id}
                    className="p-4 flex flex-col md:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                        {req.users.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">{req.users.name}</h3>
                        <p className="text-sm text-zinc-500">{req.users.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button
                        onClick={() => handleMembershipAction(req.id, 'approved')}
                        size="sm"
                        className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check size={16} className="mr-1" /> Approve
                      </Button>
                      <Button
                        onClick={() => handleMembershipAction(req.id, 'rejected')}
                        size="sm"
                        className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
              <Calendar className="text-neon-purple" size={24} />
              Upcoming Events
            </h2>

            {clubStats.events.length === 0 ? (
              <GlassCard className="p-8 text-center text-zinc-500">
                <p>No upcoming events.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {clubStats.events.map((event) => (
                  <div key={event.id} onClick={() => router.push(`/club/events`)}>
                    <GlassCard className="p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-1">{event.title}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                          event.status === 'approved' ? 'border-green-500/50 text-green-500' :
                            event.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' :
                              'border-red-500/50 text-red-500'
                        )}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {event.registration_count} reg.
                        </span>
                      </div>
                    </GlassCard>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-neon-blue" onClick={() => router.push('/club/events')}>
                  View All Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}