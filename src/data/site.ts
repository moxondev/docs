import pkg from "../../package.json";

// Site constants; the documentation release is read from package.json so it is written once
export const SITE = {
    url: "https://moxon.dev",
    api: "https://api.moxon.dev",
    store: "https://store.moxon.dev/join",
    repo: "https://github.com/moxondev/docs",
    branch: "master",
    version: pkg.version,
    twitter: "@20syldev",
    author: { name: "Sylvain L.", url: "https://sylvain.sh" },
} as const;
