import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-55 aria-invalid:border-req [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-hl text-on-hl hover:bg-hl-hover active:bg-hl-active disabled:bg-chip disabled:text-faint disabled:opacity-100",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60",
                outline:
                    "border border-field bg-control font-normal text-text hover:bg-control-hover hover:text-ink",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "font-normal text-muted hover:bg-chip hover:text-ink",
                link: "font-normal prose-link",
                code: "border border-code-btn bg-transparent font-normal text-code-icon hover:text-code-text",
            },
            size: {
                default: "h-9 gap-1.75 rounded-cta px-4 text-sm",
                xs: "h-6 gap-1 rounded-chip px-2 text-[12px] [&_svg:not([class*='size-'])]:size-3",
                sm: "h-8 gap-1.5 rounded-btn px-2.5 text-[14px] [&_svg:not([class*='size-'])]:size-3.5",
                lg: "h-11 rounded-box px-5.5 text-[16px]",
                send: "h-10 gap-2.5 rounded-cta px-4 text-sm",
                phone: "h-12 rounded-table px-5 text-[16px]",
                icon: "size-8.5 rounded-field",
                "icon-xs": "size-7 rounded-row [&_svg:not([class*='size-'])]:size-3.25",
                "icon-sm": "size-7.5 rounded-btn [&_svg:not([class*='size-'])]:size-3.5",
                "icon-lg": "size-11 rounded-field [&_svg:not([class*='size-'])]:size-5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
