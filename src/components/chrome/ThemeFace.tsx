import { MoonIcon, SunIcon } from "lucide-react";

/**
 * Content of the theme trigger of the desktop headers: a sun in the light theme and a moon in the
 * dark one, chosen by the dark class that the next-themes script sets before the first paint, so
 * the icon never flashes. Shared by the plain trigger and the dropdown trigger.
 */
export function ThemeFace() {
    return (
        <>
            <SunIcon aria-hidden="true" className="size-4 dark:hidden" />
            <MoonIcon aria-hidden="true" className="hidden size-4 dark:block" />
        </>
    );
}
