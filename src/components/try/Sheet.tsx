"use client";

import dynamic from "next/dynamic";

import type { SheetProps } from "@/types/try";

/**
 * The sheet wiring as its own chunk, fetched only by the pages that mount a sheet.
 * It renders nothing on the server, since a closed sheet shows nothing.
 *
 * @param version - Documentation version, which is also the API version of the request
 * @param op - Operation of the sheet, with try true
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 */
const SheetBody = dynamic(() => import("@/components/try/SheetBody").then((m) => m.SheetBody), {
    ssr: false,
});

/**
 * The phone Try sheet of an operation, or nothing when the operation has no live Try (try false).
 * The Bar opens it through the shared sheet state; see SheetBody for its wiring and SheetPanel for
 * the drawer.
 *
 * @param version - Documentation version, which is also the API version of the request
 * @param op - Operation of the sheet; nothing renders unless its try flag is true
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 */
export function Sheet({ version, op, name }: SheetProps) {
    if (!op.try) return null;
    return <SheetBody version={version} op={op} name={name} />;
}
