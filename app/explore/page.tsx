"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Heart, MessageCircle, Share2, MapPin, Calendar, Music, Code, Palette, Coffee, Clock, GaugeCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const categories = [
    { name: "All", icon: null },
    { name: "Music", icon: Music },
    { name: "Tech", icon: Code },
    { name: "Arts", icon: Palette },
    { name: "Social", icon: Coffee },
];

export default function ExplorePage() {
    const router = useRouter();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/");
            }
        };

        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from("events")
                .select("id, title, description, date, club_id, created_at, time, location, capacity, clubs(name)")
                .eq("status", "approved");

            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data);
            }
        };

        checkAuth();
        fetchEvents();
    }, [router]);

    return (
        <div className="container mx-auto px-4 pb-24 pt-24 md:pt-28 max-w-6xl bg-background">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-6">
                    Explore Campus
                </h1>

                {/* Category Filter */}
                <div className="flex gap-3 overflow-x-auto w-full pb-4 scrollbar-hide justify-start md:justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-neon-purple/50 transition-all whitespace-nowrap"
                        >
                            {cat.icon && <cat.icon size={14} className="text-neon-blue" />}
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.3, delay: i * 0.01 }}
                        className="group glass-card rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-card dark:bg-card hover:shadow-lg hover:shadow-neon-blue/50 transition-transform transform hover:scale-105"
                    >
                        {/* Image Header */}
                        <div className="relative h-64 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-500 dark:text-zinc-400">No Image</span>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-white/80 dark:bg-zinc-900/80">
                            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} className="text-neon-pink" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-neon-green" />
                                    {event.location || "Location not specified"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} className="text-neon-blue" />
                                    {event.time || "Time not specified"}
                                </div>
                                <div className="flex items-center gap-1">
                                    <GaugeCircle size={16} className="text-neon-pink" />
                                    {event.capacity ? `${event.capacity} seats` : "Capacity not specified"}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-zinc-800 dark:text-white mb-2">
                                {event.title}
                            </h2>

                            {/* Club Tag */}
                            {event.clubs?.name && (
                                <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-neon-purple rounded-full mb-4">
                                    {event.clubs.name}
                                </span>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-4">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-neon-pink transition-colors">
                                        <Heart size={20} />
                                    </button>
                                    <button className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <MessageCircle size={20} />
                                    </button>
                                    <button className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <Button size="sm" variant="neon" className="rounded-full px-6 h-9">
                                    Get Tickets
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Loading / End of Feed */}
                {events.length === 0 && (
                    <div className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-neon-blue motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
