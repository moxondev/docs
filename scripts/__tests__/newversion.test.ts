import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, test } from "node:test";

import {
    identicalKeys,
    main,
    manualSteps,
    planCopy,
    rewriteLinks,
    versionNumber,
    writeCopy,
} from "../newversion";
import { listModules, PAGES_DIR } from "../pages";

/**
 * Builds a throwaway repository root holding page modules and, optionally, the shared prose list.
 *
 * @param files - File contents by path relative to the root
 * @returns The absolute root folder, left in place after the run like the other tests do
 */
function makeRoot(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), "newversion-"));
    for (const [path, text] of Object.entries(files)) {
        mkdirSync(dirname(join(root, path)), { recursive: true });
        writeFileSync(join(root, path), text);
    }
    return root;
}

/**
 * Runs the command with its output captured, so a test can read what it printed.
 *
 * @param args - Command line arguments after the script name
 * @returns The exit status and the lines written to stdout and stderr
 */
async function run(args: string[]): Promise<{ status: number; out: string; err: string }> {
    const out: string[] = [];
    const err: string[] = [];
    const log = console.log;
    const error = console.error;
    console.log = (...parts: unknown[]) => void out.push(parts.join(" "));
    console.error = (...parts: unknown[]) => void err.push(parts.join(" "));
    try {
        const status = await main(args);
        return { status, out: out.join("\n"), err: err.join("\n") };
    } finally {
        console.log = log;
        console.error = error;
    }
}

const HASH = [
    'import type { Page } from "@/types/content";',
    "",
    "export const page: Page = {",
    '    version: "v6",',
    '    id: "hash",',
    "    sections: [",
    '        { text: "See [the guide](/v6/authentication) and [pow](ref:v6/pow) or ref:pow." },',
    '        { text: "curl https://api.moxon.dev/v6/hash and /fr/v6/hash/ in v6, not /v66 or /v6x." },',
    "    ],",
    "};",
    "",
].join("\n");

const TREE = {
    "src/data/pages/v6/hash.ts": HASH,
    "src/data/pages/v6/index.ts": 'export const page = { version: "v6", id: "index" };\n',
    "src/data/pages/v6/chat/clear.ts": 'export const page = { version: "v6", id: "chat/clear" };\n',
    "src/data/pages/v6/notes.md": "kept where it is\n",
    "scripts/identical.json": JSON.stringify({
        "v5/hash": ["Free"],
        "v6/chat/clear": ["Note"],
        "v6/hash": ["Kelvin", "Type"],
    }),
};

describe("version ids", () => {
    test("a v followed by a positive number", () => {
        assert.equal(versionNumber("v7"), 7);
        assert.equal(versionNumber("v10"), 10);
    });

    test("anything else is refused", () => {
        for (const value of ["7", "v", "v0", "v07", "v7.1", "V7", "v7 ", "latest"]) {
            assert.equal(versionNumber(value), null, value);
        }
    });
});

describe("link rewrite", () => {
    test("rewrites the path, ref and version field spellings and counts them", () => {
        const result = rewriteLinks(HASH, "v6", "v7");
        assert.equal(result.replacements, 5);
        assert.match(result.text, /version: "v7"/);
        assert.match(result.text, /\(\/v7\/authentication\)/);
        assert.match(result.text, /\(ref:v7\/pow\)/);
        assert.match(result.text, /https:\/\/api\.moxon\.dev\/v7\/hash and \/fr\/v7\/hash\//);
    });

    test("leaves prose, other versions and look-alikes alone", () => {
        const result = rewriteLinks(HASH, "v6", "v7");
        assert.match(result.text, / in v6, not \/v66 or \/v6x\./);
        assert.match(result.text, /or ref:pow\./);
        assert.equal(rewriteLinks("see /v5/hash and ref:v5/hash", "v6", "v7").replacements, 0);
    });

    test("a text without any of them comes back unchanged", () => {
        const result = rewriteLinks("plain", "v6", "v7");
        assert.deepEqual(result, { text: "plain", replacements: 0 });
    });

    test("is reversible on what it rewrote", () => {
        const there = rewriteLinks(HASH, "v6", "v7").text;
        assert.equal(rewriteLinks(there, "v7", "v6").text, HASH);
    });
});

describe("shared prose entries", () => {
    test("carries the entries of the source under the new key, skipping existing ones", () => {
        const identical = { "v6/a": ["x"], "v6/b": ["y"], "v7/b": ["y"], "v5/c": ["z"] };
        assert.deepEqual(identicalKeys(identical, "v6", "v7"), ["v7/a"]);
    });

    test("a version whose name starts the same is not confused", () => {
        assert.deepEqual(identicalKeys({ "v60/a": ["x"] }, "v6", "v7"), []);
    });
});

describe("plan", () => {
    test("reads the modules, rewrites them and leaves the other files out", () => {
        const { plan, problems } = planCopy(makeRoot(TREE), "v6", "v7");
        assert.deepEqual(problems, []);
        assert.deepEqual(
            plan?.files.map((file) => file.path),
            ["chat/clear.ts", "hash.ts", "index.ts"],
        );
        assert.deepEqual(plan?.skipped, ["notes.md"]);
        assert.deepEqual(plan?.identical, ["v7/chat/clear", "v7/hash"]);
        assert.match(plan?.files[0].text ?? "", /version: "v7"/);
    });

    test("refuses a destination that exists, and writes nothing", () => {
        const root = makeRoot({ ...TREE, "src/data/pages/v7/hash.ts": "keep" });
        const { plan, problems } = planCopy(root, "v6", "v7");
        assert.equal(plan, null);
        assert.deepEqual(problems, [`${PAGES_DIR}/v7 already exists and is never overwritten`]);
        assert.equal(readFileSync(join(root, "src/data/pages/v7/hash.ts"), "utf8"), "keep");
    });

    test("refuses a missing source, a copy onto itself and a bad id", () => {
        const root = makeRoot(TREE);
        assert.match(planCopy(root, "v4", "v7").problems[0], /v4 does not exist/);
        assert.match(planCopy(root, "v6", "v6").problems[0], /must differ/);
        assert.match(planCopy(root, "six", "v7").problems[0], /not a version id/);
        assert.match(planCopy(root, "v6", "7").problems[0], /not a version id/);
    });
});

describe("writing", () => {
    test("creates the folder and the files, keeps the sub-folders, adds the entries sorted", async () => {
        const root = makeRoot(TREE);
        const { plan } = planCopy(root, "v6", "v7");
        assert.equal(plan && (await writeCopy(root, plan)), 3);
        const hash = readFileSync(join(root, "src/data/pages/v7/hash.ts"), "utf8");
        assert.equal(hash, rewriteLinks(HASH, "v6", "v7").text);
        assert.ok(existsSync(join(root, "src/data/pages/v7/chat/clear.ts")));
        assert.ok(!existsSync(join(root, "src/data/pages/v7/notes.md")));
        assert.deepEqual(JSON.parse(readFileSync(join(root, "scripts/identical.json"), "utf8")), {
            "v5/hash": ["Free"],
            "v6/chat/clear": ["Note"],
            "v6/hash": ["Kelvin", "Type"],
            "v7/chat/clear": ["Note"],
            "v7/hash": ["Kelvin", "Type"],
        });
    });

    test("a file that appears between the plan and the write is an error, not an overwrite", async () => {
        const root = makeRoot(TREE);
        const { plan } = planCopy(root, "v6", "v7");
        mkdirSync(join(root, "src/data/pages/v7"), { recursive: true });
        writeFileSync(join(root, "src/data/pages/v7/chat.ts"), "mine");
        mkdirSync(join(root, "src/data/pages/v7/chat"), { recursive: true });
        writeFileSync(join(root, "src/data/pages/v7/chat/clear.ts"), "mine");
        await assert.rejects(async () => plan && writeCopy(root, plan), /EEXIST/);
        assert.equal(readFileSync(join(root, "src/data/pages/v7/chat/clear.ts"), "utf8"), "mine");
    });
});

describe("command", () => {
    test("a dry run prints the plan and the steps and writes nothing", async () => {
        const root = makeRoot(TREE);
        const result = await run(["v7", "v6", "--dry-run", "--root", root]);
        assert.equal(result.status, 0);
        assert.match(result.out, /v6 -> v7: 3 modules, 7 links rewritten, 2 shared prose/);
        assert.match(result.out, /would write src\/data\/pages\/v7\/hash\.ts/);
        assert.match(result.out, /dry run, nothing written/);
        assert.match(result.out, /1\. src\/types\/content\.ts/);
        assert.ok(!existsSync(join(root, "src/data/pages/v7")));
        assert.ok(!readFileSync(join(root, "scripts/identical.json"), "utf8").includes("v7/"));
    });

    test("the source defaults to the version before the new one", async () => {
        const root = makeRoot(TREE);
        const result = await run(["v7", "--root", root]);
        assert.equal(result.status, 0);
        assert.match(result.out, /v6 -> v7: 3 modules/);
        assert.match(result.out, /3 files written under src\/data\/pages\/v7/);
        assert.ok(existsSync(join(root, "src/data/pages/v7/index.ts")));
    });

    test("a second run on the same version is refused and changes nothing", async () => {
        const root = makeRoot(TREE);
        assert.equal((await run(["v7", "v6", "--root", root])).status, 0);
        const before = readFileSync(join(root, "src/data/pages/v7/hash.ts"), "utf8");
        const again = await run(["v7", "v6", "--root", root]);
        assert.equal(again.status, 1);
        assert.match(again.err, /v7 already exists and is never overwritten/);
        assert.equal(readFileSync(join(root, "src/data/pages/v7/hash.ts"), "utf8"), before);
    });

    test("a --root without a folder is refused, even before --dry-run, and writes nothing", async () => {
        const root = makeRoot(TREE);
        const previous = process.cwd();
        process.chdir(root);
        try {
            const bare = await run(["v7", "v6", "--root"]);
            const flag = await run(["v7", "v6", "--root", "--dry-run"]);
            assert.equal(bare.status, 1);
            assert.equal(flag.status, 1);
            assert.match(flag.err, /--root needs a folder/);
        } finally {
            process.chdir(previous);
        }
        assert.ok(!existsSync(join(root, "src/data/pages/v7")));
    });

    test("refuses unknown flags and a wrong number of arguments", async () => {
        const root = makeRoot(TREE);
        assert.equal((await run(["v7", "--force", "--root", root])).status, 1);
        assert.equal((await run(["--root", root])).status, 1);
        assert.equal((await run(["v7", "v6", "v5", "--root", root])).status, 1);
        assert.ok(!existsSync(join(root, "src/data/pages/v7")));
    });
});

describe("manual steps", () => {
    test("name the version and the release of the new major", () => {
        const steps = manualSteps("v6", "v7").join("\n");
        assert.match(steps, /add "v7" to the Version type/);
        assert.match(steps, /release 7\.0\.0/);
        assert.match(steps, /LATEST_COUNTS/);
    });
});

describe("on the real v6 folder", () => {
    test("every module of v6 is planned, none is written", () => {
        const { plan, problems } = planCopy(process.cwd(), "v6", "v99");
        assert.deepEqual(problems, []);
        assert.deepEqual(
            plan?.files.map((file) => file.path).sort(),
            listModules(join(process.cwd(), PAGES_DIR, "v6")).sort(),
        );
        assert.ok(plan?.files.every((file) => file.text.includes('version: "v99"')));
        assert.ok(plan?.files.every((file) => !/version: "v6"/.test(file.text)));
        assert.ok(!existsSync(join(process.cwd(), PAGES_DIR, "v99")));
    });
});
