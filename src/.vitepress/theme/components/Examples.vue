<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { CODE_LANG_LABELS, CODE_LANGS, type CodeLang, generateSnippet } from '../composables/useCodeSnippets';
import { useVersion } from '../composables/useVersion';
import { checkIcon, copyIcon } from '../utils/icons';
import { API_BASE_URL } from '../utils/redirect';

const props = withDefaults(
    defineProps<{
        method: 'get' | 'post' | 'patch' | 'delete';
        path: string;
        baseUrl?: string;
        params?: Record<string, string>;
        body?: Record<string, unknown>;
    }>(),
    {
        baseUrl: API_BASE_URL,
        params: () => ({}),
        body: () => ({}),
    },
);

const { versionedPath } = useVersion();
const fullPath = computed(() => versionedPath(props.path));

const STORAGE_KEY = 'moxon-code-lang';
const active = ref<CodeLang>('curl');

onMounted(() => {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY) as CodeLang | null;
        if (saved && CODE_LANGS.includes(saved)) active.value = saved;
    }
});

function setTab(tab: CodeLang) {
    active.value = tab;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, tab);
    }
}

const fullUrl = computed(() => {
    const base = `${props.baseUrl}${fullPath.value}`;
    if (props.method === 'get' && Object.keys(props.params).length) {
        const qs = new URLSearchParams(props.params).toString();
        return `${base}?${qs}`;
    }
    return base;
});

const code = computed(() =>
    generateSnippet(active.value, {
        method: props.method,
        url: fullUrl.value,
        body: props.body,
    }),
);

const copied = ref(false);

async function copy() {
    try {
        await navigator.clipboard.writeText(code.value);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch {
        // Fallback
    }
}
</script>

<template>
    <div class="panel examples">
        <div class="tab-bar examples-header">
            <div class="examples-tabs">
                <button
                    v-for="lang in CODE_LANGS"
                    :key="lang"
                    :class="['tab-item', { active: active === lang }]"
                    @click="setTab(lang)"
                >
                    {{ CODE_LANG_LABELS[lang] }}
                </button>
            </div>
            <button
                :class="['examples-copy', { copied }]"
                :title="copied ? 'Copied!' : 'Copy'"
                :aria-label="copied ? 'Copied!' : 'Copy code'"
                @click="copy"
                v-html="`${copyIcon}${checkIcon}`"
            />
        </div>
        <pre class="code-output"><code>{{ code }}</code></pre>
    </div>
</template>
