import { Footer } from "@/components/chrome/Footer";
import { columnClass } from "@/components/chrome/targets";
import { Scope } from "@/components/doc/Scope";
import { Catalogue } from "@/components/home/Catalogue";
import { Further } from "@/components/home/Further";
import { Hero } from "@/components/home/Hero";
import { countEntries, homeCatalogue } from "@/components/home/model";
import { CONTENT_ID } from "@/components/Shell";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types/content";

export interface HomeProps {
    lang: Lang;
}

/**
 * Home page of a language: the hero with the static example, the catalogue of the latest version,
 * the "Go further" band and the site footer. There is no sidebar, no version card and no request to
 * the API; the counts come from the navigation index.
 *
 * @param lang - Picks the messages of the page and the path prefix of its links (none for English)
 */
export function Home({ lang }: HomeProps) {
    const categories = homeCatalogue(NAV, LATEST, lang);

    return (
        <Scope lang={lang} tree="home">
            <main
                id={CONTENT_ID}
                tabIndex={-1}
                className={cn("mx-auto w-full", columnClass("home"))}
            >
                <Hero lang={lang} count={countEntries(categories)} />
                <Catalogue categories={categories} />
                <Further lang={lang} />
            </main>
            <Footer />
        </Scope>
    );
}
