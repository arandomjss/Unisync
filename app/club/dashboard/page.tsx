"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import { cn } from "@/lib/utils";

export default function ClubDashboard() {
  const router = useRouter();
  const [clubStats, setClubStats] = useState({
    upcomingEvents: 0,
    totalMembers: 0,
    events: [],
  });
  const [clubMembers, setClubMembers] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
      }
    };

    const fetchClubData = async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) {
          router.push("/");
          return;
        }

        const { data: memberships, error: membershipsError } = await supabase
          .from("club_memberships")
          .select("club_id")
          .eq("user_id", user.id);

        if (membershipsError) {
          console.error("Error fetching memberships:", membershipsError);
          return;
        }

        const clubIds = memberships.map((membership) => membership.club_id);

        const { data: events, error: eventsError } = await supabase
          .from("events")
          .select("id, title, date, status, club_id")
          .in("club_id", clubIds);

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          return;
        }

        const { data: members, error: membersError } = await supabase
          .from("club_memberships")
          .select("id")
          .in("club_id", clubIds);

        if (membersError) {
          console.error("Error fetching members:", membersError);
          return;
        }

        const upcomingEvents = events.filter(
          (event) => new Date(event.date) >= new Date() && event.status !== "rejected"
        ).length;

        setClubStats({
          upcomingEvents,
          totalMembers: members.length,
          events,
        });
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    const fetchClubMembers = async () => {
      try {
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) {
          router.push("/");
          return;
        }

        const { data: memberships, error: membershipsError } = await supabase
          .from("club_memberships")
          .select("club_id")
          .eq("user_id", user.id);

        if (membershipsError) {
          console.error("Error fetching memberships:", membershipsError);
          return;
        }

        const clubIds = memberships.map((membership) => membership.club_id);

        const { data: members, error: membersError } = await supabase
          .from("club_memberships")
          .select("user_id, role")
          .in("club_id", clubIds);

        if (membersError) {
          console.error("Error fetching members:", membersError);
          return;
        }

        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, name, email")
          .in("id", members.map((member) => member.user_id));

        if (usersError) {
          console.error("Error fetching users:", usersError);
          return;
        }

        const membersWithRoles = users.map((user) => {
          const member = members.find((m) => m.user_id === user.id);
          return {
            ...user,
            role: member?.role || "member",
          };
        });

        setClubMembers(membersWithRoles);
      } catch (error) {
        console.error("Error fetching club members:", error);
      }
    };

    checkAuth();
    fetchClubData();
    fetchClubMembers();
  }, [router]);

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Club Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Upcoming Events</h2>
          <p className="text-3xl font-bold text-neon-blue">{clubStats.upcomingEvents}</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Total Members</h2>
          <p className="text-3xl font-bold text-neon-purple">{clubStats.totalMembers}</p>
        </GlassCard>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Your Events</h2>
        <div className="glass-card p-4 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Event Name</th>
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Date</th>
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {clubStats.events.map((event) => (
                <tr key={event.id} className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.title}</td>
                  <td className="py-2 px-4 text-zinc-800 dark:text-white">{event.date}</td>
                  <td className={cn("py-2 px-4",event.status === "approved" ? "text-green-500": event.status === "pending"? "text-yellow-500": "text-red-500")}>
                    {event.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Club Members</h2>
        <div className="glass-card p-4 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Name</th>
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Email</th>
                <th className="py-2 px-4 text-zinc-600 dark:text-zinc-400">Role</th>
              </tr>
            </thead>
            <tbody>
              {clubMembers.map((member) => (
                <tr key={member.id} className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="py-2 px-4 text-zinc-800 dark:text-white">{member.name}</td>
                  <td className="py-2 px-4 text-zinc-800 dark:text-white">{member.email}</td>
                  <td className="py-2 px-4 text-zinc-800 dark:text-white">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}