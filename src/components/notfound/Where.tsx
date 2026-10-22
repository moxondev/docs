import {
    ArrowRightIcon,
    BookOpenIcon,
    LayoutGridIcon,
    type LucideIcon,
    RotateCcwClockIcon,
    SquareTerminalIcon,
} from "lucide-react";

import { catalogueTarget, docsTarget, toolTarget } from "@/components/chrome/targets";
import type { Say } from "@/components/notfound/say";
import { KINDS } from "@/data/kinds";
import { LATEST, VERSIONS } from "@/data/versions";
import { href, INDEX } from "@/lib/routes";
import type { Lang } from "@/types/content";

export interface WhereProps {
    say: Say;
    lang: Lang;
    release: string;
    count: number;
    categories: number;
}

type Place = "start" | "catalog" | "playground" | "changelog";

interface Row {
    id: Place;
    icon: LucideIcon;
    to: string;
}

/**
 * The block of places to go from the 404: one ruled row per place, then the line of the older
 * versions. The links keep the language of the address, since the 404 never leaves the visitor in
 * another language; the numbers come from the data through the props.
 *
 * @param say - Translator of the notfound messages in the language of the address
 * @param lang - Language of the address, which the links keep
 * @param release - Release of the latest version
 * @param count - Number of endpoints of the latest version
 * @param categories - Number of categories of the catalogue
 */
export function Where({ say, lang, release, count, categories }: WhereProps) {
    const rows: Row[] = [
        { id: "start", icon: BookOpenIcon, to: docsTarget(lang, undefined) },
        { id: "catalog", icon: LayoutGridIcon, to: catalogueTarget(lang) },
        {
            id: "playground",
            icon: SquareTerminalIcon,
            to: toolTarget(KINDS, lang, undefined, "playground"),
        },
        {
            id: "changelog",
            icon: RotateCcwClockIcon,
            to: toolTarget(KINDS, lang, undefined, "changelog"),
        },
    ];
    const older = VERSIONS.filter((def) => def.id !== LATEST);
    const values = { release, count, categories };

    return (
        <section aria-labelledby="notfound-over" className="mt-5 w-full text-left">
            <h2 id="notfound-over" className="text-sm/[1.3] font-medium text-faint">
                {say("over")}
            </h2>
            <ul className="mt-2.5 border-b border-line-soft">
                {rows.map(({ id, icon: Icon, to }) => (
                    <li key={id} className="border-t border-line-soft">
                        <a
                            href={to}
                            className="group -mx-3 grid min-h-16 grid-cols-[1.25rem_minmax(0,1fr)_1rem] items-center gap-x-4 rounded-field px-3 py-1.5 text-ink hover:bg-hover home:min-h-13"
                        >
                            <Icon aria-hidden="true" className="size-5 text-muted" />
                            <span>
                                <b className="block text-[17px]/[1.35] font-medium">
                                    {say(`links.${id}.title`)}
                                </b>
                                <span className="mt-px block text-[15px]/normal text-muted">
                                    {say(`links.${id}.text`, values)}
                                </span>
                            </span>
                            <ArrowRightIcon
                                aria-hidden="true"
                                className="size-4 text-faint group-hover:text-ink"
                            />
                        </a>
                    </li>
                ))}
            </ul>
            <p className="mt-2 flex flex-wrap items-center gap-x-1 text-[15px]/normal text-muted max-home:mt-2 max-home:gap-y-0">
                <span className="mr-2.5 max-home:mr-0 max-home:basis-full">{say("older")}</span>
                {older.map((def) => (
                    <a
                        key={def.id}
                        href={href(lang, def.id, INDEX)}
                        className="prose-link inline-flex min-h-11 items-center px-2.25 font-mono text-sm home:min-h-8 max-home:first-of-type:-ml-2.25"
                    >
                        {def.id}
                    </a>
                ))}
            </p>
        </section>
    );
}
