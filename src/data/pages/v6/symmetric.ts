import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "symmetric",
    kind: "endpoint",
    title: { en: "Symmetric", fr: "Symmetric" },
    lead: {
        en: "The `/symmetric` endpoint encrypts and decrypts text using AES symmetric encryption.",
        fr: "L'endpoint `/symmetric` chiffre et déchiffre du texte par chiffrement symétrique AES.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/symmetric",
            try: true,
            params: [
                {
                    name: "action",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["encrypt", "decrypt"],
                },
                {
                    name: "text",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "Hello World",
                },
                {
                    name: "key",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "mysecretkey",
                },
                {
                    name: "algorithm",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["aes-256-gcm", "aes-256-cbc", "aes-128-gcm"],
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
                    type: "p",
                    text: {
                        en: "The request body must be JSON:",
                        fr: "Le corps de la requête doit être en JSON :",
                    },
                },
                {
                    type: "params",
                    rows: [
                        {
                            name: "action",
                            required: true,
                            description: {
                                en: "Action to perform: `encrypt` or `decrypt`",
                                fr: "Action à effectuer : `encrypt` ou `decrypt`",
                            },
                        },
                        {
                            name: "text",
                            required: true,
                            description: {
                                en: "Text to encrypt, or base64 blob to decrypt",
                                fr: "Texte à chiffrer, ou blob base64 à déchiffrer",
                            },
                        },
                        {
                            name: "key",
                            required: true,
                            description: {
                                en: "Encryption key (minimum 8 characters)",
                                fr: "Clé de chiffrement (minimum 8 caractères)",
                            },
                        },
                        {
                            name: "algorithm",
                            required: false,
                            description: {
                                en: "Cipher algorithm: `aes-256-gcm` (default), `aes-256-cbc`, or `aes-128-gcm`",
                                fr: "Algorithme de chiffrement : `aes-256-gcm` (défaut), `aes-256-cbc` ou `aes-128-gcm`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "key-derivation",
            level: 2,
            title: { en: "Key Derivation", fr: "Dérivation de clé" },
            aliases: ["derivation-de-cle"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The raw key is never used directly. It is derived using `scryptSync` with a random 16-byte salt, producing a secure fixed-length key regardless of input length.",
                        fr: "La clé brute n'est jamais utilisée directement. Elle est dérivée avec `scryptSync` à partir d'un sel aléatoire de 16 octets, produisant une clé de longueur fixe sécurisée quelle que soit la longueur de l'entrée.",
                    },
                },
            ],
        },
        {
            id: "blob-format",
            level: 2,
            title: { en: "Blob Format", fr: "Format du blob" },
            aliases: ["format-du-blob"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Encrypted output is returned as a base64 string with a binary layout that depends on the algorithm:",
                        fr: "Le résultat chiffré est retourné sous forme de chaîne base64 avec une structure binaire qui dépend de l'algorithme :",
                    },
                },
                {
                    type: "code",
                    text: {
                        en: "GCM: [16 bytes salt][12 bytes IV][16 bytes auth tag][ciphertext]\nCBC: [16 bytes salt][16 bytes IV][32 bytes HMAC-SHA256 MAC][ciphertext]",
                        fr: "GCM : [16 octets sel][12 octets IV][16 octets tag d'authentification][texte chiffré]\nCBC : [16 octets sel][16 octets IV][32 octets MAC HMAC-SHA256][texte chiffré]",
                    },
                },
                {
                    type: "list",
                    items: [
                        {
                            en: "**Salt** (16 bytes): used to derive the key (and, for CBC, a separate HMAC key)",
                            fr: "**Sel** (16 octets) : utilisé pour dériver la clé (et, pour CBC, une clé HMAC séparée)",
                        },
                        {
                            en: "**IV**: initialization vector (12 bytes for GCM, 16 bytes for CBC)",
                            fr: "**IV** : vecteur d'initialisation (12 octets en GCM, 16 octets en CBC)",
                        },
                        {
                            en: "**Auth tag / MAC**: integrity verification — a native GCM tag (16 bytes) for GCM, or an HMAC-SHA256 MAC (32 bytes) for CBC, checked with a constant-time comparison",
                            fr: "**Tag d'authentification / MAC** : vérification d'intégrité — un tag GCM natif (16 octets) en GCM, ou un MAC HMAC-SHA256 (32 octets) en CBC, vérifié par comparaison à temps constant",
                        },
                        {
                            en: "**Ciphertext**: the encrypted content",
                            fr: "**Texte chiffré** : le contenu chiffré",
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "Pass this blob as `text` to decrypt.",
                        fr: "Passer ce blob comme valeur de `text` pour déchiffrer.",
                    },
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Breaking change in 5.4.0", fr: "Changement cassant en 5.4.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "CBC blobs now carry an integrity MAC. Blobs produced by `aes-256-cbc` before 5.4.0 (without a MAC) can no longer be decrypted — re-encrypt them with the current version. GCM blobs are unaffected.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Les blobs CBC embarquent désormais un MAC d'intégrité. Les blobs produits par `aes-256-cbc` avant la 5.4.0 (sans MAC) ne peuvent plus être déchiffrés — il faut les rechiffrer avec la version actuelle. Les blobs GCM ne sont pas affectés.",
                            },
                        ],
                    },
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
                    body: { action: "encrypt", text: "hello", key: "mysecretkey" },
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
                            name: "action",
                            type: "`string`",
                            description: {
                                en: "Action performed (`encrypt` or `decrypt`)",
                                fr: "Action effectuée (`encrypt` ou `decrypt`)",
                            },
                        },
                        {
                            name: "algorithm",
                            type: "`string`",
                            description: {
                                en: "Cipher algorithm used",
                                fr: "Algorithme de chiffrement utilisé",
                            },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: {
                                en: "Encrypted base64 blob, or decrypted plaintext",
                                fr: "Blob base64 chiffré, ou texte brut déchiffré",
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
                            message: "Action is required",
                            description: {
                                en: "The `action` parameter is missing",
                                fr: "Le paramètre `action` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Action must be one of: encrypt, decrypt",
                            description: {
                                en: "The `action` value is not valid",
                                fr: "La valeur de `action` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Text is required",
                            description: {
                                en: "The `text` parameter is missing or empty",
                                fr: "Le paramètre `text` est manquant ou vide",
                            },
                            status: 400,
                        },
                        {
                            message: "Text exceeds maximum allowed length",
                            description: {
                                en: "The `text` exceeds the maximum length",
                                fr: "Le `text` dépasse la longueur maximale autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Key is required",
                            description: {
                                en: "The `key` parameter is missing",
                                fr: "Le paramètre `key` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Key must be at least 8 characters",
                            description: {
                                en: "The `key` is shorter than 8 characters",
                                fr: "La `key` fait moins de 8 caractères",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Algorithm must be one of: aes-256-gcm, aes-256-cbc, aes-128-gcm",
                            description: {
                                en: "The `algorithm` value is not supported",
                                fr: "L'`algorithm` n'est pas supporté",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
