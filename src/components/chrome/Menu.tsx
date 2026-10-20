"use client";

import { MenuIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useRoutePath } from "@/hooks/useLocaleSwitch";

/**
 * The sheet and its dialog code as a chunk of their own, loaded on the client only.
 */
const MenuSheet = dynamic(() => import("@/components/chrome/MenuSheet").then((m) => m.MenuSheet), {
    ssr: false,
});

// Media query of the desktop header, the desk breakpoint of globals.css
const DESKTOP = "(min-width: 60rem)";

/**
 * Phone menu: the button of the phone header and the full-screen modal sheet it opens (see
 * MenuSheet). A link, a change of page or a desktop-wide screen closes it, and the sheet is a
 * separate chunk fetched once the page is interactive.
 */
export function Menu() {
    const aria = useTranslations("aria");
    const pathname = useRoutePath();
    const [open, setOpen] = useState(false);
    const [seen, setSeen] = useState(pathname);

    if (seen !== pathname) {
        setSeen(pathname);
        setOpen(false);
    }

    useEffect(() => {
        const query = window.matchMedia(DESKTOP);
        const close = () => {
            if (query.matches) setOpen(false);
        };
        query.addEventListener("change", close);
        return () => query.removeEventListener("change", close);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={aria("menuOpen")}
                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-field text-text hover:bg-chip hover:text-ink"
                >
                    <MenuIcon aria-hidden="true" className="size-5" />
                </button>
            </DialogTrigger>
            <MenuSheet close={() => setOpen(false)} />
        </Dialog>
    );
}
