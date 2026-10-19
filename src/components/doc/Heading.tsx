import { LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface HeadingProps {
    level: 2 | 3;
    id: string;
    label: string;
    count?: number;
    children: ReactNode;
}

/**
 * Section heading of a documentation page: the id the Toc, the search flash and the permalink
 * aim at, an optional mono count beside the title, and a permalink control that sits beside the
 * heading so that the heading is named by its title alone.
 *
 * @param level - 2 for a section, 3 for a sub-section
 * @param id - Section id, language-neutral, the target of every fragment link
 * @param label - Plain title of the section, read in the name of the permalink control
 * @param count - Number shown after the title, for a list of values
 * @param children - The title, as inline nodes
 */
export function Heading({ level, id, label, count, children }: HeadingProps) {
    const aria = useTranslations("aria");
    const Tag = level === 2 ? "h2" : "h3";

    return (
        <div className="group/heading flex items-baseline gap-2">
            <Tag
                id={id}
                className={cn(
                    "flex min-w-0 scroll-mt-17 items-baseline gap-2 font-display font-semibold text-ink",
                    level === 2
                        ? "text-[19px]/[1.2] tracking-[-0.01em] desk:text-xl/[1.2]"
                        : "text-base/[1.3] tracking-[-0.005em]",
                )}
            >
                <span>{children}</span>
                {count === undefined ? null : (
                    <span className="font-mono text-sm font-normal tracking-normal text-faint">
                        {count}
                    </span>
                )}
            </Tag>
            <a
                href={`#${id}`}
                aria-label={aria("permalink", { title: label })}
                className="relative shrink-0 self-center rounded-tag p-1 text-faint opacity-0 after:absolute after:-inset-3 hover:text-ink focus-visible:opacity-100 group-hover/heading:opacity-100 desk:after:hidden"
            >
                <LinkIcon aria-hidden="true" className="size-3.5" />
            </a>
        </div>
    );
}
