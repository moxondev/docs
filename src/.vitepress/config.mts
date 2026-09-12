import { defineConfig } from 'vitepress';

import { badges } from './sidebar/utils';
import { v1 } from './sidebar/v1';
import { v2 } from './sidebar/v2';
import { v3 } from './sidebar/v3';
import { v4 } from './sidebar/v4';
import { v5 } from './sidebar/v5';

export default defineConfig({
    title: 'Hyperion API Documentation',
    description:
        'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',

    head: [
        // Favicon
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],

        // Theme
        ['meta', { name: 'theme-color', content: '#5c7cfa' }],

        // Open Graph
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'Hyperion API Documentation' }],
        ['meta', { property: 'og:url', content: 'https://docs.sylvain.sh/' }],
        ['meta', { property: 'og:title', content: 'Hyperion API Documentation' }],
        [
            'meta',
            {
                property: 'og:description',
                content:
                    'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',
            },
        ],
        ['meta', { property: 'og:image', content: 'https://docs.sylvain.sh/logo.png' }],

        // Twitter Card
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:site', content: '@20syldev' }],
        ['meta', { name: 'twitter:title', content: 'Hyperion API Documentation' }],
        [
            'meta',
            {
                name: 'twitter:description',
                content:
                    'A comprehensive collection of utility endpoints for developers. Algorithms, chat, games, QR codes, and more.',
            },
        ],
        ['meta', { name: 'twitter:image', content: 'https://docs.sylvain.sh/logo.png' }],

        // Google Structured Data
        [
            'script',
            { type: 'application/ld+json' },
            JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Hyperion API Documentation',
                url: 'https://docs.sylvain.sh/',
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
        siteTitle: 'Hyperion API',

        nav: [{ text: 'Home', link: '/' }],

        sidebar: badges({
            ...v5,
            ...v4,
            ...v3,
            ...v2,
            ...v1,
        }),

        socialLinks: [{ icon: 'github', link: 'https://github.com/20syldev/docs' }],

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
            pattern: 'https://github.com/20syldev/docs/edit/master/src/:path',
            text: 'Edit this page on GitHub',
        },
    },

    vite: {
        server: {
            host: '127.0.0.1',
        },
    },
});
