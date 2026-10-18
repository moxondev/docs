import { useCallback } from "react";

import { usePreference } from "@/hooks/usePreference";
import { isSnippetLang, type SnippetLang } from "@/lib/snippets";

// Storage key of the code sample language, kept from the former site so saved tabs carry over
export const CODE_LANG_KEY = "moxon-code-lang";

// Tab of the static HTML and of a reader who never chose one
export const DEFAULT_CODE_LANG: SnippetLang = "curl";

/**
 * Reads a stored code language, ignoring a value that is not a snippet language.
 *
 * @param stored - Raw value of the preference, null when unset
 * @returns The stored language, or cURL
 */
export function codeLang(stored: string | null): SnippetLang {
    return isSnippetLang(stored) ? stored : DEFAULT_CODE_LANG;
}

/**
 * Reads and sets the code sample language shared by Samples, Try, Sheet and the home Demo,
 * persisted across pages and tabs under moxon-code-lang. The static HTML shows cURL.
 *
 * @returns The language and its setter
 */
export function useCodeLang(): [SnippetLang, (lang: SnippetLang) => void] {
    const [stored, setStored] = usePreference(CODE_LANG_KEY);
    const setLang = useCallback((lang: SnippetLang) => setStored(lang), [setStored]);
    return [codeLang(stored), setLang];
}
