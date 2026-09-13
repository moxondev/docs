<script setup lang="ts">
import { computed } from 'vue';

import { useVersion } from '../composables/useVersion';
import { t, type TranslationKey } from '../utils/i18n';
import { arrowRightIcon } from '../utils/icons';
import { KNOWN_VERSIONS, LATEST_VERSION, RETIRED_VERSIONS } from '../utils/redirect';

const { version, lang } = useVersion();

const latestIndex = KNOWN_VERSIONS.indexOf(LATEST_VERSION);
const versionIndex = computed(() => KNOWN_VERSIONS.indexOf(version.value));

const isLatest = computed(() => version.value === LATEST_VERSION);
const isPrevious = computed(() => versionIndex.value === latestIndex - 1);
const isRetired = computed(() => RETIRED_VERSIONS.includes(version.value));

const latestLink = computed(() => `/${LATEST_VERSION}/${lang.value}/`);
const bannerType = computed(() => (isPrevious.value ? 'warning' : 'danger'));
const titleKey = computed(
    () =>
        (isRetired.value
            ? 'banner.retiredTitle'
            : isPrevious.value
              ? 'banner.migrationTitle'
              : 'banner.legacyTitle') as TranslationKey,
);
const textKey = computed(
    () =>
        (isRetired.value
            ? 'banner.retiredText'
            : isPrevious.value
              ? 'banner.migrationText'
              : 'banner.legacyText') as TranslationKey,
);
</script>

<template>
    <div v-if="!isLatest" :class="['banner', bannerType]">
        <strong>{{ t(titleKey, lang) }}</strong>
        <p>{{ t(textKey, lang).replace('{version}', LATEST_VERSION) }}</p>
        <a :href="latestLink" class="banner-link">
            {{ t('banner.link', lang) }}
            <span v-html="arrowRightIcon" />
        </a>
    </div>
</template>
