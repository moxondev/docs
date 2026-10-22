import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Wordmark } from "@/components/chrome/Logo";
import { majorOf } from "@/components/chrome/targets";
import { cn } from "@/lib/utils";
import type { Version } from "@/types/content";

export interface VersionsFaceProps {
    version: Version;
    label: string;
    className?: string;
}

/**
 * Content of the version trigger of the full header: the wordmark, the major of the version being
 * read in mono muted text and a chevron, nudged down from the wordmark center. Shared by the plain
 * trigger and the dropdown trigger, so the lazy swap of one for the other moves nothing.
 *
 * @param version - Version being read, for the accessible name
 * @param label - Visible label of that version, the major
 * @param className - Extra classes for the version and the chevron, not for the wordmark: the fade
 *   of a header swap, which must leave the wordmark steady
 */
export function VersionsFace({ version, label, className }: VersionsFaceProps) {
    const aria = useTranslations("aria");

    return (
        <>
            <Wordmark size="header" />
            <span
                aria-hidden="true"
                className={cn(
                    "flex translate-y-0.75 items-center gap-1 font-mono text-xs text-muted group-hover:text-ink group-aria-expanded:text-ink",
                    className,
                )}
            >
                {label}
                <ChevronDownIcon className="size-3.5" />
            </span>
            <span className="sr-only">{aria("versionTrigger", { major: majorOf(version) })}</span>
        </>
    );
}
