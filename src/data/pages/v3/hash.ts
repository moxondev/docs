import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    lead: {
        en: "The `/hash` endpoint converts a string into a hash, i.e. a string of characters that cannot be reversed into the original string.",
        fr: "L'endpoint `/hash` convertit une chaîne de caractères en hash, c'est-à-dire une chaîne de caractères qui ne peut pas être inversée vers la chaîne originale.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/hash",
            try: false,
            params: [
                { name: "text", type: "string", in: "body", required: true },
                { name: "method", type: "string", in: "body", required: true },
            ],
        },
    ],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "text",
                            required: true,
                            description: {
                                en: "The string to hash (word, sentence, paragraph, etc.)",
                                fr: "La chaîne à hacher (mot, phrase, paragraphe, etc.)",
                            },
                        },
                        {
                            name: "method",
                            required: true,
                            description: {
                                en: "The hashing method to use (see available methods below)",
                                fr: "La méthode de hachage à utiliser (voir les méthodes disponibles ci-dessous)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-methods",
            level: 2,
            title: { en: "Available Methods", fr: "Méthodes disponibles" },
            aliases: ["methodes-disponibles"],
            blocks: [
                {
                    type: "values",
                    title: {
                        en: "Click to expand all available hashing methods",
                        fr: "Cliquez pour voir toutes les méthodes de hachage disponibles",
                    },
                    groups: [
                        {
                            label: { en: "RSA Methods:", fr: "Méthodes RSA :" },
                            items: [
                                "RSA-MD5",
                                "RSA-RIPEMD160",
                                "RSA-SHA1",
                                "RSA-SHA1-2",
                                "RSA-SHA224",
                                "RSA-SHA256",
                                "RSA-SHA3-224",
                                "RSA-SHA3-256",
                                "RSA-SHA3-384",
                                "RSA-SHA3-512",
                                "RSA-SHA384",
                                "RSA-SHA512",
                                "RSA-SHA512/224",
                                "RSA-SHA512/256",
                                "RSA-SM3",
                            ],
                        },
                        {
                            label: { en: "Blake Methods:", fr: "Méthodes Blake :" },
                            items: ["blake2b512", "blake2s256"],
                        },
                        {
                            label: { en: "SHA Methods:", fr: "Méthodes SHA :" },
                            items: [
                                "sha1",
                                "sha224",
                                "sha256",
                                "sha384",
                                "sha512",
                                "sha512-224",
                                "sha512-256",
                                "sha3-224",
                                "sha3-256",
                                "sha3-384",
                                "sha3-512",
                            ],
                        },
                        {
                            label: { en: "MD5 Methods:", fr: "Méthodes MD5 :" },
                            items: ["md5", "md5-sha1", "md5WithRSAEncryption"],
                        },
                        {
                            label: { en: "RIPEMD Methods:", fr: "Méthodes RIPEMD :" },
                            items: ["ripemd", "ripemd160", "ripemd160WithRSA", "rmd160"],
                        },
                        {
                            label: { en: "Other Methods:", fr: "Autres méthodes :" },
                            items: [
                                "shake128",
                                "shake256",
                                "sm3",
                                "sm3WithRSAEncryption",
                                "ssl3-md5",
                                "ssl3-sha1",
                            ],
                        },
                        {
                            label: {
                                en: "RSA Encryption Methods:",
                                fr: "Méthodes de chiffrement RSA :",
                            },
                            items: [
                                "sha1WithRSAEncryption",
                                "sha224WithRSAEncryption",
                                "sha256WithRSAEncryption",
                                "sha384WithRSAEncryption",
                                "sha512WithRSAEncryption",
                                "sha512-224WithRSAEncryption",
                                "sha512-256WithRSAEncryption",
                            ],
                        },
                        {
                            label: { en: "PKCS Methods:", fr: "Méthodes PKCS :" },
                            items: [
                                "id-rsassa-pkcs1-v1_5-with-sha3-224",
                                "id-rsassa-pkcs1-v1_5-with-sha3-256",
                                "id-rsassa-pkcs1-v1_5-with-sha3-384",
                                "id-rsassa-pkcs1-v1_5-with-sha3-512",
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X POST -d "text=hello&method=sha512" "https://api.moxon.dev/v3/hash"',
                    role: "request",
                },
            ],
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
                    text: '{\n    "method": "sha512",\n    "hash": "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043"\n}',
                    role: "response",
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If parameters are missing or invalid, the API will return an error:",
                        fr: "Si les paramètres sont manquants ou invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a text (?text={text})",
                            description: {
                                en: "The `text` parameter is missing",
                                fr: "Le paramètre `text` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid hash algorithm (&method={algorithm})",
                            description: {
                                en: "The `method` parameter is missing or invalid",
                                fr: "Le paramètre `method` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
