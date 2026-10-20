"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV } from "@/data/nav";
import { LATEST, type VersionDef, VERSIONS } from "@/data/versions";
import { useRoutePath } from "@/hooks/useLocaleSwitch";
import { href, parsePath, versionTarget } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export interface VersionsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export interface VersionEntry {
    id: Version;
    label: string;
    href: string;
    latest: boolean;
    current: boolean;
}

/**
 * Gives the label of a version in the picker: the full release on the latest major, read from
 * package.json, and the major alone on the others.
 *
 * @param def - Version of the catalog, whose status and last release are read
 * @returns "v6.1.0" for the latest version, "v5" for the others
 */
export function versionLabel(def: VersionDef): string {
    return def.status === "latest" && def.release ? `v${def.release}` : def.id;
}

/**
 * Lists the rows of the version menu for a path: one per published version, newest first,
 * each linking to the page the switch lands on, or to the version home outside the docs, where
 * the latest version is the current one.
 *
 * @param nav - Navigation index; a version without any page is not published yet and is left out
 * @param pathname - Path of the current page, in either language
 * @returns The rows, in the order of the version catalog
 */
export function versionEntries(nav: Nav, pathname: string): VersionEntry[] {
    const { lang, version = LATEST, slug } = parsePath(pathname);
    return VERSIONS.filter((def) => Object.keys(nav[def.id]).length > 0).map((def) => ({
        id: def.id,
        label: versionLabel(def),
        href: href(lang, def.id, slug === undefined ? undefined : versionTarget(nav, def.id, slug)),
        latest: def.status === "latest",
        current: def.id === version,
    }));
}

/**
 * Version picker of the header: the label of the version being read and a chevron, opening a
 * non-modal menu of the published versions, whose rows keep the page when the target version
 * has it. The current row carries a check icon and, opened from Alt+V, the first row has focus.
 *
 * @param open - Whether the menu is open, controlled by the header for the Alt+V shortcut
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 * @param className - Extra classes for the trigger, for its place in a header
 */
export function Versions({ open, onOpenChange, className }: VersionsProps) {
    const aria = useTranslations("aria");
    const t = useTranslations("header");
    const common = useTranslations("common");
    const pathname = useRoutePath();
    const entries = versionEntries(NAV, pathname);
    const shown = entries.find((entry) => entry.current) ?? entries[0];

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
            <DropdownMenuTrigger
                className={cn(
                    "-ml-0.5 flex h-6.5 shrink-0 cursor-pointer items-center gap-1 rounded-row px-1.5 font-mono text-xs text-muted hover:bg-chip hover:text-ink data-[state=open]:bg-chip data-[state=open]:text-ink",
                    className,
                )}
            >
                {shown?.label}
                <ChevronDownIcon aria-hidden="true" className="size-3.5" />
                <span className="sr-only">{aria("version")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-50 rounded-(--radius-box) border-line bg-surface p-1 shadow-panel"
            >
                <DropdownMenuLabel className="px-2.5 pt-2 pb-1 text-xs font-medium text-faint">
                    {t("versions")}
                </DropdownMenuLabel>
                {entries.map((entry) => (
                    <DropdownMenuItem
                        key={entry.id}
                        asChild
                        className="h-9 cursor-pointer gap-2 rounded-row px-2.5 text-ink focus:bg-chip focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-line focus-visible:outline-solid"
                    >
                        <Link href={entry.href} aria-current={entry.current ? "true" : undefined}>
                            <span className="font-mono text-[13px]">{entry.label}</span>
                            <span className="ml-auto flex items-center gap-2">
                                {entry.latest ? (
                                    <span className="text-xs text-faint">{common("latest")}</span>
                                ) : null}
                                {entry.current ? (
                                    <CheckIcon aria-hidden="true" className="size-4 text-ink" />
                                ) : (
                                    <span aria-hidden="true" className="size-4" />
                                )}
                            </span>
                            {entry.current ? (
                                <span className="sr-only">{aria("versionCurrent")}</span>
                            ) : null}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
