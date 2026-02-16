"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/Button";
import { Search, Shield, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function UserManagementPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Check if current user is admin
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/");
                return;
            }

            // Fetch all users
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching users:", error);
            } else {
                setUsers(data || []);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [router]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setUpdating(userId);
        try {
            const { error } = await supabase
                .from("users")
                .update({ role: newRole })
                .eq("id", userId);

            if (error) {
                console.error("Error updating role:", error);
                alert("Failed to update role");
            } else {
                // Update local state
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-background p-6 pb-20 pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
                            User Management
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Manage users and their roles.</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                ) : filteredUsers.length === 0 ? (
                    <GlassCard className="p-12 text-center text-zinc-500">
                        <User size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No users found.</p>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-zinc-500 border-b border-white/10">
                            <div className="col-span-4">User</div>
                            <div className="col-span-4">Email</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {filteredUsers.map((user) => (
                            <GlassCard key={user.id} className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group hover:bg-white/5 transition-colors">
                                <div className="col-span-4 w-full flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold shrink-0">
                                        {user.name?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-zinc-900 dark:text-white truncate">{user.name || "Unknown"}</p>
                                        <p className="text-xs text-zinc-500 md:hidden">{user.email}</p>
                                    </div>
                                </div>

                                <div className="col-span-4 w-full hidden md:block text-zinc-400 truncate">
                                    {user.email}
                                </div>

                                <div className="col-span-2 w-full flex items-center">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs border capitalize flex items-center gap-1.5 w-fit",
                                        user.role === 'admin' ? "border-neon-purple/30 text-neon-purple bg-neon-purple/5" :
                                            user.role === 'club_admin' ? "border-neon-blue/30 text-neon-blue bg-neon-blue/5" :
                                                "border-zinc-500/30 text-zinc-500 bg-zinc-500/5"
                                    )}>
                                        {user.role === 'admin' ? <Shield size={10} /> :
                                            user.role === 'club_admin' ? <UserCheck size={10} /> :
                                                <User size={10} />}
                                        {user.role || 'user'}
                                    </span>
                                </div>

                                <div className="col-span-2 w-full flex justify-end gap-2">
                                    <select
                                        disabled={updating === user.id}
                                        value={user.role || 'user'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-xs focus:outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
