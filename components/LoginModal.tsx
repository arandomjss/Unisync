"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            if (isLogin) {
                // Login logic
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.error("Login error:", error);
                    alert("Invalid credentials. Please try again.");
                } else {
                    alert("Login successful!");
                    onClose();
                }
            } else {
                // Check if user already exists
                const { data: userExists, error: userCheckError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", email)
                    .limit(1)
                    .single();

                if (userCheckError && userCheckError.code !== "PGRST116") {
                    console.error("Error checking user existence:", userCheckError);
                    alert("An error occurred while checking user existence.");
                    return;
                }

                if (userExists) {
                    alert("User already exists. Please log in.");
                    setIsLogin(true);
                    return;
                }

                // Signup logic
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    console.error("Signup error:", error);
                    alert(`Error creating account: ${error.message}`);
                    return;
                } else {
                    console.log("Signup successful:", data);
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                const response = await fetch("/api/updatePassword", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: data.user?.id,
                        hashedPassword,
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    console.error("Error updating password hash:", result.error);
                    alert("Account created, but failed to update password hash.");
                } else {
                    alert("Account created successfully! You can now log in.");
                    setIsLogin(true);
                }

            }
        } catch (err) {
            console.error("Unexpected error during authentication:", err);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 flex items-center justify-center w-full h-full z-50"
                    >
                        <div className="rounded-2xl p-8 relative max-w-md w-full mx-auto shadow-lg bg-zinc-900 text-white">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div>
                                <h2 className="text-4xl font-extrabold mb-4">
                                    {isLogin ? "Welcome Back" : "Join UniSync"}
                                </h2>
                                <p className="mb-6">
                                    {isLogin
                                        ? "Enter your credentials to access your dashboard."
                                        : "Create an account to verify your student status."}
                                </p>

                                <form className="space-y-5" onSubmit={handleLogin}>
                                    <Input
                                        placeholder="University Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {!isLogin && (
                                        <Input
                                            placeholder="Confirm Password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    )}

                                    <Button variant="primary" className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold py-2 mt-4">
                                        {isLogin ? "Sign In" : "Sign Up"}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm">
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            onClick={() => setIsLogin(!isLogin)}
                                            className="text-neon-blue hover:underline font-medium"
                                        >
                                            {isLogin ? "Sign up" : "Log in"}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
