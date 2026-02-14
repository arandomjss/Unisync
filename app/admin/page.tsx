"use client";

import GlassCard from "@/components/GlassCard";
import EventTable from "@/components/admin/EventTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeClubs: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
      }
    };

    const fetchStats = async () => {
      const [{ data: events }, { data: clubs }, { data: pendingEvents }] = await Promise.all([
        supabase.from("events").select("id"),
        supabase.from("clubs").select("id"),
        supabase.from("events").select("id").eq("status", "pending"),
      ]);

      setStats({
        totalEvents: events?.length || 0,
        activeClubs: clubs?.length || 0,
        pendingApprovals: pendingEvents?.length || 0,
      });
    };

    checkAuth();
    fetchStats();
  }, [router]);

  const handleAddClub = () => {
    router.push("/admin/club/add");
  };

  const handleManageClubs = () => {
    router.push("/admin/club/manage");
  };

  const handleViewStats = () => {
    router.push("/admin/club/stats");
  };

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Total Events</h2>
          <p className="text-3xl font-bold text-neon-blue">{stats.totalEvents}</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Active Clubs</h2>
          <p className="text-3xl font-bold text-neon-purple">{stats.activeClubs}</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Pending Approvals</h2>
          <p className="text-3xl font-bold text-neon-yellow">{stats.pendingApprovals}</p>
        </GlassCard>
      </div>

      {/* Event Management Section */}
      {stats.pendingApprovals > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Pending Events</h2>
          <EventTable className="glass-card" />
        </div>
      )}

      {/* Club Management Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Club Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 glass-card">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Add New Club</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Create and manage new clubs for the platform.</p>
            <Button
              onClick={handleAddClub}
              className="mt-4 bg-neon-blue text-white px-4 py-2 rounded-lg hover:bg-neon-blue-dark transition-all"
            >
              Add Club
            </Button>
          </GlassCard>
          <GlassCard className="p-6 glass-card">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">View All Clubs</h3>
            <p className="text-zinc-600 dark:text-zinc-400">View and manage all existing clubs, including their details and members.</p>
            <Button
              onClick={handleManageClubs}
              className="mt-4 bg-neon-purple text-white px-4 py-2 rounded-lg hover:bg-neon-purple-dark transition-all"
            >
              Manage Clubs
            </Button>
          </GlassCard>
          <GlassCard className="p-6 glass-card">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">Club Statistics</h3>
            <p className="text-zinc-600 dark:text-zinc-400">View detailed statistics about club activities and memberships.</p>
            <Button
              onClick={handleViewStats}
              className="mt-4 bg-neon-green text-white px-4 py-2 rounded-lg hover:bg-neon-green-dark transition-all"
            >
              View Stats
            </Button>
          </GlassCard>
        </div>
      </div>

      {/* Placeholder for User Management */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">User Management</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Feature coming soon...</p>
      </div>
    </main>
  );
}