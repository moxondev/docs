"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { usePalette, usePaletteShortcuts } from "@/hooks/usePalette";

/**
 * The palette as a chunk of its own, mounted the first time the shared open state turns true.
 */
const LazyPalette = dynamic(
    () => import("@/components/search/Palette").then((module) => module.Palette),
    { ssr: false },
);

/**
 * Starts fetching the palette chunk without mounting it, so that the first opening finds it in
 * the cache: the search controls call it when the pointer or the focus reaches them.
 */
export function preloadPalette(): void {
    void import("@/components/search/Palette");
}

/**
 * Keeps the search shortcuts alive while the palette is not loaded: a press of Ctrl or Cmd+K
 * or of "/" opens the shared state, which makes the host load the palette. It unmounts when
 * the palette mounts, whose own binding takes over, so a shortcut is never bound twice.
 */
function Waiting() {
    usePaletteShortcuts();

    return null;
}

/**
 * Mounts the search palette on demand. A page needs no palette to be read or hydrated, so it stays
 * out of the first load: its chunk is fetched the first time the shared open state turns true, and
 * the palette then mounts already open. Until then only the shortcut listener is present.
 */
export function PaletteHost() {
    const { open } = usePalette();
    const [loaded, setLoaded] = useState(false);

    if (open && !loaded) setLoaded(true);

    return loaded ? <LazyPalette /> : <Waiting />;
}
