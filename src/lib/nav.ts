import { CATALOGUE, CATEGORIES, type CategoryId, type EndpointMeta } from "@/data/catalogue";
import { localePath } from "@/i18n/routing";
import { pick, plain } from "@/lib/inline";
import { hasPage, href } from "@/lib/routes";
import type { Block, Lang, Method, Page, Section, Version } from "@/types/content";
import type { Nav, SlimMeta } from "@/types/nav";

export type NavGroup = "introduction" | "catalogue" | "tools";

export interface NavLink {
    slug: string;
    title: string;
    href: string;
    methods: Method[];
    children: NavLink[];
}

export interface NavCategory {
    id: CategoryId;
    title: string;
    anchor: string;
    count: number;
    items: NavLink[];
}

export interface SidebarModel {
    introduction: NavLink[];
    catalogue: NavCategory[];
    tools: NavLink[];
}

export interface PagerModel {
    prev?: NavLink;
    next?: NavLink;
}

export type CrumbItem =
    | { type: "group"; group: NavGroup; href?: string }
    | { type: "link"; title: string; href: string }
    | { type: "current"; title: string };

export type TocLabel = "params" | "fields" | "examples" | "errors" | "related";

export interface TocEntry {
    id: string;
    level: 2 | 3;
    title: string;
    label?: TocLabel;
}

// Pages of the Introduction group in sidebar order
export const INTRODUCTION: readonly string[] = ["index", "authentication", "pricing"];

// Pages of the Tools group in sidebar order; the manifest of the npm package is one of them
export const TOOLS: readonly string[] = ["playground", "changelog", "manifest"];

// Fragment of the home catalogue section, the target of the first breadcrumb link
export const CATALOGUE_ANCHOR = "catalogue";

// Display order of the method marks of an endpoint family, so Pow reads "GET POST"
const METHOD_ORDER: readonly Method[] = ["get", "post", "put", "patch", "delete"];

// Short Toc label of each typed block; any other section keeps its title
const TOC_LABELS: Partial<Record<Block["type"], TocLabel>> = {
    params: "params",
    fields: "fields",
    examples: "examples",
    errors: "errors",
    related: "related",
};

/**
 * Finds the catalogue entry of a page: the entry of that id, or of its first segment for a
 * sub-page ("captcha/verify" belongs to "captcha", "tic-tac-toe/play" to "tic-tac-toe").
 *
 * @param slug - Page id in any version
 * @returns The entry, or undefined for the pages outside the catalogue (guides, tools, releases)
 */
export function catalogueEntry(slug: string): EndpointMeta | undefined {
    const root = slug.split("/")[0];
    return CATALOGUE.find((entry) => entry.slug === root);
}

/**
 * Tells whether a catalogue entry shows in the sidebar, the home catalogue and the pager of a
 * version (an unlisted entry stays reachable and searchable).
 *
 * @param entry - Catalogue entry, whose unlisted versions are read
 * @param version - Version being navigated
 * @returns False when the entry is unlisted in that version
 */
export function isListed(entry: EndpointMeta, version: Version): boolean {
    return !entry.unlisted?.includes(version);
}

/**
 * Compares two release page ids by release number, newest first ("changelog/6.1.0" before
 * "changelog/6.0.0", "changelog/4.10.0" before "changelog/4.9.0").
 *
 * @param a - Release page id
 * @param b - Release page id
 * @returns A negative number when a is the newer release
 */
function newestFirst(a: string, b: string): number {
    const parts = (id: string) => (id.split("/").pop() ?? "").split(".").map(Number);
    const left = parts(a);
    const right = parts(b);
    for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
        const diff = (right[i] ?? 0) - (left[i] ?? 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

/**
 * Lists the release pages of a version, newest first: the changelog children of the sidebar and
 * the order of the release pager.
 *
 * @param nav - Navigation index; an unpromoted version is an empty record
 * @param version - Version whose changelog is read
 * @returns Page ids such as "changelog/6.1.0"
 */
export function releasePages(nav: Nav, version: Version): string[] {
    return Object.keys(nav[version])
        .filter((slug) => nav[version][slug].kind === "release")
        .sort(newestFirst);
}

/**
 * Lists the sub-pages of a page in id order ("captcha/verify" under "captcha"); release pages
 * are left out, they have their own order.
 *
 * @param nav - Navigation index; an unpromoted version is an empty record
 * @param version - Version whose pages are read
 * @param slug - Id of the parent page
 * @returns The ids of the pages one or more levels below it
 */
export function subPages(nav: Nav, version: Version, slug: string): string[] {
    const prefix = `${slug}/`;
    return Object.keys(nav[version])
        .filter((id) => id.startsWith(prefix) && nav[version][id].kind !== "release")
        .sort();
}

/**
 * Gives the method marks of an endpoint family: the methods of the page and of its sub-pages,
 * in a fixed order, so Pow and Captcha show GET POST.
 *
 * @param nav - Navigation index, whose methods are the operations of each page
 * @param version - Version whose pages are read
 * @param slug - Id of the family page ("pow")
 * @returns The distinct methods, empty when the version has no such page
 */
export function familyMethods(nav: Nav, version: Version, slug: string): Method[] {
    if (!hasPage(nav, version, slug)) return [];
    const ids = [slug, ...subPages(nav, version, slug)];
    const found = new Set(ids.flatMap((id) => nav[version][id].methods));
    return METHOD_ORDER.filter((method) => found.has(method));
}

/**
 * Gives the short title of a page in the navigation: the catalogue name for the page of an
 * endpoint family ("QR Code"), else the plain page title.
 *
 * @param nav - Navigation index holding the page titles
 * @param version - Version of the page
 * @param slug - Page id, present in that version
 * @param lang - Language of the title
 * @returns The title to print in the sidebar, the pager and the breadcrumb
 */
export function navTitle(nav: Nav, version: Version, slug: string, lang: Lang): string {
    const entry = catalogueEntry(slug);
    return entry?.slug === slug ? entry.name : nav[version][slug].title[lang];
}

/**
 * Builds the link of one page of the navigation.
 *
 * @param nav - Navigation index holding the titles and methods
 * @param version - Version of the page
 * @param slug - Page id, present in that version
 * @param lang - Language of the title and of the href
 * @returns The link without children; a family page carries the methods of its sub-pages too
 */
function navLink(nav: Nav, version: Version, slug: string, lang: Lang): NavLink {
    const entry = catalogueEntry(slug);
    return {
        slug,
        title: navTitle(nav, version, slug, lang),
        href: href(lang, version, slug),
        methods:
            entry?.slug === slug ? familyMethods(nav, version, slug) : nav[version][slug].methods,
        children: [],
    };
}

/**
 * Lists the catalogue entries that a version shows, in the order of the catalogue (category,
 * then name), with the pages that exist in that version only.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version being navigated
 * @returns The listed entries whose primary page exists in the version
 */
function listedEntries(nav: Nav, version: Version): EndpointMeta[] {
    return CATALOGUE.filter(
        (entry) => hasPage(nav, version, entry.slug) && isListed(entry, version),
    );
}

/**
 * Builds the sidebar of a version: the Introduction pages, the catalogue by category with the
 * entry counts and the sub-pages nested one level, then the Tools with the releases under the
 * changelog. Categories without a listed entry are left out.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version being navigated
 * @param lang - Language of the titles and hrefs
 * @returns The three groups of the sidebar
 */
export function sidebar(nav: Nav, version: Version, lang: Lang): SidebarModel {
    const present = (slug: string) => hasPage(nav, version, slug);
    const entries = listedEntries(nav, version);
    const catalogue = CATEGORIES.map((category) => {
        const items = entries
            .filter((entry) => entry.category === category.id)
            .map((entry) => ({
                ...navLink(nav, version, entry.slug, lang),
                children: subPages(nav, version, entry.slug).map((slug) =>
                    navLink(nav, version, slug, lang),
                ),
            }));
        return {
            id: category.id,
            title: category.title[lang],
            anchor: category.anchor,
            count: items.length,
            items,
        };
    }).filter((category) => category.count > 0);
    const tools = TOOLS.filter(present).map((slug) => ({
        ...navLink(nav, version, slug, lang),
        children:
            slug === "changelog"
                ? releasePages(nav, version).map((id) => navLink(nav, version, id, lang))
                : [],
    }));
    return {
        introduction: INTRODUCTION.filter(present).map((slug) => navLink(nav, version, slug, lang)),
        catalogue,
        tools,
    };
}

/**
 * Gives the reading order of a version, the one of the pager: the Introduction pages, the
 * catalogue entries by category with each sub-page right after its parent, then the Tools.
 * Release pages and unlisted entries are not in it.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version being navigated
 * @returns Page ids in reading order
 */
export function pageOrder(nav: Nav, version: Version): string[] {
    const present = (slug: string) => hasPage(nav, version, slug);
    const catalogue = listedEntries(nav, version).flatMap((entry) => [
        entry.slug,
        ...subPages(nav, version, entry.slug),
    ]);
    return [...INTRODUCTION.filter(present), ...catalogue, ...TOOLS.filter(present)];
}

/**
 * Finds the previous and next pages of a page: in the reading order of the version, or for a
 * release page among the changelog index and the releases, newest first.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version of the page
 * @param slug - Id of the current page
 * @param lang - Language of the titles and hrefs
 * @returns The neighbours that exist; none for a page outside both orders (an unlisted entry)
 */
export function pager(nav: Nav, version: Version, slug: string, lang: Lang): PagerModel {
    const release = hasPage(nav, version, slug) && nav[version][slug].kind === "release";
    const order = release
        ? ["changelog", ...releasePages(nav, version)].filter((id) => hasPage(nav, version, id))
        : pageOrder(nav, version);
    const at = order.indexOf(slug);
    const out: PagerModel = {};
    if (at > 0) out.prev = navLink(nav, version, order[at - 1], lang);
    if (at >= 0 && at < order.length - 1) out.next = navLink(nav, version, order[at + 1], lang);
    return out;
}

/**
 * Builds the breadcrumb of a page: the catalogue group, category and parent entry for a catalogue
 * page, Tools and Changelog for a release, the group name for an Introduction or Tools page. The
 * group words come from messages.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version of the page
 * @param slug - Id of the current page
 * @param lang - Language of the titles and hrefs
 * @returns The crumbs, the current page last; empty for a page the version does not have
 */
export function crumbs(nav: Nav, version: Version, slug: string, lang: Lang): CrumbItem[] {
    if (!hasPage(nav, version, slug)) return [];
    const home = localePath(lang);
    const current: CrumbItem = { type: "current", title: navTitle(nav, version, slug, lang) };
    const entry = catalogueEntry(slug);
    const category = entry && CATEGORIES.find((candidate) => candidate.id === entry.category);
    if (entry && category) {
        const out: CrumbItem[] = [
            { type: "group", group: "catalogue", href: `${home}#${CATALOGUE_ANCHOR}` },
            { type: "link", title: category.title[lang], href: `${home}#${category.anchor}` },
        ];
        if (slug !== entry.slug && hasPage(nav, version, entry.slug)) {
            out.push({ type: "link", title: entry.name, href: href(lang, version, entry.slug) });
        }
        return [...out, current];
    }
    if (nav[version][slug].kind === "release" && hasPage(nav, version, "changelog")) {
        return [
            { type: "group", group: "tools" },
            {
                type: "link",
                title: navTitle(nav, version, "changelog", lang),
                href: href(lang, version, "changelog"),
            },
            current,
        ];
    }
    if (INTRODUCTION.includes(slug)) return [{ type: "group", group: "introduction" }, current];
    if (TOOLS.includes(slug)) return [{ type: "group", group: "tools" }, current];
    return [current];
}

/**
 * Picks the short Toc label of a section from the types of its blocks: the first typed block
 * wins, inside the split branch of the language. A Try block gives no label: it is hidden behind
 * the panel on endpoint pages and only an example elsewhere.
 *
 * @param blocks - Blocks of the section, in order
 * @param lang - Language whose split branches are read
 * @returns The label, or undefined when the section keeps its title
 */
function sectionLabel(blocks: readonly Block[], lang: Lang): TocLabel | undefined {
    for (const block of blocks) {
        if (block.type === "split") {
            const inner = sectionLabel(block[lang], lang);
            if (inner) return inner;
            continue;
        }
        if (block.type === "try") continue;
        const label = TOC_LABELS[block.type];
        if (label) return label;
    }
    return undefined;
}

/**
 * Lists the "On this page" entries of a page: its level 2 and level 3 sections in the
 * language, each with its plain title and, when its blocks give one, the short label that the
 * Toc prints instead.
 *
 * @param page - Page whose sections are read; the untitled preamble is skipped
 * @param lang - Language; a section that exists only in the other one is skipped
 * @returns The entries in document order
 */
export function tocEntries(page: Page, lang: Lang): TocEntry[] {
    const titled = (section: Section): section is Section & { level: 2 | 3 } =>
        section.level !== undefined &&
        section.title !== undefined &&
        (!section.only || section.only === lang);
    return page.sections.filter(titled).map((section) => {
        const entry: TocEntry = {
            id: section.id,
            level: section.level,
            title: section.title ? plain(pick(section.title, lang)) : section.id,
        };
        const label = sectionLabel(section.blocks, lang);
        if (label) entry.label = label;
        return entry;
    });
}

/**
 * Builds the facts that the slim header prints for a page (category, name, back link to the
 * category of the home catalogue, methods of its Try operations), or null when the page keeps the
 * full header: only endpoint pages with a live Try operation swap.
 *
 * @param nav - Navigation index, for the short title of the page
 * @param version - Version of the page
 * @param id - Page id ("hash", "captcha/verify")
 * @param page - Page module, whose kind and operations are read
 * @param lang - Language of the texts and of the back link
 * @returns The meta for Sentinel, or null for a page without a Try operation
 */
export function slimMeta(
    nav: Nav,
    version: Version,
    id: string,
    page: Page,
    lang: Lang,
): SlimMeta | null {
    const methods = [
        ...new Set((page.operations ?? []).filter((op) => op.try).map((op) => op.method)),
    ];
    if (page.kind !== "endpoint" || methods.length === 0) return null;
    const entry = catalogueEntry(id);
    const category = entry && CATEGORIES.find((candidate) => candidate.id === entry.category);
    return {
        name: navTitle(nav, version, id, lang),
        category: category?.title[lang],
        back: category ? `${localePath(lang)}#${category.anchor}` : undefined,
        methods,
    };
}
