"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, Clock, GaugeCircle, ArrowLeft, Share2, Heart, UserPlus, Check, X } from "lucide-react";
import Image from "next/image";
import { useClubData } from "@/components/club/ClubUtils";

export default function EventDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const clubData = useClubData();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Registration state
    const [isRegistered, setIsRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                // router.push("/"); // Don't redirect immediately to allow public view? Or keep as is.
                // Keeping original logic:
                router.push("/");
                return;
            }
            setUserId(session.user.id);
        };

        const fetchEvent = async () => {
            if (!id) return;

            setLoading(true);
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching event:", error);
            } else {
                setEvent(data);
            }
            setLoading(false);
        };

        checkAuth();
        fetchEvent();
    }, [id, router]);

    // Fetch membership status
    useEffect(() => {
        const fetchMembership = async () => {
            if (!event || !userId) return;

            const { data, error } = await supabase
                .from("club_memberships")
                .select("status")
                .eq("club_id", event.club_id)
                .eq("user_id", userId)
                .maybeSingle();

            if (data) setMembershipStatus(data.status);
        };

        fetchMembership();
    }, [event, userId]);

    const handleJoinClub = async () => {
        if (!event || !userId) return;

        const { error } = await supabase.from("club_memberships").insert([
            {
                club_id: event.club_id,
                user_id: userId,
                role: "member",
                status: "pending",
            },
        ]);

        if (error) {
            console.error("Error joining club:", error);
            alert("Failed to send join request.");
        } else {
            setMembershipStatus("pending");
        }
    };

    useEffect(() => {
        const fetchRegistrationStatus = async () => {
            if (!id || !userId) return;

            const { data, error } = await supabase
                .from("event_participants")
                .select("*")
                .eq("event_id", id)
                .eq("event_id", id)
                .eq("user_id", userId)
                .maybeSingle();

            if (data) setIsRegistered(true);
        };
        fetchRegistrationStatus();
    }, [id, userId]);

    const handleGetTickets = async () => {
        if (!userId) {
            router.push("/");
            return;
        }
        if (!id) {
            console.error("Event ID is missing");
            return;
        }

        setRegistering(true);

        const { error } = await supabase
            .from("event_participants")
            .insert([{
                event_id: id,
                user_id: userId
            }]);

        if (error) {
            console.error("Error registering:", error);
            alert("Failed to register for event.");
        } else {
            setIsRegistered(true);
            alert("Successfully registered!");
        }
        setRegistering(false);
    };

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
                <h1 className="text-2xl font-bold text-zinc-400 mb-4">Event not found</h1>
                <Button onClick={() => router.back()} variant="ghost">
                    Go Back
                </Button>
            </div>
        );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const club = clubData[event.club_id];

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 md:pt-28 px-4">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/10"
                >
                    {/* Header Image Area */}
                    <div className="relative h-64 md:h-80 w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        {event.image_url ? (
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="text-zinc-500 dark:text-zinc-400 flex flex-col items-center">
                                <Calendar size={48} className="mb-2 opacity-50" />
                                <span>No Event Image</span>
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2">
                            <button className="p-2 rounded-full glass bg-black/20 hover:bg-black/40 text-white transition-colors">
                                <Share2 size={20} />
                            </button>
                            <button className="p-2 rounded-full glass bg-black/20 hover:bg-black/40 text-white transition-colors">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                        {/* Club Badge & Join Action */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                {club && (
                                    <div className={`p-2 rounded-xl ${club.color} ${club.textColor}`}>
                                        <club.icon size={20} />
                                    </div>
                                )}
                                <Link href={`/clubs/${event.club_id}`}>
                                    <span className="text-sm font-medium px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                                        {club?.name || "Unknown Club"}
                                    </span>
                                </Link>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${event.status === 'approved' ? 'border-green-500/50 text-green-500' : 'border-yellow-500/50 text-yellow-500'}`}>
                                    {event.status}
                                </span>
                            </div>

                            {/* Membership Status Button */}
                            {membershipStatus === 'approved' ? (
                                <div className="flex items-center gap-2 text-green-500 font-medium text-sm px-3 py-1.5 bg-green-500/10 rounded-full">
                                    <Check size={16} /> Member
                                </div>
                            ) : membershipStatus === 'pending' ? (
                                <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm px-3 py-1.5 bg-yellow-500/10 rounded-full">
                                    <Clock size={16} /> Request Pending
                                </div>
                            ) : membershipStatus === 'rejected' ? (
                                <div className="flex items-center gap-2 text-red-500 font-medium text-sm px-3 py-1.5 bg-red-500/10 rounded-full">
                                    <X size={16} /> Application Rejected
                                </div>
                            ) : (
                                <Button size="sm" variant="neon" onClick={handleJoinClub} className="gap-2">
                                    <UserPlus size={16} /> Join Club
                                </Button>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-6">
                            {event.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="p-2 rounded-lg bg-neon-pink/10 text-neon-pink">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Date</p>
                                        <p className="font-semibold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Time</p>
                                        <p className="font-semibold">{event.time || "TBA"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Location</p>
                                        <p className="font-semibold">{event.location || "TBA"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                        <GaugeCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Capacity</p>
                                        <p className="font-semibold">{event.capacity ? `${event.capacity} People` : "Unlimited"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">About Event</h3>
                            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                <p>{event.description || "No description provided."}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-white/10">
                            <div className="text-sm text-zinc-500">
                                Created by club admin on {new Date(event.created_at).toLocaleDateString()}
                            </div>
                            <Button
                                onClick={handleGetTickets}
                                disabled={isRegistered || registering}
                                className={cn("w-full md:w-auto px-8 py-6 text-lg rounded-full shadow-lg transition-all",
                                    isRegistered ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20" : "shadow-neon-blue/20 hover:shadow-neon-blue/40"
                                )}
                            >
                                {registering ? "Registering..." : isRegistered ? "Registered ✓" : "Get Tickets"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
