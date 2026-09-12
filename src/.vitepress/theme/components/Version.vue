<script setup lang="ts">
import { useRoute } from 'vitepress';
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue';
import { computed } from 'vue';

import { v1 } from '../../sidebar/v1';
import { v2 } from '../../sidebar/v2';
import { v3 } from '../../sidebar/v3';
import { v4 } from '../../sidebar/v4';
import { v5 } from '../../sidebar/v5';
import { v6 } from '../../sidebar/v6';
import { useVersion } from '../composables/useVersion';
import { KNOWN_VERSIONS, VERSION_PATH } from '../utils/redirect';

interface SidebarItem {
    link?: string;
    items?: SidebarItem[];
}

function extractPages(sidebar: Record<string, SidebarItem[]>): string[] {
    const pages = new Set<string>();
    function walk(items: SidebarItem[]) {
        for (const item of items) {
            if (item.link) {
                const match = item.link.match(VERSION_PATH);
                if (match) pages.add(match[2]);
            }
            if (item.items) walk(item.items);
        }
    }
    const firstKey = Object.keys(sidebar)[0];
    if (firstKey) walk(sidebar[firstKey]);
    return [...pages];
}

const sidebars: Record<string, Record<string, SidebarItem[]>> = { v1, v2, v3, v4, v5, v6 };
const pages: Record<string, string[]> = Object.fromEntries(
    Object.entries(sidebars).map(([v, s]) => [v, extractPages(s)]),
);

const route = useRoute();
const { version, lang } = useVersion();

const page = computed(() => route.path.match(VERSION_PATH)?.[2] ?? '');
const visible = computed(() => route.path.includes('/v'));

const getLink = (v: string) => `/${v}/${lang.value}/${pages[v]?.includes(page.value) ? page.value : ''}`;

const items = computed(() => [...KNOWN_VERSIONS].reverse().map((v) => ({ text: v, link: getLink(v) })));
</script>

<template>
    <div v-if="visible" class="version-switcher-wrapper">
        <VPFlyout class="VPNavBarMenuGroup" :button="version" :items="items" />
    </div>
</template>
