import {
    InfoIcon,
    LightbulbIcon,
    type LucideIcon,
    OctagonAlertIcon,
    TriangleAlertIcon,
} from "lucide-react";

import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { pick } from "@/lib/inline";
import type { Block, CalloutKind } from "@/types/content";

export interface CalloutProps {
    block: Extract<Block, { type: "callout" }>;
    ctx: DocContext;
}

const KINDS: Record<CalloutKind, { icon: LucideIcon; rule: string }> = {
    info: { icon: InfoIcon, rule: "border-l-2 border-l-ink" },
    tip: { icon: LightbulbIcon, rule: "border-l-2 border-l-ink" },
    warning: { icon: TriangleAlertIcon, rule: "border-l-3 border-l-hl-edge" },
    danger: { icon: OctagonAlertIcon, rule: "border-l-3 border-l-destructive" },
};

/**
 * Note of the documentation: no box and no tint, only a left rule, an icon per kind and a bold
 * title over the body. The rule carries the meaning (ink for info and tip, yellow for warning, red
 * for danger) and the icon only repeats the title; the text wraps normally, not pretty.
 *
 * @param block - Callout block: kind, title and body, each in one or both languages
 * @param ctx - Context of the page: language and version, for the links of the text
 */
export function Callout({ block, ctx }: CalloutProps) {
    const { icon: Glyph, rule } = KINDS[block.kind];
    const title = pick(block.title, ctx.lang);
    const body = pick(block.body, ctx.lang);

    return (
        <div role="note" className={`flex items-start gap-3 pl-4 text-sm/[1.55] text-text ${rule}`}>
            <Glyph aria-hidden="true" className="mt-px size-4.5 shrink-0 text-ink" />
            <div className="flex min-w-0 flex-col gap-1.5">
                {title ? (
                    <p className="font-semibold">
                        <Inline text={title} ctx={ctx} />
                    </p>
                ) : null}
                {body.map((part, index) =>
                    part.type === "p" ? (
                        <p key={index} className="max-w-[64ch] text-wrap [&_code]:text-[14px]">
                            <Inline text={part.text} ctx={ctx} />
                        </p>
                    ) : (
                        <ul
                            key={index}
                            className="max-w-[64ch] list-disc pl-5 text-wrap [&_code]:text-[14px]"
                        >
                            {part.items.map((item, at) => (
                                <li key={at} className="text-wrap">
                                    <Inline text={item} ctx={ctx} />
                                </li>
                            ))}
                        </ul>
                    ),
                )}
            </div>
        </div>
    );
}
