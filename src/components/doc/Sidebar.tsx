"use client";

import { ChevronRightIcon, FunnelIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { categoryOf, childLabel, filterCatalogue } from "@/components/doc/filter";
import { Method } from "@/components/doc/Method";
import { Status } from "@/components/doc/Status";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { NavCategory, NavLink, SidebarModel } from "@/lib/nav";
import { parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface SidebarProps {
    model: SidebarModel;
}

export interface RowProps {
    link: NavLink;
    label?: string;
    current: string | undefined;
}

export interface CategoryProps {
    category: NavCategory;
    open: boolean;
    current: string | undefined;
    onToggle: () => void;
}

const ROW =
    "flex items-center gap-2 rounded-row text-muted hover:bg-hover hover:text-ink aria-[current=page]:bg-active aria-[current=page]:font-medium aria-[current=page]:text-active-ink";

/**
 * Tells whether a page belongs to the family of an entry: the entry itself or one of its
 * sub-pages, so the family stays unfolded while one of its pages is read.
 *
 * @param link - Entry of the sidebar
 * @param slug - Page id being read
 * @returns True for the entry and for each of its children
 */
function inFamily(link: NavLink, slug: string | undefined): boolean {
    return slug !== undefined && (link.slug === slug || link.children.some((c) => c.slug === slug));
}

/**
 * One row of the sidebar: the name, then at the end of the row the pictogram of the status and
 * the method chips, so that the names of a category line up. The word of the status shows only in
 * a tooltip, because a yellow marker would vanish on the yellow ground of the current row.
 *
 * @param link - Entry to show: title, path, methods
 * @param label - Text to print instead of the page title (the messages name the guides)
 * @param current - Page id being read
 */
function Row({ link, label, current }: RowProps) {
    const common = useTranslations("common");
    const row = (
        <Link
            href={link.href}
            prefetch={false}
            aria-current={current === link.slug ? "page" : undefined}
            className={cn(ROW, "px-2.5 py-1.25")}
        >
            {label ?? link.title}
            <span className="ml-auto flex items-center gap-1.5">
                {link.status ? <Status status={link.status} titled={false} /> : null}
                <Method methods={link.methods} variant="tag" />
            </span>
        </Link>
    );

    if (!link.status) return row;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{row}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={6}>
                {common(`status.${link.status}`)}
            </TooltipContent>
        </Tooltip>
    );
}

/**
 * One collapsible category of the catalogue: a button with the chevron and the count, and the
 * list of its entries, which stays in the document when folded (hidden) so that the links are
 * still crawlable. The family of the page being read lists its sub-pages under it.
 *
 * @param category - Category: title, count and entries
 * @param open - Whether the list is unfolded
 * @param current - Page id being read
 * @param onToggle - Called when the button is pressed
 */
function Category({ category, open, current, onToggle }: CategoryProps) {
    const listId = `side-${category.id}`;

    return (
        <li>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={onToggle}
                className="flex w-full items-center gap-1.75 rounded-row px-2.5 py-1.5 text-left text-muted hover:bg-hover hover:text-ink aria-expanded:font-medium aria-expanded:text-ink"
            >
                <ChevronRightIcon
                    aria-hidden="true"
                    className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-90")}
                />
                {category.title}
                <span className="ml-auto font-mono text-[12px] font-normal text-faint">
                    {category.count}
                </span>
            </button>
            <ul
                id={listId}
                hidden={!open}
                className="mt-px mb-1 ml-4 flex flex-col gap-px border-l border-line pl-2"
            >
                {category.items.map((item) => (
                    <li key={item.slug}>
                        <Row link={item} current={current} />
                        {inFamily(item, current) && item.children.length > 0 ? (
                            <ul className="ml-3 flex flex-col gap-px border-l border-line pl-2">
                                {item.children.map((child) => (
                                    <li key={child.slug}>
                                        <Row
                                            link={child}
                                            label={
                                                child.short ?? childLabel(item.title, child.title)
                                            }
                                            current={current}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </li>
                ))}
            </ul>
        </li>
    );
}

/**
 * Documentation sidebar, sticky on a desktop: the filter of the endpoints, the Introduction
 * pages, the catalogue by category and the Tools. The server layout builds the model, so the
 * navigation index and the catalogue stay out of the first-load script.
 *
 * @param model - Introduction, catalogue and tools of the version, with titles and links in the
 *   language of the page
 */
export function Sidebar({ model }: SidebarProps) {
    const t = useTranslations("sidebar");
    const aria = useTranslations("aria");
    const pathname = usePathname() ?? "/";
    const navRef = useRef<HTMLElement>(null);
    const [query, setQuery] = useState("");
    const [flipped, setFlipped] = useState<{ path: string; ids: readonly string[] }>({
        path: pathname,
        ids: [],
    });
    const current = parsePath(pathname).slug;
    const home = current === undefined ? undefined : categoryOf(model.catalogue, current);
    const toggled = flipped.path === pathname ? flipped.ids : [];
    const filtering = query.trim() !== "";
    const categories = filterCatalogue(model.catalogue, query);
    const inChangelog = current === "changelog" || current?.startsWith("changelog/");

    useEffect(() => {
        const box = navRef.current;
        const row = box?.querySelector<HTMLElement>("[aria-current=page]");
        if (!box || !row) return;
        const outer = box.getBoundingClientRect();
        const inner = row.getBoundingClientRect();
        if (inner.top < outer.top) box.scrollTop -= outer.top - inner.top + 8;
        else if (inner.bottom > outer.bottom) box.scrollTop += inner.bottom - outer.bottom + 8;
    }, [pathname]);

    const flip = (id: string) => {
        setFlipped({
            path: pathname,
            ids: toggled.includes(id) ? toggled.filter((other) => other !== id) : [...toggled, id],
        });
    };

    return (
        <aside className="hidden border-r border-line-soft bg-side desk:block print:hidden">
            <nav
                ref={navRef}
                aria-label={aria("docsNav")}
                className="sticky top-15 flex h-[calc(100dvh-3.75rem)] flex-col gap-5.5 overflow-y-auto px-3.5 pt-5 pb-10 text-sm"
            >
                <label className="flex h-8.5 shrink-0 items-center gap-2 rounded-field border border-field bg-control px-2.5 focus-within:border-focus-line focus-within:ring-3 focus-within:ring-focus-ring">
                    <FunnelIcon aria-hidden="true" className="size-3.5 shrink-0 text-faint" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label={aria("filterEndpoints")}
                        placeholder={t("filter")}
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
                    />
                </label>
                {filtering ? null : (
                    <div className="flex flex-col gap-0.5">
                        <p className="px-2.5 pb-1.5 text-xs font-semibold text-ink">
                            {t("groups.introduction")}
                        </p>
                        {model.introduction.map((link) => (
                            <Row
                                key={link.slug}
                                link={link}
                                label={t(`items.${link.slug}`)}
                                current={current}
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-0.5">
                    <p className="px-2.5 pb-1.5 text-xs font-semibold text-ink">
                        {t("groups.catalogue")}
                    </p>
                    {categories.length === 0 ? (
                        <p role="status" className="px-2.5 text-[14px] text-faint">
                            {t("empty")}
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-0.5">
                            {categories.map((category) => (
                                <Category
                                    key={category.id}
                                    category={category}
                                    open={
                                        filtering ||
                                        (category.id === home) !== toggled.includes(category.id)
                                    }
                                    current={current}
                                    onToggle={() => flip(category.id)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
                {filtering || model.tools.length === 0 ? null : (
                    <div className="flex flex-col gap-0.5">
                        <p className="px-2.5 pb-1.5 text-xs font-semibold text-ink">
                            {t("groups.tools")}
                        </p>
                        {model.tools.map((link) => (
                            <div key={link.slug} className="flex flex-col gap-px">
                                <Row
                                    link={link}
                                    label={t(`items.${link.slug}`)}
                                    current={current}
                                />
                                {link.slug === "changelog" && inChangelog ? (
                                    <ul className="mb-1 ml-4 flex flex-col gap-px border-l border-line pl-2">
                                        {link.children.map((child) => (
                                            <li key={child.slug}>
                                                <Row link={child} current={current} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </nav>
        </aside>
    );
}
