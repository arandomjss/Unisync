import GlassCard from "@/components/GlassCard";
import EventTable from "@/components/admin/EventTable";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Total Events</h2>
          <p className="text-3xl font-bold text-neon-blue">42</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Active Clubs</h2>
          <p className="text-3xl font-bold text-neon-purple">12</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Pending Approvals</h2>
          <p className="text-3xl font-bold text-neon-yellow">5</p>
        </GlassCard>
      </div>

      {/* Event Management Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Pending Events</h2>
        <EventTable className="glass-card" />
      </div>

      {/* Placeholder for Club Management */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Club Management</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Feature coming soon...</p>
      </div>

      {/* Placeholder for User Management */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">User Management</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Feature coming soon...</p>
      </div>
    </main>
  );
}