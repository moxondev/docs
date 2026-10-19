"use client";

import type { KeyboardEvent } from "react";

import { nextTab } from "@/components/try/util";
import { cn } from "@/lib/utils";

export interface TabItem {
    id: string;
    label: string;
}

export interface TabListProps {
    items: readonly TabItem[];
    value: string;
    onChange: (id: string) => void;
    label: string;
    panelId: string;
    className?: string;
    tabClassName?: string;
}

/**
 * Builds the id of the tab button of an item, which its panel points to with aria-labelledby.
 *
 * @param panelId - Id of the tab panel the list controls
 * @param id - Id of the item, unique within the list
 * @returns The id of the tab button
 */
export function tabId(panelId: string, id: string): string {
    return `${panelId}-tab-${id}`;
}

/**
 * Tab list of the ARIA tabs pattern without a library: one button per item, the selected one in
 * the tab order, arrows, Home and End moving the selection. It replaces Radix Tabs for the two
 * small lists of the Try island, which spares every endpoint page the weight of the library.
 *
 * @param items - Tabs in display order, each with its id and its translated label
 * @param value - Id of the selected tab
 * @param onChange - Called with the id of the tab the reader picks
 * @param label - Accessible name of the list
 * @param panelId - Id of the tab panel this list controls
 * @param className - Classes of the list element
 * @param tabClassName - Classes of every tab button, with aria-selected for the selected look
 */
export function TabList({
    items,
    value,
    onChange,
    label,
    panelId,
    className,
    tabClassName,
}: TabListProps) {
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const index = items.findIndex((item) => item.id === value);
        const target = nextTab(items.length, index, event.key);
        if (target === null) return;
        event.preventDefault();
        onChange(items[target].id);
        event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus();
    };

    return (
        <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={className}>
            {items.map((item) => (
                <button
                    key={item.id}
                    id={tabId(panelId, item.id)}
                    type="button"
                    role="tab"
                    aria-selected={item.id === value}
                    aria-controls={panelId}
                    tabIndex={item.id === value ? 0 : -1}
                    onClick={() => onChange(item.id)}
                    className={cn("cursor-pointer", tabClassName)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
