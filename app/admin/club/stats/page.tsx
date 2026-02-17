"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ClubStatsPage() {
  const [clubStats, setClubStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchClubStats = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("name, club_memberships:club_memberships (id), events:events (id)");

      if (error) {
        console.error("Error fetching club stats:", error);
      } else {
        setClubStats(
          data?.map((club) => ({
            name: club.name,
            events: club.events || [],
            members: club.club_memberships || [],
          })) || []
        );
      }
    };

    fetchClubStats();
  }, []);

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Club Statistics</h1>
      {clubStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubStats.map((club) => (
            <div key={club.name} className="p-6 glass-card">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{club.name}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Events: {club.events.length}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Members: {club.members.length}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">No club statistics available.</p>
      )}
    </main>
  );
}