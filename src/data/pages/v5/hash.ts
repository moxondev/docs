import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    lead: {
        en: "The `/hash` endpoint converts a string into a hash, i.e. a string of characters that cannot be reversed into the original string.",
        fr: "L'endpoint `/hash` convertit une chaîne de caractères en hash, c'est-à-dire une chaîne de caractères qui ne peut pas être inversée vers la chaîne originale.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/hash",
            try: true,
            params: [
                {
                    name: "text",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "Hello World",
                },
                {
                    name: "method",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: [
                        "md5",
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
                        "blake2b512",
                        "blake2s256",
                        "ripemd160",
                        "shake128",
                        "shake256",
                    ],
                    featured: ["sha256", "sha512", "sha3-256", "blake2b512", "md5"],
                },
                {
                    name: "encoding",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["hex", "base64"],
                },
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
                        {
                            name: "encoding",
                            required: false,
                            description: {
                                en: "Output encoding: `hex` (default) or `base64`",
                                fr: "Encodage de sortie : `hex` (défaut) ou `base64`",
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
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                {
                    type: "examples",
                    op: "default",
                    body: { text: "hello", method: "sha256", encoding: "base64" },
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
                            name: "method",
                            type: "`string`",
                            description: {
                                en: "Hashing method used",
                                fr: "Méthode de hachage utilisée",
                            },
                        },
                        {
                            name: "hash",
                            type: "`string`",
                            description: {
                                en: "Resulting hash string (hex or base64 encoded digest)",
                                fr: "Hash résultant (encodé en hex ou base64 selon le choix)",
                            },
                        },
                    ],
                },
                { type: "try", op: "default" },
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
                            message: "Text is required",
                            description: {
                                en: "The `text` parameter is empty",
                                fr: "Le paramètre `text` est vide",
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
                        {
                            message: "Unsupported method. Use one of: {methods}",
                            description: {
                                en: "The method is not a supported hash algorithm",
                                fr: "La méthode n'est pas un algorithme supporté",
                            },
                            status: 400,
                        },
                        {
                            message: "Encoding must be one of: hex, base64",
                            description: {
                                en: "Invalid `encoding` value",
                                fr: "Valeur d'`encoding` invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
