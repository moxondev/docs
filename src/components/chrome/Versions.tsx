"use client";

import type { ComponentType } from "react";

import { VERSIONS_TRIGGER } from "@/components/chrome/look";
import { versionEntries } from "@/components/chrome/targets";
import { VersionsFace } from "@/components/chrome/VersionsFace";
import type { VersionsMenuProps } from "@/components/chrome/VersionsMenu";
import { KINDS } from "@/data/kinds";
import { useLazyMenu } from "@/hooks/useLazyMenu";
import { useRoutePath } from "@/hooks/useLocaleSwitch";

export interface VersionsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faceClassName?: string;
}

/**
 * Fetches the chunk of the version menu, which holds the dropdown primitive.
 *
 * @returns The menu component, once its chunk has arrived
 */
function loadMenu(): Promise<ComponentType<VersionsMenuProps>> {
    return import("@/components/chrome/VersionsMenu").then((module) => module.VersionsMenu);
}

/**
 * Version picker of the full header: one trigger around the wordmark, the major being read and a
 * chevron (see VersionsFace), which opens the menu of the published versions (see VersionsMenu)
 * once its chunk is fetched, a plain trigger standing in until the reader shows interest.
 *
 * @param open - Whether the menu is open, controlled by the header for the Alt+V shortcut
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 * @param faceClassName - Extra classes for the version and the chevron of the plain trigger, the
 *   fade of a header swap; never applied to the wordmark, which must not blink
 */
export function Versions({ open, onOpenChange, faceClassName }: VersionsProps) {
    const pathname = useRoutePath();
    const { plain, Menu, focus, want } = useLazyMenu(loadMenu, open);
    const entries = versionEntries(KINDS, pathname);
    const shown = entries.find((entry) => entry.current) ?? entries[0];

    if (Menu) return <Menu open={open} onOpenChange={onOpenChange} focus={focus} />;

    return (
        <button
            ref={plain}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onPointerEnter={want}
            onFocus={want}
            onClick={() => onOpenChange(!open)}
            onKeyDown={(event) => {
                if (event.key !== "ArrowDown") return;
                event.preventDefault();
                onOpenChange(true);
            }}
            className={VERSIONS_TRIGGER}
        >
            {shown ? (
                <VersionsFace version={shown.id} label={shown.label} className={faceClassName} />
            ) : null}
        </button>
    );
}
