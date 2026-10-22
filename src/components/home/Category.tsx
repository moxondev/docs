import { ChevronDownIcon } from "lucide-react";

import { Entry } from "@/components/home/Entry";
import type { HomeCategory } from "@/components/home/query";
import { cn } from "@/lib/utils";

export interface CategoryProps {
    category: HomeCategory;
    open: boolean;
    phone: boolean;
    onToggle: () => void;
}

export interface TitleProps {
    category: HomeCategory;
}

/**
 * Title of a category with the number of its entries, in the faint mono figure of the headings.
 *
 * @param category - Category whose title and entry count are printed
 */
function Title({ category }: TitleProps) {
    return (
        <span className="text-xl/tight font-semibold tracking-[-0.01em] text-ink home:text-[19px]/tight">
            {category.title}
            <span className="ml-1.5 font-mono text-[14px] font-normal tracking-normal text-faint">
                {category.entries.length}
            </span>
        </span>
    );
}

/**
 * One category of the home catalogue: on a desktop a row with the title and description on the
 * left and the entries on the right, on a phone an accordion whose title is a button. The entries
 * stay in the document when folded, so that the links remain crawlable.
 *
 * @param category - Category to show: anchor, title, description and entries
 * @param open - Whether the phone accordion shows the entries; a desktop ignores it and shows all
 * @param phone - True in the phone layout, where the title is a button
 * @param onToggle - Called when the phone button is pressed
 */
export function Category({ category, open, phone, onToggle }: CategoryProps) {
    const listId = `${category.anchor}-list`;

    return (
        <section
            id={category.anchor}
            className="scroll-mt-3 border-t border-line-soft home:grid home:grid-cols-[14.5rem_minmax(0,1fr)] home:gap-x-12 home:gap-y-4 home:pt-8 home:pb-8.5"
        >
            <div>
                <h3 className="m-0">
                    {phone ? (
                        <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={listId}
                            onClick={onToggle}
                            className="grid min-h-16 w-full grid-cols-[minmax(0,1fr)_1.75rem] items-center py-2.5 text-left"
                        >
                            <Title category={category} />
                            <ChevronDownIcon
                                aria-hidden="true"
                                className={cn(
                                    "size-5 justify-self-end text-muted transition-transform",
                                    open && "rotate-180",
                                )}
                            />
                        </button>
                    ) : (
                        <Title category={category} />
                    )}
                </h3>
                <p
                    className={cn(
                        "mt-1.5 text-sm/[1.6] text-muted home:mt-2",
                        !open && "max-home:hidden",
                    )}
                >
                    {category.summary}
                </p>
            </div>
            <ul
                id={listId}
                className={cn(
                    "mt-1.5 pb-2.5 max-home:divide-y max-home:divide-line-soft home:-mx-3 home:-my-2.5 home:mt-0 home:grid home:grid-cols-1 home:gap-x-6 home:gap-y-0.5 home:pb-0 desk:grid-cols-2",
                    !open && "max-home:hidden",
                )}
            >
                {category.entries.map((entry) => (
                    <li key={entry.slug}>
                        <Entry entry={entry} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
