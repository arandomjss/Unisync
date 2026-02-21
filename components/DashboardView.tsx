"use client";

import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Users, Heart, ArrowUpRight, Play, Ticket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- Components ---

const BentoGrid = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]", className)}>
            {children}
        </div>
    );
};

const BentoItem = ({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay }}
            className={cn(
                "glass-card rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-neon-blue/10",
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
                rowSpan === 2 && "md:row-span-2",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

// --- Data Fetching Helpers ---

async function fetchUserName() {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        return "Guest";
    }

    const userId = session.user.id;

    const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user name:', error);
        return "Guest";
    }

    return data.name || "Guest";
}

async function fetchEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5); // Fetch 5 events: 1 hero, 1 recommended, 3 up next

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }

    return data;
}

// --- Main Component ---

async function fetchUserStats(userId: string) {
    // 1. Get clubs joined
    const { count: clubsCount, error: clubsError } = await supabase
        .from('club_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved');

    if (clubsError) console.error('Error fetching clubs count:', clubsError);

    // 2. Get events registered
    const { count: eventsCount, error: eventsError } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (eventsError) console.error('Error fetching events count:', eventsError);

    return {
        clubs: clubsCount || 0,
        events: eventsCount || 0
    };
}

export default function DashboardView() {
    const router = useRouter();
    const [userName, setUserName] = useState("Guest");
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState({ clubs: 0, events: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const name = await fetchUserName();
                setUserName(name);
                const statsData = await fetchUserStats(session.user.id);
                setStats(statsData);
            }
            const eventsData = await fetchEvents();
            setEvents(eventsData || []);
            setLoading(false);
        };
        loadData();
    }, []);

    // Distribute events
    const heroEvent = events.length > 0 ? events[0] : null;
    const recommendedEvent = events.length > 1 ? events[1] : null;
    const upNextEvents = events.length > 2 ? events.slice(2, 5) : [];

    return (
        <div className="container mx-auto px-4 pb-24 pt-24 md:pt-28">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                        Good Evening, <span className="text-gradient">{userName}</span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Ready for tonight's campus vibe?</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="neon" className="rounded-full">
                        <Ticket size={16} className="mr-2" />
                        My Tickets
                    </Button>
                </div>
            </div>

            <BentoGrid>
                {/* HERO / FEATURED EVENT - Large Card */}
                <BentoItem colSpan={2} rowSpan={2} delay={0.1} className="bg-gradient-to-br from-neon-blue/20 to-zinc-900 border-neon-blue/50">
                    {heroEvent ? (
                        <>
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-blue"></span>
                                </span>
                                <span className="text-neon-blue font-bold tracking-wider text-xs uppercase">Featured</span>
                            </div>

                            {heroEvent.image_url ? (
                                <div className="absolute inset-0">
                                    <img
                                        src={heroEvent.image_url}
                                        alt={heroEvent.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-[url('/images/neutral-placeholder.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                </>
                            )}

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                <h2 className="text-3xl font-bold text-white mb-2">{heroEvent.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-zinc-300 text-sm mb-4">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1 text-neon-blue" /> {heroEvent.location || "Location TBA"}</span>
                                    <span className="flex items-center"><Users size={14} className="mr-1 text-neon-pink" /> 100+ attending</span>
                                </div>
                                <Button className="w-full md:w-auto rounded-full bg-white text-black hover:bg-zinc-200" onClick={() => router.push(`/events/${heroEvent.id}`)}>
                                    View Details <ArrowUpRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <p>No featured events currently.</p>
                        </div>
                    )}
                </BentoItem>

                {/* FOR YOU - Recommendation */}
                <BentoItem delay={0.2} className="bg-gradient-to-br from-neon-green/10 to-zinc-900/50 dark:to-zinc-900 bg-white/50 dark:bg-black/20">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-lg text-zinc-900 dark:text-white">
                            For You <Sparkles size={16} className="text-amber-500 dark:text-neon-yellow" />
                        </CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-zinc-400">Campus pick</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recommendedEvent ? (
                            <>
                                <div className="mt-2">
                                    <h3 className="font-bold text-zinc-900 dark:text-white text-xl line-clamp-1">{recommendedEvent.title}</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                                        {new Date(recommendedEvent.date).toLocaleDateString(undefined, { weekday: 'long', hour: 'numeric', minute: '2-digit' })}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full text-zinc-600 dark:text-zinc-300">Trending</span>
                                        <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full text-zinc-600 dark:text-zinc-300">Event</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="w-full mt-4 justify-between group/btn text-zinc-600 dark:text-white hover:bg-black/5 dark:hover:bg-white/10" onClick={() => router.push(`/events/${recommendedEvent.id}`)}>
                                    View Details <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Button>
                            </>
                        ) : (
                            <div className="py-4 text-center text-zinc-500 text-sm">
                                Check back later for recommendations.
                            </div>
                        )}
                    </CardContent>
                </BentoItem>

                {/* UPCOMING - List */}
                <BentoItem rowSpan={2} delay={0.3} className="md:col-start-3 md:row-start-2 bg-white/50 dark:bg-black/20">
                    <CardHeader>
                        <CardTitle className="text-lg text-zinc-900 dark:text-white">Up Next</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upNextEvents.length > 0 ? (
                            upNextEvents.map((event) => (
                                <div key={event.id} onClick={() => router.push(`/events/${event.id}`)} className={`flex flex-col p-3 bg-white/60 dark:bg-white/5 rounded-lg border-l-2 border-l-neon-blue hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer`}>
                                    <span className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{event.title}</span>
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between mt-1">
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                                        <span className="truncate max-w-[80px]">{event.location || "TBA"}</span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-500 text-sm">
                                No more upcoming events.
                            </div>
                        )}
                        <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white" onClick={() => router.push('/events')}>
                            View Full Calendar
                        </Button>
                    </CardContent>
                </BentoItem>

                {/* STATS / QUICK ACTION */}
                <BentoItem delay={0.4} className="bg-gradient-to-br from-pink-500/10 dark:from-neon-pink/10 to-transparent flex flex-col justify-center items-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-linear-to-tr from-pink-500 to-orange-500 dark:from-neon-pink dark:to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-pink-500/20 dark:shadow-neon-pink/20">
                        <Heart size={32} className="text-white fill-white animate-pulse" />
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div className="text-center">
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats.clubs}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Clubs</p>
                        </div>
                        <div className="w-px bg-zinc-200 dark:bg-white/10 h-8 self-center"></div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stats.events}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Events</p>
                        </div>
                    </div>
                </BentoItem>

            </BentoGrid>
        </div>
    );
}
