import { ArrowRightIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NEW_TAB_ID } from "@/components/doc/context";
import { type IconName, type InlineNode, parseInline, pick } from "@/lib/inline";
import { linkAttrs, type RefContext, resolveRef } from "@/lib/routes";
import type { Inline as InlineText, Lx } from "@/types/content";

export interface InlineProps {
    text: Lx<InlineText>;
    ctx: RefContext;
}

export interface NodesProps {
    nodes: readonly InlineNode[];
    ctx: RefContext;
}

export interface IconProps {
    name: IconName;
}

const ICONS: Record<IconName, LucideIcon> = { "arrow-right": ArrowRightIcon };

/**
 * Draws an icon token of the inline grammar: the Lucide icon sized to the text, hidden from
 * assistive technology, followed by the word that says what it means.
 *
 * @param name - Icon of the allow-list; the word read after it comes from messages (aria.arrow)
 */
function Icon({ name }: IconProps) {
    const aria = useTranslations("aria");
    const Glyph = ICONS[name];

    return (
        <>
            <Glyph aria-hidden="true" className="inline size-[1em] align-[-0.125em]" />
            <span className="sr-only">{aria("arrow")}</span>
        </>
    );
}

/**
 * Draws a list of inline nodes: text, code spans, strong, emphasis, links and icons. An internal
 * link keeps the page in the client router, a web link to another host opens a tab and points at
 * the hidden sentence that says so.
 *
 * @param nodes - Nodes of one parsed inline string
 * @param ctx - Language and version of the page, which resolve the ref: targets of the links
 */
function Nodes({ nodes, ctx }: NodesProps): ReactNode {
    return nodes.map((node, index) => {
        switch (node.type) {
            case "text":
                return node.value;
            case "code":
                return (
                    <code
                        key={index}
                        className="rounded-chip bg-chip px-1 py-px font-mono text-[0.875em] text-ink"
                    >
                        {node.value}
                    </code>
                );
            case "strong":
                return (
                    <strong key={index} className="font-semibold text-ink">
                        <Nodes nodes={node.children} ctx={ctx} />
                    </strong>
                );
            case "em":
                return (
                    <em key={index}>
                        <Nodes nodes={node.children} ctx={ctx} />
                    </em>
                );
            case "icon":
                return <Icon key={index} name={node.name} />;
            case "link": {
                const attrs = linkAttrs(resolveRef(node.target, ctx));
                const children = <Nodes nodes={node.children} ctx={ctx} />;
                if (attrs.target) {
                    return (
                        <a
                            key={index}
                            {...attrs}
                            aria-describedby={NEW_TAB_ID}
                            className="prose-link"
                        >
                            {children}
                        </a>
                    );
                }
                if (attrs.rel || !attrs.href.startsWith("/")) {
                    return (
                        <a key={index} {...attrs} className="prose-link">
                            {children}
                        </a>
                    );
                }
                return (
                    <Link key={index} href={attrs.href} className="prose-link">
                        {children}
                    </Link>
                );
            }
        }
    });
}

/**
 * Renders one inline string of the content: the grammar is parsed on the server and drawn as
 * React nodes, never as an HTML string, so nothing in the text can inject markup.
 *
 * @param text - Inline string, or one per language; the language of ctx picks it
 * @param ctx - Language and version of the page, for the links
 */
export function Inline({ text, ctx }: InlineProps) {
    return <Nodes nodes={parseInline(pick(text, ctx.lang))} ctx={ctx} />;
}
