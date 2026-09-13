export interface EndpointParam {
    name: string;
    required: boolean;
    default?: string;
    options?: string[];
    placeholder?: string;
    json?: boolean;
    boolean?: boolean;
}

export interface EndpointOverride {
    method?: EndpointDef['method'];
    path?: string;
    removed?: boolean;
}

export interface EndpointDef {
    name: string;
    path: string;
    doc?: string;
    method: 'get' | 'post' | 'patch' | 'delete';
    params: EndpointParam[];
    group: string;
    /** Per-version differences, keyed by documentation version (e.g. `v6`). */
    overrides?: Record<string, EndpointOverride>;
}

export const endpoints: EndpointDef[] = [
    {
        name: 'Address',
        path: '/address',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'country', required: false, options: ['fr', 'us', 'uk', 'de', 'es'] },
            { name: 'count', required: false, placeholder: '1-10' },
        ],
    },
    {
        name: 'Agent',
        path: '/agent',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'ua', required: false, placeholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...' }],
    },
    {
        name: 'Algorithms',
        path: '/algorithms',
        method: 'get',
        group: 'Endpoints',
        params: [
            {
                name: 'method',
                required: true,
                options: [
                    'anagram',
                    'bubblesort',
                    'factorial',
                    'gcd',
                    'isprime',
                    'fibonacci',
                    'palindrome',
                    'primelist',
                    'primefactors',
                    'reverse',
                    'roman',
                ],
            },
            { name: 'value', required: true, placeholder: '42' },
            { name: 'value2', required: false, placeholder: '24' },
        ],
    },
    {
        name: 'Asymmetric',
        path: '/asymmetric',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'action', required: true, options: ['keygen', 'encrypt', 'decrypt'] },
            { name: 'text', required: false, placeholder: 'Hello World' },
            { name: 'publicKey', required: false, placeholder: '-----BEGIN PUBLIC KEY-----\n...' },
            { name: 'privateKey', required: false, placeholder: '-----BEGIN PRIVATE KEY-----\n...' },
            { name: 'modulusLength', required: false, options: ['2048', '4096'] },
            { name: 'algorithm', required: false, options: ['rsa-oaep-sha256', 'rsa-oaep-sha1'] },
        ],
    },
    {
        name: 'Avatar',
        path: '/avatar',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'seed', required: false, placeholder: 'claude' },
            { name: 'type', required: false, options: ['identicon', 'pixel'] },
            { name: 'format', required: false, options: ['png', 'svg'] },
            { name: 'size', required: false, placeholder: '200' },
            { name: 'bg', required: false, placeholder: '#f0f0f0' },
        ],
    },
    {
        name: 'Barcode',
        path: '/barcode',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'data', required: true, placeholder: 'Hello123' },
            { name: 'type', required: false, options: ['code128', 'ean13', 'ean8', 'upca', 'code39'] },
            { name: 'format', required: false, options: ['svg', 'png'] },
            { name: 'width', required: false, placeholder: '2' },
            { name: 'height', required: false, placeholder: '100' },
            { name: 'color', required: false, placeholder: '#000000' },
            { name: 'bg', required: false, placeholder: '#ffffff' },
        ],
    },
    {
        name: 'Base',
        path: '/base',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'value', required: true, placeholder: '255' },
            { name: 'from', required: false, placeholder: '10' },
            { name: 'to', required: false, placeholder: '16' },
        ],
    },
    {
        name: 'Captcha',
        path: '/captcha',
        method: 'get',
        group: 'Captcha',
        params: [
            { name: 'mode', required: false, options: ['image', 'challenge'] },
            { name: 'text', required: false, placeholder: 'abc123' },
            { name: 'length', required: false, placeholder: '6' },
            { name: 'width', required: false, placeholder: '360' },
            { name: 'height', required: false, placeholder: '120' },
            { name: 'noise', required: false, options: ['low', 'medium', 'high'] },
            { name: 'bg', required: false, placeholder: '#ffffff' },
            { name: 'color', required: false, placeholder: '#000000' },
        ],
    },
    {
        name: 'Captcha Verify',
        path: '/captcha',
        doc: '/captcha/verify',
        method: 'post',
        group: 'Captcha',
        params: [
            { name: 'token', required: true, placeholder: 'eyJ...' },
            { name: 'answer', required: true, placeholder: 'a4Kf2p' },
        ],
    },
    {
        name: 'Case',
        path: '/case',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'text', required: true, placeholder: 'hello_world' },
            {
                name: 'to',
                required: false,
                options: ['camel', 'pascal', 'snake', 'kebab', 'constant', 'title', 'sentence', 'upper', 'lower'],
            },
        ],
    },
    {
        name: 'Chart',
        path: '/chart',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'type', required: true, options: ['bar', 'line', 'pie', 'donut'] },
            {
                name: 'data',
                required: true,
                placeholder: '{"labels":["Jan","Feb","Mar"],"datasets":[{"label":"Sales","values":[120,200,150]}]}',
                json: true,
            },
            { name: 'title', required: false, placeholder: 'My Chart' },
            { name: 'width', required: false, placeholder: '600' },
            { name: 'height', required: false, placeholder: '400' },
            { name: 'colors', required: false, placeholder: '#5c7cfa,#f03e3e,#37b24d' },
            { name: 'bg', required: false, placeholder: '#ffffff' },
            { name: 'legend', required: false, options: ['true', 'false'], boolean: true },
            { name: 'mode', required: false, options: ['svg', 'data'] },
        ],
    },
    {
        name: 'Chat (GET)',
        path: '/chat',
        method: 'get',
        group: 'Chat',
        params: [],
    },
    {
        name: 'Chat (POST)',
        path: '/chat',
        method: 'post',
        group: 'Chat',
        params: [
            { name: 'username', required: true, placeholder: 'john' },
            { name: 'message', required: true, placeholder: 'Hello!' },
            { name: 'session', required: true, placeholder: 'my-session' },
            { name: 'token', required: false, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Chat Private',
        path: '/chat/private',
        method: 'post',
        group: 'Chat',
        params: [
            { name: 'username', required: true, placeholder: 'john' },
            { name: 'token', required: true, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Chat Clear',
        path: '/chat/:token',
        doc: '/chat/clear',
        method: 'delete',
        group: 'Chat',
        overrides: { v6: { method: 'post', path: '/chat/clear' } },
        params: [
            { name: 'token', required: true, placeholder: '41a43360-9874-4c7a-9ca8-eec29e765a0e' },
            { name: 'username', required: true, placeholder: 'alice' },
            { name: 'session', required: true, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Color',
        path: '/color',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'hex', required: false, placeholder: '#ff6600' }],
    },
    {
        name: 'Convert',
        path: '/convert',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'value', required: true, placeholder: '100' },
            {
                name: 'from',
                required: true,
                options: [
                    'celsius',
                    'fahrenheit',
                    'kelvin',
                    'km',
                    'mi',
                    'm',
                    'ft',
                    'cm',
                    'in',
                    'yd',
                    'kg',
                    'lb',
                    'oz',
                    'g',
                    'ton',
                    'b',
                    'kb',
                    'mb',
                    'gb',
                    'tb',
                    'km/h',
                    'mph',
                    'm/s',
                    'knots',
                ],
            },
            {
                name: 'to',
                required: true,
                options: [
                    'celsius',
                    'fahrenheit',
                    'kelvin',
                    'km',
                    'mi',
                    'm',
                    'ft',
                    'cm',
                    'in',
                    'yd',
                    'kg',
                    'lb',
                    'oz',
                    'g',
                    'ton',
                    'b',
                    'kb',
                    'mb',
                    'gb',
                    'tb',
                    'km/h',
                    'mph',
                    'm/s',
                    'knots',
                ],
            },
        ],
    },
    {
        name: 'Credit',
        path: '/credit',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'brand', required: false, options: ['random', 'visa', 'mastercard', 'amex', 'discover'] },
            { name: 'count', required: false, placeholder: '1' },
            { name: 'format', required: false, options: ['masked', 'full'] },
        ],
    },
    {
        name: 'Cron',
        path: '/cron',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'expr', required: true, placeholder: '0 9 * * 1-5' },
            { name: 'count', required: false, placeholder: '5' },
            { name: 'from', required: false, placeholder: '2025-01-01T00:00:00Z' },
            {
                name: 'timezone',
                required: false,
                options: ['UTC', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'],
            },
        ],
    },
    {
        name: 'CSV',
        path: '/csv',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'action', required: true, options: ['parse', 'format'] },
            { name: 'csv', required: false, placeholder: 'name,age\nAlice,30' },
            { name: 'json', required: false, placeholder: '[{"name":"Alice","age":30}]', json: true },
            { name: 'delimiter', required: false, placeholder: ',' },
            { name: 'headers', required: false, options: ['true', 'false'], boolean: true },
        ],
    },
    {
        name: 'Dice',
        path: '/dice',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'roll', required: true, placeholder: '2d6+3' }],
    },
    {
        name: 'Diff',
        path: '/diff',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'a', required: true, placeholder: 'line1\nline2' },
            { name: 'b', required: true, placeholder: 'line1\nline2 edited' },
            { name: 'mode', required: false, options: ['line', 'word'] },
        ],
    },
    {
        name: 'Domain',
        path: '/domain',
        method: 'get',
        group: 'Endpoints',
        params: [],
    },
    {
        name: 'Encode',
        path: '/encode',
        method: 'get',
        group: 'Endpoints',
        params: [
            {
                name: 'method',
                required: true,
                options: [
                    'base64encode',
                    'base64decode',
                    'urlencode',
                    'urldecode',
                    'morse',
                    'unmorse',
                    'rot13',
                    'caesar',
                    'binary',
                    'unbinary',
                ],
            },
            { name: 'text', required: true, placeholder: 'Hello World' },
            { name: 'shift', required: false, placeholder: '3' },
        ],
    },
    {
        name: 'Evaluate',
        path: '/evaluate',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'expr', required: true, placeholder: '2*(3+4)^2' },
            { name: 'precision', required: false, placeholder: '2' },
        ],
    },
    {
        name: 'Geo',
        path: '/geo',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'lat1', required: true, placeholder: '48.8566' },
            { name: 'lon1', required: true, placeholder: '2.3522' },
            { name: 'lat2', required: true, placeholder: '40.7128' },
            { name: 'lon2', required: true, placeholder: '-74.0060' },
        ],
    },
    {
        name: 'Hash',
        path: '/hash',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'text', required: true, placeholder: 'Hello World' },
            {
                name: 'method',
                required: true,
                options: [
                    'md5',
                    'sha1',
                    'sha224',
                    'sha256',
                    'sha384',
                    'sha512',
                    'sha512-224',
                    'sha512-256',
                    'sha3-224',
                    'sha3-256',
                    'sha3-384',
                    'sha3-512',
                    'blake2b512',
                    'blake2s256',
                    'ripemd160',
                    'shake128',
                    'shake256',
                ],
            },
            { name: 'encoding', required: false, options: ['hex', 'base64'] },
        ],
    },
    {
        name: 'Headers',
        path: '/headers',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'filter', required: false, placeholder: 'host,user-agent' }],
    },
    {
        name: 'Hyperplanning',
        path: '/hyperplanning',
        method: 'post',
        group: 'Endpoints',
        overrides: { v6: { removed: true } },
        params: [
            { name: 'url', required: true, placeholder: 'https://example.com/planning.ics' },
            { name: 'detail', required: false, options: ['full', 'list'] },
        ],
    },
    {
        name: 'Infos',
        path: '/infos',
        method: 'get',
        group: 'Endpoints',
        params: [],
    },
    {
        name: 'IP',
        path: '/ip',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'address', required: false, placeholder: '8.8.8.8' }],
    },
    {
        name: 'JWT',
        path: '/jwt',
        method: 'post',
        group: 'Endpoints',
        params: [{ name: 'token', required: true, placeholder: 'eyJ...' }],
    },
    {
        name: 'Levenshtein',
        path: '/levenshtein',
        method: 'get',
        group: 'Endpoints',
        overrides: { v6: { method: 'post' } },
        params: [
            { name: 'str1', required: true, placeholder: 'kitten' },
            { name: 'str2', required: true, placeholder: 'sitting' },
        ],
    },
    {
        name: 'Matrix',
        path: '/matrix',
        method: 'post',
        group: 'Endpoints',
        params: [
            {
                name: 'operation',
                required: true,
                options: ['add', 'subtract', 'multiply', 'scalar', 'transpose', 'determinant', 'inverse', 'identity'],
            },
            { name: 'matrix', required: true, placeholder: '[[1,2],[3,4]]', json: true },
            { name: 'matrix2', required: false, placeholder: '[[5,6],[7,8]]', json: true },
            { name: 'scalar', required: false, placeholder: '3' },
        ],
    },
    {
        name: 'OTP',
        path: '/otp',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'action', required: true, options: ['secret', 'generate', 'verify'] },
            { name: 'secret', required: false, placeholder: 'JBSWY3DPEHPK3PXP' },
            { name: 'code', required: false, placeholder: '123456' },
            { name: 'label', required: false, placeholder: 'alice' },
            { name: 'issuer', required: false, placeholder: 'Demo' },
            { name: 'algorithm', required: false, options: ['sha1', 'sha256', 'sha512'] },
            { name: 'digits', required: false, options: ['6', '8'] },
            { name: 'period', required: false, options: ['15', '30', '60'] },
            { name: 'counter', required: false, placeholder: '0' },
        ],
    },
    {
        name: 'Palette',
        path: '/palette',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'color', required: true, placeholder: '#ff6600' },
            {
                name: 'type',
                required: true,
                options: ['complementary', 'triadic', 'analogous', 'tetradic', 'split-complementary'],
            },
        ],
    },
    {
        name: 'Password',
        path: '/password',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'type', required: false, options: ['random', 'passphrase'] },
            { name: 'length', required: false, placeholder: '16' },
            { name: 'uppercase', required: false, options: ['true', 'false'] },
            { name: 'lowercase', required: false, options: ['true', 'false'] },
            { name: 'digits', required: false, options: ['true', 'false'] },
            { name: 'symbols', required: false, options: ['true', 'false'] },
            { name: 'exclude', required: false, placeholder: '0Ol1' },
            { name: 'count', required: false, placeholder: '1' },
            { name: 'separator', required: false, placeholder: '-' },
        ],
    },
    {
        name: 'Personal',
        path: '/personal',
        method: 'get',
        group: 'Endpoints',
        params: [],
    },
    {
        name: 'Placeholder',
        path: '/placeholder',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'type', required: true, options: ['image', 'skeleton'] },
            { name: 'width', required: false, placeholder: '400' },
            { name: 'height', required: false, placeholder: '300' },
            { name: 'bg', required: false, placeholder: '#cccccc' },
            { name: 'color', required: false, placeholder: '#666666' },
            { name: 'text', required: false, placeholder: '400×300' },
            { name: 'rows', required: false, placeholder: '3' },
            { name: 'avatar', required: false, options: ['true', 'circle', 'rounded', 'square'] },
            { name: 'lines', required: false, placeholder: '4' },
            { name: 'animate', required: false, options: ['shimmer', 'pulse', 'none'] },
            { name: 'speed', required: false, placeholder: '1.5' },
            { name: 'radius', required: false, placeholder: '8' },
        ],
    },
    {
        name: 'Pow',
        path: '/pow',
        method: 'get',
        group: 'Pow',
        params: [{ name: 'difficulty', required: false, placeholder: '1-6' }],
    },
    {
        name: 'Pow Verify',
        path: '/pow',
        doc: '/pow/verify',
        method: 'post',
        group: 'Pow',
        params: [
            { name: 'token', required: true, placeholder: 'eyJ...' },
            { name: 'nonce', required: true, placeholder: '48123' },
        ],
    },
    {
        name: 'QR Code',
        path: '/qrcode',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'url', required: true, placeholder: 'https://example.com' },
            { name: 'format', required: false, options: ['png', 'base64'] },
            { name: 'size', required: false, placeholder: '300' },
            { name: 'margin', required: false, placeholder: '2' },
            { name: 'correction', required: false, options: ['L', 'M', 'Q', 'H'] },
            { name: 'dark', required: false, placeholder: '#000000' },
            { name: 'light', required: false, placeholder: '#ffffff' },
            { name: 'icon', required: false, placeholder: 'https://example.com/icon.png' },
            { name: 'iconSize', required: false, placeholder: '50' },
            { name: 'iconPadding', required: false, placeholder: '4' },
            { name: 'iconRadius', required: false, placeholder: '8' },
        ],
    },
    {
        name: 'Read',
        path: '/read',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'text', required: true, placeholder: 'The cat sat on the mat. It was happy.' },
            { name: 'lang', required: false, options: ['en', 'fr'] },
        ],
    },
    {
        name: 'Regex',
        path: '/regex',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'pattern', required: true, placeholder: '\\d+' },
            { name: 'text', required: true, placeholder: 'Order 42 and item 7' },
            { name: 'flags', required: false, placeholder: 'i' },
        ],
    },
    {
        name: 'Semver',
        path: '/semver',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'version', required: true, placeholder: '1.2.3-beta.1+build.42' },
            { name: 'action', required: false, options: ['parse', 'bump', 'compare'] },
            { name: 'part', required: false, options: ['major', 'minor', 'patch'] },
            { name: 'other', required: false, placeholder: '1.3.0' },
        ],
    },
    {
        name: 'Statistics',
        path: '/statistics',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'values', required: true, placeholder: '1,2,3,4,5' }],
    },
    {
        name: 'Symmetric',
        path: '/symmetric',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'action', required: true, options: ['encrypt', 'decrypt'] },
            { name: 'text', required: true, placeholder: 'Hello World' },
            { name: 'key', required: true, placeholder: 'mysecretkey' },
            { name: 'algorithm', required: false, options: ['aes-256-gcm', 'aes-256-cbc', 'aes-128-gcm'] },
        ],
    },
    {
        name: 'Text',
        path: '/text',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'method', required: true, options: ['stats', 'slug', 'lorem', 'number'] },
            { name: 'value', required: false, placeholder: 'Hello World' },
            { name: 'type', required: false, options: ['words', 'sentences', 'paragraphs'] },
            { name: 'count', required: false, placeholder: '5' },
            { name: 'lang', required: false, options: ['en', 'fr'] },
        ],
    },
    {
        name: 'Tic-Tac-Toe',
        path: '/tic-tac-toe',
        method: 'post',
        group: 'Tic-Tac-Toe',
        params: [
            { name: 'username', required: true, placeholder: 'john' },
            { name: 'move', required: true, placeholder: '5' },
            { name: 'session', required: true, placeholder: 'my-session' },
            { name: 'game', required: true, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Tic-Tac-Toe Play',
        path: '/tic-tac-toe/:game',
        doc: '/tic-tac-toe/play',
        method: 'patch',
        group: 'Tic-Tac-Toe',
        overrides: { v6: { method: 'post', path: '/tic-tac-toe/play' } },
        params: [
            { name: 'game', required: true, placeholder: 'VWXYZ' },
            { name: 'username', required: true, placeholder: 'alice' },
            { name: 'move', required: true, placeholder: '1-1' },
            { name: 'session', required: true, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Tic-Tac-Toe Forfeit',
        path: '/tic-tac-toe/:game',
        doc: '/tic-tac-toe/forfeit',
        method: 'delete',
        group: 'Tic-Tac-Toe',
        overrides: { v6: { method: 'post', path: '/tic-tac-toe/forfeit' } },
        params: [
            { name: 'game', required: true, placeholder: 'VWXYZ' },
            { name: 'username', required: true, placeholder: 'alice' },
            { name: 'session', required: true, placeholder: 'abc123' },
        ],
    },
    {
        name: 'Tic-Tac-Toe Fetch',
        path: '/tic-tac-toe/fetch',
        method: 'post',
        group: 'Tic-Tac-Toe',
        params: [
            { name: 'username', required: true, placeholder: 'john' },
            { name: 'game', required: false, placeholder: 'abc123' },
            { name: 'private', required: false, options: ['true', 'false'] },
        ],
    },
    {
        name: 'Tic-Tac-Toe List',
        path: '/tic-tac-toe/list',
        method: 'post',
        group: 'Tic-Tac-Toe',
        params: [],
    },
    {
        name: 'Time',
        path: '/time',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'type', required: false, options: ['live', 'random', 'countdown'] },
            {
                name: 'format',
                required: false,
                options: [
                    'iso',
                    'utc',
                    'timestamp',
                    'locale',
                    'date',
                    'time',
                    'year',
                    'month',
                    'day',
                    'hour',
                    'minute',
                    'second',
                    'ms',
                    'dayOfWeek',
                    'dayOfYear',
                    'weekNumber',
                    'timezone',
                ],
            },
            {
                name: 'timezone',
                required: false,
                options: ['UTC', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'],
            },
            { name: 'start', required: false, placeholder: '2025-01-01' },
            { name: 'end', required: false, placeholder: '2025-12-31' },
            { name: 'target', required: false, placeholder: '2026-01-01' },
        ],
    },
    {
        name: 'Token',
        path: '/token',
        method: 'post',
        group: 'Endpoints',
        params: [
            { name: 'len', required: false, default: '24', placeholder: '24' },
            {
                name: 'type',
                required: false,
                options: ['alpha', 'alphanum', 'base64', 'hex', 'num', 'punct', 'urlsafe', 'uuid'],
            },
        ],
    },
    {
        name: 'URL',
        path: '/url',
        method: 'get',
        group: 'Endpoints',
        params: [{ name: 'url', required: true, placeholder: 'https://example.com/path?a=1' }],
    },
    {
        name: 'Username',
        path: '/username',
        method: 'get',
        group: 'Endpoints',
        params: [],
    },
    {
        name: 'UUID',
        path: '/uuid',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'uuid', required: false, placeholder: '41a43360-9874-4c7a-9ca8-eec29e765a0e' },
            { name: 'count', required: false, placeholder: '1-50' },
        ],
    },
    {
        name: 'Validate',
        path: '/validate',
        method: 'get',
        group: 'Endpoints',
        params: [
            { name: 'type', required: true, options: ['luhn', 'iban', 'email'] },
            { name: 'value', required: true, placeholder: 'test@example.com' },
        ],
    },
];

/**
 * Finds an endpoint definition by its display name.
 *
 * @param name - The display name of the endpoint (e.g. `'Hash'`)
 * @returns The matching `EndpointDef`, or `undefined` if not found
 */
/**
 * Applies a version's overrides to an endpoint.
 *
 * @param endpoint - The base endpoint definition
 * @param version - The documentation version (e.g. `v6`)
 * @returns The endpoint as that version serves it, or `null` when it no longer lists it
 */
export function resolveEndpoint(endpoint: EndpointDef, version: string): EndpointDef | null {
    const override = endpoint.overrides?.[version];
    if (!override) return endpoint;
    if (override.removed) return null;
    return { ...endpoint, method: override.method ?? endpoint.method, path: override.path ?? endpoint.path };
}

export function findEndpoint(name: string, version?: string): EndpointDef | undefined {
    const endpoint = endpoints.find((ep) => ep.name === name);
    if (!endpoint) return undefined;
    return (version ? resolveEndpoint(endpoint, version) : endpoint) ?? undefined;
}
