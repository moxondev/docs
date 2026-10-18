import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "username",
    kind: "endpoint",
    title: { en: "Username Generation", fr: "Génération de noms d'utilisateur" },
    lead: {
        en: "The `/username` endpoint generates random usernames. This endpoint is useful for creating placeholder usernames or suggesting names to users.",
        fr: "L'endpoint `/username` génère un nom d'utilisateur aléatoire composé d'un adjectif, d'un animal et d'un métier. Un nombre aléatoire est également inclus. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-05-12",
    operations: [{ id: "default", method: "get", path: "/username", try: true, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters. It returns a randomly generated username using an adjective + animal pattern.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne un nom d'utilisateur généré aléatoirement avec le format adjectif + animal.",
                    },
                },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                {
                    type: "fields",
                    rows: [
                        {
                            name: "username",
                            type: "`string`",
                            description: {
                                en: "A randomly generated username",
                                fr: "Nom d'utilisateur généré",
                            },
                        },
                        {
                            name: "number",
                            type: "`number`",
                            description: {
                                en: "A random number used in generation",
                                fr: "Nombre aléatoire",
                            },
                        },
                        {
                            name: "adjective",
                            type: "`string`",
                            description: {
                                en: "The adjective component of the username",
                                fr: "Adjectif",
                            },
                        },
                        {
                            name: "animal",
                            type: "`string`",
                            description: {
                                en: "The animal component of the username",
                                fr: "Animal",
                            },
                        },
                        {
                            name: "job",
                            type: "`string`",
                            description: { en: "A randomly associated job", fr: "Métier" },
                        },
                    ],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default" },
                { type: "try", op: "default" },
            ],
        },
    ],
};
