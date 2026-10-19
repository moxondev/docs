import { RELEASE } from "@/data/nav";

/**
 * Site constants; the documentation release comes from the generated nav module, itself written
 * from package.json, so the client never bundles the manifest.
 */
export const SITE = {
    url: "https://moxon.dev",
    api: "https://api.moxon.dev",
    store: "https://store.moxon.dev/join",
    repo: "https://github.com/moxondev/docs",
    branch: "master",
    version: RELEASE,
    twitter: "@20syldev",
    author: { name: "Sylvain L.", url: "https://sylvain.sh" },
} as const;
