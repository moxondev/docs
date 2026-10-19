import { LINKS } from "@/data/links";
import type { Page, Version } from "@/types/content";

/**
 * Converts one kebab-case id segment to camelCase, the naming rule of the page modules.
 *
 * @param segment - One segment of a page id
 * @returns The segment in camelCase ("ticTacToe"), the name of its module file or folder
 */
function camel(segment: string): string {
    return segment.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Gives the path of the module that holds a page, relative to the repository root: one module
 * per page id under src/data/pages/<version>/, the release pages together in releases.ts.
 *
 * @param version - Version whose folder holds the module
 * @param page - Page, whose id and kind name the module
 * @returns The path, for example "src/data/pages/v6/ticTacToe/fetch.ts"
 */
export function modulePath(version: Version, page: Pick<Page, "id" | "kind">): string {
    const name = page.kind === "release" ? "releases" : page.id.split("/").map(camel).join("/");
    return `src/data/pages/${version}/${name}.ts`;
}

/**
 * Builds the GitHub link that edits the module of a page on the default branch.
 *
 * @param version - Version whose module the link edits
 * @param page - Page, whose id and kind name the module
 * @returns The absolute edit URL
 */
export function editUrl(version: Version, page: Pick<Page, "id" | "kind">): string {
    return `${LINKS.edit}${modulePath(version, page)}`;
}

/**
 * Builds the GitHub link that opens a new issue titled with the path of the page.
 *
 * @param version - Version of the page, which prefixes the issue title
 * @param page - Page, whose id names it in the issue title
 * @returns The absolute URL of the new issue form, the title prefilled
 */
export function issueUrl(version: Version, page: Pick<Page, "id">): string {
    return `${LINKS.newIssue}?title=${encodeURIComponent(`${version}/${page.id}`)}`;
}
