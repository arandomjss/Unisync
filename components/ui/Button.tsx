"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost" | "neon";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            neon: "bg-transparent border border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(112,0,255,0.5)] hover:shadow-[0_0_20px_rgba(112,0,255,0.8)] hover:bg-neon-purple/10",
        };

        const sizes = {
            sm: "h-9 px-3 rounded-md text-sm",
            md: "h-11 px-8 rounded-lg text-base",
            lg: "h-14 px-10 rounded-xl text-lg",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            >
                {props.children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
