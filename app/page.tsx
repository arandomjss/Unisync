import GlassCard from '../components/GlassCard';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <GlassCard>
        <h1 className="text-3xl font-bold mb-2">Hello, UniSync! 👋</h1>
        <p className="text-zinc-300">This is a glassmorphic card. Try hovering me!</p>
      </GlassCard>
    </div>
  );
}
