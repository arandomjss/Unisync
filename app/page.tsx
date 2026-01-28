"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start overflow-x-hidden pt-20 pb-20">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-hero-glow opacity-20 blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 flex flex-col items-center justify-center text-center mt-20 md:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-neon-green mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            v2.0 Now Live
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-white dark:to-zinc-500">
              Connect.
            </span>
            <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-neon-blue dark:via-neon-purple mx-2">
              Vibe.
            </span>
            <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-white dark:to-zinc-500">
              Sync.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate platform for university events. Discover what’s happening on campus, connect with peers, and never miss a beat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              variant="primary"
              className="bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full px-8 font-bold text-lg"
              onClick={() => setIsLoginOpen(true)}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="neon"
              className="rounded-full px-8 text-lg"
            >
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Ticker Section */}
      <section className="w-full mt-32 mb-20 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex w-full overflow-hidden whitespace-nowrap">
          <div className="animate-ticker flex items-center gap-12 text-zinc-400 dark:text-zinc-600 font-bold text-4xl uppercase tracking-widest opacity-30 select-none">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12">
                <span>Hackathons</span> <span className="text-neon-blue">●</span>
                <span>Parties</span> <span className="text-neon-purple">●</span>
                <span>Workshops</span> <span className="text-neon-pink">●</span>
                <span>Concerts</span> <span className="text-neon-green">●</span>
                <span>Esports</span> <span className="text-neon-blue">●</span>
                <span>Networking</span> <span className="text-neon-purple">●</span>
                <span>Hackathons</span> <span className="text-neon-blue">●</span>
                <span>Parties</span> <span className="text-neon-purple">●</span>
                <span>Workshops</span> <span className="text-neon-pink">●</span>
                <span>Concerts</span> <span className="text-neon-green">●</span>
                <span>Esports</span> <span className="text-neon-blue">●</span>
                <span>Networking</span> <span className="text-neon-purple">●</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Floating Cards Visuals */}
      <section className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          { title: "Real-time Updates", desc: "Instantly see what's happening now.", icon: Zap, color: "text-amber-500 dark:text-neon-yellow" },
          { title: "Smart Matching", desc: "Events tailored to your major & interests.", icon: Sparkles, color: "text-purple-600 dark:text-neon-purple" },
          { title: "Global Campus", desc: "Connect with students from other unis.", icon: Globe, color: "text-blue-600 dark:text-neon-blue" }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="glass-card p-8 rounded-3xl border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
            style={{
              backdropFilter: "blur(20px)"
            }}
          >
            <div className={`p-4 rounded-full bg-zinc-100 dark:bg-white/5 w-fit mb-4 ${feature.color}`}>
              <feature.icon size={32} className="text-zinc-900 dark:text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </main>
  );
}
