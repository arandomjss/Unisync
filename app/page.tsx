import HeroCalendarMock from './HeroCalendarMock';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
      <div className="w-32 h-32 bg-red-500 mb-8" />
      <HeroCalendarMock />
    </main>
  );
}
