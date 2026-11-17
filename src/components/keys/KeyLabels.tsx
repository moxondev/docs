"use client";

import { CommandIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { KeyLabel } from "@/hooks/useModKey";

export interface KeyLabelsProps {
    labels: readonly KeyLabel[];
}

/**
 * Key combination of a shortcut hint, in reading order: the keys as words of the messages (Ctrl,
 * Enter, Esc) or characters, and the Command key of Apple platforms as the Lucide Command icon
 * rather than a Unicode glyph, with the word "Cmd" as hidden text for screen readers.
 *
 * @param labels - Keys to print, from useShortcutLabels or a single named key
 */
export function KeyLabels({ labels }: KeyLabelsProps) {
    const common = useTranslations("common");

    return (
        <span className="inline-flex items-center gap-[1ch]">
            {labels.map((label, index) =>
                "text" in label ? (
                    <span key={index}>{label.text}</span>
                ) : label.word === "cmd" ? (
                    <span key={index} className="inline-flex items-center">
                        <CommandIcon aria-hidden="true" className="size-3" />
                        <span className="sr-only">{common("keys.cmd")}</span>
                    </span>
                ) : (
                    <span key={index}>{common(`keys.${label.word}`)}</span>
                ),
            )}
        </span>
    );
}
