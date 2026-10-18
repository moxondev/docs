import { SITE } from "@/data/site";

/**
 * Every external URL the interface prints, the allow-list of the link check; edit is the prefix of
 * the per-page edit links, followed by the path of the page module.
 */
export const LINKS = {
    api: SITE.api,
    store: SITE.store,
    org: "https://github.com/moxondev",
    repo: SITE.repo,
    issues: `${SITE.repo}/issues`,
    newIssue: `${SITE.repo}/issues/new`,
    license: `${SITE.repo}/blob/${SITE.branch}/LICENSE`,
    edit: `${SITE.repo}/edit/${SITE.branch}/`,
    apiRepo: "https://github.com/moxondev/api",
    npm: "https://www.npmjs.com/package/@moxon/api",
    author: SITE.author.url,
    contact: "mailto:contact@sylvain.sh",
} as const;
