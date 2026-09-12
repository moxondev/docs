interface SidebarItem {
    text: string;
    link?: string;
    items?: SidebarItem[];
    collapsed?: boolean;
    docFooterText?: string;
    badge?: string;
}

type Sidebar = Record<string, SidebarItem[]>;

/**
 * VitePress ignores the `badge` field carried by sidebar entries, so it is inlined into the
 * label as a method badge. Only entries nested inside a collapsible group (depth >= 2) are
 * decorated: those share the same route and are otherwise indistinguishable.
 *
 * A badge may list several methods ('GET POST'), which yields one pill per method rather than
 * a single pill carrying conflicting colour classes.
 *
 * The original label is kept in `docFooterText` so the prev/next pager, which falls back to
 * `text` and renders it with v-html, stays free of badge markup.
 */
function decorate(items: SidebarItem[], depth: number): SidebarItem[] {
    return items.map(({ badge, ...item }) => {
        const decorated: SidebarItem = { ...item };

        if (badge && depth >= 2) {
            const pills = badge
                .split(' ')
                .map((method) => `<span class="method-badge xs ${method.toLowerCase()}">${method}</span>`)
                .join('');

            decorated.docFooterText = item.docFooterText ?? item.text;
            decorated.text = `${pills}${item.text}`;
        }

        if (item.items) decorated.items = decorate(item.items, depth + 1);

        return decorated;
    });
}

/**
 * Decorates the sidebar with method badges. See `decorate()` for details.
 *
 * @param sidebar The sidebar to decorate.
 * @returns A new sidebar with decorated entries.
 */
export function badges(sidebar: Sidebar): Sidebar {
    return Object.fromEntries(Object.entries(sidebar).map(([path, items]) => [path, decorate(items, 0)]));
}
