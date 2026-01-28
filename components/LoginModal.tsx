"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 z-50"
                    >
                        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/30 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-blue/30 rounded-full blur-3xl pointer-events-none" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 mb-2">
                                    {isLogin ? "Welcome back" : "Join UniSync"}
                                </h2>
                                <p className="text-zinc-400 mb-6">
                                    {isLogin
                                        ? "Enter your credentials to access your dashboard."
                                        : "Create an account to verify your student status."}
                                </p>

                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <Input placeholder="University Email" type="email" />
                                    <Input placeholder="Password" type="password" />
                                    {!isLogin && <Input placeholder="Confirm Password" type="password" />}

                                    <Button variant="primary" className="w-full bg-gradient-to-r from-neon-blue to-neon-purple border-0 mt-4">
                                        {isLogin ? "Sign In" : "Sign Up"}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-zinc-400">
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
