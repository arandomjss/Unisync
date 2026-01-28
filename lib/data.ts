import { Calendar, Code, Cpu, FlaskConical, Palette, Music, BookOpen } from "lucide-react";

export interface Club {
    id: string;
    name: string;
    shortName: string;
    category: "Tech" | "Arts" | "Science" | "Cultural" | "Academic";
    color: string;
    textColor: string;
    icon: any;
}

export interface Event {
    id: string;
    title: string;
    clubId: string;
    date: Date;
    location: string;
    description: string;
    type: "Workshop" | "Competition" | "Social" | "Seminar";
}

export const clubs: Club[] = [
    {
        id: "asdd",
        name: "ASDD Club",
        shortName: "ASDD",
        category: "Tech",
        color: "bg-neon-blue/10 border-neon-blue",
        textColor: "text-neon-blue",
        icon: Code
    },
    {
        id: "ieee",
        name: "IEEE Student Branch",
        shortName: "IEEE",
        category: "Tech",
        color: "bg-blue-500/10 border-blue-500",
        textColor: "text-blue-500",
        icon: Cpu
    },
    {
        id: "ach",
        name: "ACH Club",
        shortName: "ACH",
        category: "Tech",
        color: "bg-emerald-500/10 border-emerald-500",
        textColor: "text-emerald-500",
        icon: Cpu
    },
    {
        id: "cultural",
        name: "Cultural Club",
        shortName: "Cultural",
        category: "Cultural",
        color: "bg-neon-pink/10 border-neon-pink",
        textColor: "text-neon-pink",
        icon: Music
    },
    {
        id: "science",
        name: "Science Club",
        shortName: "Science",
        category: "Science",
        color: "bg-neon-green/10 border-neon-green",
        textColor: "text-neon-green",
        icon: FlaskConical
    },
    {
        id: "cs-dept",
        name: "CS Department",
        shortName: "CS Dept",
        category: "Academic",
        color: "bg-purple-500/10 border-purple-500",
        textColor: "text-purple-500",
        icon: BookOpen
    }
];

// Helper to create date relative to today for mock data stability
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const today = new Date();

export const events: Event[] = [
    {
        id: "1",
        title: "Intro to Competitive Programming",
        clubId: "asdd",
        date: addDays(today, 1),
        location: "Lab 301",
        description: "Learn the basics of CP and algorithms.",
        type: "Workshop"
    },
    {
        id: "2",
        title: "IEEE Tech Talk: AI Future",
        clubId: "ieee",
        date: addDays(today, 3),
        location: "Auditorium A",
        description: "Guest lecture on the future of GenAI.",
        type: "Seminar"
    },
    {
        id: "3",
        title: "Diwali Night Rehearsal",
        clubId: "cultural",
        date: addDays(today, 5),
        location: "Student Center",
        description: "Practice for the upcoming fest.",
        type: "Social"
    },
    {
        id: "4",
        title: "Web Dev Bootcamp",
        clubId: "asdd",
        date: addDays(today, 8),
        location: "Lab 202",
        description: "Building your first React app.",
        type: "Workshop"
    },
    {
        id: "5",
        title: "Science Fair Demo",
        clubId: "science",
        date: addDays(today, 10),
        location: "Chemistry Hall",
        description: "Showcase of student projects.",
        type: "Competition"
    },
    {
        id: "6",
        title: "CyberSec Workshop",
        clubId: "ach",
        date: addDays(today, 12),
        location: "Lab 305",
        description: "Ethical Hacking 101.",
        type: "Workshop"
    }
];
