import type { Page } from "@/types/content";

/**
 * The bundled icons by family: the Try panel lists them and the page shows them under Icons.
 */
const FAMILIES = [
    {
        label: { en: "Arrows and actions:", fr: "Flèches et actions :" },
        items: [
            "arrow-down",
            "arrow-left",
            "arrow-right",
            "arrow-up",
            "check",
            "chevron-right",
            "download",
            "external-link",
            "minus",
            "plus",
            "refresh-cw",
            "upload",
            "x",
        ],
    },
    {
        label: {
            en: "Status and distinctions:",
            fr: "États et distinctions :",
        },
        items: [
            "award",
            "badge-check",
            "bell",
            "bug",
            "circle-alert",
            "circle-check",
            "circle-dot",
            "circle-x",
            "construction",
            "flag",
            "flame",
            "heart",
            "info",
            "shield",
            "shield-check",
            "sparkles",
            "star",
            "thumbs-up",
            "triangle-alert",
            "trophy",
            "zap",
        ],
    },
    {
        label: {
            en: "Files and development:",
            fr: "Fichiers et développement :",
        },
        items: [
            "archive",
            "book-open",
            "bookmark",
            "box",
            "code",
            "cog",
            "cpu",
            "database",
            "file-text",
            "folder",
            "git-branch",
            "git-commit",
            "git-merge",
            "git-pull-request",
            "hammer",
            "key",
            "layers",
            "link",
            "lock",
            "package",
            "plug",
            "puzzle",
            "search",
            "server",
            "settings",
            "tag",
            "terminal",
            "wrench",
        ],
    },
    {
        label: {
            en: "Everyday objects and media:",
            fr: "Objets du quotidien et médias :",
        },
        items: [
            "calendar",
            "clock",
            "cloud",
            "coffee",
            "eye",
            "gift",
            "globe",
            "hourglass",
            "house",
            "image",
            "mail",
            "message-circle",
            "monitor",
            "moon",
            "music",
            "palette",
            "pause",
            "pencil",
            "play",
            "rocket",
            "smartphone",
            "sun",
            "timer",
            "trash-2",
            "user",
            "users",
            "video",
            "wifi",
        ],
    },
    {
        label: { en: "Brands:", fr: "Marques :" },
        items: [
            "chrome",
            "codepen",
            "discord",
            "dribbble",
            "facebook",
            "figma",
            "framer",
            "github",
            "gitlab",
            "instagram",
            "linkedin",
            "slack",
            "trello",
            "twitch",
            "twitter",
            "youtube",
        ],
    },
];

/**
 * The families of icons as the sections of the lists of the Try panel, each in alphabetical order.
 */
const ICON_GROUPS = FAMILIES.map((family) => ({
    label: {
        en: family.label.en.replace(/:$/, ""),
        fr: family.label.fr.replace(/ :$/, ""),
    },
    options: [...family.items].sort(),
}));

/**
 * Every icon of the families, in their order, as the options of the icon and trail fields.
 */
const ICON_NAMES = ICON_GROUPS.flatMap((group) => group.options);

export const page: Page = {
    version: "v6",
    id: "badge",
    kind: "endpoint",
    title: { en: "Badge", fr: "Badge" },
    lead: {
        en: "The `/badge` endpoint draws a standalone SVG badge, a pill with a label, optional icons and an optional second part, for a plain `<img>`.",
        fr: "L'endpoint `/badge` dessine un badge SVG autonome, une pilule avec un libellé, des icônes et une seconde partie facultatives, pour un simple `<img>`.",
    },
    updated: "2026-11-17",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/badge",
            try: true,
            params: [
                {
                    name: "label",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "New",
                },
                {
                    name: "icon",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ICON_NAMES,
                    groups: ICON_GROUPS,
                    featured: ["sparkles", "github", "star", "rocket", "check"],
                },
                {
                    name: "trail",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ICON_NAMES,
                    groups: ICON_GROUPS,
                    featured: ["arrow-right", "chevron-right", "check"],
                },
                {
                    name: "message",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "v6",
                },
                {
                    name: "start",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#2d333b",
                },
                {
                    name: "end",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#2d333b",
                },
                {
                    name: "ink",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
                {
                    name: "messageStart",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#0969da",
                },
                {
                    name: "messageEnd",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#0969da",
                },
                {
                    name: "messageInk",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
                {
                    name: "border",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
                {
                    name: "size",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["xs", "sm", "md", "lg"],
                },
                {
                    name: "radius",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "10",
                },
                {
                    name: "angle",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "135",
                },
                {
                    name: "lift",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "0",
                },
                {
                    name: "font",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["sans", "serif", "mono"],
                },
                {
                    name: "weight",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["normal", "bold"],
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [{ type: "endpoint", op: "default" }],
        },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Only `label` is required. Every other parameter changes one aspect of the badge, and a badge without any of them is a dark pill with white bold text.",
                        fr: "Seul `label` est obligatoire. Chaque autre paramètre change un aspect du badge, et un badge sans aucun d'eux est une pilule sombre avec un texte blanc en gras.",
                    },
                },
            ],
        },
        {
            id: "content",
            level: 3,
            title: { en: "Text and icons", fr: "Texte et icônes" },
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "label",
                            required: true,
                            default: "—",
                            description: {
                                en: "Text of the badge, up to `64` characters",
                                fr: "Texte du badge, jusqu'à `64` caractères",
                            },
                        },
                        {
                            name: "icon",
                            required: false,
                            default: "—",
                            description: {
                                en: "Name of an [icon](#icons) drawn before the label",
                                fr: "Nom d'une [icône](#icons) dessinée avant le libellé",
                            },
                        },
                        {
                            name: "trail",
                            required: false,
                            default: "—",
                            description: {
                                en: "Name of an [icon](#icons) drawn after the text, after the message when there is one",
                                fr: "Nom d'une [icône](#icons) dessinée après le texte, après le message s'il y en a un",
                            },
                        },
                        {
                            name: "message",
                            required: false,
                            default: "—",
                            description: {
                                en: "Text of a second part, drawn after the label on its own background, up to `64` characters",
                                fr: "Texte d'une seconde partie, dessinée après le libellé sur son propre fond, jusqu'à `64` caractères",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "A `label` or a `message` cannot hold control characters or invisible ones, and needs at least one character that draws something (see the box below). Runs of spaces count as one, and an accented letter sent as a letter followed by its accent is drawn like the single accented letter.",
                        fr: "Un `label` ou un `message` ne peut contenir ni caractère de contrôle ni caractère invisible, et il lui faut au moins un caractère qui dessine quelque chose (voir l'encadré ci-dessous). Une suite d'espaces compte pour une seule, et une lettre accentuée envoyée en deux caractères, la lettre puis son accent, est dessinée comme la lettre accentuée seule.",
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "Characters that are refused",
                        fr: "Caractères refusés",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "A `label` or a `message` with one of these characters is refused with a `400`:",
                            },
                            {
                                type: "list",
                                items: [
                                    "Control characters, line and paragraph separators, and lone surrogates.",
                                    "Format characters that draw nothing: the soft hyphen, the zero-width space, the word joiner, the bidirectional marks and the tag characters.",
                                    "Invisible fillers: the Hangul fillers, the blank Braille pattern and the combining grapheme joiner.",
                                    "The noncharacters `U+FFFE` and `U+FFFF`.",
                                ],
                            },
                            {
                                type: "p",
                                text: "A text made only of spaces is refused as a missing text, and one made only of combining marks or variation selectors is refused like the characters above, as it draws nothing.",
                            },
                            {
                                type: "p",
                                text: "Still accepted: an emoji or a symbol followed by its variation selector (`U+FE0E` and `U+FE0F`, as in the red heart), accented letters, and no-break or ideographic spaces around a visible text.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Un `label` ou un `message` qui contient l'un de ces caractères est refusé avec un `400` :",
                            },
                            {
                                type: "list",
                                items: [
                                    "Les caractères de contrôle, les séparateurs de ligne et de paragraphe, et les surrogates isolés.",
                                    "Les caractères de format qui ne dessinent rien : le trait d'union conditionnel, l'espace de largeur nulle, le word joiner, les marques bidirectionnelles et les caractères de tag.",
                                    "Les remplisseurs invisibles : les remplisseurs Hangul, le motif Braille vide et le joint de graphèmes combinants.",
                                    "Les non-caractères `U+FFFE` et `U+FFFF`.",
                                ],
                            },
                            {
                                type: "p",
                                text: "Un texte fait uniquement d'espaces est refusé comme un texte manquant, et un texte fait uniquement de marques combinantes ou de sélecteurs de variation est refusé comme les caractères ci-dessus, puisqu'il ne dessine rien.",
                            },
                            {
                                type: "p",
                                text: "Restent acceptés : un emoji ou un symbole suivi de son sélecteur de variation (`U+FE0E` et `U+FE0F`, comme dans le cœur rouge), les lettres accentuées, et les espaces insécables ou idéographiques autour d'un texte visible.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "colors",
            level: 3,
            title: { en: "Colors", fr: "Couleurs" },
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "start",
                            required: false,
                            default: "`#2d333b`",
                            description: {
                                en: "Background color, or the first color of its gradient",
                                fr: "Couleur de fond, ou première couleur de son dégradé",
                            },
                        },
                        {
                            name: "end",
                            required: false,
                            default: "`start`",
                            description: {
                                en: "Last color of the gradient. Without it, the background is a single color",
                                fr: "Dernière couleur du dégradé. Sans elle, le fond est d'une seule couleur",
                            },
                        },
                        {
                            name: "ink",
                            required: false,
                            default: "`#ffffff`",
                            description: {
                                en: "Color of the text and of the icons, except the trailing icon when there is a `message`",
                                fr: "Couleur du texte et des icônes, sauf l'icône finale quand il y a un `message`",
                            },
                        },
                        {
                            name: "messageStart",
                            required: false,
                            default: "`#0969da`",
                            description: {
                                en: "Background color of the second part, or the first color of its gradient",
                                fr: "Couleur de fond de la seconde partie, ou première couleur de son dégradé",
                            },
                        },
                        {
                            name: "messageEnd",
                            required: false,
                            default: "`messageStart`",
                            description: {
                                en: "Last color of the gradient of the second part",
                                fr: "Dernière couleur du dégradé de la seconde partie",
                            },
                        },
                        {
                            name: "messageInk",
                            required: false,
                            default: "`ink`",
                            description: {
                                en: "Color of the text of the second part and, with a `message`, of the trailing icon. Ignored without a `message`",
                                fr: "Couleur du texte de la seconde partie et, avec un `message`, de l'icône finale. Ignorée sans `message`",
                            },
                        },
                        {
                            name: "border",
                            required: false,
                            default: "—",
                            description: {
                                en: "Color of a `1` px outline. Without it, the badge has no outline",
                                fr: "Couleur d'un contour de `1` px. Sans elle, le badge n'a pas de contour",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "A color is a hexadecimal value of `3` or `6` digits, with or without the `#`. In a URL, write the `#` as `%23`, or leave it out. The colors of the second part are checked even without a `message`.",
                        fr: "Une couleur est une valeur hexadécimale de `3` ou `6` chiffres, avec ou sans le `#`. Dans une URL, écrivez le `#` sous la forme `%23`, ou omettez-le. Les couleurs de la seconde partie sont contrôlées même sans `message`.",
                    },
                },
            ],
        },
        {
            id: "shape",
            level: 3,
            title: { en: "Shape and font", fr: "Forme et police" },
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "size",
                            required: false,
                            default: "`sm`",
                            description: {
                                en: "`xs`, `sm`, `md` or `lg`: a badge `16`, `20`, `24` or `28` px high. The icons and the text follow",
                                fr: "`xs`, `sm`, `md` ou `lg` : un badge de `16`, `20`, `24` ou `28` px de haut. Les icônes et le texte suivent",
                            },
                        },
                        {
                            name: "radius",
                            required: false,
                            default: { en: "pill", fr: "pilule" },
                            description: {
                                en: "Corner radius in pixels, from `0` (square) to `100`. A radius larger than half the height gives the pill, which is also the default",
                                fr: "Rayon des coins en pixels, de `0` (carré) à `100`. Un rayon supérieur à la moitié de la hauteur donne la pilule, qui est aussi la valeur par défaut",
                            },
                        },
                        {
                            name: "angle",
                            required: false,
                            default: "`135`",
                            description: {
                                en: "Direction of the gradients in degrees, from `0` to `360`, in the CSS convention: `90` runs from left to right and `180` from top to bottom. The default runs from corner to corner. The value is rounded to the nearest whole degree",
                                fr: "Direction des dégradés en degrés, de `0` à `360`, selon la convention CSS : `90` va de gauche à droite et `180` de haut en bas. La valeur par défaut va d'un coin à l'autre. La valeur est arrondie au degré entier le plus proche",
                            },
                        },
                        {
                            name: "lift",
                            required: false,
                            default: "`0`",
                            description: {
                                en: "From `0` to `10`: the image grows by twice this value in height, which leaves that much free space under the badge, and the badge stays at the top",
                                fr: "De `0` à `10` : l'image grandit du double de cette valeur en hauteur, ce qui laisse autant d'espace libre sous le badge, et le badge reste en haut",
                            },
                        },
                        {
                            name: "font",
                            required: false,
                            default: "`sans`",
                            description: {
                                en: "`sans`, `serif` or `mono`",
                                fr: "`sans`, `serif` ou `mono`",
                            },
                        },
                        {
                            name: "weight",
                            required: false,
                            default: "`bold`",
                            description: {
                                en: "`normal` or `bold`",
                                fr: "`normal` ou `bold`",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`radius`, `angle` and `lift` take a plain decimal of up to three digits and two decimals (`4`, `12.5`): a sign, an exponent or an empty value is refused. An empty `size`, `font` or `weight` is refused too, whereas an empty color, icon, `border` or `message` is ignored.",
                            },
                            {
                                type: "p",
                                text: "The width of the badge is measured on the server, so it is the same wherever it is shown. The text is drawn in the first font of its family that the viewer has installed (`Verdana` for `sans`, `Georgia` for `serif`, `Menlo` for `mono`), and it is stretched to the measured width, so a different font only changes the spacing between the letters.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`radius`, `angle` et `lift` prennent un décimal simple d'au plus trois chiffres et deux décimales (`4`, `12.5`) : un signe, un exposant ou une valeur vide sont refusés. Un `size`, un `font` ou un `weight` vide est refusé lui aussi, alors qu'une couleur, une icône, un `border` ou un `message` vide est ignoré.",
                            },
                            {
                                type: "p",
                                text: "La largeur du badge est mesurée sur le serveur, elle est donc la même partout où il s'affiche. Le texte est dessiné avec la première police de sa famille que le lecteur a installée (`Verdana` pour `sans`, `Georgia` pour `serif`, `Menlo` pour `mono`), et il est étiré à la largeur mesurée : une autre police ne change que l'espacement entre les lettres.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "icons",
            level: 2,
            title: { en: "Icons", fr: "Icônes" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "`icon` and `trail` take the name of one of the `106` icons bundled with the API: `105` icons of [Lucide](https://lucide.dev) and `discord`. Any other name is refused. The icons are drawn in the `ink` color, in the size of the badge, and the trailing one in `messageInk` when there is a `message`.",
                        fr: "`icon` et `trail` prennent le nom de l'une des `106` icônes embarquées dans l'API : `105` icônes de [Lucide](https://lucide.dev) et `discord`. Tout autre nom est refusé. Les icônes sont dessinées dans la couleur `ink`, à la taille du badge, et l'icône finale dans `messageInk` quand il y a un `message`.",
                    },
                },
                {
                    type: "values",
                    title: {
                        en: "Click to expand all available icons",
                        fr: "Cliquez pour voir toutes les icônes disponibles",
                    },
                    groups: FAMILIES,
                },
                {
                    type: "p",
                    text: {
                        en: "The icons of Lucide are published under the ISC licence, and the ones it derives from Feather under the MIT licence: both licences are kept in the source code of the API.",
                        fr: "Les icônes de Lucide sont publiées sous licence ISC, et celles qu'il tire de Feather sous licence MIT : les deux licences sont conservées dans le code source de l'API.",
                    },
                },
            ],
        },
        {
            id: "two-parts",
            level: 2,
            title: { en: "Two parts", fr: "Deux parties" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "With a `message`, the badge is split in two like the ones of shields.io: the label on the first background, the message on a second one, which has its own colors (`messageStart`, `messageEnd` and `messageInk`). The `border` and the `radius` go around the whole badge, and `trail` is drawn at the very end.",
                        fr: "Avec un `message`, le badge se coupe en deux comme ceux de shields.io : le libellé sur le premier fond, le message sur un second, qui a ses propres couleurs (`messageStart`, `messageEnd` et `messageInk`). Le `border` et le `radius` entourent tout le badge, et l'icône `trail` est dessinée tout à la fin.",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="https://api.moxon.dev/v6/badge?label=build&message=passing&messageStart=16a34a&icon=circle-check" alt="build: passing" />',
                },
            ],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The response is a **standalone SVG** (`Content-Type: image/svg+xml`), sized to its content, with no script and no external file. It is usable in an `<img>` tag, as a CSS background or in a Markdown image:",
                        fr: "La réponse est un **SVG autonome** (`Content-Type: image/svg+xml`), dimensionné selon son contenu, sans script ni fichier externe. Il s'utilise dans une balise `<img>`, en fond CSS ou dans une image Markdown :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="https://api.moxon.dev/v6/badge?label=New&icon=sparkles&start=7c3aed&end=db2777" alt="New" />',
                },
                {
                    type: "code",
                    lang: "text",
                    text: "![New](https://api.moxon.dev/v6/badge?label=New&icon=sparkles&start=7c3aed&end=db2777)",
                },
                {
                    type: "p",
                    text: {
                        en: "The image only depends on the query string, so it is sent with `Cache-Control: public, max-age=86400` (one day) and an `ETag`, and with `Content-Security-Policy: default-src 'none'`.",
                        fr: "L'image ne dépend que de la chaîne de requête : elle est donc envoyée avec `Cache-Control: public, max-age=86400` (un jour) et un `ETag`, et avec `Content-Security-Policy: default-src 'none'`.",
                    },
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            blocks: [
                {
                    type: "examples",
                    op: "default",
                    query: { label: "New", icon: "sparkles", start: "7c3aed", end: "db2777" },
                },
                { type: "try", op: "default" },
            ],
        },
        {
            id: "library",
            level: 2,
            title: { en: "In Node.js", fr: "Dans Node.js" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The `badge` function takes the same options as the query string, with `lift`, `radius` and `angle` as numbers, and returns `{ contentType, body }`, `body` being the SVG. It throws an `Error` with a message of the table [below](#error-handling) when an option is invalid. Outside HTTP, a number is only checked for its range and rounded to two decimals. It is exported by `@moxon/api/v6` and by the package root, which resolves to the latest version, see [the npm package](ref:index#using-the-npm-package).",
                        fr: "La fonction `badge` prend les mêmes options que la chaîne de requête, avec `lift`, `radius` et `angle` sous forme de nombres, et renvoie `{ contentType, body }`, `body` étant le SVG. Elle lève une `Error` avec un message du tableau [ci-dessous](#error-handling) quand une option est invalide. Hors HTTP, un nombre est seulement contrôlé dans sa plage et arrondi à deux décimales. Elle est exportée par `@moxon/api/v6` et par la racine du paquet, qui résout vers la dernière version, voir [le paquet npm](ref:index#using-the-npm-package).",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { badge } from '@moxon/api/v6';\n\nconst { contentType, body } = badge({\n    label: 'New',\n    icon: 'sparkles',\n    start: '#7c3aed',\n    end: '#db2777',\n    lift: 2,\n});\n\nconsole.log(contentType); // 'image/svg+xml'\nconsole.log(body); // '<svg xmlns=\"http://www.w3.org/2000/svg\" ...'",
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Every invalid value is refused with a `400` and a message that names it, instead of being replaced by a default.",
                        fr: "Toute valeur invalide est refusée avec un `400` et un message qui la nomme, au lieu d'être remplacée par une valeur par défaut.",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a label (?label={text})",
                            description: {
                                en: "The `label` is missing or empty, holds only spaces, or is given more than once",
                                fr: "Le `label` est absent ou vide, ne contient que des espaces, ou est donné plusieurs fois",
                            },
                            status: 400,
                        },
                        {
                            message: "Label cannot exceed 64 characters",
                            description: {
                                en: "The `label` is longer than `64` characters. The same message exists for the `message`, as `Message cannot exceed 64 characters`",
                                fr: "Le `label` dépasse `64` caractères. Le même message existe pour le `message`, sous la forme `Message cannot exceed 64 characters`",
                            },
                            status: 400,
                        },
                        {
                            message: "Label cannot contain control or invisible characters",
                            description: {
                                en: "The `label` holds a control or invisible character, or nothing but combining marks or variation selectors (see [the characters that are refused](#content)). The same message exists for the `message`, as `Message cannot contain control or invisible characters`",
                                fr: "Le `label` contient un caractère de contrôle ou invisible, ou rien d'autre que des marques combinantes ou des sélecteurs de variation (voir [les caractères refusés](#content)). Le même message existe pour le `message`, sous la forme `Message cannot contain control or invisible characters`",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid message",
                            description: {
                                en: "The `message` holds only spaces or is given more than once. An empty `message` is ignored",
                                fr: "Le `message` ne contient que des espaces ou est donné plusieurs fois. Un `message` vide est ignoré",
                            },
                            status: 400,
                        },
                        {
                            message: 'Unknown icon "nope"',
                            description: {
                                en: "The `icon` is not one of the [icons](#icons). The name is repeated in the message, cut at `40` characters",
                                fr: "Le paramètre `icon` ne fait pas partie des [icônes](#icons). Le nom est repris dans le message, coupé à `40` caractères",
                            },
                            status: 400,
                        },
                        {
                            message: 'Unknown trail icon "nope"',
                            description: {
                                en: "The `trail` is not one of the [icons](#icons)",
                                fr: "Le paramètre `trail` ne fait pas partie des [icônes](#icons)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid icon name",
                            description: {
                                en: "The `icon` is given more than once. The same message exists for the `trail`, as `Please provide a valid trail icon name`",
                                fr: "Le paramètre `icon` est donné plusieurs fois. Le même message existe pour `trail`, sous la forme `Please provide a valid trail icon name`",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid start color (use hex like ff6600)",
                            description: {
                                en: "The `start` is not a hexadecimal color. The same message exists for `end`, `ink`, `messageStart`, `messageEnd`, `messageInk` and `border`, with the name of the parameter",
                                fr: "Le `start` n'est pas une couleur hexadécimale. Le même message existe pour `end`, `ink`, `messageStart`, `messageEnd`, `messageInk` et `border`, avec le nom du paramètre",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid start color",
                            description: {
                                en: "A color is given more than once. The same message exists for the other colors, with the name of the parameter",
                                fr: "Une couleur est donnée plusieurs fois. Le même message existe pour les autres couleurs, avec le nom du paramètre",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid size (use xs, sm, md or lg)",
                            description: {
                                en: "The `size` is not one of the four sizes",
                                fr: "Le `size` n'est pas l'une des quatre tailles",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid font (use sans, serif or mono)",
                            description: {
                                en: "The `font` is not one of the three fonts",
                                fr: "Le `font` n'est pas l'une des trois polices",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid weight (use normal or bold)",
                            description: {
                                en: "The `weight` is neither `normal` nor `bold`",
                                fr: "Le `weight` n'est ni `normal` ni `bold`",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid lift (use a number from 0 to 10)",
                            description: {
                                en: "The `lift` is out of range, not a plain decimal or has more than two decimals",
                                fr: "Le `lift` est hors limites, n'est pas un décimal simple ou a plus de deux décimales",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid radius (use a number from 0 to 100)",
                            description: {
                                en: "The `radius` is out of range, not a plain decimal or has more than two decimals",
                                fr: "Le `radius` est hors limites, n'est pas un décimal simple ou a plus de deux décimales",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid angle (use a number from 0 to 360)",
                            description: {
                                en: "The `angle` is out of range, not a plain decimal or has more than two decimals",
                                fr: "L'`angle` est hors limites, n'est pas un décimal simple ou a plus de deux décimales",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
        {
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            blocks: [
                {
                    type: "related",
                    items: [
                        {
                            label: "",
                            to: "placeholder",
                            description: {
                                en: "SVG placeholders and skeleton loaders",
                                fr: "Placeholders SVG et squelettes de chargement",
                            },
                        },
                        {
                            label: "",
                            to: "avatar",
                            description: {
                                en: "Avatars generated from a seed",
                                fr: "Avatars générés à partir d'une graine",
                            },
                        },
                        {
                            label: "",
                            to: "chart",
                            description: {
                                en: "SVG charts from data arrays",
                                fr: "Graphiques SVG à partir de tableaux de données",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
