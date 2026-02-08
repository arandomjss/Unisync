"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Heart, MessageCircle, Share2, MapPin, Calendar, Music, Code, Palette, Coffee } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const categories = [
    { name: "All", icon: null },
    { name: "Music", icon: Music },
    { name: "Tech", icon: Code },
    { name: "Arts", icon: Palette },
    { name: "Social", icon: Coffee },
];

const mockEvents = [
    {
        id: 1,
        title: "Neon Nights: Rooftop Party",
        organizer: "Student Union",
        image: "/images/placeholder.jpg",
        date: "Tonight, 9:00 PM",
        location: "Union Roof",
        likes: 342,
        tags: ["Party", "Music", "Social"]
    },
    {
        id: 2,
        title: "Inter-Uni Hackathon 2026",
        organizer: "CS Society",
        image: "/images/placeholder.jpg",
        date: "Tomorrow, 10:00 AM",
        location: "Engineering Hall",
        likes: 856,
        tags: ["Coding", "Tech", "Pizza"]
    },
    {
        id: 3,
        title: "Abstract Art Exhibition",
        organizer: "Fine Arts Club",
        image: "/images/placeholder.jpg",
        date: "Fri, 5:00 PM",
        location: "Gallery A",
        likes: 120,
        tags: ["Art", "Culture"]
    }
];

export default function ExplorePage() {
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
        <div className="container mx-auto px-4 pb-24 pt-24 md:pt-28 max-w-2xl">
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
            <div className="flex flex-col gap-8">
                {mockEvents.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group glass-card rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900"
                    >
                        {/* Image Header */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div>
                                    <span className="text-xs font-bold text-neon-blue uppercase tracking-wider mb-1 block">
                                        @{event.organizer}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white leading-tight">
                                        {event.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 text-sm mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} className="text-neon-pink" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-neon-green" />
                                    {event.location}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {event.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-4">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-neon-pink transition-colors">
                                        <Heart size={20} />
                                        <span className="text-xs font-medium">{event.likes}</span>
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
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-neon-blue motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
