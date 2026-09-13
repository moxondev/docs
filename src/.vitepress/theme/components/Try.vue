<script setup lang="ts">
import { computed } from 'vue';

import { useVersion } from '../composables/useVersion';
import type { EndpointParam } from '../data/endpoints';
import { findEndpoint } from '../data/endpoints';
import { API_BASE_URL } from '../utils/redirect';
import Panel from './Panel.vue';

const props = withDefaults(
    defineProps<{
        name?: string;
        method?: 'get' | 'post' | 'patch' | 'delete';
        path?: string;
        baseUrl?: string;
        params?: EndpointParam[];
        autoSend?: boolean;
        noVersion?: boolean;
    }>(),
    {
        name: undefined,
        method: undefined,
        path: undefined,
        baseUrl: API_BASE_URL,
        params: () => [],
        autoSend: false,
        noVersion: false,
    },
);

const { version } = useVersion();

const endpoint = computed(() => (props.name ? findEndpoint(props.name, version.value) : undefined));

const resolvedMethod = computed(() => endpoint.value?.method ?? props.method ?? 'get');
const resolvedPath = computed(() => endpoint.value?.path ?? props.path ?? '/');
const resolvedParams = computed(() => endpoint.value?.params ?? props.params ?? []);
</script>

<template>
    <div class="try">
        <Panel
            :method="resolvedMethod"
            :path="resolvedPath"
            :base-url="baseUrl"
            :params="resolvedParams"
            :auto-send="autoSend"
            :no-version="noVersion"
        />
    </div>
</template>
