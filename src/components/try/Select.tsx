"use client";

import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Select as SelectPrimitive } from "radix-ui";
import { useState } from "react";

import { useDesk } from "@/components/search/desk";
import { optionCount } from "@/components/try/util";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerNested,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { ParamSpec } from "@/types/content";

export interface SelectProps {
    param: ParamSpec;
    value: string;
    id: string;
    touch: boolean;
    bench: boolean;
    invalid: boolean;
    describedBy?: string;
    onChange: (name: string, value: string) => void;
}

// Value of the row that empties an optional parameter; Radix refuses an empty item value
const CLEAR = "\u0000clear";

/**
 * Builds the classes of the field that opens the list, the size of the other fields of the form.
 *
 * @param touch - True in the phone sheet: 44 px high with 16 px text
 * @param bench - True in the Playground: below the desktop layout it has the size of the sheet
 * @returns The class list of the trigger button
 */
function triggerClass(touch: boolean, bench: boolean): string {
    return cn(
        "flex h-9 w-full cursor-pointer items-center gap-2 rounded-field border border-field bg-control pr-2.5 pl-2.5 text-left font-mono text-[14px] text-ink outline-none focus-visible:border-focus-line focus-visible:ring-[3px] focus-visible:ring-focus-ring data-[placeholder]:text-faint data-[state=open]:border-focus-line data-[state=open]:ring-[3px] data-[state=open]:ring-focus-ring aria-invalid:border-req aria-invalid:focus-visible:border-req",
        touch && "h-11 rounded-box pr-3 pl-3 text-[16px]",
        bench && "max-desk:h-11 max-desk:rounded-box max-desk:px-3 max-desk:text-[16px]",
    );
}

/**
 * Tail of the trigger: the number of options in the Playground, then the chevron.
 *
 * @param param - Enum parameter whose options are counted
 * @param touch - True in the phone sheet, which draws a larger chevron
 * @param bench - True in the Playground, where a desktop shows the option count
 */
function Tail({ param, touch, bench }: Pick<SelectProps, "param" | "touch" | "bench">) {
    const t = useTranslations("try");

    return (
        <>
            {bench ? (
                <span aria-hidden="true" className="hidden text-xs text-muted desk:block">
                    {t("options", { count: optionCount(param) })}
                </span>
            ) : null}
            <ChevronDown
                aria-hidden="true"
                className={cn(
                    "shrink-0 text-muted",
                    touch ? "size-4" : "size-3.5",
                    bench && !touch && "max-desk:size-4",
                )}
            />
        </>
    );
}

/**
 * Listbox of a long enum on a desktop: a Radix select, a panel under the field that the arrows and
 * the first letters of a value drive. An optional parameter gets a first row that empties it.
 *
 * @param param - Enum parameter: its name, options and required flag
 * @param value - Current value, an empty string when nothing is chosen
 * @param id - Id of the trigger, which the label of the field points to
 * @param touch - True in the phone sheet: 44 px field with 16 px text
 * @param bench - True in the Playground: shows the option count, sheet sizes below the desktop
 * @param invalid - True when the value is flagged, which paints the border and sets aria-invalid
 * @param describedBy - Id of the message under the field, when it shows one
 * @param onChange - Called with the parameter name and the new value
 */
function Listbox({ param, value, id, touch, bench, invalid, describedBy, onChange }: SelectProps) {
    const t = useTranslations("try");
    const row =
        "relative flex h-8 cursor-pointer items-center rounded-row pr-8 pl-2.5 font-mono text-[13.5px] text-text outline-none select-none data-[highlighted]:bg-chip data-[highlighted]:text-ink data-[state=checked]:font-semibold data-[state=checked]:text-ink";

    return (
        <SelectPrimitive.Root
            value={value}
            onValueChange={(next) => onChange(param.name, next === CLEAR ? "" : next)}
        >
            <SelectPrimitive.Trigger
                id={id}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                aria-required={param.required === true || undefined}
                className={triggerClass(touch, bench)}
            >
                <span className="min-w-0 flex-1 truncate">
                    <SelectPrimitive.Value placeholder={t("select")} />
                </span>
                <Tail param={param} touch={touch} bench={bench} />
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={4}
                    className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-box border border-line bg-surface p-1 shadow-palette"
                >
                    <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto">
                        {param.required === true ? null : (
                            <SelectPrimitive.Item value={CLEAR} className={cn(row, "text-faint")}>
                                <SelectPrimitive.ItemText>{t("select")}</SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        )}
                        {(param.options ?? []).map((option) => (
                            <SelectPrimitive.Item key={option} value={option} className={row}>
                                <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
                                <SelectPrimitive.ItemIndicator className="absolute right-2.5">
                                    <Check aria-hidden="true" className="size-3.5" />
                                </SelectPrimitive.ItemIndicator>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}

/**
 * Bottom sheet of a long enum on a phone: a field that opens a drawer with one 48 px row per value.
 * Inside the Try sheet the drawer nests in it, so closing it leaves the sheet open.
 *
 * @param param - Enum parameter: its name, options and required flag
 * @param value - Current value, an empty string when nothing is chosen
 * @param id - Id of the trigger, which the label of the field points to
 * @param touch - True in the phone sheet: 44 px field with 16 px text
 * @param bench - True in the Playground: shows the option count, sheet sizes below the desktop
 * @param invalid - True when the value is flagged, which paints the border and sets aria-invalid
 * @param describedBy - Id of the message under the field, when it shows one
 * @param onChange - Called with the parameter name and the new value
 */
function Sheet({ param, value, id, touch, bench, invalid, describedBy, onChange }: SelectProps) {
    const t = useTranslations("try");
    const [open, setOpen] = useState(false);
    const Root = touch ? DrawerNested : Drawer;
    const choose = (next: string) => onChange(param.name, next);
    const row =
        "flex h-12 w-full items-center rounded-field px-3 text-left font-mono text-[16px] text-text hover:bg-chip";

    return (
        <Root open={open} onOpenChange={setOpen}>
            <DrawerTrigger
                id={id}
                aria-haspopup="dialog"
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                aria-required={param.required === true || undefined}
                data-placeholder={value === "" ? "" : undefined}
                className={triggerClass(touch, bench)}
            >
                <span className="min-w-0 flex-1 truncate">
                    {value === "" ? t("select") : value}
                </span>
                <Tail param={param} touch={touch} bench={bench} />
            </DrawerTrigger>
            <DrawerContent className="bg-surface">
                <DrawerHeader className="pb-2 text-left!">
                    <DrawerTitle className="font-mono text-sm font-semibold text-ink">
                        {param.name}
                    </DrawerTitle>
                    <DrawerDescription className="text-[13px] text-muted">
                        {t("options", { count: optionCount(param) })}
                    </DrawerDescription>
                </DrawerHeader>
                <ul className="max-h-[55dvh] overflow-y-auto px-3 pb-6">
                    {param.required === true ? null : (
                        <li>
                            <DrawerClose asChild>
                                <button
                                    type="button"
                                    onClick={() => choose("")}
                                    aria-current={value === "" ? "true" : undefined}
                                    className={cn(row, "text-faint", value === "" && "bg-chip")}
                                >
                                    {t("select")}
                                </button>
                            </DrawerClose>
                        </li>
                    )}
                    {(param.options ?? []).map((option) => (
                        <li key={option}>
                            <DrawerClose asChild>
                                <button
                                    type="button"
                                    onClick={() => choose(option)}
                                    aria-current={option === value ? "true" : undefined}
                                    className={cn(
                                        row,
                                        option === value && "bg-chip font-semibold text-ink",
                                    )}
                                >
                                    {option}
                                    {option === value ? (
                                        <Check aria-hidden="true" className="ml-auto size-4" />
                                    ) : null}
                                </button>
                            </DrawerClose>
                        </li>
                    ))}
                </ul>
            </DrawerContent>
        </Root>
    );
}

/**
 * Field of an enum parameter with too many options for a segmented control, in place of a native
 * select: a listbox under the field on a desktop, a bottom sheet on a phone.
 *
 * @param props - Parameter, value, flags and callback of the field
 */
export function Select(props: SelectProps) {
    return useDesk() ? <Listbox {...props} /> : <Sheet {...props} />;
}
