"use client";

import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Try } from "@/components/try/Try";
import { setQueryParam, useQueryParam } from "@/hooks/useLocationSearch";
import { href } from "@/lib/routes";
import type { Lang } from "@/types/content";
import type { PlaygroundProps } from "@/types/try";

/**
 * The endpoint picker of the Playground, loaded after the first paint.
 * Its cmdk and popover are only needed on this page, so a placeholder of its size holds its place.
 *
 * @param version - Version whose operations are listed; printed before the path of the selected one
 * @param entries - Operations with try true of that version, each with its page slug and name
 * @param value - Slug of the selected entry, null when none is selected
 * @param onSelect - Called with the slug of the entry the reader picks
 */
const Picker = dynamic(() => import("@/components/try/Picker").then((m) => m.Picker), {
    ssr: false,
    loading: () => <div aria-hidden="true" className="h-11 w-full max-w-md rounded-box bg-chip" />,
});

/**
 * The Playground page body: an endpoint picker, the inline Try form of the chosen operation and a
 * link to its documentation. The choice lives in the address (?endpoint=hash), so a link from the
 * documentation or the search palette lands with the endpoint already selected.
 *
 * @param version - Version whose operations are offered; the API version of every request
 * @param entries - Operations with try true of that version, each with its page slug and name
 */
export function Playground({ version, entries }: PlaygroundProps) {
    const t = useTranslations("playground");
    const lang = useLocale() as Lang;
    const slug = useQueryParam("endpoint");
    const entry = entries.find((candidate) => candidate.slug === slug) ?? null;

    return (
        <section className="flex flex-col gap-3 py-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Picker
                    version={version}
                    entries={entries}
                    value={entry?.slug ?? null}
                    onSelect={(next) => setQueryParam("endpoint", next)}
                />
                {entry ? (
                    <Link
                        href={href(lang, version, entry.slug)}
                        className="prose-link inline-flex items-center gap-1 text-[13px]"
                    >
                        {t("viewDocs")}
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </Link>
                ) : null}
            </div>
            {entry ? (
                <Try
                    key={`${version}/${entry.slug}`}
                    version={version}
                    op={entry.op}
                    variant="inline"
                />
            ) : (
                <p className="rounded-panel border border-dashed border-field px-6 py-10 text-center text-[14px] text-muted">
                    {t("empty")}
                </p>
            )}
        </section>
    );
}
