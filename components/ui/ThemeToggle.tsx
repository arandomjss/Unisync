"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (!mounted) {
        return null; // Prevent rendering until the component is mounted
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-black/5 dark:hover:bg-white/10"
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 rotate-0 scale-100 transition-all" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-zinc-800 rotate-90 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
