"use client";

import {
    ArrowUpRightIcon,
    BookIcon,
    CheckIcon,
    ChevronRightIcon,
    ChevronsUpDownIcon,
    FlaskConicalIcon,
    LanguagesIcon,
    LayoutGridIcon,
    ListIcon,
    type LucideIcon,
    MoonIcon,
    SearchIcon,
    TagIcon,
    XIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { ReactNode, RefObject } from "react";

import { GitHub } from "@/components/chrome/GitHub";
import { Logo } from "@/components/chrome/Logo";
import { LATEST_MARK } from "@/components/chrome/look";
import {
    catalogueTarget,
    currentRow,
    docsTarget,
    languageRows,
    majorOf,
    type MenuRow,
    releaseLinks,
    themeChoice,
    themeRows,
    toolTarget,
    versionEntries,
    type VersionEntry,
    versionGroups,
} from "@/components/chrome/targets";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { KINDS } from "@/data/kinds";
import { LINKS } from "@/data/links";
import { SITE } from "@/data/site";
import { useLocaleSwitch, useRoutePath } from "@/hooks/useLocaleSwitch";
import { openPalette } from "@/hooks/usePalette";
import { routing } from "@/i18n/routing";
import { linkAttrs, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types/content";

export interface RowLinkProps {
    icon: LucideIcon;
    label: string;
    href: string;
    current?: boolean;
}

export interface SettingProps {
    icon: LucideIcon;
    label: string;
    value: string;
    children: ReactNode;
}

export interface VersionChoicesProps {
    pathname: string;
}

export interface VersionTailProps {
    entry: VersionEntry;
}

export interface VersionChoiceProps {
    entry: VersionEntry;
    lang: Lang;
}

export interface ChoiceProps {
    label: string;
    selected: boolean;
    children?: ReactNode;
}

// Look shared by every row of the menu, a link or a setting: a muted icon and the label in ink
const ROW =
    "flex h-13 w-full cursor-pointer items-center gap-3.5 px-5 text-left text-base text-ink hover:bg-chip focus-visible:-outline-offset-2";

// Height transition of a setting that opens or closes; the clip keeps the rows inside while it runs
const FOLD =
    "overflow-hidden pb-1.5 data-[state=closed]:animate-fold-up data-[state=open]:animate-fold-down";

// Look of the rows of an opened setting, aligned with the labels above
const CHOICE =
    "flex h-12 w-full cursor-pointer items-center gap-3 pr-5 pl-13 text-left text-[16px] text-text hover:bg-chip focus-visible:-outline-offset-2";

// Small heading of a group of versions, aligned with the choice labels
const GROUP = "pt-1 pr-5 pb-0.5 pl-13 text-[13px] font-medium text-faint";

/**
 * Link row of the menu: an icon and a label, the whole row being the target. The row of the page
 * being read has the yellow ground and a heavier label; aria-current says it too.
 *
 * @param icon - Lucide icon of the row
 * @param label - Text printed next to the icon, which also names the link
 * @param href - Site path the row opens
 * @param current - True for the row of the page being read
 */
function RowLink({ icon: Glyph, label, href, current = false }: RowLinkProps) {
    return (
        <Link
            href={href}
            aria-current={current ? "page" : undefined}
            className={cn(ROW, current && "bg-active font-medium hover:bg-active")}
        >
            <Glyph
                aria-hidden="true"
                className={cn("size-4.5", current ? "text-ink" : "text-muted")}
            />
            {label}
        </Link>
    );
}

/**
 * Setting row of the menu with its value at the right and a chevron, which opens its choices in
 * place under it, so that nothing covers the menu.
 *
 * @param icon - Lucide icon of the row
 * @param label - Name printed at the left of the row, before its current value
 * @param value - Current value, printed at the right in muted text
 * @param children - Choice rows of the setting
 */
function Setting({ icon: Glyph, label, value, children }: SettingProps) {
    return (
        <Collapsible>
            <CollapsibleTrigger className={cn(ROW, "group")}>
                <Glyph aria-hidden="true" className="size-4.5 text-muted" />
                <span className="min-w-0 truncate">{label}</span>
                <span className="ml-auto flex min-w-0 items-center gap-1.5 text-sm text-muted">
                    <span className="truncate">{value}</span>
                    <ChevronRightIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-90"
                    />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className={FOLD}>{children}</CollapsibleContent>
        </Collapsible>
    );
}

/**
 * Content of a choice row: its label and, for the selected choice, a check icon (never a yellow
 * ground, which only marks the page being read).
 *
 * @param label - Text of the choice, printed before the check of the selected one
 * @param selected - True for the choice in use
 * @param children - Extra content after the label, for example a hint
 */
function Choice({ label, selected, children }: ChoiceProps) {
    return (
        <>
            <span className={cn(selected && "font-medium text-ink")}>{label}</span>
            {children}
            {selected ? <CheckIcon aria-hidden="true" className="ml-auto size-4 text-ink" /> : null}
        </>
    );
}

/**
 * Choices of the language setting: the current language, then a plain link to the same page in
 * the other one, which does a full load of that language and saves the choice, as the desktop
 * switch does.
 */
function LanguageChoices() {
    const common = useTranslations("common");
    const { locale, links, follow } = useLocaleSwitch();

    return (
        <>
            {languageRows(routing.locales, locale, links).map((row) =>
                row.current ? (
                    <div key={row.locale} aria-current="true" className={CHOICE}>
                        <Choice label={common(`languages.${row.locale}`)} selected />
                    </div>
                ) : (
                    <a
                        key={row.locale}
                        href={row.href}
                        hrefLang={row.locale}
                        onClick={(event) => follow(row.locale, event)}
                        className={CHOICE}
                    >
                        <Choice label={common(`languages.${row.locale}`)} selected={false} />
                    </a>
                ),
            )}
        </>
    );
}

/**
 * Choices of the theme setting, applied at once by next-themes. The rows are the ones of the
 * desktop theme menu (themeRows), as the language ones are shared.
 */
function ThemeChoices() {
    const common = useTranslations("common");
    const { theme, setTheme } = useTheme();

    return (
        <>
            {themeRows(themeChoice(theme)).map((row) => (
                <button
                    key={row.name}
                    type="button"
                    aria-pressed={row.current}
                    onClick={() => setTheme(row.name)}
                    className={CHOICE}
                >
                    <Choice label={common(`themes.${row.name}`)} selected={row.current} />
                </button>
            ))}
        </>
    );
}

/**
 * Right part of a version choice: the yellow mark of the latest version or the word of the others
 * in muted text, then the check of the version being read.
 *
 * @param entry - Row of the version list
 */
function VersionTail({ entry }: VersionTailProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");
    const aria = useTranslations("aria");

    return (
        <>
            <span className="ml-auto flex items-center gap-2">
                {entry.status === "latest" ? (
                    <span className={LATEST_MARK}>{common("latest")}</span>
                ) : (
                    <span className="text-sm text-faint">{t(`versionStatus.${entry.status}`)}</span>
                )}
                {entry.current ? (
                    <CheckIcon aria-hidden="true" className="size-4 text-ink" />
                ) : null}
            </span>
            {entry.current ? <span className="sr-only">{aria("versionCurrent")}</span> : null}
        </>
    );
}

/**
 * One version of the list: the link to that version (same page when it has it) with its mark or
 * word and the check, and for a major with releases a disclosure button that unfolds its release
 * notes in place. Rows without releases keep the same right edge so that the words line up.
 *
 * @param entry - Row of the version list
 * @param lang - Picks the path prefix of the release links (none for English, /fr for French)
 */
function VersionChoice({ entry, lang }: VersionChoiceProps) {
    const t = useTranslations("header");
    const aria = useTranslations("aria");
    const releases = releaseLinks(KINDS, lang, entry.id);
    const major = majorOf(entry.id);
    const link = (extra: string) => (
        <Link
            href={entry.href}
            aria-current={entry.current ? "true" : undefined}
            className={cn(CHOICE, "min-w-0 flex-1", extra)}
        >
            <span className={cn("font-mono", entry.current && "font-medium text-ink")}>
                {entry.label}
            </span>
            <VersionTail entry={entry} />
        </Link>
    );

    if (releases.length === 0) return link("pr-14");

    return (
        <Collapsible>
            <div className="flex items-stretch">
                {link("pr-2")}
                <CollapsibleTrigger
                    aria-label={aria("versionReleases", { major })}
                    className="group flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-muted hover:bg-chip hover:text-ink"
                >
                    <ChevronRightIcon
                        aria-hidden="true"
                        className="size-4 transition-transform duration-150 group-data-[state=open]:rotate-90"
                    />
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className={FOLD}>
                <p className="pr-5 pl-13 text-[13px] font-medium text-faint">
                    {t("releaseNotes", { major })}
                </p>
                {releases.map((release) => (
                    <Link
                        key={release.label}
                        href={release.href}
                        className="flex h-11 w-full items-center pr-5 pl-13 font-mono text-[15px] text-text hover:bg-chip"
                    >
                        {release.label}
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

/**
 * Choices of the version setting, in the two groups of the desktop menu (the versions the API still
 * serves, then the archives) and the release of the documentation in muted mono at the end.
 *
 * @param pathname - Path of the page being read
 */
function VersionChoices({ pathname }: VersionChoicesProps) {
    const t = useTranslations("header");
    const { lang } = parsePath(pathname);
    const { active, archived } = versionGroups(versionEntries(KINDS, pathname));

    return (
        <>
            <p className={GROUP}>{t("versionsActive")}</p>
            {active.map((entry) => (
                <VersionChoice key={entry.id} entry={entry} lang={lang} />
            ))}
            {archived.length > 0 ? (
                <>
                    <p className={cn(GROUP, "mt-1.5")}>{t("versionsArchived")}</p>
                    {archived.map((entry) => (
                        <VersionChoice key={entry.id} entry={entry} lang={lang} />
                    ))}
                </>
            ) : null}
            <p className="mt-1.5 pr-5 pl-13 font-mono text-[13px] text-faint">
                {t("documentationRelease", { release: SITE.version })}
            </p>
        </>
    );
}

export interface MenuSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    opener: RefObject<HTMLElement | null>;
}

/**
 * Full-screen sheet of the phone menu (see Menu): the header, the links, the settings (language,
 * theme, version, GitHub) and the Pro button. The search button closes the dialog and opens the
 * palette, since two modal layers cannot share the page.
 *
 * @param open - Whether the dialog is open, controlled by the menu button
 * @param onOpenChange - Called with the state that Escape, the close button or a link ask for
 * @param opener - Ref of the menu button, which gets the focus back when the dialog closes
 */
export function MenuSheet({ open, onOpenChange, opener }: MenuSheetProps) {
    const t = useTranslations("menu");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const pathname = useRoutePath();
    const { version, slug } = parsePath(pathname);
    const { locale: lang } = useLocaleSwitch();
    const { theme } = useTheme();
    const row: MenuRow | null = currentRow(version, slug);
    const shown = versionEntries(KINDS, pathname).find((entry) => entry.current);
    const close = () => onOpenChange(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                aria-describedby={undefined}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    opener.current?.focus();
                }}
                onClick={(event) => {
                    if ((event.target as HTMLElement).closest("a[href]")) close();
                }}
                className="top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto rounded-none border-0 bg-page p-0 shadow-none data-[state=closed]:animate-none data-[state=open]:animate-none sm:max-w-none desk:hidden"
            >
                <DialogTitle className="sr-only">{t("title")}</DialogTitle>
                <div className="flex h-14 shrink-0 items-center gap-1 border-b border-line-soft pr-1.5 pl-5">
                    <Logo size="phone" />
                    <div className="flex-1" />
                    <button
                        type="button"
                        aria-label={aria("search")}
                        aria-haspopup="dialog"
                        onClick={() => {
                            close();
                            requestAnimationFrame(() => openPalette());
                        }}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-field text-text hover:bg-chip hover:text-ink"
                    >
                        <SearchIcon aria-hidden="true" className="size-5" />
                    </button>
                    <DialogClose
                        aria-label={aria("menuClose")}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-field text-text hover:bg-chip hover:text-ink"
                    >
                        <XIcon aria-hidden="true" className="size-5" />
                    </DialogClose>
                </div>
                <nav aria-label={aria("mainNav")} className="flex flex-col pt-1.5">
                    <RowLink
                        icon={BookIcon}
                        label={t("documentation")}
                        href={docsTarget(lang, version)}
                        current={row === "documentation"}
                    />
                    <RowLink
                        icon={LayoutGridIcon}
                        label={t("catalogue")}
                        href={catalogueTarget(lang)}
                    />
                    <RowLink
                        icon={FlaskConicalIcon}
                        label={t("playground")}
                        href={toolTarget(KINDS, lang, version, "playground")}
                        current={row === "playground"}
                    />
                    <RowLink
                        icon={ListIcon}
                        label={t("changelog")}
                        href={toolTarget(KINDS, lang, version, "changelog")}
                        current={row === "changelog"}
                    />
                    <RowLink
                        icon={TagIcon}
                        label={t("pricing")}
                        href={toolTarget(KINDS, lang, version, "pricing")}
                        current={row === "pricing"}
                    />
                </nav>
                <hr className="mx-5 my-1.5 border-line-soft" />
                <div className="flex flex-col">
                    <Setting
                        icon={LanguagesIcon}
                        label={t("language")}
                        value={common(`languages.${lang}`)}
                    >
                        <LanguageChoices />
                    </Setting>
                    <Setting
                        icon={MoonIcon}
                        label={t("theme")}
                        value={common(`themes.${themeChoice(theme)}`)}
                    >
                        <ThemeChoices />
                    </Setting>
                    <Setting
                        icon={ChevronsUpDownIcon}
                        label={t("version")}
                        value={shown?.label ?? ""}
                    >
                        <VersionChoices pathname={pathname} />
                    </Setting>
                    <a {...linkAttrs(LINKS.repo)} className={ROW}>
                        <GitHub className="size-4.5 text-muted" />
                        {t("github")}
                        <ArrowUpRightIcon
                            aria-hidden="true"
                            className="ml-auto size-4 text-muted"
                        />
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                </div>
                <Button asChild size="phone" className="mx-5 mt-3.5 mb-5">
                    <a {...linkAttrs(LINKS.store)}>
                        {t("pro")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
