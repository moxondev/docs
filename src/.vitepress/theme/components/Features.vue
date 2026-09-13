<script setup lang="ts">
import { useRoute } from 'vitepress';
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import { ref, watch } from 'vue';

import { useVersion } from '../composables/useVersion';
import { endpoints, resolveEndpoint } from '../data/endpoints';
import { t, type TranslationKey } from '../utils/i18n';

const route = useRoute();
const { version, lang } = useVersion();

const keys: Record<string, TranslationKey> = {
    Address: 'features.address',
    Agent: 'features.agent',
    Algorithms: 'features.algorithms',
    Asymmetric: 'features.asymmetric',
    Avatar: 'features.avatar',
    Barcode: 'features.barcode',
    Base: 'features.base',
    Captcha: 'features.captcha',
    Case: 'features.case',
    Chart: 'features.chart',
    Color: 'features.color',
    Convert: 'features.convert',
    Credit: 'features.credit',
    Cron: 'features.cron',
    CSV: 'features.csv',
    Dice: 'features.dice',
    Diff: 'features.diff',
    Domain: 'features.domain',
    Encode: 'features.encode',
    Evaluate: 'features.evaluate',
    Geo: 'features.geo',
    Hash: 'features.hash',
    Headers: 'features.headers',
    Hyperplanning: 'features.hyperplanning',
    Infos: 'features.infos',
    IP: 'features.ip',
    JWT: 'features.jwt',
    Levenshtein: 'features.levenshtein',
    Matrix: 'features.matrix',
    OTP: 'features.otp',
    Palette: 'features.palette',
    Password: 'features.password',
    Personal: 'features.personal',
    Placeholder: 'features.placeholder',
    Pow: 'features.pow',
    'QR Code': 'features.qrcode',
    Read: 'features.read',
    Regex: 'features.regex',
    Semver: 'features.semver',
    Statistics: 'features.statistics',
    Symmetric: 'features.symmetric',
    Text: 'features.text',
    Time: 'features.time',
    Token: 'features.token',
    URL: 'features.url',
    Username: 'features.username',
    UUID: 'features.uuid',
    Validate: 'features.validate',
};

const seen = new Set<string>();
const unique = endpoints.filter((e) => {
    const base = e.path.split('/')[1];
    if (seen.has(base)) return false;
    seen.add(base);
    return keys[e.name];
});

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pick() {
    const l = lang.value;
    return shuffle(unique.filter((e) => resolveEndpoint(e, version.value)))
        .slice(0, 4)
        .map((e) => ({
            title: e.name,
            details: t(keys[e.name], l),
            link: `/${version.value}/${l}${e.path}`,
        }));
}

const features = ref(pick());
watch(
    () => route.path,
    () => (features.value = pick()),
);
</script>

<template>
    <VPFeatures class="VPHomeFeatures" :features="features" />
</template>
