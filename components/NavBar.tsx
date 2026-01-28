"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Profile", href: "/profile", icon: User },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 glass px-8 py-4 rounded-full items-center gap-8 shadow-neon-blue/20 shadow-lg">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white mr-8">
          Uni<span className="text-neon-blue">Sync</span>
        </Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white dark:hover:text-white hover:text-black",
                  isActive ? "text-white dark:text-white" : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav"
                    className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
          <div className="ml-4 pl-4 border-l border-zinc-200 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass h-16 rounded-2xl flex items-center justify-around shadow-lg shadow-black/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              <div className={cn("relative p-2 rounded-xl transition-all duration-300", isActive ? "text-neon-blue -translate-y-1" : "text-zinc-500")}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-glow"
                    className="absolute inset-0 bg-neon-blue/20 blur-lg rounded-full -z-10"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
