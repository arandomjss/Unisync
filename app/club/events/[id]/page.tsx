"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventParticipant {
    user_id: string;
    joined_at: string;
    users: {
        name: string;
        email: string;
    };
}

export default function EventAdminDetails() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [participants, setParticipants] = useState<EventParticipant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/");
                    return;
                }

                // 1. Fetch Event Details
                const { data: eventData, error: eventError } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (eventError) throw eventError;
                setEvent(eventData);

                // 2. Fetch Participants
                const { data: partsData, error: partsError } = await supabase
                    .from("event_participants")
                    .select(`
            user_id, joined_at,
            users (name, email)
          `)
                    .eq("event_id", id);

                if (partsError) throw partsError;
                setParticipants(partsData as any[] || []);

            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background text-neon-blue">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background">
                <p className="text-zinc-500">Event not found.</p>
                <Button onClick={() => router.back()} variant="ghost" className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background p-6 pb-20 pt-24 md:pt-28">
            <div className="max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 hover:bg-white/5 text-zinc-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard className="p-6">
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border mb-4 inline-block capitalize",
                                event.status === 'approved' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                                    event.status === 'pending' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                                        'border-red-500/30 text-red-500 bg-red-500/5'
                            )}>
                                {event.status}
                            </span>

                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{event.title}</h1>

                            <div className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-neon-blue" />
                                    <div>
                                        <p className="text-xs opacity-70">Date</p>
                                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-neon-purple" />
                                    <div>
                                        <p className="text-xs opacity-70">Time</p>
                                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {event.time || "TBA"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={16} className="text-neon-green" />
                                    <div>
                                        <p className="text-xs opacity-70">Location</p>
                                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {event.location || "TBA"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users size={16} className="text-orange-500" />
                                    <div>
                                        <p className="text-xs opacity-70">Capacity</p>
                                        <p className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {participants.length} / {event.capacity || "∞"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Participants List */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                                Registered Participants
                            </h2>
                            <span className="text-zinc-500 text-sm">{participants.length} registered</span>
                        </div>

                        {participants.length === 0 ? (
                            <GlassCard className="p-12 text-center text-zinc-500">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No participants registered yet.</p>
                            </GlassCard>
                        ) : (
                            <div className="space-y-3">
                                {participants.map((p) => (
                                    <GlassCard key={p.user_id} className="p-4 flex items-center justify-between group hover:bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                                {p.users.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-zinc-900 dark:text-white">{p.users.name}</h4>
                                                <p className="text-xs text-zinc-500">{p.users.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-500">Registered</p>
                                            <p className="text-xs font-medium text-zinc-400">
                                                {new Date(p.joined_at || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
