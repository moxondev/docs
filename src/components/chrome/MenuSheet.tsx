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
import type { ReactNode } from "react";

import { GitHub } from "@/components/chrome/GitHub";
import { Logo } from "@/components/chrome/Logo";
import {
    catalogueTarget,
    currentRow,
    docsTarget,
    type MenuRow,
    toolTarget,
} from "@/components/chrome/targets";
import { versionEntries } from "@/components/chrome/Versions";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LINKS } from "@/data/links";
import { NAV } from "@/data/nav";
import { useLocaleSwitch, useRoutePath } from "@/hooks/useLocaleSwitch";
import { openPalette } from "@/hooks/usePalette";
import { type AppLocale, routing } from "@/i18n/routing";
import { linkAttrs, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

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

export interface ChoiceProps {
    label: string;
    selected: boolean;
    children?: ReactNode;
}

// Look shared by every row of the menu, a link or a setting: a muted icon and the label in ink
const ROW =
    "flex h-13 w-full cursor-pointer items-center gap-3.5 px-5 text-left text-base text-ink hover:bg-chip";

// Look of the rows of an opened setting, aligned with the labels above
const CHOICE =
    "flex h-12 w-full cursor-pointer items-center gap-3 pr-5 pl-13 text-left text-[15px] text-text hover:bg-chip";

// Themes the reader can pick, in the order of the list
const THEMES = ["light", "dark", "system"] as const;

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
                {label}
                <span className="ml-auto flex items-center gap-1.5 text-sm text-muted">
                    {value}
                    <ChevronRightIcon
                        aria-hidden="true"
                        className="size-4 transition-transform group-data-[state=open]:rotate-90"
                    />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-1.5">{children}</CollapsibleContent>
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
            {routing.locales.map((code: AppLocale) =>
                code === locale ? (
                    <div key={code} aria-current="true" className={CHOICE}>
                        <Choice label={common(`languages.${code}`)} selected />
                    </div>
                ) : (
                    <a
                        key={code}
                        href={links[code]}
                        hrefLang={code}
                        onClick={(event) => follow(code, event)}
                        className={CHOICE}
                    >
                        <Choice label={common(`languages.${code}`)} selected={false} />
                    </a>
                ),
            )}
        </>
    );
}

/**
 * Choices of the theme setting: light, dark and the system theme, applied at once by next-themes.
 */
function ThemeChoices() {
    const common = useTranslations("common");
    const { theme = "system", setTheme } = useTheme();

    return (
        <>
            {THEMES.map((name) => (
                <button
                    key={name}
                    type="button"
                    aria-pressed={theme === name}
                    onClick={() => setTheme(name)}
                    className={CHOICE}
                >
                    <Choice label={common(`themes.${name}`)} selected={theme === name} />
                </button>
            ))}
        </>
    );
}

/**
 * Choices of the version setting: the published versions, each keeping the page when the target
 * version has it, the one being read marked with a check.
 *
 * @param pathname - Path of the page being read
 */
function VersionChoices({ pathname }: VersionChoicesProps) {
    const common = useTranslations("common");

    return (
        <>
            {versionEntries(NAV, pathname).map((entry) => (
                <Link
                    key={entry.id}
                    href={entry.href}
                    aria-current={entry.current ? "true" : undefined}
                    className={CHOICE}
                >
                    <Choice label={entry.label} selected={entry.current}>
                        {entry.latest ? (
                            <span className="text-xs text-faint">{common("latest")}</span>
                        ) : null}
                    </Choice>
                </Link>
            ))}
        </>
    );
}

export interface MenuSheetProps {
    close: () => void;
}

/**
 * Full-screen sheet of the phone menu: the header, the links, the settings (language, theme,
 * version, GitHub) and the Pro button. The search button closes the dialog and opens the
 * palette, since two modal layers cannot share the page.
 *
 * @param close - Closes the dialog of the menu
 */
export function MenuSheet({ close }: MenuSheetProps) {
    const t = useTranslations("menu");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const pathname = useRoutePath();
    const { version, slug } = parsePath(pathname);
    const { locale: lang } = useLocaleSwitch();
    const { theme = "system" } = useTheme();
    const row: MenuRow | null = currentRow(version, slug);
    const shown = versionEntries(NAV, pathname).find((entry) => entry.current);

    return (
        <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
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
                    href={toolTarget(NAV, lang, version, "playground")}
                    current={row === "playground"}
                />
                <RowLink
                    icon={ListIcon}
                    label={t("changelog")}
                    href={toolTarget(NAV, lang, version, "changelog")}
                    current={row === "changelog"}
                />
                <RowLink
                    icon={TagIcon}
                    label={t("pricing")}
                    href={toolTarget(NAV, lang, version, "pricing")}
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
                <Setting icon={MoonIcon} label={t("theme")} value={common(`themes.${theme}`)}>
                    <ThemeChoices />
                </Setting>
                <Setting icon={ChevronsUpDownIcon} label={t("version")} value={shown?.label ?? ""}>
                    <VersionChoices pathname={pathname} />
                </Setting>
                <a {...linkAttrs(LINKS.repo)} className={ROW}>
                    <GitHub className="size-4.5 text-muted" />
                    {t("github")}
                    <ArrowUpRightIcon aria-hidden="true" className="ml-auto size-4 text-muted" />
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
    );
}
