import { defaultLang, langCodes, languages } from './i18n';

export const API_BASE_URL = 'https://api.moxon.dev';
export const LATEST_VERSION = 'v6';
export const KNOWN_VERSIONS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];

declare const __LATEST_RELEASE__: string;

/** Versions the API no longer serves; their documentation is kept for reference only. */
export const RETIRED_VERSIONS = ['v1', 'v2', 'v3'];

const CHANGELOG_SINCE = 'v4';
const changelogVersions = KNOWN_VERSIONS.slice(KNOWN_VERSIONS.indexOf(CHANGELOG_SINCE));

const langPattern = langCodes.join('|');
const versionNums = KNOWN_VERSIONS.map((v) => v.replace('v', '')).join('');
const rootPaths = new Set(['', '404', ...languages.filter((l) => l.prefix).map((l) => l.prefix.replace(/^\//, ''))]);

export const VERSION_REGEX = new RegExp(`^v[${versionNums}]$`);
export const VERSION_PATH_REGEX = new RegExp(`^(v[${versionNums}])\\/`);
export const VERSION_PATH = new RegExp(`^/v\\d+/(${langPattern})/(.*)$`);

/**
 * Returns the user's preferred language from localStorage, browser navigator, or the default.
 *
 * @returns A language code (e.g. `'en'`, `'fr'`)
 */
export function getUserLang(): string {
    if (typeof localStorage === 'undefined') return defaultLang;
    const saved = localStorage.getItem('lang');
    if (saved && langCodes.includes(saved)) return saved;
    const nav = (typeof navigator !== 'undefined' ? navigator.language : '') ?? '';
    const match = languages.find((l) => nav.toLowerCase().startsWith(l.code));
    return match ? match.code : defaultLang;
}

function changelogPath(release: string, lang: string, latest: string): string {
    const version = `v${release.split('.')[0]}`;
    return changelogVersions.includes(version)
        ? `/${version}/${lang}/changelog/${release}`
        : `/${latest}/${lang}/changelog`;
}

/**
 * Computes a redirect path by injecting the version and language when missing.
 *
 * @param path - The current URL path
 * @param lang - The target language code
 * @param latest - The latest version to use when no version is present. Defaults to `LATEST_VERSION`
 * @returns The redirect path, or `null` if no redirect is needed
 */
export function getSmartRedirect(path: string, lang: string, latest = LATEST_VERSION): string | null {
    const p = path.replace(/\/$/, '').replace(/^\//, '');
    if (rootPaths.has(p)) return null;

    const vRange = `[${versionNums}]`;
    if (new RegExp(`^v${vRange}\\/(${langPattern})(\\/.*)?$`).test(p)) return null;

    const langMatch = p.match(new RegExp(`^(${langPattern})\\/(.+)$`));
    if (langMatch) {
        const [, code, rest] = langMatch;
        return getSmartRedirect(`/${rest}`, code, latest);
    }

    const versionMatch = p.match(new RegExp(`^(v${vRange})(/(.+))?$`));
    if (versionMatch) {
        const [, version, , rest] = versionMatch;
        return `/${version}/${lang}${rest ? '/' + rest : ''}`;
    }

    const latestMatch = p.match(/^latest(\/(.+))?$/);
    if (latestMatch) {
        const [, , rest] = latestMatch;
        return `/${latest}/${lang}${rest ? '/' + rest : ''}`;
    }

    if (p === 'changelog/latest') return changelogPath(__LATEST_RELEASE__, lang, latest);

    const releaseMatch = p.match(/^(?:changelog\/)?(\d+\.\d+\.\d+)$/);
    if (releaseMatch) return changelogPath(releaseMatch[1], lang, latest);

    if (!p.includes('.') && !p.startsWith('_')) {
        return `/${latest}/${lang}/${p}`;
    }

    return null;
}
