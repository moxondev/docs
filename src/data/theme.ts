export type ThemeName = "light" | "dark";

export type ThemeChoice = ThemeName | "system";

// Browser chrome color of each resolved theme: the brand yellow, the dark theme page ground
export const THEME_COLORS: Record<ThemeName, string> = { light: "#fde68a", dark: "#121316" };

/**
 * Themes a reader can pick, in the order of the menus and of the Alt+T cycle: the two themes, then
 * the one that follows the system.
 */
export const THEME_CHOICES: readonly ThemeChoice[] = ["light", "dark", "system"];
