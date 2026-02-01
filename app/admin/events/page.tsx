import EventTable from "@/components/admin/EventTable";

export default function AdminEvents() {
  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Manage Events</h1>
      <EventTable className="glass-card" />
    </main>
  );
}