import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { defaultText, NO_DEFAULT, paramView } from "@/components/doc/params";
import { pick } from "@/lib/inline";
import { cn } from "@/lib/utils";
import type {
    FieldsTable,
    Inline as InlineText,
    Lx,
    Operation,
    ParamSpec,
    ParamsTable,
} from "@/types/content";

export interface FieldsProps {
    block: ParamsTable | FieldsTable;
    ids: readonly string[];
    ctx: DocContext;
    operation?: Operation;
}

export interface FieldProps {
    id: string;
    name: string;
    type?: ReactNode;
    tag?: ReactNode;
    children?: ReactNode;
    chips?: ReactNode;
}

export interface DefaultProps {
    text: InlineText;
    ctx: DocContext;
}

export interface TagProps {
    required: boolean | "conditional";
}

export interface ChipsProps {
    chips: readonly string[];
    more: number;
    moreTo?: string;
}

// A string that is one code span and nothing else, whose inside is the value to print
const SINGLE_CODE = /^`([^`]+)`$/;

// A default written as plain words, with no markup at all
const PLAIN_WORDS = /^[^`*[\]\\{]+$/;

/**
 * Finds the text to print as a type: the inside of a lone code span ("`string`" gives "string"),
 * so the type reads as the quiet mono word of the design and not as an inline code chip.
 *
 * @param text - Inline text of the Type column, one per language allowed
 * @param ctx - Context whose language picks the text
 * @returns The inside of the code span, or null when the text has other markup
 */
function loneCode(text: Lx<InlineText>, ctx: DocContext): string | null {
    const match = SINGLE_CODE.exec(pick(text, ctx.lang));
    return match ? match[1] : null;
}

/**
 * Required or optional tag of a parameter row: red on its pale ground when required, quiet when
 * optional or conditional. The word is the information, the colour only helps.
 *
 * @param required - True, false or "conditional" when the requirement depends on another parameter
 */
function Tag({ required }: TagProps) {
    const t = useTranslations("common.tags");
    const word = required === "conditional" ? "conditional" : required ? "required" : "optional";

    return (
        <span
            className={cn(
                "rounded-tag px-1.5 py-px text-[12px]/4 font-medium",
                required === true ? "bg-req-bg text-req" : "bg-chip text-muted",
            )}
        >
            {t(word)}
        </span>
    );
}

/**
 * Sentence that tells the default value of a parameter, with the value as a code chip when it is
 * a lone code span or plain words, and as the inline markup it is otherwise.
 *
 * @param text - Default value as inline text
 * @param ctx - Context of the page, for the links of a value with markup
 */
function Default({ text, ctx }: DefaultProps) {
    const t = useTranslations("endpoint");
    if (text === NO_DEFAULT) return <span className="sr-only">{text}</span>;
    const code = SINGLE_CODE.exec(text)?.[1] ?? (PLAIN_WORDS.test(text) ? text : null);

    return (
        <p className="order-3 text-sm/[1.6] text-text">
            {t.rich("default", {
                value: code ?? "",
                code: (chunks) =>
                    code === null ? (
                        <Inline text={text} ctx={ctx} />
                    ) : (
                        <code className="rounded-chip bg-chip px-1 py-px font-mono text-[0.875em] text-ink">
                            {chunks}
                        </code>
                    ),
            })}
        </p>
    );
}

/**
 * Chips of the values of a parameter, and the overflow count after them: a link to the Values
 * section of the page when it has one, a plain count otherwise.
 *
 * @param chips - Values to show as chips, in order
 * @param more - How many values are not shown
 * @param moreTo - Section id of the Values section the overflow links to
 */
function Chips({ chips, more, moreTo }: ChipsProps) {
    const t = useTranslations("endpoint");

    return (
        <ul className="order-2 mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {chips.map((chip) => (
                <li key={chip} className="rounded-chip bg-chip px-1.75 py-0.5 text-ink">
                    {chip}
                </li>
            ))}
            {more > 0 ? (
                <li className="font-sans text-[14px]">
                    {moreTo ? (
                        <a
                            href={`#${moreTo}`}
                            className="prose-link relative px-1 py-px after:absolute after:-inset-x-1.5 after:-inset-y-3.5"
                        >
                            {t("moreValues", { count: more })}
                        </a>
                    ) : (
                        <span className="px-1 text-faint">{t("moreValues", { count: more })}</span>
                    )}
                </li>
            ) : null}
        </ul>
    );
}

/**
 * One row of a parameter or response list: the name in bold mono, its type, a tag, the
 * description, the chips of the values and the default sentence, under the derived id that the
 * search results and the anchor flash aim at.
 *
 * @param id - Derived row anchor (p-name, f-name)
 * @param name - Parameter or field name, printed verbatim
 * @param type - Type word or inline type, shown after the name
 * @param tag - Required tag, only for the rows of a parameters table
 * @param children - Description and default sentence
 * @param chips - Chips of the values, when the parameter lists them
 */
function Field({ id, name, type, tag, children, chips }: FieldProps) {
    return (
        <li
            id={id}
            className="flex scroll-mt-17 flex-col gap-1.5 border-t border-line-soft py-3.5 desk:py-4"
        >
            <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-sm font-semibold text-ink">{name}</code>
                {type ? <span className="font-mono text-xs text-faint">{type}</span> : null}
                {tag}
            </div>
            {children}
            {chips}
        </li>
    );
}

/**
 * Parameter or response field list of a page. A parameters table is joined with the operation it
 * documents for the type, the chips and the default sentence, the table cell winning over the
 * operation default; a response table prints its own type column.
 *
 * @param block - Parameters table or response fields table
 * @param ids - Derived row anchors of the block, in row order
 * @param ctx - Context of the page: language, version, Values section
 * @param operation - Operation the parameters belong to, absent for a response table
 */
export function Fields({ block, ids, ctx, operation }: FieldsProps) {
    return (
        <ul className="border-b border-line-soft">
            {block.type === "params"
                ? block.rows.map((row, index) => {
                      const spec: ParamSpec | undefined = operation?.params.find(
                          (param) => param.name === row.name,
                      );
                      const view = paramView(spec, ctx.values);
                      const preset = defaultText(row.default, spec, ctx.lang);
                      const first = block.columns !== "default-after-description";
                      return (
                          <Field
                              key={ids[index]}
                              id={ids[index]}
                              name={row.name}
                              type={view.type}
                              tag={<Tag required={row.required} />}
                              chips={
                                  view.chips.length > 0 ? (
                                      <Chips
                                          chips={view.chips}
                                          more={view.more}
                                          moreTo={view.moreTo}
                                      />
                                  ) : undefined
                              }
                          >
                              {first && preset ? <Default text={preset} ctx={ctx} /> : null}
                              <p className="order-1 text-sm/[1.6] text-text">
                                  <Inline text={row.description} ctx={ctx} />
                              </p>
                              {first || !preset ? null : <Default text={preset} ctx={ctx} />}
                          </Field>
                      );
                  })
                : block.rows.map((row, index) => {
                      const code = loneCode(row.type, ctx);
                      return (
                          <Field
                              key={ids[index]}
                              id={ids[index]}
                              name={row.name}
                              type={code ?? <Inline text={row.type} ctx={ctx} />}
                          >
                              <p className="text-sm/[1.6] text-text">
                                  <Inline text={row.description} ctx={ctx} />
                              </p>
                          </Field>
                      );
                  })}
        </ul>
    );
}
