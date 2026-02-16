"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useClubData } from "@/components/club/ClubUtils";
import { ArrowLeft, Calendar, MapPin, Clock, Users, UserPlus, Check, X, Share2, Globe, Mail } from "lucide-react";
import Image from "next/image";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ClubProfilePage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const clubData = useClubData();
    const [club, setClub] = useState<any | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [stats, setStats] = useState({ members: 0, events: 0 });

    useEffect(() => {
        const fetchClubData = async () => {
            if (!id) return;
            setLoading(true);

            // 1. Fetch Club Details
            const { data: clubInfo, error: clubError } = await supabase
                .from("clubs")
                .select("*")
                .eq("id", id)
                .single();

            if (clubError) {
                console.error("Error fetching club:", clubError);
                setLoading(false);
                return;
            }
            setClub(clubInfo);

            // 2. Fetch Club Events
            const { data: eventsData, error: eventsError } = await supabase
                .from("events")
                .select("*")
                .eq("club_id", id)
                .order('date', { ascending: true });

            if (!eventsError) setEvents(eventsData || []);

            // 3. Fetch Stats (Members count)
            const { count: memberCount } = await supabase
                .from("club_memberships")
                .select("*", { count: 'exact', head: true })
                .eq("club_id", id)
                .eq("status", "approved");

            setStats({
                members: memberCount || 0,
                events: eventsData?.length || 0
            });

            // 4. Check User Session & Membership
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUserId(session.user.id);
                const { data: membership } = await supabase
                    .from("club_memberships")
                    .select("status")
                    .eq("club_id", id)
                    .eq("user_id", session.user.id)
                    .single();
                setMembershipStatus(membership?.status || null);
            }

            setLoading(false);
        };

        fetchClubData();
    }, [id]);

    const handleJoinClub = async () => {
        if (!club || !userId) {
            if (!userId) router.push("/"); // Redirect to login if not auth
            return;
        }

        const { error } = await supabase.from("club_memberships").insert([
            {
                club_id: club.id,
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

    const staticClubInfo = clubData[id] || {};

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background">
                <h1 className="text-2xl font-bold text-zinc-400 mb-4">Club not found</h1>
                <Button onClick={() => router.back()} variant="ghost">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 md:pt-28 px-4">
            <div className="max-w-6xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {/* Club Header Card */}
                <div className="relative rounded-3xl overflow-hidden glass-card border border-zinc-200 dark:border-white/10 mb-8">
                    {/* Banner / Background */}
                    <div className={cn("h-48 md:h-64 w-full bg-gradient-to-r",
                        staticClubInfo.color ? staticClubInfo.color.replace('text-', 'bg-').replace('500', '900') : "from-zinc-800 to-zinc-900"
                    )}>
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="px-6 md:px-10 pb-8 relative -mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        {/* Club Logo/Icon */}
                        <div className="flex items-end gap-6">
                            <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center border-4 border-background shadow-xl",
                                staticClubInfo.color ? "bg-white dark:bg-zinc-900" : "bg-zinc-800"
                            )}>
                                {staticClubInfo.icon ? (
                                    <staticClubInfo.icon size={64} className={staticClubInfo.textColor || "text-white"} />
                                ) : (
                                    <Users size={64} className="text-zinc-400" />
                                )}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-2">{club.name}</h1>
                                <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 text-sm">
                                    <span className="flex items-center gap-1"><Users size={16} /> {stats.members} Members</span>
                                    <span className="flex items-center gap-1"><Calendar size={16} /> {stats.events} Events</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2 w-full md:w-auto">
                            <Button variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-zinc-900 dark:text-white">
                                <Share2 size={20} />
                            </Button>

                            {membershipStatus === 'approved' ? (
                                <div className="px-6 py-2 rounded-full bg-green-500/20 text-green-500 font-bold border border-green-500/50 flex items-center gap-2">
                                    <Check size={20} /> Member
                                </div>
                            ) : membershipStatus === 'pending' ? (
                                <div className="px-6 py-2 rounded-full bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/50 flex items-center gap-2">
                                    <Clock size={20} /> Pending
                                </div>
                            ) : membershipStatus === 'rejected' ? (
                                <div className="px-6 py-2 rounded-full bg-red-500/20 text-red-500 font-bold border border-red-500/50 flex items-center gap-2">
                                    <X size={20} /> Rejected
                                </div>
                            ) : (
                                <Button onClick={handleJoinClub} variant="neon" className="rounded-full px-8 font-bold flex-1 md:flex-none">
                                    <UserPlus size={20} className="mr-2" /> Join Club
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: About */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">About Us</h2>
                            <GlassCard className="p-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {club.description || "No description provided."}
                            </GlassCard>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Upcoming Events</h2>
                            <div className="space-y-4">
                                {events.length > 0 ? (
                                    events.map(event => (
                                        <Link href={`/events/${event.id}`} key={event.id}>
                                            <GlassCard className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer mb-3">
                                                <div className="h-16 w-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-center shrink-0">
                                                    <span className="text-xs text-zinc-500 uppercase font-bold">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{new Date(event.date).getDate()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate group-hover:text-neon-blue transition-colors">{event.title}</h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                                        <Clock size={14} /> {event.time || "TBA"}
                                                        <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                                        <MapPin size={14} /> {event.location || "TBA"}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <Button size="sm" variant="ghost" className="text-neon-blue">View</Button>
                                                </div>
                                            </GlassCard>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-zinc-500">No upcoming events.</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-6">
                        <GlassCard className="p-6 space-y-4">
                            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Contact Info</h3>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-neon-blue transition-colors">
                                <Globe size={20} />
                                <span>Website</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-neon-blue transition-colors">
                                <Mail size={20} />
                                <span>Email Club</span>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
