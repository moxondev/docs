import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "h-9 w-full min-w-0 rounded-field border border-field bg-control px-2.5 py-1 text-[14px] text-ink transition-[color,box-shadow] outline-none selection:bg-hl selection:text-on-hl file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-faint disabled:cursor-not-allowed disabled:bg-chip disabled:text-faint",
                "focus:border-focus-line focus:ring-[3px] focus:ring-focus-ring",
                "aria-invalid:border-req aria-invalid:focus:border-req",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
