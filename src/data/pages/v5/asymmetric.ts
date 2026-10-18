import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "asymmetric",
    kind: "endpoint",
    title: { en: "Asymmetric", fr: "Asymmetric" },
    lead: {
        en: "The `/asymmetric` endpoint performs RSA asymmetric key generation, encryption, and decryption.",
        fr: "L'endpoint `/asymmetric` effectue la génération de clés RSA asymétriques, le chiffrement et le déchiffrement.",
    },
    updated: "2026-07-26",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/asymmetric",
            try: true,
            params: [
                {
                    name: "action",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["keygen", "encrypt", "decrypt"],
                },
                {
                    name: "text",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "Hello World",
                },
                {
                    name: "publicKey",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "-----BEGIN PUBLIC KEY-----\n...",
                },
                {
                    name: "privateKey",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "-----BEGIN PRIVATE KEY-----\n...",
                },
                {
                    name: "modulusLength",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["2048", "4096"],
                },
                {
                    name: "algorithm",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["rsa-oaep-sha256", "rsa-oaep-sha1"],
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
                                en: "Action to perform: `keygen`, `encrypt`, or `decrypt`",
                                fr: "Action à effectuer : `keygen`, `encrypt` ou `decrypt`",
                            },
                        },
                        {
                            name: "text",
                            required: "conditional",
                            description: {
                                en: "Text to encrypt, or base64 ciphertext to decrypt",
                                fr: "Texte à chiffrer, ou texte chiffré en base64 à déchiffrer",
                            },
                        },
                        {
                            name: "publicKey",
                            required: "conditional",
                            description: {
                                en: "PEM public key (required for `encrypt`)",
                                fr: "Clé publique PEM (requise pour `encrypt`)",
                            },
                        },
                        {
                            name: "privateKey",
                            required: "conditional",
                            description: {
                                en: "PEM private key (required for `decrypt`)",
                                fr: "Clé privée PEM (requise pour `decrypt`)",
                            },
                        },
                        {
                            name: "modulusLength",
                            required: false,
                            description: {
                                en: "RSA key size for `keygen`: `2048` (default) or `4096`. Ignored for `encrypt`/`decrypt` — the size limit is derived from the actual key",
                                fr: "Taille de la clé RSA pour `keygen` : `2048` (défaut) ou `4096`. Ignoré pour `encrypt`/`decrypt` — la limite de taille est dérivée de la clé réelle",
                            },
                        },
                        {
                            name: "algorithm",
                            required: false,
                            description: {
                                en: "Padding algorithm: `rsa-oaep-sha256` (default) or `rsa-oaep-sha1`",
                                fr: "Algorithme de padding : `rsa-oaep-sha256` (défaut) ou `rsa-oaep-sha1`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-actions",
            level: 2,
            title: { en: "Available Actions", fr: "Actions disponibles" },
            aliases: ["actions-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: ["Action", "Description"],
                    rows: [
                        [
                            "`keygen`",
                            {
                                en: "Generates an RSA key pair and returns both PEM-encoded public and private keys",
                                fr: "Génère une paire de clés RSA et retourne les clés publique et privée encodées en PEM",
                            },
                        ],
                        [
                            "`encrypt`",
                            {
                                en: "Encrypts text with the public key using OAEP padding and returns the result as base64",
                                fr: "Chiffre un texte avec la clé publique en utilisant le padding OAEP et retourne le résultat en base64",
                            },
                        ],
                        [
                            "`decrypt`",
                            {
                                en: "Decrypts a base64 ciphertext with the private key and returns the original plaintext",
                                fr: "Déchiffre un texte chiffré en base64 avec la clé privée et retourne le texte original",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "plaintext-size-limit",
            level: 2,
            title: { en: "Plaintext Size Limit", fr: "Limite de taille du texte" },
            aliases: ["limite-de-taille-du-texte"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "OAEP padding reserves space inside each RSA block, so the maximum plaintext size depends on the key size and hash algorithm:",
                        fr: "Le padding OAEP réserve de l'espace dans chaque bloc RSA, donc la taille maximale du texte dépend de la taille de la clé et de l'algorithme de hachage :",
                    },
                },
                {
                    type: "table",
                    head: {
                        en: ["Key Size", "Algorithm", "Max Plaintext"],
                        fr: ["Taille de clé", "Algorithme", "Texte max"],
                    },
                    rows: [
                        ["2048", "`rsa-oaep-sha256`", { en: "190 bytes", fr: "190 octets" }],
                        ["2048", "`rsa-oaep-sha1`", { en: "214 bytes", fr: "214 octets" }],
                        ["4096", "`rsa-oaep-sha256`", { en: "446 bytes", fr: "446 octets" }],
                        ["4096", "`rsa-oaep-sha1`", { en: "470 bytes", fr: "470 octets" }],
                    ],
                    kind: "matrix",
                },
                {
                    type: "p",
                    text: {
                        en: "The formula is: `modulusLength / 8 − 2 × hashLength − 2`.",
                        fr: "La formule est : `modulusLength / 8 − 2 × hashLength − 2`.",
                    },
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [{ type: "examples", op: "default", body: { action: "keygen" } }],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                { type: "label", text: { en: "`keygen` action:", fr: "Action `keygen` :" } },
                {
                    type: "fields",
                    rows: [
                        { name: "action", type: "`string`", description: "`keygen`" },
                        {
                            name: "algorithm",
                            type: "`string`",
                            description: {
                                en: "Padding algorithm used",
                                fr: "Algorithme de padding utilisé",
                            },
                        },
                        {
                            name: "modulusLength",
                            type: "`number`",
                            description: {
                                en: "RSA key size in bits",
                                fr: "Taille de la clé RSA en bits",
                            },
                        },
                        {
                            name: "publicKey",
                            type: "`string`",
                            description: {
                                en: "PEM-encoded public key (SPKI)",
                                fr: "Clé publique encodée en PEM (SPKI)",
                            },
                        },
                        {
                            name: "privateKey",
                            type: "`string`",
                            description: {
                                en: "PEM-encoded private key (PKCS#8)",
                                fr: "Clé privée encodée en PEM (PKCS#8)",
                            },
                        },
                    ],
                },
                {
                    type: "label",
                    text: {
                        en: "`encrypt` / `decrypt` action:",
                        fr: "Action `encrypt` / `decrypt` :",
                    },
                },
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
                                en: "Padding algorithm used",
                                fr: "Algorithme de padding utilisé",
                            },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: {
                                en: "Base64 ciphertext, or decrypted plaintext",
                                fr: "Texte chiffré en base64, ou texte brut déchiffré",
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
                            message: 'Action must be "keygen", "encrypt", or "decrypt"',
                            description: {
                                en: "The `action` value is not valid",
                                fr: "La valeur de `action` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Unsupported algorithm. Use one of: rsa-oaep-sha256, rsa-oaep-sha1",
                            description: {
                                en: "The `algorithm` value is not supported",
                                fr: "L'`algorithm` n'est pas supporté",
                            },
                            status: 400,
                        },
                        {
                            message: "Modulus length must be 2048 or 4096",
                            description: {
                                en: "The `modulusLength` is not 2048 or 4096",
                                fr: "Le `modulusLength` n'est ni 2048 ni 4096",
                            },
                            status: 400,
                        },
                        {
                            message: "Text is required",
                            description: {
                                en: "The `text` parameter is missing for encrypt",
                                fr: "Le paramètre `text` est manquant pour encrypt",
                            },
                            status: 400,
                        },
                        {
                            message: "Public key is required",
                            description: {
                                en: "The `publicKey` is missing for encrypt",
                                fr: "La `publicKey` est manquante pour encrypt",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid public key format",
                            description: {
                                en: "The `publicKey` does not start with the PEM header, or cannot be parsed as a valid key",
                                fr: "La `publicKey` ne commence pas par l'en-tête PEM, ou ne peut pas être analysée comme une clé valide",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Text exceeds maximum length for this key size and algorithm (N bytes)",
                            description: {
                                en: "The plaintext is too large for the key/algorithm",
                                fr: "Le texte est trop long pour la clé et l'algorithme",
                            },
                            status: 400,
                        },
                        {
                            message: "Encryption failed: invalid key or data too large",
                            description: {
                                en: "The encryption failed",
                                fr: "Le chiffrement a échoué",
                            },
                            status: 400,
                        },
                        {
                            message: "Encrypted data is required",
                            description: {
                                en: "The `text` parameter is missing for decrypt",
                                fr: "Le paramètre `text` est manquant pour decrypt",
                            },
                            status: 400,
                        },
                        {
                            message: "Private key is required",
                            description: {
                                en: "The `privateKey` is missing for decrypt",
                                fr: "La `privateKey` est manquante pour decrypt",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid private key format",
                            description: {
                                en: "The `privateKey` does not start with the PEM header",
                                fr: "La `privateKey` ne commence pas par l'en-tête PEM",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid key or corrupted data",
                            description: {
                                en: "The decryption failed",
                                fr: "Le déchiffrement a échoué",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
