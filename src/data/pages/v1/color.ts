import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "color",
    kind: "endpoint",
    title: { en: "Color Generation", fr: "Génération de couleurs" },
    lead: {
        en: "The `/color` endpoint generates a random color in multiple formats. This endpoint does not require any options.",
        fr: "L'endpoint `/color` génère une couleur aléatoire dans plusieurs formats. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/color", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v1/color", role: "request" }],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "hex": "#517fff",\n    "rgb": "rgb(81, 127, 255)",\n    "hsl": "hsl(224, 100%, 66%)",\n    "hsv": "hsv(224, 68.2%, 100%)",\n    "hwb": "hwb(224, 32%, 0%)",\n    "cmyk": "cmyk(68.24%, 50.2%, 0%, 0%)"\n}',
                    role: "response",
                },
            ],
        },
        {
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v1/color"',
                    role: "curl",
                },
            ],
        },
    ],
};
