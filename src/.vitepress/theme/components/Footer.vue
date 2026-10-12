<script setup lang="ts">
import { useSidebar } from 'vitepress/theme';

import { useVersion } from '../composables/useVersion';
import { t } from '../utils/i18n';

const { version, lang } = useVersion();
const { hasSidebar } = useSidebar();
const year = new Date().getFullYear();
</script>

<template>
    <footer :class="['site-footer', { 'has-sidebar': hasSidebar }]">
        <div class="site-footer-inner">
            <span class="site-footer-copy">&copy; {{ year }} <a href="/">moxon.dev</a></span>
            <nav class="site-footer-links">
                <a :href="`/${version}/${lang}/changelog`">{{ t('footer.changelog', lang) }}</a>
                <span class="site-footer-dot" />
                <a href="https://github.com/moxondev/docs" target="_blank" rel="noopener">GitHub</a>
                <span class="site-footer-dot" />
                <a href="https://github.com/moxondev/docs/issues" target="_blank" rel="noopener">{{
                    t('footer.issue', lang)
                }}</a>
            </nav>
        </div>
    </footer>
</template>
