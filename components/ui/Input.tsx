import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    isLightMode?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, isLightMode, ...props }, ref) => {
        const lightModeClasses = "bg-zinc-100 text-zinc-900 border-zinc-300 placeholder-zinc-500";
        const darkModeClasses = "bg-zinc-800 text-white border-zinc-700 placeholder-zinc-400";

        return (
            <input
                type={type}
                className={cn(
                    `flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
                    isLightMode ? lightModeClasses : darkModeClasses,
                    className // Ensure this is applied last to allow user overrides
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
