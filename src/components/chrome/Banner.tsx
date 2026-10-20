"use client";

import { ArrowRightIcon, OctagonAlertIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { bannerKind } from "@/components/chrome/targets";
import { versionLabel } from "@/components/chrome/Versions";
import { NAV } from "@/data/nav";
import { LATEST, VERSIONS } from "@/data/versions";
import { href, INDEX, parsePath, versionTarget } from "@/lib/routes";

// Icon of each kind: a triangle for the previous version, an octagon for legacy and retired ones
const ICONS = {
    previous: TriangleAlertIcon,
    legacy: OctagonAlertIcon,
    retired: OctagonAlertIcon,
} as const;

/**
 * Wraps a code span of a banner message in the monospace look of the documentation.
 *
 * @param chunks - Text between the code tags of the message
 * @returns A code element with the chip background and the mono font of the documentation
 */
function code(chunks: ReactNode): ReactNode {
    return (
        <code className="rounded-tag bg-chip px-1.5 py-0.5 font-mono text-[0.875em]">{chunks}</code>
    );
}

/**
 * Notice of a version that is not the latest, drawn as the yellow note box of the documentation:
 * the full box on the home of the version, else a single line linking to the same page of the
 * latest version when it has it, so that a reader who lands deep from a search engine sees it.
 */
export function Banner() {
    const t = useTranslations("banner");
    const pathname = usePathname() ?? "/";
    const { lang, version, slug } = parsePath(pathname);
    const def = VERSIONS.find((candidate) => candidate.id === version);
    const kind = def ? bannerKind(def) : null;

    if (!def || !kind || !slug) return null;
    const Glyph = ICONS[kind];
    const latest = VERSIONS.find((candidate) => candidate.id === LATEST);
    const latestLabel = latest ? versionLabel(latest) : LATEST;

    if (slug === INDEX) {
        return (
            <div className="mx-auto w-full max-w-205 px-5 pt-6 desk:px-12 desk:pt-9 print:hidden">
                <aside
                    aria-label={t(`${kind}.title`)}
                    className="flex items-start gap-3 rounded-box border border-note-line bg-note-bg px-3.5 py-3 text-sm/[1.55] text-note-ink"
                >
                    <Glyph aria-hidden="true" className="mt-px size-4.5 shrink-0 text-ink" />
                    <div className="flex min-w-0 flex-col gap-1.5">
                        <p className="font-semibold">{t(`${kind}.title`)}</p>
                        <p>{t.rich(`${kind}.text`, { version: LATEST, code })}</p>
                        <Link
                            href={href(lang, LATEST)}
                            className="prose-link inline-flex w-fit items-center gap-1.5 font-medium"
                        >
                            {t("link")}
                            <ArrowRightIcon aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </aside>
            </div>
        );
    }

    return (
        <aside
            aria-label={t(`${kind}.title`)}
            className="flex items-start gap-2.5 border-b border-note-line bg-note-bg px-5 py-2.5 text-[13px]/5 text-note-ink desk:px-12 print:hidden"
        >
            <Glyph aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink" />
            <p className="min-w-0">
                {t(`slim.${kind}`, { version: versionLabel(def), latest: latestLabel })}{" "}
                <Link
                    href={href(lang, LATEST, versionTarget(NAV, LATEST, slug))}
                    className="prose-link font-medium whitespace-nowrap"
                >
                    {t("link")}
                </Link>
            </p>
        </aside>
    );
}
