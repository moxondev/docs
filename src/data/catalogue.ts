import type { Loc, Version } from "@/types/content";

export type CategoryId =
    "security" | "text" | "images" | "compute" | "fakeData" | "network" | "realtime";

export interface CategoryDef {
    id: CategoryId;
    anchor: string;
    title: Loc<string>;
    summary: Loc<string>;
}

export interface EndpointMeta {
    slug: string;
    name: string;
    category: CategoryId;
    tagline: Loc<string>;
    summary: Loc<string>;
    since: Version;
    deprecated?: Version;
    unlisted?: Version[];
}

/**
 * The categories in display order; ids are those of @moxon/api/manifest, anchors those of the home
 * sections.
 */
export const CATEGORIES: CategoryDef[] = [
    {
        id: "security",
        anchor: "securite",
        title: { en: "Security", fr: "Sécurité" },
        summary: {
            en: "Hashing, encryption, tokens, passwords and anti-bot protection.",
            fr: "Hachage, chiffrement, jetons, mots de passe et protections anti-bot.",
        },
    },
    {
        id: "text",
        anchor: "texte",
        title: { en: "Text", fr: "Texte" },
        summary: {
            en: "Case, comparison, readability, regular expressions and encodings.",
            fr: "Casse, comparaison, lisibilité, expressions régulières et encodages.",
        },
    },
    {
        id: "images",
        anchor: "images",
        title: { en: "Images", fr: "Images" },
        summary: {
            en: "QR codes, barcodes, avatars, charts, palettes and colors.",
            fr: "QR codes, codes-barres, avatars, graphiques, palettes et couleurs.",
        },
    },
    {
        id: "compute",
        anchor: "calcul",
        title: { en: "Math and formats", fr: "Calcul et formats" },
        summary: {
            en: "Expressions, matrices, statistics, conversions and data formats.",
            fr: "Expressions, matrices, statistiques, conversions et formats de données.",
        },
    },
    {
        id: "fakeData",
        anchor: "donnees",
        title: { en: "Fake data", fr: "Données fictives" },
        summary: {
            en: "Addresses, identities, test cards, identifiers and dice.",
            fr: "Adresses, identités, cartes de test, identifiants et dés.",
        },
    },
    {
        id: "network",
        anchor: "reseau",
        title: { en: "Network", fr: "Réseau" },
        summary: {
            en: "Analysis of IP addresses, URLs, domains, User-Agents and headers.",
            fr: "Analyse d'adresses IP, d'URL, de domaines, de User-Agent et d'en-têtes.",
        },
    },
    {
        id: "realtime",
        anchor: "temps-reel",
        title: { en: "Real-time and games", fr: "Temps réel et jeux" },
        summary: {
            en: "Channel messaging, online tic-tac-toe and API information.",
            fr: "Messagerie par canaux, morpion en ligne et informations sur l'API.",
        },
    },
];

/**
 * One entry per endpoint family, keyed by the id of its primary page, by category in display
 * order and alphabetical inside each; methods and routes come from the pages. A page exists from
 * the major in since, is deprecated in deprecated, and leaves the lists in the majors of unlisted.
 */
export const CATALOGUE: EndpointMeta[] = [
    {
        slug: "asymmetric",
        name: "Asymmetric",
        category: "security",
        tagline: { en: "RSA keys, encryption", fr: "Clés RSA, chiffrement" },
        summary: {
            en: "RSA asymmetric encryption: generate key pairs, encrypt and decrypt.",
            fr: "Chiffrement RSA asymétrique : générer des paires de clés, chiffrer et déchiffrer.",
        },
        since: "v5",
    },
    {
        slug: "captcha",
        name: "Captcha",
        category: "security",
        tagline: { en: "CAPTCHA challenge", fr: "Défi CAPTCHA" },
        summary: {
            en: "Generate CAPTCHA images with customizable size, colors, and auto-generated text.",
            fr: "Générer des images CAPTCHA avec taille, couleurs et texte auto-généré personnalisables.",
        },
        since: "v1",
    },
    {
        slug: "hash",
        name: "Hash",
        category: "security",
        tagline: { en: "Hash digests", fr: "Empreintes de hachage" },
        summary: {
            en: "Hash text with MD5, SHA-1, SHA-256, SHA-512, or BLAKE2b.",
            fr: "Hasher du texte avec MD5, SHA-1, SHA-256, SHA-512 ou BLAKE2b.",
        },
        since: "v2",
    },
    {
        slug: "jwt",
        name: "JWT",
        category: "security",
        tagline: { en: "JWT decoding", fr: "Décodage de JWT" },
        summary: {
            en: "Decode a JSON Web Token: header, payload, signature, and expiration status.",
            fr: "Décoder un JSON Web Token : header, payload, signature et statut d'expiration.",
        },
        since: "v5",
    },
    {
        slug: "otp",
        name: "OTP",
        category: "security",
        tagline: { en: "TOTP and HOTP", fr: "TOTP et HOTP" },
        summary: {
            en: "Generate and verify TOTP/HOTP one-time passwords with otpauth URI support.",
            fr: "Générer et vérifier des mots de passe TOTP/HOTP avec support URI otpauth.",
        },
        since: "v5",
    },
    {
        slug: "password",
        name: "Password",
        category: "security",
        tagline: { en: "Passwords and passphrases", fr: "Mots de passe et phrases secrètes" },
        summary: {
            en: "Generate secure random passwords or passphrases with customizable options.",
            fr: "Générer des mots de passe sécurisés ou des phrases de passe avec options personnalisables.",
        },
        since: "v4",
    },
    {
        slug: "pow",
        name: "Pow",
        category: "security",
        tagline: { en: "Proof-of-work challenge", fr: "Défi de preuve de travail" },
        summary: {
            en: "Proof-of-work challenge: a bot protection no vision model can shortcut.",
            fr: "Défi de preuve de travail : une protection anti-bot que la vision ne contourne pas.",
        },
        since: "v5",
    },
    {
        slug: "symmetric",
        name: "Symmetric",
        category: "security",
        tagline: { en: "AES encryption", fr: "Chiffrement AES" },
        summary: {
            en: "AES symmetric encryption and decryption with AES-256-GCM, AES-256-CBC, or AES-128-GCM.",
            fr: "Chiffrement et déchiffrement AES symétrique avec AES-256-GCM, AES-256-CBC ou AES-128-GCM.",
        },
        since: "v5",
    },
    {
        slug: "token",
        name: "Token",
        category: "security",
        tagline: { en: "Random tokens", fr: "Jetons aléatoires" },
        summary: {
            en: "Generate secure random tokens in various formats.",
            fr: "Générer des tokens aléatoires sécurisés dans différents formats.",
        },
        since: "v1",
    },
    {
        slug: "base",
        name: "Base",
        category: "text",
        tagline: { en: "Number bases 2 to 36", fr: "Bases numériques de 2 à 36" },
        summary: {
            en: "Convert a number between any bases from 2 to 36, with arbitrary precision.",
            fr: "Convertir un nombre entre deux bases de 2 à 36, avec une précision arbitraire.",
        },
        since: "v5",
    },
    {
        slug: "case",
        name: "Case",
        category: "text",
        tagline: { en: "9 case styles", fr: "9 formats de casse" },
        summary: {
            en: "Convert text between 9 case formats: camelCase, snake_case, kebab-case, and more.",
            fr: "Convertir un texte entre 9 formats de casse : camelCase, snake_case, kebab-case, et plus.",
        },
        since: "v5",
    },
    {
        slug: "diff",
        name: "Diff",
        category: "text",
        tagline: { en: "Differences between two texts", fr: "Différences entre deux textes" },
        summary: {
            en: "Compare two texts and get an ordered list of changes, line by line or word by word.",
            fr: "Comparer deux textes et obtenir la liste des changements, par ligne ou par mot.",
        },
        since: "v5",
    },
    {
        slug: "encode",
        name: "Encode",
        category: "text",
        tagline: { en: "Text encoding and decoding", fr: "Encodage et décodage de texte" },
        summary: {
            en: "Encode and decode text in Base64, Morse, Caesar, binary, and more.",
            fr: "Encoder et décoder du texte en Base64, Morse, César, binaire, et plus.",
        },
        since: "v4",
    },
    {
        slug: "levenshtein",
        name: "Levenshtein",
        category: "text",
        tagline: { en: "Distance between two strings", fr: "Distance entre deux chaînes" },
        summary: {
            en: "Calculate the edit distance between two strings.",
            fr: "Calculer la distance d'édition entre deux chaînes.",
        },
        since: "v3",
    },
    {
        slug: "read",
        name: "Read",
        category: "text",
        tagline: { en: "Readability and reading time", fr: "Lisibilité et temps de lecture" },
        summary: {
            en: "Analyze a text: word, sentence and syllable counts, Flesch scores and reading time.",
            fr: "Analyser un texte : mots, phrases, syllabes, scores Flesch et temps de lecture.",
        },
        since: "v5",
    },
    {
        slug: "regex",
        name: "Regex",
        category: "text",
        tagline: { en: "Regular expression testing", fr: "Test d'expressions régulières" },
        summary: {
            en: "Test a regex pattern against a text: matches, capture groups, and named groups.",
            fr: "Tester un pattern regex contre un texte : correspondances, groupes capturants et nommés.",
        },
        since: "v4",
    },
    {
        slug: "text",
        name: "Text",
        category: "text",
        tagline: {
            en: "Text manipulation and generation",
            fr: "Manipulation et génération de texte",
        },
        summary: {
            en: "Text utilities: slug, stats, Lorem Ipsum, number to words.",
            fr: "Utilitaires texte : slug, stats, Lorem Ipsum, nombre en lettres.",
        },
        since: "v4",
    },
    {
        slug: "avatar",
        name: "Avatar",
        category: "images",
        tagline: { en: "Deterministic avatars", fr: "Avatars déterministes" },
        summary: {
            en: "Generate deterministic avatars (identicon or pixel art) from any seed string.",
            fr: "Générer des avatars déterministes (identicon ou pixel art) à partir d'une chaîne seed.",
        },
        since: "v4",
    },
    {
        slug: "barcode",
        name: "Barcode",
        category: "images",
        tagline: { en: "Barcodes in SVG or PNG", fr: "Codes-barres en SVG ou PNG" },
        summary: {
            en: "Generate barcode images in Code 128, EAN-13, EAN-8, UPC-A, or Code 39 format.",
            fr: "Générer des images de codes-barres aux formats Code 128, EAN-13, EAN-8, UPC-A ou Code 39.",
        },
        since: "v4",
    },
    {
        slug: "chart",
        name: "Chart",
        category: "images",
        tagline: { en: "Charts in SVG or JSON", fr: "Graphiques en SVG ou JSON" },
        summary: {
            en: "Generate SVG charts (bar, line, pie, donut) from data arrays.",
            fr: "Générer des graphiques SVG (barres, lignes, camembert, donut) à partir de données.",
        },
        since: "v5",
    },
    {
        slug: "color",
        name: "Color",
        category: "images",
        tagline: { en: "Color formats", fr: "Formats de couleur" },
        summary: {
            en: "Generate or convert colors with HEX, RGB, HSL, HSV, HWB, and CMYK values.",
            fr: "Générer ou convertir des couleurs avec valeurs HEX, RGB, HSL, HSV, HWB et CMYK.",
        },
        since: "v1",
    },
    {
        slug: "palette",
        name: "Palette",
        category: "images",
        tagline: { en: "Harmonious palettes", fr: "Palettes harmonieuses" },
        summary: {
            en: "Generate harmonious color palettes from a base HEX color.",
            fr: "Générer des palettes de couleurs harmonieuses à partir d'une couleur HEX.",
        },
        since: "v4",
    },
    {
        slug: "placeholder",
        name: "Placeholder",
        category: "images",
        tagline: { en: "SVG placeholders", fr: "Placeholders SVG" },
        summary: {
            en: "Generate SVG placeholders: images or animated skeleton loaders.",
            fr: "Générer des placeholders SVG : images ou squelettes de chargement animés.",
        },
        since: "v4",
    },
    {
        slug: "qrcode",
        name: "QR Code",
        category: "images",
        tagline: { en: "QR code as PNG", fr: "QR Code en PNG" },
        summary: {
            en: "Generate QR code images from any URL.",
            fr: "Générer des images QR code à partir d'une URL.",
        },
        since: "v1",
    },
    {
        slug: "algorithms",
        name: "Algorithms",
        category: "compute",
        tagline: { en: "Classic algorithms", fr: "Algorithmes classiques" },
        summary: {
            en: "Factorial, fibonacci, prime numbers, GCD, roman numerals, and more.",
            fr: "Factorielle, fibonacci, nombres premiers, PGCD, chiffres romains, et plus.",
        },
        since: "v1",
    },
    {
        slug: "convert",
        name: "Convert",
        category: "compute",
        tagline: { en: "Unit conversion", fr: "Conversion d'unités" },
        summary: {
            en: "Unit conversion: temperature, length, weight, data, and speed.",
            fr: "Conversion d'unités : température, longueur, poids, données et vitesse.",
        },
        since: "v1",
    },
    {
        slug: "cron",
        name: "Cron",
        category: "compute",
        tagline: { en: "Cron expression parsing", fr: "Lecture d'expressions cron" },
        summary: {
            en: "Parse a cron expression: human-readable description and next execution timestamps.",
            fr: "Parser une expression cron : description lisible et prochains timestamps d'exécution.",
        },
        since: "v4",
    },
    {
        slug: "csv",
        name: "CSV",
        category: "compute",
        tagline: { en: "CSV to JSON and back", fr: "CSV vers JSON, et inversement" },
        summary: {
            en: "Convert between CSV and JSON, in both directions.",
            fr: "Convertir entre CSV et JSON, dans les deux sens.",
        },
        since: "v5",
    },
    {
        slug: "evaluate",
        name: "Evaluate",
        category: "compute",
        tagline: { en: "Expression evaluation", fr: "Calcul d'expressions" },
        summary: {
            en: "Safely evaluate math expressions with constants, functions, and operators.",
            fr: "Évaluer des expressions mathématiques avec constantes, fonctions et opérateurs.",
        },
        since: "v5",
    },
    {
        slug: "matrix",
        name: "Matrix",
        category: "compute",
        tagline: { en: "Matrix operations", fr: "Calcul matriciel" },
        summary: {
            en: "Matrix operations: add, subtract, multiply, transpose, determinant, inverse, and more.",
            fr: "Opérations matricielles : addition, multiplication, déterminant, inverse, et plus.",
        },
        since: "v5",
    },
    {
        slug: "semver",
        name: "Semver",
        category: "compute",
        tagline: { en: "Semantic versions", fr: "Versions sémantiques" },
        summary: {
            en: "Parse, bump and compare semantic versions following the semver.org specification.",
            fr: "Analyser, incrémenter et comparer des versions sémantiques (semver.org).",
        },
        since: "v5",
    },
    {
        slug: "statistics",
        name: "Statistics",
        category: "compute",
        tagline: { en: "Descriptive statistics", fr: "Statistiques descriptives" },
        summary: {
            en: "Descriptive statistics: mean, median, standard deviation, and more.",
            fr: "Statistiques descriptives : moyenne, médiane, écart-type, et plus.",
        },
        since: "v4",
    },
    {
        slug: "time",
        name: "Time",
        category: "compute",
        tagline: { en: "Time, formats and time zones", fr: "Heure, formats et fuseaux" },
        summary: {
            en: "Current or random time with 17 format options and timezone support.",
            fr: "Heure actuelle ou aléatoire avec 17 formats et support des fuseaux.",
        },
        since: "v3",
    },
    {
        slug: "validate",
        name: "Validate",
        category: "compute",
        tagline: { en: "Data format validation", fr: "Validation de formats de données" },
        summary: {
            en: "Validate credit cards (Luhn), IBANs, and email addresses.",
            fr: "Valider des cartes bancaires (Luhn), IBAN et adresses email.",
        },
        since: "v4",
    },
    {
        slug: "address",
        name: "Address",
        category: "fakeData",
        tagline: { en: "Fake postal addresses", fr: "Adresses postales fictives" },
        summary: {
            en: "Generate realistic fake addresses for France, the US, UK, Germany, and Spain.",
            fr: "Générer des adresses fictives réalistes pour 5 pays (FR, US, UK, DE, ES).",
        },
        since: "v4",
    },
    {
        slug: "credit",
        name: "Credit",
        category: "fakeData",
        tagline: { en: "Test cards, Luhn checksum", fr: "Cartes de test, checksum Luhn" },
        summary: {
            en: "Generate fictitious Luhn-valid credit card numbers for testing purposes.",
            fr: "Générer des numéros de cartes bancaires fictifs Luhn-valides pour les tests.",
        },
        since: "v4",
    },
    {
        slug: "dice",
        name: "Dice",
        category: "fakeData",
        tagline: { en: "Dice in NdX+M notation", fr: "Dés en notation NdX+M" },
        summary: {
            en: "Roll dice using RPG notation (2d6+3, 1d20, 4d8).",
            fr: "Lancer des dés en notation RPG (2d6+3, 1d20, 4d8).",
        },
        since: "v4",
    },
    {
        slug: "personal",
        name: "Personal",
        category: "fakeData",
        tagline: { en: "Fake identities", fr: "Identités fictives" },
        summary: {
            en: "Generate a random fake identity with personal details.",
            fr: "Générer une identité fictive aléatoire avec des détails personnels.",
        },
        since: "v1",
    },
    {
        slug: "username",
        name: "Username",
        category: "fakeData",
        tagline: { en: "Random usernames", fr: "Noms d'utilisateur aléatoires" },
        summary: {
            en: "Generate random usernames with adjective + animal pattern.",
            fr: "Générer des noms d'utilisateur aléatoires (adjectif + animal).",
        },
        since: "v1",
    },
    {
        slug: "uuid",
        name: "UUID",
        category: "fakeData",
        tagline: { en: "v4 UUIDs, or UUID parsing", fr: "UUID v4, ou analyse d'un UUID" },
        summary: {
            en: "Generate random UUID v4 values, or parse a UUID's version and variant.",
            fr: "Générer des UUID v4 aléatoires, ou analyser la version et la variante d'un UUID.",
        },
        since: "v5",
    },
    {
        slug: "agent",
        name: "Agent",
        category: "network",
        tagline: { en: "User-Agent parsing", fr: "Analyse de User-Agent" },
        summary: {
            en: "Parse a User-Agent string: browser, OS, device, engine, and bot detection.",
            fr: "Parser un User-Agent : navigateur, OS, appareil, moteur et détection de bot.",
        },
        since: "v4",
    },
    {
        slug: "domain",
        name: "Domain",
        category: "network",
        tagline: { en: "Random data about a domain", fr: "Données aléatoires sur un domaine" },
        summary: {
            en: "Generate a fake domain profile: IP addresses, DNS, hosting, SSL, traffic and SEO score.",
            fr: "Générer un profil de domaine fictif : adresses IP, DNS, hébergeur, SSL, trafic et score SEO.",
        },
        since: "v1",
    },
    {
        slug: "geo",
        name: "Geo",
        category: "network",
        tagline: {
            en: "Distance and bearing between two GPS points",
            fr: "Distance et cap entre deux points GPS",
        },
        summary: {
            en: "Distance and bearing between two GPS coordinates (Haversine).",
            fr: "Distance et cap entre deux coordonnées GPS (Haversine).",
        },
        since: "v4",
    },
    {
        slug: "headers",
        name: "Headers",
        category: "network",
        tagline: { en: "Client HTTP headers", fr: "En-têtes HTTP du client" },
        summary: {
            en: "Retrieve HTTP request headers sent by the client, with optional filtering.",
            fr: "Récupérer les en-têtes HTTP envoyés par le client, avec filtrage optionnel.",
        },
        since: "v4",
    },
    {
        slug: "hyperplanning",
        name: "Hyperplanning",
        category: "network",
        tagline: { en: "Hyperplanning schedules", fr: "Emplois du temps Hyperplanning" },
        summary: {
            en: "Fetch and parse Hyperplanning schedules from a URL.",
            fr: "Récupérer et analyser les emplois du temps Hyperplanning depuis une URL.",
        },
        since: "v3",
        deprecated: "v6",
        unlisted: ["v6"],
    },
    {
        slug: "ip",
        name: "IP",
        category: "network",
        tagline: { en: "IPv4 and IPv6 analysis", fr: "Analyse IPv4 et IPv6" },
        summary: {
            en: "Analyze an IP address: type, class, binary form, decimal value, and reverse DNS.",
            fr: "Analyser une adresse IP : type, classe, forme binaire, valeur décimale et reverse DNS.",
        },
        since: "v4",
    },
    {
        slug: "url",
        name: "URL",
        category: "network",
        tagline: { en: "URL breakdown", fr: "Décomposition d'une URL" },
        summary: {
            en: "Parse a URL into scheme, host, port, path, query parameters and fragment.",
            fr: "Décomposer une URL en schéma, hôte, port, chemin, paramètres et fragment.",
        },
        since: "v5",
    },
    {
        slug: "chat",
        name: "Chat",
        category: "realtime",
        tagline: {
            en: "Messaging, public and private channels",
            fr: "Messagerie, canaux publics et privés",
        },
        summary: {
            en: "Send and read messages in public or private channels, kept for one hour.",
            fr: "Envoyer et lire des messages dans des canaux publics ou privés, conservés une heure.",
        },
        since: "v2",
    },
    {
        slug: "infos",
        name: "Infos",
        category: "realtime",
        tagline: { en: "API information", fr: "Informations sur l'API" },
        summary: {
            en: "Get API metadata: endpoint count, version, documentation link.",
            fr: "Métadonnées de l'API : nombre d'endpoints, version, lien documentation.",
        },
        since: "v1",
    },
    {
        slug: "tic-tac-toe",
        name: "Tic-tac-toe",
        category: "realtime",
        tagline: { en: "Online tic-tac-toe", fr: "Morpion en ligne" },
        summary: {
            en: "Play tic-tac-toe online between two players, in public or private games.",
            fr: "Jouer au morpion en ligne à deux joueurs, en partie publique ou privée.",
        },
        since: "v2",
    },
];
