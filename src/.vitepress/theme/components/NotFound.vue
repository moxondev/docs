<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { getPrefix, t } from '../utils/i18n';
import { getSmartRedirect, getUserLang, LATEST_VERSION } from '../utils/redirect';

defineProps<{ lang: string }>();
const redirecting = ref(false);

onBeforeMount(() => {
    const lang = getUserLang();
    const target = getSmartRedirect(window.location.pathname, lang, LATEST_VERSION);
    if (target) {
        redirecting.value = true;
        document.title = 'Redirecting...';
        window.location.replace(target);
    }
});
</script>

<template>
    <div v-if="!redirecting" class="not-found">
        <p class="code">404</p>
        <h1 class="title">{{ t('notFound.title', lang) }}</h1>
        <p class="quote">{{ t('notFound.message', lang) }}</p>
        <a class="link" :href="getPrefix(lang) || '/'">{{ t('notFound.link', lang) }}</a>
    </div>
</template>
