"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, Calendar, User, Search, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClubMember {
    id: string; // membership id
    user_id: string;
    role: string;
    status: string;
    joined_at: string;
    users: {
        name: string;
        email: string;
        avatar_url?: string;
    };
}

export default function ClubMembers() {
    const router = useRouter();
    const [members, setMembers] = useState<ClubMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/");
                return;
            }

            // 1. Get clubs where user is admin
            const { data: memberships } = await supabase
                .from("club_memberships")
                .select("club_id")
                .eq("user_id", user.id)
                .eq("role", "admin");

            if (!memberships || memberships.length === 0) {
                setLoading(false);
                return;
            }

            const clubIds = memberships.map((m) => m.club_id);

            // 2. Fetch Members
            const { data: membersData, error } = await supabase
                .from("club_memberships")
                .select(`
          id, user_id, role, status, joined_at,
          users (name, email)
        `)
                .in("club_id", clubIds)
                .eq("status", "approved")
                .order('joined_at', { ascending: false });

            if (error) {
                console.error("Error fetching members:", error);
            } else {
                setMembers(membersData as any[] || []);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [router]);

    const filteredMembers = members.filter(member =>
        member.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.users.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-background p-6 pb-20 pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
                            Club Members
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400">View and manage your club's members.</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <GlassCard className="p-12 text-center text-zinc-500">
                        <User size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No members found.</p>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <GlassCard className="p-6 flex items-center gap-4 group hover:bg-white/5 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-lg font-bold">
                                        {member.users.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-900 dark:text-white truncate">
                                            {member.users.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 truncate">{member.users.email}</p>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full border",
                                                member.role === 'admin'
                                                    ? "border-neon-purple/30 text-neon-purple bg-neon-purple/5"
                                                    : "border-neon-blue/30 text-neon-blue bg-neon-blue/5"
                                            )}>
                                                {member.role}
                                            </span>
                                            <span className="text-zinc-500 flex items-center gap-1">
                                                <Calendar size={10} />
                                                Joined {new Date(member.joined_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
