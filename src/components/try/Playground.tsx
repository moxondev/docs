"use client";

import { useTranslations } from "next-intl";

import type { PlaygroundProps } from "@/types/try";

/**
 * Static placeholder of the Playground, standing in until the interactive picker exists.
 * It shows the picker prompt, the endpoints the picker will offer and the empty-state sentence.
 *
 * @param version - Version whose operations are offered; the API version of every request
 * @param entries - Operations with try true of that version, each with its page slug and name
 */
export function Playground({ version, entries }: PlaygroundProps) {
    const t = useTranslations("playground");

    return (
        <section
            data-stub="playground"
            data-version={version}
            className="flex flex-col gap-3 rounded-panel border border-dashed border-field p-6"
        >
            <p className="text-sm font-medium text-ink">{t("selectEndpoint")}</p>
            <ul className="flex flex-wrap gap-1.5 font-mono text-xs">
                {entries.map((entry) => (
                    <li key={entry.slug} className="rounded-chip bg-chip px-1.75 py-0.5 text-ink">
                        {entry.name}
                    </li>
                ))}
            </ul>
            <p className="text-[13px] text-muted">{t("empty")}</p>
        </section>
    );
}
