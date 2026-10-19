"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import type { FieldIssue } from "@/hooks/useRequest";
import { cn } from "@/lib/utils";
import type { ParamSpec } from "@/types/content";

export interface ControlProps {
    param: ParamSpec;
    value: string;
    issue?: FieldIssue;
    touch?: boolean;
    onChange: (name: string, value: string) => void;
}

export interface ChoiceProps {
    param: ParamSpec;
    value: string;
    labelId: string;
    touch: boolean;
    onChange: (name: string, value: string) => void;
}

export interface FieldProps {
    param: ParamSpec;
    value: string;
    id: string;
    touch: boolean;
    invalid: boolean;
    describedBy?: string;
    onChange: (name: string, value: string) => void;
}

// Enum parameters with at most this many options are a segmented control, the others a select
export const SEGMENT_MAX = 3;

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
 * a grey track, the checked one raised. An optional parameter can be cleared by choosing its
 * checked option again.
 *
 * @param param - Parameter whose options are the segments
 * @param value - Current value, empty when none is chosen
 * @param labelId - Id of the element that names the group
 * @param touch - True in the phone sheet, which uses 44 px segments
 * @param onChange - Called with the parameter name and the new value
 */
function Choice({ param, value, labelId, touch, onChange }: ChoiceProps) {
    const clearable = param.required !== true;
    const group = useId();

    return (
        <div
            role="radiogroup"
            aria-labelledby={labelId}
            className={cn("flex gap-0.75 bg-chip p-0.75", touch ? "rounded-box" : "rounded-cta")}
        >
            {choices(param).map((option) => (
                <label key={option} className="flex-1 cursor-pointer">
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
                            "flex items-center justify-center font-mono text-muted transition-colors peer-checked:bg-seg-on peer-checked:text-ink peer-checked:shadow-seg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-line hover:text-ink",
                            touch ? "h-11 rounded-field text-[13px]" : "h-7.5 rounded-btn text-xs",
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
 * monospace textarea for JSON, a text input otherwise (numbers keep a numeric keypad but are
 * sent as typed, so no spinner rewrites them).
 *
 * @param param - Parameter: its type picks the element, its placeholder and options fill it
 * @param value - Current value, an empty string when nothing is entered or chosen
 * @param id - Id of the element, which its label points to
 * @param touch - True in the phone sheet: 44 px fields with 15 px text
 * @param invalid - True when the value is flagged, which paints the border and sets aria-invalid
 * @param describedBy - Id of the message under the field, when it shows one
 * @param onChange - Called with the parameter name and the new value
 */
function Field({ param, value, id, touch, invalid, describedBy, onChange }: FieldProps) {
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
                        "h-9 w-full cursor-pointer appearance-none rounded-field border border-field bg-control py-1 pr-8 pl-2.5 font-mono text-[13px] text-ink outline-none focus:border-focus-line focus:ring-[3px] focus:ring-focus-ring aria-invalid:border-req",
                        touch && "h-11 rounded-box pr-10 pl-3 text-[15px]",
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
                <ChevronDown
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
                        touch ? "right-3 size-4" : "right-2.5 size-3.5",
                    )}
                />
            </div>
        );
    }

    if (param.type === "json") {
        return (
            <textarea
                {...shared}
                rows={4}
                spellCheck={false}
                placeholder={param.placeholder}
                onChange={(event) => onChange(param.name, event.target.value)}
                className={cn(
                    "min-h-24 w-full resize-y rounded-field border border-field bg-control px-2.5 py-2 font-mono text-[13px]/[1.5] text-ink outline-none placeholder:text-faint focus:border-focus-line focus:ring-[3px] focus:ring-focus-ring aria-invalid:border-req",
                    touch && "rounded-box px-3 text-[15px]",
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
            className={cn("font-mono", touch && "h-11 rounded-box px-3 text-[15px]")}
        />
    );
}

/**
 * One labelled control of the Try form, built from a parameter of Operation.params: its name, the
 * required tag, then the segmented control or the field that fits. A flagged value paints the
 * border and shows its message under the field.
 *
 * @param param - Parameter descriptor: type, options, placeholder and required flag
 * @param value - Current value of the field, an empty string when unset
 * @param issue - Problem found by the form: required (emptied) or json (does not parse)
 * @param touch - True in the phone sheet, which uses the 44 px sizes
 * @param onChange - Called with the parameter name and the new value on every edit
 */
export function Control({ param, value, issue, touch = false, onChange }: ControlProps) {
    const t = useTranslations("try");
    const common = useTranslations("common");
    const base = useId();
    const id = `${base}-field`;
    const labelId = `${base}-label`;
    const messageId = `${base}-message`;
    const segmented = isSegmented(param);

    return (
        <div className="flex flex-col gap-1.5">
            <label
                id={labelId}
                htmlFor={segmented ? undefined : id}
                className="flex items-baseline gap-1.5 font-mono text-xs font-medium text-ink"
            >
                {param.name}
                {param.required === true ? (
                    <em className="font-sans text-[11px] font-normal text-req not-italic">
                        {common("tags.required")}
                    </em>
                ) : null}
                {param.required === "conditional" ? (
                    <em className="font-sans text-[11px] font-normal text-muted not-italic">
                        {common("tags.conditional")}
                    </em>
                ) : null}
            </label>
            {segmented ? (
                <Choice
                    param={param}
                    value={value}
                    labelId={labelId}
                    touch={touch}
                    onChange={onChange}
                />
            ) : (
                <Field
                    param={param}
                    value={value}
                    id={id}
                    touch={touch}
                    invalid={issue !== undefined}
                    describedBy={issue ? messageId : undefined}
                    onChange={onChange}
                />
            )}
            {issue ? (
                <p id={messageId} className="text-xs text-req">
                    {t(issue === "required" ? "requiredField" : "invalidJson")}
                </p>
            ) : null}
        </div>
    );
}
