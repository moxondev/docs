import { LINKS } from "@/data/links";
import { LATEST } from "@/data/versions";
import type { JsonValue, Method, Version } from "@/types/content";

export type HomeCardId = "authentication" | "pricing" | "changelog" | "github" | "npm";

export interface HomeCard {
    id: HomeCardId;
    to: string;
    icon: "arrow-right" | "arrow-up-right";
}

export interface HomeDemo {
    version: Version;
    method: Method;
    path: string;
    body: Record<string, JsonValue>;
    status: number;
    response: Record<string, JsonValue>;
}

/**
 * The "Go further" cards in display order, texts in messages home.further.<id>; a ref: target
 * resolves in the latest version, the GitHub and npm cards leave the site.
 */
export const HOME_CARDS: HomeCard[] = [
    { id: "authentication", to: "ref:authentication", icon: "arrow-right" },
    { id: "pricing", to: "ref:pricing", icon: "arrow-right" },
    { id: "changelog", to: "ref:changelog", icon: "arrow-right" },
    { id: "github", to: LINKS.repo, icon: "arrow-up-right" },
    { id: "npm", to: LINKS.npm, icon: "arrow-up-right" },
];

// The static example of the hero: a real answer of the API, so the home makes no live call
export const HOME_DEMO: HomeDemo = {
    version: LATEST,
    method: "post",
    path: "/hash",
    body: { text: "hello", method: "sha256" },
    status: 200,
    response: {
        method: "sha256",
        hash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
        encoding: "hex",
    },
};
