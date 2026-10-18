import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Wraps the Next configuration with the next-intl plugin, which loads src/i18n/request.ts.
 *
 * @param nextConfig - Configuration to extend, whose own webpack hook, env and Turbopack
 *   aliases are kept
 * @returns A new configuration with the next-intl aliases and env added, the input left untouched
 */
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: process.env.NODE_ENV === "production" ? "export" : undefined,
    trailingSlash: true,
    images: { unoptimized: true },
    experimental: { globalNotFound: true },
    turbopack: { root: process.cwd() },
    agentRules: false,
};

export default withNextIntl(nextConfig);
