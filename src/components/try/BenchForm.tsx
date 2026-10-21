"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import { Control } from "@/components/try/Control";
import { Featured } from "@/components/try/Featured";
import { SendButton } from "@/components/try/Form";
import { controlSpan, featuredOptions, splitParams } from "@/components/try/util";
import { useFieldFocus } from "@/hooks/useFieldFocus";
import type { RequestHandle } from "@/hooks/useRequest";
import { cn } from "@/lib/utils";
import type { Operation, ParamSpec } from "@/types/content";

export interface BenchFormProps {
    op: Operation;
    handle: RequestHandle;
}

/**
 * Builds the row of featured chips of a parameter, or nothing when its data names none.
 *
 * @param param - Enum parameter whose featured values become chips; any other type gives none
 * @param handle - State machine of the form, which holds the value and takes the edit
 * @returns The chips element, undefined for a parameter without featured values
 */
function chips(param: ParamSpec, handle: RequestHandle): ReactNode {
    const values = featuredOptions(param);
    if (values.length === 0) return undefined;

    return (
        <Featured
            values={values}
            value={handle.values[param.name] ?? ""}
            clearable={param.required !== true}
            onPick={(next) => handle.setValue(param.name, next)}
        />
    );
}

/**
 * Form of the Playground bench: the parameters in a Required and an Optional group, each under a
 * quiet heading and only when it has parameters, then the send button. On a wide screen the form
 * is a card of its own and the send button sticks to the bottom of the screen.
 *
 * @param op - Operation whose parameters are the fields
 * @param handle - State machine of the form: values, issues, edit and send
 */
export function BenchForm({ op, handle }: BenchFormProps) {
    const t = useTranslations("try");
    const base = useId();
    const form = useFieldFocus(handle.focus);
    const groups = splitParams(op.params);
    const sections = [
        { id: "required", params: groups.required },
        { id: "optional", params: groups.optional },
    ].filter((section) => section.params.length > 0);

    return (
        <form
            ref={form}
            noValidate
            onSubmit={(event) => event.preventDefault()}
            onKeyDown={handle.onKeyDown}
            className="flex flex-col gap-3.5 max-wide:p-4 wide:gap-0 wide:rounded-panel wide:border wide:border-panel-line wide:bg-surface wide:shadow-panel"
        >
            {sections.length === 0 ? (
                <p className="text-[14px] text-muted wide:px-5 wide:py-4">{t("noParams")}</p>
            ) : (
                sections.map((section) => (
                    <div
                        role="group"
                        aria-labelledby={`${base}-${section.id}`}
                        key={section.id}
                        className="flex min-w-0 flex-col gap-3 desk:-mx-4 desk:px-4 desk:not-first:border-t desk:not-first:border-line-soft desk:not-first:pt-4 wide:mx-0 wide:px-5 wide:py-4"
                    >
                        <p
                            id={`${base}-${section.id}`}
                            className="text-[12px] font-medium tracking-[0.08em] text-muted uppercase max-desk:sr-only"
                        >
                            {t(section.id)}
                        </p>
                        <div className="grid gap-3.5 desk:grid-cols-2 desk:gap-x-4">
                            {section.params.map((param) => (
                                <Control
                                    key={param.name}
                                    param={param}
                                    value={handle.values[param.name] ?? ""}
                                    issue={handle.issues[param.name]}
                                    bench
                                    extra={chips(param, handle)}
                                    className={cn(
                                        "min-w-0",
                                        controlSpan(param) === "full" && "desk:col-span-2",
                                    )}
                                    onChange={handle.setValue}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
            <div className="wide:sticky wide:bottom-0 wide:z-10 wide:rounded-b-panel wide:border-t wide:border-line-soft wide:bg-surface wide:px-5 wide:py-3.5">
                <SendButton handle={handle} touch={false} />
            </div>
        </form>
    );
}
