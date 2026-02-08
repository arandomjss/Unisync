import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import EventSubmissionForm from "@/components/club/EventSubmissionForm";

export default function ClubEvents() {
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
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Your Events</h1>
      <EventSubmissionForm className="glass-card" />
    </main>
  );
}