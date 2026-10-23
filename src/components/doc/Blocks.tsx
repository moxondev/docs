import type { ReactNode } from "react";

import { Callout } from "@/components/doc/Callout";
import { Code } from "@/components/doc/Code";
import type { DocContext } from "@/components/doc/context";
import { Details } from "@/components/doc/Details";
import { Errors } from "@/components/doc/Errors";
import { Fields } from "@/components/doc/Fields";
import { valueGroups } from "@/components/doc/groups";
import { Heading } from "@/components/doc/Heading";
import { Inline } from "@/components/doc/Inline";
import { Plans } from "@/components/doc/Plans";
import { PlaygroundBlock } from "@/components/doc/PlaygroundBlock";
import { Related } from "@/components/doc/Related";
import { Release } from "@/components/doc/Release";
import { Route } from "@/components/doc/Route";
import { Scope } from "@/components/doc/Scope";
import { Status } from "@/components/doc/Status";
import { Table } from "@/components/doc/Table";
import { Values } from "@/components/doc/Values";
import { Samples } from "@/components/try/Samples";
import { Try } from "@/components/try/Try";
import { NAV } from "@/data/nav";
import { SITE } from "@/data/site";
import { pick, plain } from "@/lib/inline";
import { mentionedStatus } from "@/lib/nav";
import { apiPath, exampleRequest } from "@/lib/request";
import { cn } from "@/lib/utils";
import type { Block, Inline as InlineText, Lx, Section } from "@/types/content";

export interface BlocksProps {
    blocks: readonly Block[];
    ctx: DocContext;
    head?: ReactNode;
}

export interface BlockViewProps {
    block: Block;
    ctx: DocContext;
    head?: ReactNode;
}

export interface SectionsProps {
    sections: readonly Section[];
    ctx: DocContext;
}

export interface LineStatusProps {
    text: Lx<InlineText>;
    ctx: DocContext;
}

// No-break space that keeps the marker on the same line as the last word of its text
const GLUE = String.fromCodePoint(0xa0);

/**
 * Builds the example of the filter of a Values block: the start of a featured value that has a
 * dash ("sha3" for "sha3-256"), else the first value of the list.
 *
 * @param ctx - Context of the page, which holds the featured values of its parameters
 * @param first - First value of the block, the fallback
 * @returns The example printed in the placeholder of the filter
 */
function filterExample(ctx: DocContext, first: string): string {
    const dashed = ctx.featured.find((value) => value.includes("-"));
    return dashed ? dashed.split("-")[0] : first;
}

/**
 * Marker at the end of a changelog line that links a page with a status: the word on the marker,
 * as the title of that page shows it. It closes the line so the text stays as written, and a
 * no-break space ties it to the last word, so it wraps with that word, never alone.
 *
 * @param text - Inline string of the line, one per language or written once
 * @param ctx - Context of the page: its kind, language and version, which resolve the links
 */
function LineStatus({ text, ctx }: LineStatusProps) {
    if (ctx.page.kind !== "release" && ctx.page.kind !== "changelog") return null;
    const status = mentionedStatus(NAV, pick(text, ctx.lang), ctx.version);
    if (!status) return null;

    return (
        <span className="whitespace-nowrap">
            {GLUE}
            <Status status={status} variant="mark" />
        </span>
    );
}

/**
 * Draws one block of a section: the component of its type, fed with the derived anchors and the
 * operation the context holds for it. The page-level blocks that have a column of their own (the
 * Try panel) draw nothing here; only an auto-send Try stays inline.
 *
 * @param block - Block to draw, the very object that ctx keys its operation by
 * @param ctx - Context of the page: language, version, anchors, operations
 * @param head - Heading of the section, which a Values block carries beside its filter
 */
function BlockView({ block, ctx, head }: BlockViewProps) {
    const { lang, version } = ctx;
    const operation = ctx.operations.get(block);
    const ids = ctx.anchors.rows.get(block) ?? [];

    switch (block.type) {
        case "p":
            return (
                <p className="max-w-(--measure) text-[16px]/[1.7] text-text">
                    <Inline text={block.text} ctx={ctx} />
                    <LineStatus text={block.text} ctx={ctx} />
                </p>
            );
        case "label":
            return (
                <p className="max-w-(--measure) text-[16px]/[1.7] font-semibold text-ink">
                    <Inline text={block.text} ctx={ctx} />
                </p>
            );
        case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
                <List
                    className={
                        block.ordered
                            ? "max-w-(--measure) list-decimal pl-5.5 text-[16px]/[1.7] text-text marker:text-faint"
                            : "max-w-(--measure) list-disc pl-5.5 text-[16px]/[1.7] text-text marker:text-faint"
                    }
                >
                    {block.items.map((item, index) => (
                        <li key={index} className="mt-1 first:mt-0">
                            <Inline text={item} ctx={ctx} />
                            <LineStatus text={item} ctx={ctx} />
                        </li>
                    ))}
                </List>
            );
        }
        case "quote":
            return (
                <blockquote className="max-w-(--measure) border-l-2 border-line pl-4 text-[16px]/[1.7] text-muted">
                    <p>
                        <Inline text={block.text} ctx={ctx} />
                    </p>
                </blockquote>
            );
        case "rule":
            return <hr className="border-line-soft" />;
        case "callout":
            return <Callout block={block} ctx={ctx} />;
        case "details":
            return (
                <Details title={<Inline text={pick(block.title, lang)} ctx={ctx} />}>
                    <Blocks blocks={block.body} ctx={ctx} />
                </Details>
            );
        case "values": {
            const groups = valueGroups(block.groups, lang, ctx.featured);
            return (
                <Values
                    head={head}
                    description={plain(pick(block.title, lang))}
                    example={filterExample(ctx, groups[0]?.items[0] ?? "")}
                    groups={groups}
                />
            );
        }
        case "code":
            return <Code block={block} lang={lang} />;
        case "table":
            return <Table block={block} ctx={ctx} />;
        case "params":
        case "fields":
            return <Fields block={block} ids={ids} ctx={ctx} operation={operation} />;
        case "errors":
            return <Errors block={block} ids={ids} ctx={ctx} />;
        case "endpoint":
            return operation ? (
                <Route
                    method={operation.method}
                    host={SITE.api}
                    path={apiPath(version, operation)}
                />
            ) : null;
        case "examples":
            return operation ? (
                <Samples request={exampleRequest(version, operation, block, lang)} />
            ) : null;
        case "try":
            return block.autoSend && operation ? (
                <Try version={version} op={operation} variant="inline" autoSend />
            ) : null;
        case "related":
            return <Related block={block} ctx={ctx} />;
        case "plans":
            return <Plans ctx={ctx} />;
        case "playground":
            return (
                <Scope lang={lang} tree="playground">
                    <PlaygroundBlock ctx={ctx} />
                </Scope>
            );
        case "split":
            return <Blocks blocks={block[lang]} ctx={ctx} />;
    }
}

/**
 * Draws the blocks of a section in a column, one gap apart. A split block is drawn as the blocks
 * of the language of the page, so its branches share the column.
 *
 * @param blocks - Blocks of the section, in order
 * @param ctx - Context of the page, handed to every block
 * @param head - Heading of the section for a Values block among them, otherwise not drawn here
 */
export function Blocks({ blocks, ctx, head }: BlocksProps) {
    return (
        <div className="flex flex-col gap-4">
            {blocks.map((block, index) => (
                <BlockView
                    key={index}
                    block={block}
                    ctx={ctx}
                    head={index === 0 ? head : undefined}
                />
            ))}
        </div>
    );
}

/**
 * Draws the sections of a page: each titled one with its heading and permalink, the release line
 * after the first heading of a release page, then its blocks. A Values list takes the heading of
 * its section for its filter row, and a heading with no content sits close above its subsection.
 *
 * @param sections - Sections to draw, in order
 * @param ctx - Context of the page, which also holds the release line
 */
export function Sections({ sections, ctx }: SectionsProps) {
    const { lang } = ctx;
    const shown = sections.filter((section) => !section.only || section.only === lang);
    const first = shown.findIndex((section) => section.title !== undefined);

    return (
        <>
            {shown.map((section, index) => {
                const title = section.title ? pick(section.title, lang) : undefined;
                const values = section.blocks[0]?.type === "values" ? section.blocks[0] : undefined;
                const count = values?.groups.reduce((sum, group) => sum + group.items.length, 0);
                const before = index > 0 ? shown[index - 1] : undefined;
                const nested =
                    before !== undefined &&
                    before.blocks.length === 0 &&
                    (section.level ?? 2) > (before.level ?? 2);
                const heading =
                    title === undefined ? null : (
                        <Heading
                            level={section.level ?? 2}
                            id={section.id}
                            label={plain(title)}
                            count={count}
                        >
                            <Inline text={title} ctx={ctx} />
                        </Heading>
                    );

                return (
                    <section
                        key={`${section.id}-${index}`}
                        className={cn(
                            "flex flex-col gap-4",
                            section.id === "" || nested ? "mt-5" : "mt-10",
                        )}
                    >
                        {values ? null : heading}
                        {index === first && ctx.page.release ? <Release ctx={ctx} /> : null}
                        <Blocks
                            blocks={section.blocks}
                            ctx={ctx}
                            head={values ? heading : undefined}
                        />
                    </section>
                );
            })}
        </>
    );
}
