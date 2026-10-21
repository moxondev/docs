"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import { optionCount, SEGMENT_MAX, textareaRows, typeHint } from "@/components/try/util";
import { Input } from "@/components/ui/input";
import type { FieldIssue } from "@/hooks/useRequest";
import { cn } from "@/lib/utils";
import type { ParamSpec } from "@/types/content";

export interface ControlProps {
    param: ParamSpec;
    value: string;
    issue?: FieldIssue;
    touch?: boolean;
    bench?: boolean;
    className?: string;
    extra?: ReactNode;
    onChange: (name: string, value: string) => void;
}

export interface ChoiceProps {
    param: ParamSpec;
    value: string;
    labelId: string;
    touch: boolean;
    bench: boolean;
    invalid: boolean;
    describedBy?: string;
    onChange: (name: string, value: string) => void;
}

export interface FieldProps {
    param: ParamSpec;
    value: string;
    id: string;
    touch: boolean;
    bench: boolean;
    invalid: boolean;
    describedBy?: string;
    onChange: (name: string, value: string) => void;
}

// Values of a boolean parameter, as the form holds them
const BOOLEANS: readonly string[] = ["true", "false"];

/**
 * Lists the choices of a segmented control: the options of an enum, true and false for a boolean.
 *
 * @param param - Enum or boolean parameter
 * @returns The values in display order
 */
function choices(param: ParamSpec): readonly string[] {
    return param.type === "boolean" ? BOOLEANS : (param.options ?? []);
}

/**
 * Tells whether a parameter is drawn as a segmented control.
 *
 * @param param - Parameter whose type and number of options decide the control
 * @returns True for a boolean and for an enum of at most SEGMENT_MAX options
 */
function isSegmented(param: ParamSpec): boolean {
    return (
        param.type === "boolean" || (param.type === "enum" && choices(param).length <= SEGMENT_MAX)
    );
}

/**
 * Segmented control of an enum or boolean parameter: native radio buttons, one option per value in
 * a grey track, the checked one lifted by a flat ring. An optional parameter can be cleared by
 * choosing its checked option again, and a flagged group paints the border of its track.
 *
 * @param param - Parameter whose options are the segments
 * @param value - Current value, empty when none is chosen
 * @param labelId - Id of the element that names the group
 * @param touch - True in the phone sheet, which uses 44 px segments
 * @param bench - True in the Playground: on a desktop the track takes the width of its options
 * instead of the whole row, and below it the segments have the size of the phone sheet
 * @param invalid - True when the group is flagged, which sets aria-invalid
 * @param describedBy - Id of the message under the group, when it shows one
 * @param onChange - Called with the parameter name and the new value
 */
function Choice({
    param,
    value,
    labelId,
    touch,
    bench,
    invalid,
    describedBy,
    onChange,
}: ChoiceProps) {
    const clearable = param.required !== true;
    const group = useId();

    return (
        <div
            role="radiogroup"
            aria-labelledby={labelId}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
                "flex gap-0.5 border border-line bg-chip p-0.75 aria-invalid:border-req",
                touch ? "rounded-box" : "rounded-field",
                bench && "max-desk:rounded-box desk:w-fit desk:max-w-full",
            )}
        >
            {choices(param).map((option) => (
                <label
                    key={option}
                    className={cn("flex-1 cursor-pointer", bench && "desk:flex-initial")}
                >
                    <input
                        type="radio"
                        name={group}
                        value={option}
                        checked={option === value}
                        onChange={() => onChange(param.name, option)}
                        onClick={() => {
                            if (clearable && option === value) onChange(param.name, "");
                        }}
                        className="peer sr-only"
                    />
                    <span
                        className={cn(
                            "flex items-center justify-center font-mono text-muted transition-colors peer-checked:bg-seg-on peer-checked:font-semibold peer-checked:text-ink peer-checked:shadow-[0_0_0_1px_var(--field)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-line hover:text-ink",
                            touch
                                ? "h-11 rounded-field text-[14px]"
                                : "h-7 rounded-row text-[13px]",
                            bench &&
                                "max-desk:h-11 max-desk:rounded-field max-desk:text-[14px] desk:px-2.5",
                        )}
                    >
                        {option}
                    </span>
                </label>
            ))}
        </div>
    );
}

/**
 * Typed field of a parameter that is not a segmented control: a native select for a long enum, a
 * monospace textarea for JSON or a multi-line sample, a text input otherwise. Numbers are sent as
 * typed, so no spinner rewrites them.
 *
 * @param param - Parameter: its type picks the element, its placeholder and options fill it
 * @param value - Current value, an empty string when nothing is entered or chosen
 * @param id - Id of the element, which its label points to
 * @param touch - True in the phone sheet: 44 px fields with 16 px text
 * @param bench - True in the Playground: a select shows how many options it holds, and below the
 * desktop layout the fields have the size of the phone sheet
 * @param invalid - True when the value is flagged, which paints the border and sets aria-invalid
 * @param describedBy - Id of the message under the field, when it shows one
 * @param onChange - Called with the parameter name and the new value
 */
function Field({ param, value, id, touch, bench, invalid, describedBy, onChange }: FieldProps) {
    const t = useTranslations("try");
    const shared = {
        id,
        value,
        "aria-invalid": invalid || undefined,
        "aria-describedby": describedBy,
        "aria-required": param.required === true || undefined,
    };

    if (param.type === "enum") {
        return (
            <div className="relative">
                <select
                    {...shared}
                    onChange={(event) => onChange(param.name, event.target.value)}
                    className={cn(
                        "h-9 w-full cursor-pointer appearance-none rounded-field border border-field bg-control py-1 pr-8 pl-2.5 font-mono text-[14px] text-ink outline-none focus:border-focus-line focus:ring-[3px] focus:ring-focus-ring aria-invalid:border-req aria-invalid:focus:border-req",
                        touch && "h-11 rounded-box pr-10 pl-3 text-[16px]",
                        bench &&
                            "max-desk:h-11 max-desk:rounded-box max-desk:pr-10 max-desk:pl-3 max-desk:text-[16px] desk:pr-24",
                    )}
                >
                    {value === "" || param.required !== true ? (
                        <option value="">{t("select")}</option>
                    ) : null}
                    {(param.options ?? []).map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {bench ? (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 text-xs text-muted desk:block"
                    >
                        {t("options", { count: optionCount(param) })}
                    </span>
                ) : null}
                <ChevronDown
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
                        touch ? "right-3 size-4" : "right-2.5 size-3.5",
                        bench && !touch && "max-desk:right-3 max-desk:size-4",
                    )}
                />
            </div>
        );
    }

    const rows = textareaRows(param);
    if (rows !== null) {
        return (
            <textarea
                {...shared}
                rows={rows}
                spellCheck={false}
                placeholder={param.placeholder}
                onChange={(event) => onChange(param.name, event.target.value)}
                className={cn(
                    "w-full resize-y rounded-field border border-field bg-control px-2.5 py-2 font-mono text-[14px]/[1.5] text-ink outline-none placeholder:text-faint focus:border-focus-line focus:ring-[3px] focus:ring-focus-ring aria-invalid:border-req aria-invalid:focus:border-req",
                    rows > 2 ? "min-h-24" : "min-h-15",
                    touch && "rounded-box px-3 text-[16px]",
                    bench && "max-desk:rounded-box max-desk:px-3 max-desk:text-[16px]",
                )}
            />
        );
    }

    return (
        <Input
            {...shared}
            type="text"
            inputMode={param.type === "number" ? "decimal" : undefined}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={param.placeholder}
            onChange={(event) => onChange(param.name, event.target.value)}
            className={cn(
                "font-mono",
                touch && "h-11 rounded-box px-3 text-[16px]",
                bench && "max-desk:h-11 max-desk:rounded-box max-desk:px-3 max-desk:text-[16px]",
            )}
        />
    );
}

/**
 * One labelled control of the Try form, built from a parameter of Operation.params: its name, its
 * type and requirement, then the segmented control or the field that fits. A flagged value paints
 * the border and shows its message under the field, tied to it with aria-describedby.
 *
 * @param param - Parameter descriptor: type, options, placeholder and required flag
 * @param value - Current value of the field, an empty string when unset
 * @param issue - Problem found by the form: required (emptied) or json (does not parse)
 * @param touch - True in the phone sheet, which uses the 44 px sizes
 * @param bench - True in the Playground: the segments take the width of their options, a select
 * shows its option count, and on a desktop the required and optional tags are left to the heading
 * of their group
 * @param className - Extra classes for the root, for its width in the grid of the bench form
 * @param extra - Element shown under the field, such as the featured chips of the bench form
 * @param onChange - Called with the parameter name and the new value on every edit
 */
export function Control({
    param,
    value,
    issue,
    touch = false,
    bench = false,
    className,
    extra,
    onChange,
}: ControlProps) {
    const t = useTranslations("try");
    const common = useTranslations("common");
    const base = useId();
    const id = `${base}-field`;
    const labelId = `${base}-label`;
    const messageId = `${base}-message`;
    const segmented = isSegmented(param);
    const hint = typeHint(param);

    return (
        <div data-param={param.name} className={cn("flex flex-col gap-1.5", className)}>
            <label
                id={labelId}
                htmlFor={segmented ? undefined : id}
                className="flex items-baseline gap-2 font-mono text-[13px]/[18px] font-semibold text-ink"
            >
                {param.name}
                {hint ? (
                    <em className="font-mono text-[12px] font-normal text-faint not-italic">
                        {hint}
                    </em>
                ) : null}
                {param.required === true ? (
                    <em
                        className={cn(
                            "font-sans text-[13px] font-medium text-req not-italic",
                            bench && "desk:hidden",
                        )}
                    >
                        {common("tags.required")}
                    </em>
                ) : null}
                {param.required === "conditional" ? (
                    <em className="font-sans text-[13px] font-normal text-faint not-italic">
                        {common("tags.conditional")}
                    </em>
                ) : null}
                {param.required === false ? (
                    <em
                        className={cn(
                            "font-sans text-[13px] font-normal text-faint not-italic",
                            bench && "desk:hidden",
                        )}
                    >
                        {common("tags.optional")}
                    </em>
                ) : null}
            </label>
            {segmented ? (
                <Choice
                    param={param}
                    value={value}
                    labelId={labelId}
                    touch={touch}
                    bench={bench}
                    invalid={issue !== undefined}
                    describedBy={issue ? messageId : undefined}
                    onChange={onChange}
                />
            ) : (
                <Field
                    param={param}
                    value={value}
                    id={id}
                    touch={touch}
                    bench={bench}
                    invalid={issue !== undefined}
                    describedBy={issue ? messageId : undefined}
                    onChange={onChange}
                />
            )}
            {extra}
            {issue ? (
                <p id={messageId} className="text-[13px] text-req">
                    {t(issue === "required" ? "requiredField" : "invalidJson")}
                </p>
            ) : null}
        </div>
    );
}
