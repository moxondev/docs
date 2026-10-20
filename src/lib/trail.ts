import { localePath } from "@/i18n/routing";
import type { Crumb } from "@/lib/metadata";
import { crumbs, type NavGroup } from "@/lib/nav";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export interface TrailWords {
    home: string;
    group: (key: NavGroup) => string;
}

/**
 * Builds the breadcrumb trail of a page for its structured data: the site home first, then the
 * crumbs of the page (the group words come from the crumbs messages), the page itself last. A
 * crumb without a target of its own, such as the Introduction group, points at the page.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version of the page
 * @param id - Page id, "index" for a version home
 * @param lang - Language of the names and of the paths
 * @param words - Name of the site home and translator of the group crumbs
 * @param here - Site path of the page itself, the target of the last crumb
 * @returns The trail from the home down to the page; empty for a page the version does not have
 */
export function pageTrail(
    nav: Nav,
    version: Version,
    id: string,
    lang: Lang,
    words: TrailWords,
    here: string,
): Crumb[] {
    const items = crumbs(nav, version, id, lang);
    if (items.length === 0) return [];
    const trail: Crumb[] = [{ name: words.home, path: localePath(lang) }];
    for (const item of items) {
        if (item.type === "current") trail.push({ name: item.title, path: here });
        else if (item.type === "link") trail.push({ name: item.title, path: item.href });
        else trail.push({ name: words.group(item.group), path: item.href ?? here });
    }
    return trail;
}
