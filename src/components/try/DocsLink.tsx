"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export interface DocsLinkProps {
    href: string;
    className?: string;
}

/**
 * Link from the Playground to the documentation page of the operation. It opens in the same tab,
 * so it ends with the right arrow and not the up-right one of a new tab.
 *
 * @param href - Address of the documentation page, already localized; nothing renders when empty
 * @param className - Extra classes, which hide the copy that is not on screen
 */
export function DocsLink({ href, className }: DocsLinkProps) {
    const t = useTranslations("try");

    if (href === "") return null;

    return (
        <Link
            href={href}
            className={cn(
                "prose-link inline-flex items-center gap-1 text-[14px] max-desk:min-h-11",
                className,
            )}
        >
            {t("viewDocs")}
            <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
    );
}
