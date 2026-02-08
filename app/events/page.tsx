"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { clubs, events, type Event, type Club } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EventsPage() {
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

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedClubs, setSelectedClubs] = useState<string[]>(clubs.map(c => c.id));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const toggleClub = (clubId: string) => {
        setSelectedClubs(prev =>
            prev.includes(clubId)
                ? prev.filter(id => id !== clubId)
                : [...prev, clubId]
        );
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEventsForDay = (date: Date) => {
        return events.filter(event =>
            isSameDay(event.date, date) && selectedClubs.includes(event.clubId)
        );
    };

    const selectedDayEvents = getEventsForDay(selectedDate);

    return (
        <div className="container mx-auto px-4 pt-24 pb-24 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar / Filters */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-2">
                            Calendar
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            Filter by your favorite clubs
                        </p>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-2">
                        {clubs.map(club => {
                            const Icon = club.icon;
                            const isSelected = selectedClubs.includes(club.id);
                            return (
                                <button
                                    key={club.id}
                                    onClick={() => toggleClub(club.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full",
                                        isSelected
                                            ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900 dark:text-white"
                                            : "text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    <div className={cn("p-1.5 rounded-lg", isSelected ? club.color : "bg-black/10 dark:bg-white/10")}>
                                        <Icon size={14} className={isSelected ? club.textColor : "text-zinc-500"} />
                                    </div>
                                    <span>{club.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">

                    {/* Calendar Header */}
                    <div className="flex items-center justify-between glass p-4 rounded-2xl">
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="glass-card rounded-3xl p-6">
                        <div className="grid grid-cols-7 mb-4 text-center text-zinc-400 text-sm font-medium">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2">
                            {calendarDays.map((day, idx) => {
                                const dayEvents = getEventsForDay(day);
                                const isSelected = isSameDay(day, selectedDate);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const isTodayDate = isToday(day);

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "min-h-[80px] md:min-h-[100px] p-2 rounded-xl cursor-pointer transition-all relative border border-transparent",
                                            isCurrentMonth ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-300 dark:text-zinc-700",
                                            isSelected ? "bg-neon-blue/10 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]" : "hover:bg-black/5 dark:hover:bg-white/5",
                                            isTodayDate && !isSelected && "bg-zinc-100 dark:bg-zinc-800"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn("text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center", isTodayDate && "bg-neon-blue text-white")}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-1 content-start">
                                            {dayEvents.slice(0, 4).map((event) => {
                                                const club = clubs.find(c => c.id === event.clubId);
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className={cn("w-2 h-2 rounded-full", club?.textColor.replace('text-', 'bg-'))}
                                                    />
                                                );
                                            })}
                                            {dayEvents.length > 4 && (
                                                <span className="text-[10px] text-zinc-500">+</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Day Details */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Events for <span className="text-neon-blue">{format(selectedDate, 'MMM do')}</span>
                        </h3>

                        {selectedDayEvents.length === 0 ? (
                            <div className="text-center py-10 text-zinc-500 glass-card rounded-2xl">
                                <p>No events scheduled for this day.</p>
                                <Button variant="ghost" className="mt-2 text-neon-blue">Check other dates</Button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {selectedDayEvents.map(event => {
                                    const club = clubs.find(c => c.id === event.clubId);
                                    return (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center group hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-colors"
                                        >
                                            <div className={cn("p-4 rounded-2xl flex-shrink-0", club?.color)}>
                                                {club && <club.icon size={24} className={club.textColor} />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", club?.color, club?.textColor)}>
                                                        {club?.shortName}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                                                        {event.type}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{event.title}</h4>
                                                <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{event.description}</p>

                                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                                    <span className="flex items-center gap-1"><Clock size={14} /> {format(event.date, 'p')}</span>
                                                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                                                </div>
                                            </div>

                                            <Button className="w-full md:w-auto rounded-full">
                                                View Details
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
