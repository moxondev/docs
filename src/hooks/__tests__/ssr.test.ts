import assert from "node:assert/strict";
import { test } from "node:test";

import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { NextIntlClientProvider } from "next-intl";
import { type ComponentProps, createElement, type FunctionComponent } from "react";
import { renderToString } from "react-dom/server";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useCodeLang } from "@/hooks/useCodeLang";
import { useCopy } from "@/hooks/useCopy";
import { useFlash } from "@/hooks/useFlash";
import { useHydrated } from "@/hooks/useHydrated";
import { useLocaleSwitch, useRoutePath } from "@/hooks/useLocaleSwitch";
import { useLocationSearch, useQueryParam } from "@/hooks/useLocationSearch";
import { useModKey } from "@/hooks/useModKey";
import { usePalette, usePaletteShortcuts } from "@/hooks/usePalette";
import { usePreference } from "@/hooks/usePreference";
import { useRequest } from "@/hooks/useRequest";
import { useShortcutLabels, useShortcuts, useSingleKeys } from "@/hooks/useShortcuts";
import { useSentinel, useSlim } from "@/hooks/useSlim";
import type { Operation } from "@/types/content";

const INFOS: Operation = {
    id: "default",
    method: "get",
    path: "/infos",
    try: true,
    params: [{ name: "lang", type: "string", in: "query", required: false, default: "fr" }],
};

const ROUTER = {
    back: () => {},
    forward: () => {},
    prefetch: () => {},
    push: () => {},
    refresh: () => {},
    replace: () => {},
};

/**
 * Renders a component on the server the way the static export does, inside the App Router
 * contexts that next/navigation reads; the hooks under test must not touch window.
 *
 * @param probe - Component calling the hooks and printing what they return as JSON
 * @param pathname - Path of the page being prerendered
 * @param locale - Language of the document, the one the intl provider of its root layout carries
 * @returns The value the component printed, parsed back
 */
function serverRender(probe: FunctionComponent, pathname = "/fr/v6/hash/", locale = "fr"): unknown {
    const props = { locale, messages: {} } as ComponentProps<typeof NextIntlClientProvider>;
    const intl = createElement(NextIntlClientProvider, props, createElement(probe));
    const page = createElement(PathnameContext.Provider, { value: pathname }, intl);
    const html = renderToString(
        createElement(AppRouterContext.Provider, { value: ROUTER as never }, page),
    );
    const text = html.replace(/^<pre>|<\/pre>$/g, "").replace(/&quot;/g, '"');
    return JSON.parse(text);
}

/**
 * Prints a value as the JSON body of a pre element.
 *
 * @param value - What the hooks returned
 * @returns The element
 */
function print(value: unknown) {
    return createElement("pre", null, JSON.stringify(value));
}

test("the module graph of the hooks loads without a browser", () => {
    assert.equal(typeof window, "undefined");
    assert.equal(typeof document, "undefined");
});

test("preferences, platform and hydration render their server snapshot", () => {
    const out = serverRender(() => {
        const [lang] = usePreference("lang");
        const [code] = useCodeLang();
        const [singleKeys] = useSingleKeys();
        return print({
            lang,
            code,
            singleKeys,
            keys: useModKey(),
            hint: useShortcutLabels("search"),
            hydrated: useHydrated(),
        });
    });
    assert.deepEqual(out, {
        lang: null,
        code: "curl",
        singleKeys: true,
        keys: { mod: "ctrl", alt: "alt" },
        hint: [{ word: "ctrl" }, { text: "K" }],
        hydrated: false,
    });
});

test("stores, scroll spy and query render closed, empty and inactive", () => {
    const out = serverRender(() => {
        usePaletteShortcuts();
        useShortcuts({ theme: () => {} });
        useSentinel({ name: "Hash", category: "Security", methods: ["post"] });
        const { open, seed, session } = usePalette();
        return print({
            palette: { open, seed, session },
            slim: useSlim(),
            section: useActiveSection(["parameters", "errors"]),
            search: useLocationSearch(),
            endpoint: useQueryParam("endpoint"),
            copy: useCopy().status,
        });
    });
    assert.deepEqual(out, {
        palette: { open: false, seed: "", session: 0 },
        slim: { slim: false, meta: null },
        section: null,
        search: "",
        endpoint: null,
        copy: "idle",
    });
});

test("the language links come from the prerendered path", () => {
    const out = serverRender(() => {
        const { locale, links } = useLocaleSwitch();
        useFlash();
        return print({ locale, links });
    }, "/fr/v6/changelog/6.1.0");
    assert.deepEqual(out, {
        locale: "fr",
        links: { en: "/v6/changelog/6.1.0/", fr: "/fr/v6/changelog/6.1.0/" },
    });
});

test("the English 404 document keeps an English chrome whatever its address", () => {
    const render = (pathname: string) =>
        serverRender(
            () => {
                const { locale, links } = useLocaleSwitch();
                return print({ locale, links, path: useRoutePath() });
            },
            pathname,
            "en",
        );
    const home = { locale: "en", links: { en: "/", fr: "/fr/" }, path: "/" };
    assert.deepEqual(render("/_not-found/"), home);
    assert.deepEqual(render("/fr/zzz/"), home);
    assert.deepEqual(render("/fr/v5/zzz"), home);
});

test("a Try form renders its first state; an auto-send form renders as loading", () => {
    const out = serverRender(() => {
        const manual = useRequest("v6", INFOS);
        const auto = useRequest("v6", INFOS, { autoSend: true });
        return print({
            manual: [manual.phase, manual.canSend, manual.request.url],
            auto: [auto.phase, auto.canSend],
        });
    });
    assert.deepEqual(out, {
        manual: ["idle", true, "https://api.moxon.dev/v6/infos?lang=fr"],
        auto: ["loading", false],
    });
});
