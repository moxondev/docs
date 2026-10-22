"use client";

import { MenuIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useRoutePath } from "@/hooks/useLocaleSwitch";

/**
 * The sheet and its dialog code as a chunk of their own, mounted on the first press of the button.
 *
 * @param open - Whether the dialog is open, controlled by the menu button
 * @param onOpenChange - Called with the state that Escape, the close button or a link ask for
 * @param opener - Ref of the menu button, which gets the focus back when the dialog closes
 */
const MenuSheet = dynamic(() => import("@/components/chrome/MenuSheet").then((m) => m.MenuSheet), {
    ssr: false,
});

// Media query of the desktop header, the desk breakpoint of globals.css
const DESKTOP = "(min-width: 60rem)";

/**
 * Starts fetching the chunk of the menu sheet without mounting it.
 */
function preloadSheet(): void {
    void import("@/components/chrome/MenuSheet");
}

/**
 * Phone menu: the button of the phone header and the full-screen modal sheet it opens (see
 * MenuSheet). The button is plain markup and the sheet is a separate chunk, fetched once the page
 * is interactive on a phone and never on a desktop.
 */
export function Menu() {
    const aria = useTranslations("aria");
    const pathname = useRoutePath();
    const button = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [seen, setSeen] = useState(pathname);

    if (seen !== pathname) {
        setSeen(pathname);
        setOpen(false);
    }

    useEffect(() => {
        const query = window.matchMedia(DESKTOP);
        const follow = () => {
            if (query.matches) setOpen(false);
            else preloadSheet();
        };
        follow();
        query.addEventListener("change", follow);
        return () => query.removeEventListener("change", follow);
    }, []);

    return (
        <>
            <button
                ref={button}
                type="button"
                aria-label={aria("menuOpen")}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => {
                    setMounted(true);
                    setOpen(true);
                }}
                className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-field text-text hover:bg-chip hover:text-ink"
            >
                <MenuIcon aria-hidden="true" className="size-5" />
            </button>
            {mounted ? <MenuSheet open={open} onOpenChange={setOpen} opener={button} /> : null}
        </>
    );
}
