"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AddClubPage() {
  const router = useRouter();
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Error fetching admin ID or no session found:", error);
        alert("You must be logged in to add a club.");
        router.push("/");
      } else {
        setAdminId(session.user.id);
      }
    };

    fetchAdminId();
  }, [router]);

  const handleAddClub = async () => {
    setLoading(true);
    const { error } = await supabase.from("clubs").insert([
      {
        name: clubName,
        description: description,
        created_by: adminId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error adding club:", error);
      alert("Failed to add club. Please try again.");
    } else {
      alert("Club added successfully!");
      router.push("/admin");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">
        Add New Club
      </h1>
      <div className="max-w-lg mx-auto">
        <label className="block text-zinc-800 dark:text-white mb-2">
          Club Name
        </label>
        <input
          type="text"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full p-3 border border-zinc-300 rounded-lg mb-4"
          placeholder="Enter club name"
        />

        <label className="block text-zinc-800 dark:text-white mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-zinc-300 rounded-lg mb-4"
          placeholder="Enter club description"
        ></textarea>

        <Button
          onClick={handleAddClub}
          disabled={loading || !clubName || !description}
          className="bg-neon-blue text-white px-4 py-2 rounded-lg hover:bg-neon-blue-dark transition-all"
        >
          {loading ? "Adding..." : "Add Club"}
        </Button>
      </div>
    </main>
  );
}