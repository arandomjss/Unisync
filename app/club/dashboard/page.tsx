import GlassCard from "@/components/GlassCard";

export default function ClubDashboard() {
  return (
    <main className="min-h-screen bg-background p-6 pt-24">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Club Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Upcoming Events</h2>
          <p className="text-3xl font-bold text-neon-blue">3</p>
        </GlassCard>
        <GlassCard className="p-6 glass-card">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Total Members</h2>
          <p className="text-3xl font-bold text-neon-purple">25</p>
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
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <td className="py-2 px-4 text-zinc-800 dark:text-white">Tech Talk</td>
                <td className="py-2 px-4 text-zinc-800 dark:text-white">2026-02-10</td>
                <td className="py-2 px-4 text-yellow-500">Pending</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-zinc-800 dark:text-white">Spring Fest</td>
                <td className="py-2 px-4 text-zinc-800 dark:text-white">2026-03-05</td>
                <td className="py-2 px-4 text-green-500">Approved</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}