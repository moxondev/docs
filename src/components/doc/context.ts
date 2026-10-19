import { blockOperations } from "@/components/doc/ops";
import type { ValuesRef } from "@/components/doc/params";
import { type PageAnchors, pageAnchors } from "@/lib/anchors";
import type { Block, Lang, Operation, Page, Version } from "@/types/content";

export interface DocContext {
    lang: Lang;
    version: Version;
    id: string;
    page: Page;
    anchors: PageAnchors;
    operations: Map<Block, Operation | undefined>;
    values?: ValuesRef;
    featured: string[];
}

// Id of the hidden sentence that names what an external link does, referenced by aria-describedby
export const NEW_TAB_ID = "new-tab";

/**
 * Finds the Values section of a page: the section holding a values block, with the number of
 * values it lists, which the overflow link of a parameter points at.
 *
 * @param page - Page whose sections are read
 * @param lang - Language rendered; a one-language section of the other one is skipped
 * @returns The section id and the total number of values, undefined when the page has none
 */
function valuesSection(page: Page, lang: Lang): ValuesRef | undefined {
    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        for (const block of section.blocks) {
            if (block.type !== "values") continue;
            const total = block.groups.reduce((sum, group) => sum + group.items.length, 0);
            return { id: section.id, total };
        }
    }
    return undefined;
}

/**
 * Collects the values that the parameters of a page feature, so that the Values block can show
 * the families that hold them first.
 *
 * @param page - Page whose operations are read
 * @returns The featured values of every parameter, in order
 */
function featuredValues(page: Page): string[] {
    return (page.operations ?? []).flatMap((operation) =>
        operation.params.flatMap((param) => param.featured ?? []),
    );
}

/**
 * Builds the facts every block of a documentation page reads: language and version (the context
 * of its links), the derived row anchors, the operation of each block and the Values section.
 *
 * @param page - Page whose blocks are walked to derive the row anchors, the operations and the
 *   Values section
 * @param version - Version the page belongs to, which the links of its blocks resolve against
 * @param id - Page id, "index" for a version home
 * @param lang - Language of the route tree
 * @returns The context handed down to the block components
 */
export function docContext(page: Page, version: Version, id: string, lang: Lang): DocContext {
    return {
        lang,
        version,
        id,
        page,
        anchors: pageAnchors(page, lang),
        operations: blockOperations(page, lang),
        values: valuesSection(page, lang),
        featured: featuredValues(page),
    };
}
