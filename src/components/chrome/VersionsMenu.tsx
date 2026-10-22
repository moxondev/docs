"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { type KeyboardEvent, useLayoutEffect, useRef } from "react";

import {
    LATEST_MARK,
    MENU_HEADING,
    MENU_MODALITY,
    MENU_PANEL,
    MENU_ROW,
    VERSIONS_TRIGGER,
} from "@/components/chrome/look";
import {
    majorOf,
    releaseLinks,
    versionEntries,
    type VersionEntry,
    versionGroups,
} from "@/components/chrome/targets";
import { VersionsFace } from "@/components/chrome/VersionsFace";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KINDS } from "@/data/kinds";
import { SITE } from "@/data/site";
import { useEntryFocus } from "@/hooks/useLazyMenu";
import { useRoutePath } from "@/hooks/useLocaleSwitch";
import { localePath } from "@/i18n/routing";
import { parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types/content";

export interface VersionsMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    focus: boolean;
}

export interface VersionRowsProps {
    entries: VersionEntry[];
    lang: Lang;
    onOpenChange: (open: boolean) => void;
}

export interface VersionRowProps {
    entry: VersionEntry;
    lang: Lang;
    onOpenChange: (open: boolean) => void;
}

export interface VersionTailProps {
    entry: VersionEntry;
    arrow?: boolean;
}

/**
 * Right part of a version row: the yellow mark of the latest version or the word of the others in
 * muted text, the check of the version being read, and the chevron of a row that opens a submenu.
 *
 * @param entry - Row of the version menu
 * @param arrow - True for a row with a release submenu, which ends with a chevron
 */
function VersionTail({ entry, arrow = false }: VersionTailProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");
    const aria = useTranslations("aria");

    return (
        <>
            <span className="ml-auto flex items-center gap-2">
                {entry.status === "latest" ? (
                    <span className={LATEST_MARK}>{common("latest")}</span>
                ) : (
                    <span className="text-[13px] text-faint">
                        {t(`versionStatus.${entry.status}`)}
                    </span>
                )}
                {entry.current ? (
                    <CheckIcon aria-hidden="true" className="size-4 text-ink" />
                ) : null}
                {arrow ? (
                    <ChevronRightIcon aria-hidden="true" className="-mr-1 size-3.5 text-faint" />
                ) : null}
            </span>
            {entry.current ? <span className="sr-only">{aria("versionCurrent")}</span> : null}
        </>
    );
}

/**
 * Row of a major that has releases: a link to that version which also opens a submenu of its
 * releases, newest first. The primitive swallows Enter, so it is turned back into the click that
 * follows the link, and the aria-labelledby of the submenu is cleared so that its own label wins.
 *
 * @param entry - Row of the version menu
 * @param lang - Picks the path prefix of the release links (none for English, /fr for French)
 * @param onOpenChange - Called with false once a link is followed, to close the whole menu
 */
function VersionRow({ entry, lang, onOpenChange }: VersionRowProps) {
    const t = useTranslations("header");
    const releases = releaseLinks(KINDS, lang, entry.id);
    const link = (
        <Link href={entry.href} aria-current={entry.current ? "true" : undefined}>
            <span className="font-mono text-[14px]">{entry.label}</span>
            <VersionTail entry={entry} arrow={releases.length > 0} />
        </Link>
    );

    if (releases.length === 0) {
        return (
            <DropdownMenuItem asChild className={cn(MENU_ROW, "h-9")}>
                {link}
            </DropdownMenuItem>
        );
    }

    const follow = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        event.currentTarget.click();
    };

    return (
        <DropdownMenuSub>
            <MenuPrimitive.SubTrigger
                asChild
                onKeyDown={follow}
                onClick={() => onOpenChange(false)}
                className={cn(
                    MENU_ROW,
                    "flex h-9 items-center outline-hidden select-none data-[state=open]:bg-chip",
                )}
            >
                {link}
            </MenuPrimitive.SubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent
                    aria-labelledby={undefined}
                    aria-label={t("releaseNotes", { major: majorOf(entry.id) })}
                    alignOffset={-5}
                    sideOffset={4}
                    {...MENU_MODALITY}
                    className={cn(
                        MENU_PANEL,
                        "max-h-(--radix-dropdown-menu-content-available-height) w-48 overflow-y-auto",
                    )}
                >
                    <DropdownMenuLabel className={MENU_HEADING}>
                        {t("releaseNotes", { major: majorOf(entry.id) })}
                    </DropdownMenuLabel>
                    {releases.map((release) => (
                        <DropdownMenuItem
                            key={release.label}
                            asChild
                            className={cn(MENU_ROW, "h-8.5")}
                        >
                            <Link href={release.href}>
                                <span className="font-mono text-[14px]">{release.label}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}

/**
 * Rows of one group of the menu: a plain link per version, or a row with a release submenu for
 * a major that has releases.
 *
 * @param entries - Rows of the group, newest first
 * @param lang - Picks the path prefix of the release links (none for English, /fr for French)
 * @param onOpenChange - Called with false once a link is followed
 */
function VersionRows({ entries, lang, onOpenChange }: VersionRowsProps) {
    return (
        <>
            {entries.map((entry) => (
                <VersionRow key={entry.id} entry={entry} lang={lang} onOpenChange={onOpenChange} />
            ))}
        </>
    );
}

/**
 * Menu of the version picker of the full header, in its own chunk (see Versions): the trigger, a
 * home row since the wordmark is no link here, the active versions, the archives and the
 * documentation release. The trigger takes no fade class, which would replay the header swap.
 *
 * @param open - Whether the menu is open, controlled by the header for the Alt+V shortcut
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 * @param focus - True when the plain trigger that this one replaces had the focus, which the new
 *   trigger then takes
 */
export function VersionsMenu({ open, onOpenChange, focus }: VersionsMenuProps) {
    const t = useTranslations("header");
    const pathname = useRoutePath();
    const { lang } = parsePath(pathname);
    const trigger = useRef<HTMLButtonElement>(null);
    const entries = versionEntries(KINDS, pathname);
    const shown = entries.find((entry) => entry.current) ?? entries[0];
    const { active, archived } = versionGroups(entries);

    const onPanelFocus = useEntryFocus(open);

    useLayoutEffect(() => {
        if (focus) trigger.current?.focus({ preventScroll: true });
    }, [focus]);

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
            <DropdownMenuTrigger ref={trigger} className={VERSIONS_TRIGGER}>
                {shown ? <VersionsFace version={shown.id} label={shown.label} /> : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                alignOffset={0}
                sideOffset={8}
                onFocus={onPanelFocus}
                {...MENU_MODALITY}
                className={cn(MENU_PANEL, "w-60")}
            >
                <DropdownMenuItem asChild className={cn(MENU_ROW, "h-9")}>
                    <Link href={localePath(lang)}>{t("versionsHome")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-1.5 my-1.5 bg-line-soft" />
                <DropdownMenuLabel className={MENU_HEADING}>
                    {t("versionsActive")}
                </DropdownMenuLabel>
                <VersionRows entries={active} lang={lang} onOpenChange={onOpenChange} />
                {archived.length > 0 ? (
                    <>
                        <DropdownMenuSeparator className="mx-1.5 my-1.5 bg-line-soft" />
                        <DropdownMenuLabel className={MENU_HEADING}>
                            {t("versionsArchived")}
                        </DropdownMenuLabel>
                        <VersionRows entries={archived} lang={lang} onOpenChange={onOpenChange} />
                    </>
                ) : null}
                <DropdownMenuSeparator className="mx-1.5 my-1.5 bg-line-soft" />
                <DropdownMenuLabel className="px-2.5 pt-1.5 pb-1.5 font-mono text-[13px] font-normal text-faint">
                    {t("documentationRelease", { release: SITE.version })}
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
