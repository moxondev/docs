import type { PageIndex } from "@/lib/routes";
import type { Version } from "@/types/content";

// Page id prefix of the release pages of a version ("changelog/6.1.0")
const RELEASE_PREFIX = "changelog/";

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
 * Lists the release pages of a version, newest first: the changelog children of the sidebar, the
 * order of the release pager and the release submenu of the version picker. This module imports
 * nothing heavy, so the client chrome can use it next to the small kinds index.
 *
 * @param nav - Page index (the navigation index or the kinds index); an unpromoted version is an
 *   empty record
 * @param version - Version whose changelog is read
 * @returns Page ids such as "changelog/6.1.0"
 */
export function releasePages(nav: PageIndex, version: Version): string[] {
    return Object.keys(nav[version])
        .filter((slug) => nav[version][slug].kind === "release")
        .sort(newestFirst);
}

/**
 * Gives the release number of a release page id.
 *
 * @param slug - Release page id such as "changelog/5.3.0"
 * @returns The number, "5.3.0" for that example
 */
export function releaseNumber(slug: string): string {
    return slug.startsWith(RELEASE_PREFIX) ? slug.slice(RELEASE_PREFIX.length) : slug;
}
