import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import {
    bannerKind,
    catalogueTarget,
    columnClass,
    currentRow,
    docsTarget,
    footerColumn,
    footerIssue,
    footerPlan,
    languageRows,
    majorOf,
    menuAfter,
    nextTheme,
    releaseLinks,
    showsFooter,
    themeChoice,
    themeRows,
    toolTarget,
    versionEntries,
    versionGroups,
    versionLabel,
} from "@/components/chrome/targets";
import { NAV } from "@/data/nav";
import { SITE } from "@/data/site";
import { THEME_CHOICES } from "@/data/theme";
import { LATEST, VERSIONS, type VersionStatus } from "@/data/versions";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/routes";

// C with a cedilla, built from its code point so that this file stays pure ASCII
const C_CEDILLA = String.fromCodePoint(0x00e7);

// E with a grave accent, built from its code point for the same reason
const E_GRAVE = String.fromCodePoint(0x00e8);

// The version just before the latest one, which every page of the latest version exists in too
const PREVIOUS = VERSIONS[1].id;

// A release page of the latest version, the shape of the pages that carry a footer
const RELEASE = Object.keys(NAV[LATEST]).find(
    (slug) => NAV[LATEST][slug].kind === "release",
) as string;

test("a tools page stays in the version being read when it has the page", () => {
    assert.equal(toolTarget(NAV, "fr", "v5", "playground"), "/fr/v5/playground/");
    assert.equal(toolTarget(NAV, "en", "v4", "changelog"), "/v4/changelog/");
    assert.equal(toolTarget(NAV, "en", "v3", "playground"), `/${LATEST}/playground/`);
    assert.equal(toolTarget(NAV, "fr", undefined, "pricing"), `/fr/${LATEST}/pricing/`);
});

test("the documentation and catalogue rows point at the version home and the home catalogue", () => {
    assert.equal(docsTarget("en", "v5"), "/v5/");
    assert.equal(docsTarget("fr", undefined), `/fr/${LATEST}/`);
    assert.equal(catalogueTarget("en"), "/#catalogue");
    assert.equal(catalogueTarget("fr"), "/fr/#catalogue");
});

test("one row of the menu is current, the home has none", () => {
    assert.equal(currentRow(undefined, undefined), null);
    assert.equal(currentRow(LATEST, "hash"), "documentation");
    assert.equal(currentRow(LATEST, "index"), "documentation");
    assert.equal(currentRow(LATEST, "playground"), "playground");
    assert.equal(currentRow(LATEST, "pricing"), "pricing");
    assert.equal(currentRow(LATEST, "changelog"), "changelog");
    assert.equal(currentRow(LATEST, RELEASE), "changelog");
});

test("only the versions older than the latest carry a banner", () => {
    const kinds: Record<VersionStatus, ReturnType<typeof bannerKind>> = {
        latest: null,
        previous: "previous",
        legacy: "legacy",
        retired: "retired",
    };
    for (const def of VERSIONS) assert.equal(bannerKind(def), kinds[def.status], def.id);
    assert.deepEqual(
        VERSIONS.filter((def) => def.status === "latest").map((def) => def.id),
        [LATEST],
    );
});

test("endpoint pages end with their own links and have no footer", () => {
    assert.equal(showsFooter(NAV, undefined, undefined), true);
    assert.equal(showsFooter(NAV, LATEST, "hash"), false);
    assert.equal(showsFooter(NAV, LATEST, "index"), true);
    assert.equal(showsFooter(NAV, LATEST, "pricing"), true);
    assert.equal(showsFooter(NAV, LATEST, RELEASE), true);
    assert.equal(showsFooter(NAV, LATEST, "zzz"), true);
});

test("the column table gives the home, the playground and the text pages their width", () => {
    assert.equal(columnClass("home"), "max-w-296 px-5 home:px-8");
    assert.equal(columnClass("playground"), "max-w-300 px-5 desk:px-12");
    for (const kind of [
        "article",
        "index",
        "pricing",
        "changelog",
        "release",
        "endpoint",
    ] as const) {
        assert.equal(columnClass(kind), "max-w-240 px-5 desk:px-12", kind);
    }
});

test("the footer takes the column of the page above it", () => {
    assert.equal(footerColumn(NAV, undefined, undefined), columnClass("home"));
    assert.equal(footerColumn(NAV, LATEST, "playground"), columnClass("playground"));
    assert.equal(footerColumn(NAV, LATEST, "authentication"), columnClass("article"));
    assert.equal(footerColumn(NAV, LATEST, "pricing"), columnClass("pricing"));
    assert.equal(footerColumn(NAV, LATEST, "changelog"), columnClass("changelog"));
    assert.equal(footerColumn(NAV, LATEST, "index"), columnClass("index"));
    assert.equal(footerColumn(NAV, LATEST, RELEASE), columnClass("release"));
    assert.equal(footerColumn(NAV, LATEST, "zzz"), columnClass("article"));

    for (const slug of Object.keys(NAV[LATEST]).filter((id) => showsFooter(NAV, LATEST, id))) {
        assert.equal(footerColumn(NAV, LATEST, slug), columnClass(NAV[LATEST][slug].kind), slug);
    }
});

test("the home and the documentation page take their column from the shared table", () => {
    // The footer reads the table, so a page that spells its own width would drift away from it
    const root = join(import.meta.dirname, "../..");
    for (const file of ["home/Home.tsx", "doc/Page.tsx", "NotFound.tsx"]) {
        const source = readFileSync(join(root, file), "utf8");
        assert.match(source, /columnClass\(/, file);
        assert.doesNotMatch(source, /max-w-(?:296|300|240|205)\b/, file);
    }
});

test("the footer repeats the report link only where the page has no foot links of its own", () => {
    assert.equal(footerIssue(NAV, undefined, undefined), true);
    assert.equal(footerIssue(NAV, LATEST, "zzz"), true);
    for (const slug of Object.keys(NAV[LATEST])) {
        assert.equal(footerIssue(NAV, LATEST, slug), false, slug);
    }
});

test("the 404 asks for its footer, whatever address it is served for", () => {
    // The address is unknown, so the mode decides: an endpoint address would have hidden the footer
    const expected = { show: true, issue: true, column: columnClass("article") };
    assert.deepEqual(footerPlan(NAV, undefined, undefined, "notfound"), expected);
    assert.deepEqual(footerPlan(NAV, LATEST, "hash", "notfound"), expected);
    assert.deepEqual(footerPlan(NAV, LATEST, "zzz", "notfound"), expected);
});

test("without a mode the footer plan follows the address", () => {
    assert.deepEqual(footerPlan(NAV, LATEST, "hash"), {
        show: false,
        issue: false,
        column: columnClass("endpoint"),
    });
    assert.deepEqual(footerPlan(NAV, undefined, undefined), {
        show: true,
        issue: true,
        column: columnClass("home"),
    });
    assert.deepEqual(footerPlan(NAV, LATEST, "pricing", "address"), {
        show: true,
        issue: false,
        column: columnClass("pricing"),
    });
});

test("the banner names the latest version by its release and the others by their major", () => {
    const labels = Object.fromEntries(VERSIONS.map((def) => [def.id, versionLabel(def)]));
    assert.equal(labels[LATEST], `v${SITE.version}`);
    for (const def of VERSIONS.filter((version) => version.id !== LATEST)) {
        assert.equal(labels[def.id], def.id);
    }
});

test("the picker rows keep the page, flag the latest and the current version", () => {
    const rows = versionEntries(NAV, `/fr/${LATEST}/hash/`);
    assert.equal(rows[0].id, LATEST);
    assert.equal(rows[0].href, `/fr/${LATEST}/hash/`);
    assert.equal(rows[0].latest, true);
    assert.deepEqual(
        rows.filter((row) => row.current).map((row) => row.id),
        [LATEST],
    );
    const older = rows.find((row) => row.id === PREVIOUS);
    assert.equal(older?.href, `/fr/${PREVIOUS}/hash/`);
    assert.equal(older?.latest, false);
});

test("outside the documentation every row opens a version home and the latest is current", () => {
    const rows = versionEntries(NAV, "/");
    assert.equal(rows.find((row) => row.current)?.id, LATEST);
    assert.equal(rows[0].href, `/${LATEST}/`);
    assert.ok(rows.every((row) => row.href.endsWith("/")));
});

test("an unpublished version is not in the picker", () => {
    const empty = { ...NAV, [PREVIOUS]: {} };
    assert.equal(
        versionEntries(empty, `/${LATEST}/hash/`).some((row) => row.id === PREVIOUS),
        false,
    );
});

test("the picker rows are labelled with the major, never the release", () => {
    const rows = versionEntries(NAV, `/${LATEST}/hash/`);
    assert.deepEqual(
        rows.map((row) => row.label),
        rows.map((row) => row.id),
    );
    assert.ok(rows.every((row) => !row.label.includes(".")));
});

test("the picker rows carry the status of their version and whether the API serves it", () => {
    const rows = versionEntries(NAV, `/${LATEST}/hash/`);
    for (const def of VERSIONS) {
        const row = rows.find((candidate) => candidate.id === def.id);
        assert.equal(row?.status, def.status, def.id);
        assert.equal(row?.served, def.served, def.id);
    }
});

test("the picker groups the served versions apart from the archives, keeping the order", () => {
    const { active, archived } = versionGroups(versionEntries(NAV, `/${LATEST}/hash/`));
    assert.ok(active.length > 0 && archived.length > 0);
    assert.ok(active.every((row) => row.served));
    assert.ok(archived.every((row) => !row.served && row.status === "retired"));
    assert.equal(active[0].id, LATEST);
    const order = VERSIONS.map((def) => def.id);
    assert.deepEqual(
        [...active, ...archived].map((row) => row.id),
        order.filter((id) => [...active, ...archived].some((row) => row.id === id)),
    );
});

test("the release submenu lists the releases newest first, in the language of the reader", () => {
    const english = releaseLinks(NAV, "en", "v5");
    assert.equal(english[0].label, VERSIONS.find((def) => def.id === "v5")?.release);
    assert.equal(english.at(-1)?.label, "5.0.0");
    assert.equal(english.length, 10);
    const french = releaseLinks(NAV, "fr", "v5");
    assert.equal(french[0].href, `/fr/v5/changelog/${french[0].label}/`);
    assert.equal(english[0].href, `/v5/changelog/${english[0].label}/`);
    assert.deepEqual(
        releaseLinks(NAV, "en", LATEST).map((link) => link.label),
        ["6.1.0", "6.0.0"],
    );
});

test("every release link of the submenu is a page of the index, and the archives have none", () => {
    for (const def of VERSIONS) {
        const links = releaseLinks(NAV, "en", def.id);
        assert.equal(links.length > 0, def.changelog && def.release !== undefined, def.id);
        for (const link of links) {
            const slug = link.href.split("/").slice(2, -1).join("/");
            assert.equal(NAV[def.id][slug]?.kind, "release", link.href);
        }
    }
});

test("the major of a version id is its number", () => {
    assert.equal(majorOf("v5"), "5");
    assert.equal(majorOf("v6"), "6");
});

test("the language menu has one row per locale, the document language marked current", () => {
    const links = alternates("/v6/hash/");
    assert.deepEqual(languageRows(routing.locales, "en", links), [
        { locale: "en", href: "/v6/hash/", current: true },
        { locale: "fr", href: "/fr/v6/hash/", current: false },
    ]);
    const french = languageRows(routing.locales, "fr", alternates("/fr/v6/hash/"));
    assert.deepEqual(
        french.map((row) => [row.locale, row.current]),
        [
            ["en", false],
            ["fr", true],
        ],
    );
    assert.deepEqual(
        languageRows(routing.locales, "en", alternates("/")).map((row) => row.href),
        ["/", "/fr/"],
    );
    assert.equal(languageRows(routing.locales, "en", links).filter((row) => row.current).length, 1);
});

test("each language is named in its own language, in every locale of the messages", () => {
    const read = (locale: string): Record<string, Record<string, string>> =>
        JSON.parse(
            readFileSync(
                join(import.meta.dirname, `../../../../messages/${locale}/common.json`),
                "utf8",
            ),
        );
    const english = read("en");
    const french = read("fr");
    assert.deepEqual(french.languages, english.languages);
    assert.deepEqual(Object.keys(english.languages), [...routing.locales]);
    assert.deepEqual(Object.keys(english.languageCodes), [...routing.locales]);
    assert.equal(english.languages.en, "English");
    assert.equal(french.languages.fr, `Fran${C_CEDILLA}ais`);
    for (const locale of routing.locales) {
        assert.equal(english.languageCodes[locale], locale.toUpperCase());
        assert.equal(french.languageCodes[locale], locale.toUpperCase());
    }
});

test("the theme menu has one row per choice, light, dark, then system, the preference current", () => {
    assert.deepEqual(themeRows("dark"), [
        { name: "light", current: false },
        { name: "dark", current: true },
        { name: "system", current: false },
    ]);
    assert.deepEqual(
        themeRows("system").map((row) => row.name),
        ["light", "dark", "system"],
    );
    for (const name of THEME_CHOICES) {
        const rows = themeRows(name);
        assert.equal(rows.filter((row) => row.current).length, 1);
        assert.equal(rows.find((row) => row.current)?.name, name);
    }
});

test("no theme row is current before the preference is known", () => {
    assert.equal(themeRows(undefined).length, THEME_CHOICES.length);
    assert.equal(themeRows(undefined).filter((row) => row.current).length, 0);
});

test("a theme name that the site does not offer counts as the system theme", () => {
    assert.equal(themeChoice("light"), "light");
    assert.equal(themeChoice("dark"), "dark");
    assert.equal(themeChoice("system"), "system");
    assert.equal(themeChoice(undefined), "system");
    assert.equal(themeChoice("auto"), "system");
    assert.equal(themeChoice(""), "system");
});

test("Alt+T cycles the preference: light, dark, system, light", () => {
    assert.equal(nextTheme("light"), "dark");
    assert.equal(nextTheme("dark"), "system");
    assert.equal(nextTheme("system"), "light");
    let theme = nextTheme("light");
    const seen = [theme];
    for (let press = 0; press < 5; press++) {
        theme = nextTheme(theme);
        seen.push(theme);
    }
    assert.deepEqual(seen, ["dark", "system", "light", "dark", "system", "light"]);
});

test("the cycle starts from the system theme when the preference is not known", () => {
    assert.equal(nextTheme(undefined), "light");
    assert.equal(nextTheme("auto"), "light");
});

test("at most one menu of the header is open, the last one asked for", () => {
    assert.equal(menuAfter(null, "language", true), "language");
    assert.equal(menuAfter("language", "theme", true), "theme");
    assert.equal(menuAfter("theme", "versions", true), "versions");
    assert.equal(menuAfter("theme", "theme", true), "theme");
});

test("a menu that closes only closes itself, and a late close leaves the new one open", () => {
    assert.equal(menuAfter("theme", "theme", false), null);
    assert.equal(menuAfter("theme", "language", false), "theme");
    assert.equal(menuAfter(null, "versions", false), null);
});

test("every choice of the theme has a name in both locales, in the order of the menu", () => {
    const read = (locale: string): Record<string, Record<string, string>> =>
        JSON.parse(
            readFileSync(
                join(import.meta.dirname, `../../../../messages/${locale}/common.json`),
                "utf8",
            ),
        );
    assert.deepEqual(Object.keys(read("en").themes), [...THEME_CHOICES]);
    assert.deepEqual(Object.keys(read("fr").themes), [...THEME_CHOICES]);
});

test("the theme message of the trigger and of the live region takes the name of a choice", () => {
    const read = (locale: string, file: string): Record<string, string> =>
        JSON.parse(
            readFileSync(
                join(import.meta.dirname, `../../../../messages/${locale}/${file}.json`),
                "utf8",
            ),
        );
    for (const locale of ["en", "fr"]) {
        assert.match(read(locale, "header").theme, /\{name\}/);
        assert.doesNotMatch(read(locale, "aria").theme, /\{/);
    }
    assert.equal(read("en", "header").theme, "Theme: {name}");
    assert.equal(read("fr", "header").theme, `Th${E_GRAVE}me : {name}`);
});
