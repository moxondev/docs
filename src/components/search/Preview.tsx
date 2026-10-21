import { CornerDownLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Method } from "@/components/doc/Method";
import { Status } from "@/components/doc/Status";
import { KeyLabels } from "@/components/KeyLabels";
import type { ActivateMode, DocEntry, Entry } from "@/components/search/entries";
import { Kbd } from "@/components/ui/kbd";
import { CATEGORIES } from "@/data/catalogue";
import { NAV } from "@/data/nav";
import { SITE } from "@/data/site";
import { useModKey } from "@/hooks/useModKey";
import { catalogueEntry } from "@/lib/nav";
import { parsePath } from "@/lib/routes";
import { pageParams, playgroundHref, type SearchIndex } from "@/lib/search";
import type { Lang } from "@/types/content";
import type { SearchDoc } from "@/types/search";

export interface PreviewProps {
    entry: DocEntry;
    index: SearchIndex;
    lang: Lang;
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

export interface FirstParamProps {
    doc: SearchDoc;
    others: SearchDoc[];
}

export interface ActionProps {
    onClick: () => void;
    children: ReactNode;
    keys: ReactNode;
}

// Names listed after "+ n more parameters" before the list is cut
const NAMES_MAX = 4;

// Ellipsis closing a cut list of names (built from its code point: ASCII source)
const ELLIPSIS = String.fromCodePoint(0x2026);

/**
 * Splits the p key of a parameter row into its type and its tag.
 *
 * @param key - Value of p, for example "enum!" (required), "string~" (conditional) or "number"
 * @returns The type, and the tag as the key of messages common.tags, null for an optional one
 */
function typeAndTag(key: string | undefined): {
    type: string;
    tag: "required" | "conditional" | null;
} {
    const type = (key ?? "string").replace(/[!~]$/, "");
    if (key?.endsWith("!")) return { type, tag: "required" };
    if (key?.endsWith("~")) return { type, tag: "conditional" };
    return { type, tag: null };
}

/**
 * First parameter of the page and the names of the others, as the preview shows them: the name,
 * its type, its tag and its description, then "+ 2 more parameters: method, encoding".
 *
 * @param doc - First parameter row of the page; always a parameter row, since the preview mounts
 *   this only when the page has one
 * @param others - Parameter rows after the first one
 */
function FirstParam({ doc, others }: FirstParamProps) {
    const t = useTranslations("search");
    const common = useTranslations("common");
    const { type, tag } = typeAndTag(doc.p);
    const shown = others.slice(0, NAMES_MAX).map((other) => other.t);
    const names = others.length > NAMES_MAX ? [...shown, ELLIPSIS].join(", ") : shown.join(", ");

    return (
        <>
            <h4 className="mt-5 mb-2 text-xs font-medium text-faint">{t("preview.firstParam")}</h4>
            <div className="flex flex-col gap-1 border-y border-line py-3">
                <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[14px] font-semibold text-ink">{doc.t}</span>
                    <span className="font-mono text-xs text-muted">{type}</span>
                    {tag ? (
                        <span className="rounded-tag bg-req-bg px-1.5 py-px text-xs text-req">
                            {common(`tags.${tag}`)}
                        </span>
                    ) : null}
                </div>
                {doc.d ? <p className="line-clamp-2 text-[14px]/[1.5] text-text">{doc.d}</p> : null}
            </div>
            <p className="pt-3 text-[14px] text-muted">
                {others.length > 0
                    ? t("preview.moreParams", { count: others.length, names })
                    : t("preview.noParams")}
            </p>
        </>
    );
}

/**
 * Action row pinned at the bottom of the preview: a label and the keys that trigger it. The
 * keyboard focus fills the row with the yellow ground of the selected result instead of drawing
 * the page outline, which would box the row against the quiet panel.
 *
 * @param onClick - Called when the row is clicked, to open the page or to try it in the Playground
 * @param children - Label of the action
 * @param keys - Key hints at the right of the row
 */
function Action({ onClick, children, keys }: ActionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="-mx-2.5 flex h-9.5 w-[calc(100%+1.25rem)] cursor-pointer items-center justify-between rounded-cta px-2.5 text-left text-[14.5px] text-ink transition-colors duration-150 hover:bg-chip focus-visible:bg-active focus-visible:outline-none"
        >
            {children}
            <span className="flex items-center gap-1">{keys}</span>
        </button>
    );
}

/**
 * Preview of the selected result, beside the list on desktop: the page with its category, route,
 * description and first parameter, and the actions to open it and to try it in the Playground. A
 * parameter, an error or a section shows the page it belongs to, since that is what opens.
 *
 * @param entry - Selected row of a document
 * @param index - Index of the version, which gives the page of a row and its parameters
 * @param lang - Language of the index, for the category name
 * @param onActivate - Opens the selected row, in the page or in the Playground
 */
export function Preview({ entry, index, lang, onActivate }: PreviewProps) {
    const t = useTranslations("search");
    const keys = useModKey();
    const { doc } = entry;
    const page = index.byKey.get(`${doc.u}#`) ?? doc;
    const { slug } = parsePath(doc.u);
    const meta = slug ? catalogueEntry(slug) : undefined;
    const category = CATEGORIES.find((candidate) => candidate.id === meta?.category);
    const params = pageParams(index, doc);
    const tryable = playgroundHref(doc, NAV) !== null;

    return (
        <>
            <p className="mb-2 text-xs text-muted">
                {category ? category.title[lang] : t("groups.pages")}
            </p>
            <div className="flex items-center gap-2.5">
                <h3 className="text-[22px]/[1.15] font-semibold tracking-[-0.02em] text-ink">
                    {page.t}
                </h3>
                {page.s ? <Status status={page.s} variant="mark" /> : null}
            </div>
            {page.r ? (
                <div className="mt-2.5 mb-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[13.5px] text-muted">
                    {page.m?.length ? <Method methods={page.m} variant="tag" /> : null}
                    <span className="min-w-0 break-all">
                        {SITE.api}
                        <span className="font-medium text-ink">{page.r}</span>
                    </span>
                </div>
            ) : (
                <div className="h-3.5" />
            )}
            {page.d ? <p className="text-sm/[1.6] text-text">{page.d}</p> : null}
            {params.length > 0 ? <FirstParam doc={params[0]} others={params.slice(1)} /> : null}
            <div className="mt-auto flex flex-col">
                <Action
                    onClick={() => onActivate(entry, "open")}
                    keys={
                        <Kbd aria-hidden="true">
                            <CornerDownLeftIcon />
                        </Kbd>
                    }
                >
                    {t("preview.openPage")}
                </Action>
                {tryable ? (
                    <Action
                        onClick={() => onActivate(entry, "playground")}
                        keys={
                            <>
                                <Kbd aria-hidden="true">
                                    <KeyLabels labels={[{ word: keys.mod }]} />
                                </Kbd>
                                <Kbd aria-hidden="true">
                                    <CornerDownLeftIcon />
                                </Kbd>
                            </>
                        }
                    >
                        {t("preview.openPlayground")}
                    </Action>
                ) : null}
            </div>
        </>
    );
}
