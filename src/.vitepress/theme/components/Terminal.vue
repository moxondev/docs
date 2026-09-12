<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

interface ApiRequest {
    method: 'GET' | 'POST';
    endpoint: string;
    body?: Record<string, unknown>;
    command: string;
}

const requests: ApiRequest[] = [
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/health',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/health"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v5',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v5"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/algorithms?method=fibonacci&value=10',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/algorithms?method=fibonacci&value=10"',
    },
    {
        method: 'POST',
        endpoint: 'https://api.sylvain.sh/v6/chart',
        body: {
            type: 'bar',
            data: { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Sales', values: [120, 200, 150] }] },
            mode: 'data',
        },
        command:
            'curl -X POST \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type":"bar","data":{...},"mode":"data"}\' \\\n  "https://api.sylvain.sh/v6/chart"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/domain',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/domain"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/evaluate?expr=2*(3%2B4)%5E2&precision=2',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/evaluate?expr=2*(3%2B4)%5E2&precision=2"',
    },
    {
        method: 'POST',
        endpoint: 'https://api.sylvain.sh/v6/hash',
        body: { text: 'hello', method: 'sha256' },
        command:
            'curl -X POST \\\n  -H "Content-Type: application/json" \\\n  -d \'{"text":"hello","method":"sha256"}\' \\\n  "https://api.sylvain.sh/v6/hash"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/infos',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/infos"',
    },
    {
        method: 'POST',
        endpoint: 'https://api.sylvain.sh/v6/matrix',
        body: {
            operation: 'determinant',
            matrix: [
                [1, 2],
                [3, 4],
            ],
        },
        command:
            'curl -X POST \\\n  -H "Content-Type: application/json" \\\n  -d \'{"operation":"determinant","matrix":[[1,2],[3,4]]}\' \\\n  "https://api.sylvain.sh/v6/matrix"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/personal',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/personal"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/time?format=iso',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/time?format=iso"',
    },
    {
        method: 'POST',
        endpoint: 'https://api.sylvain.sh/v6/token',
        body: { len: 48, type: 'alphanum' },
        command:
            'curl -X POST \\\n  -H "Content-Type: application/json" \\\n  -d \'{"len":48,"type":"alphanum"}\' \\\n  "https://api.sylvain.sh/v6/token"',
    },
    {
        method: 'GET',
        endpoint: 'https://api.sylvain.sh/v6/username',
        command: 'curl -X GET \\\n  "https://api.sylvain.sh/v6/username"',
    },
];

const command = ref('');
const response = ref('');
const cursor = ref<'command' | 'response' | null>('command');
const body = ref<HTMLElement | null>(null);

let index = 0;
let interval: ReturnType<typeof setInterval> | null = null;
let timeout: ReturnType<typeof setTimeout> | null = null;
let alive = true;

function scroll() {
    nextTick(() => {
        if (body.value) body.value.scrollTop = body.value.scrollHeight;
    });
}

async function fetchApi(request: ApiRequest): Promise<string> {
    try {
        const options: RequestInit = { method: request.method, headers: {} };
        if (request.method === 'POST' && request.body) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(request.body);
        }
        const res = await fetch(request.endpoint, options);
        return JSON.stringify(await res.json(), null, 2);
    } catch {
        return '{\n  "error": "Request failed"\n}';
    }
}

function typeText(text: string, target: typeof command, speed: number, onComplete: () => void) {
    let i = 0;
    target.value = '';
    interval = setInterval(() => {
        if (i < text.length) {
            target.value += text[i++];
            scroll();
        } else {
            clearInterval(interval!);
            onComplete();
        }
    }, speed);
}

async function runRequest() {
    if (!alive) return;
    const request = requests[index];
    cursor.value = 'command';

    typeText(request.command, command, 35, async () => {
        cursor.value = 'response';
        const result = await fetchApi(request);

        typeText(result, response, 15, () => {
            cursor.value = null;
            timeout = setTimeout(() => {
                response.value = '';
                index = (index + 1) % requests.length;
                runRequest();
            }, 3000);
        });
    });
}

onMounted(() => {
    requests.sort(() => Math.random() - 0.5);
    runRequest();
});

onUnmounted(() => {
    alive = false;
    if (interval) clearInterval(interval);
    if (timeout) clearTimeout(timeout);
});
</script>

<template>
    <div class="terminal">
        <div class="terminal-header">
            <div class="terminal-buttons">
                <span class="terminal-btn close"></span>
                <span class="terminal-btn minimize"></span>
                <span class="terminal-btn maximize"></span>
            </div>
            <span class="terminal-title">sylvain@api</span>
        </div>
        <div ref="body" class="terminal-body">
            <div class="terminal-line">
                <span class="terminal-prompt">$</span>
                <span class="terminal-command-wrapper"
                    ><span class="terminal-command"
                        >{{ command }}<span v-if="cursor === 'command'" class="terminal-cursor">_</span></span
                    ></span
                >
            </div>
            <pre
                v-if="response"
                class="terminal-response">{{ response }}<span v-if="cursor === 'response'" class="terminal-cursor">_</span></pre>
        </div>
    </div>
</template>
