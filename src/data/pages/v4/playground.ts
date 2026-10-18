import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "playground",
    kind: "playground",
    title: { en: "API Playground", fr: "Playground API" },
    lead: {
        en: "Test any moxon API endpoint directly from your browser. Select an endpoint, fill in the parameters, and send a request.",
        fr: "Testez n'importe quel endpoint de l'API moxon directement depuis votre navigateur. Sélectionnez un endpoint, remplissez les paramètres, et envoyez une requête.",
    },
    updated: "2026-04-08",
    sections: [{ id: "", blocks: [{ type: "playground" }] }],
};
