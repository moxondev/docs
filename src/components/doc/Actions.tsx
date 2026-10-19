"use client";

import { CheckIcon, CopyIcon, FlaskConicalIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/useCopy";

export interface ActionsProps {
    markdownUrl: string;
    playgroundHref?: string;
}

/**
 * Actions beside the page title, hidden on a phone: copy the page as Markdown, fetched from its
 * static export only when the button is pressed, and open the Playground with this endpoint
 * preselected. The success of the copy is announced through a polite live region.
 *
 * @param markdownUrl - Site path of the Markdown export of this page, under /md/
 * @param playgroundHref - Playground link with its ?endpoint= preset, absent on a page without Try
 */
export function Actions({ markdownUrl, playgroundHref }: ActionsProps) {
    const t = useTranslations("endpoint");
    const common = useTranslations("common");
    const { status, copy } = useCopy();
    const Glyph = status === "copied" ? CheckIcon : CopyIcon;

    return (
        <div className="hidden items-center gap-2 desk:flex">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                    void copy(async () => {
                        const response = await fetch(markdownUrl);
                        if (!response.ok) throw new Error(`${response.status}`);
                        return response.text();
                    })
                }
            >
                <Glyph aria-hidden="true" />
                {status === "copied"
                    ? t("markdownCopied")
                    : status === "failed"
                      ? common("copyFailed")
                      : t("copyMarkdown")}
            </Button>
            <span role="status" className="sr-only">
                {status === "copied" ? t("markdownCopied") : ""}
            </span>
            {playgroundHref ? (
                <Button asChild variant="outline" size="sm">
                    <Link href={playgroundHref}>
                        <FlaskConicalIcon aria-hidden="true" />
                        {t("playground")}
                    </Link>
                </Button>
            ) : null}
        </div>
    );
}
