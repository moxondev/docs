"use client";

import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { usePalette, usePaletteShortcuts } from "@/hooks/usePalette";

/**
 * Placeholder of the search palette: it opens and closes like the real one (Ctrl or Cmd+K, "/",
 * the search fields, Esc) around an empty dashed body. Mounted once by Shell, it owns the
 * search shortcuts.
 */
export function Palette() {
    const { open, setOpen } = usePalette();
    const aria = useTranslations("aria");

    usePaletteShortcuts();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                data-stub="palette"
                aria-describedby={undefined}
                className="top-21 w-230 max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden rounded-panel border-0 bg-surface p-0 shadow-palette sm:max-w-[calc(100%-2rem)]"
            >
                <DialogTitle className="flex h-15 items-center border-b border-line px-5 text-[17px] font-normal text-faint">
                    {aria("searchDialog")}
                </DialogTitle>
                <div className="m-4 h-120 rounded-box border border-dashed border-field bg-side" />
            </DialogContent>
        </Dialog>
    );
}
