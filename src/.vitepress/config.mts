import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitepress';

import { badges } from './sidebar/utils';
import { v1 } from './sidebar/v1';
import { v2 } from './sidebar/v2';
import { v3 } from './sidebar/v3';
import { v4 } from './sidebar/v4';
import { v5 } from './sidebar/v5';
import { v6 } from './sidebar/v6';

const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'));

export default defineConfig({
    title: 'moxon API Documentation',
    description:
        'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',

    head: [
        // Favicon
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '48x48' }],
        ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
        ['link', { rel: 'manifest', href: '/site.webmanifest' }],

        // Theme
        ['meta', { name: 'theme-color', content: '#fde68a' }],

        // Open Graph
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'moxon API Documentation' }],
        ['meta', { property: 'og:url', content: 'https://moxon.dev/' }],
        ['meta', { property: 'og:title', content: 'moxon API Documentation' }],
        [
            'meta',
            {
                property: 'og:description',
                content:
                    'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',
            },
        ],
        ['meta', { property: 'og:image', content: 'https://moxon.dev/og-image.png' }],

        // Twitter Card
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:site', content: '@20syldev' }],
        ['meta', { name: 'twitter:title', content: 'moxon API Documentation' }],
        [
            'meta',
            {
                name: 'twitter:description',
                content:
                    'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',
            },
        ],
        ['meta', { name: 'twitter:image', content: 'https://moxon.dev/og-image.png' }],

        // Google Structured Data
        [
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'moxon API Documentation',
                url: 'https://moxon.dev/',
                description: 'A comprehensive collection of utility endpoints for developers.',
                author: {
                    '@type': 'Person',
                    name: 'Sylvain L.',
                    url: 'https://sylvain.sh',
                },
            }),
        ],
    ],

    cleanUrls: true,
    lastUpdated: true,

    themeConfig: {
        siteTitle: 'moxon API',

        nav: [{ text: 'Home', link: '/' }],

        sidebar: badges({
            ...v6,
            ...v5,
            ...v4,
            ...v3,
            ...v2,
            ...v1,
        }),

        socialLinks: [{ icon: 'github', link: 'https://github.com/moxondev/docs' }],

        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: 'Search',
                        buttonAriaLabel: 'Search',
                    },
                    modal: {
                        noResultsText: 'No results for',
                        resetButtonTitle: 'Reset search',
                        footer: {
                            selectText: 'to select',
                            navigateText: 'to navigate',
                            closeText: 'to close',
                        },
                    },
                },
            },
        },

        outline: {
            level: [2, 3],
        },

        editLink: {
            pattern: 'https://github.com/moxondev/docs/edit/master/src/:path',
            text: 'Edit this page on GitHub',
        },
    },

    vite: {
        define: {
            __LATEST_RELEASE__: JSON.stringify(version),
        },
        server: {
            host: '127.0.0.1',
        },
    },
});
