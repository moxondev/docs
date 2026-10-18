import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import checkFile from "eslint-plugin-check-file";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
    globalIgnores([
        ".next",
        "out",
        "components/ui",
        "src/components/ui",
        "next-env.d.ts",
        ".claude-work",
        "public",
    ]),
    ...nextVitals,
    ...nextTs,
    {
        plugins: { "check-file": checkFile, import: importPlugin },
        rules: {
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@radix-ui/react-*"],
                            message:
                                "Use named imports from the unified 'radix-ui' package instead.",
                        },
                    ],
                },
            ],
            "check-file/filename-naming-convention": [
                "error",
                {
                    // PascalCase components; a single lowercase word is also allowed (chat.tsx)
                    "**/components/**/*.{ts,tsx}": "@(+([a-z0-9])|*([A-Z]*([a-z0-9])))",
                    "**/{hooks,lib,data,types}/**/*.{ts,tsx}": "CAMEL_CASE",
                },
                { ignoreMiddleExtensions: true },
            ],
            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    pathGroups: [{ pattern: "@/**", group: "internal" }],
                    pathGroupsExcludedImportTypes: ["builtin"],
                },
            ],
            "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],
        },
    },
    prettier,
]);
