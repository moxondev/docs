import { argv } from "node:process";

/**
 * Stands in for the search index and Markdown export writer, which does not exist yet, so that
 * the gen script already runs.
 *
 * @param args - Command-line flags, only echoed
 */
function main(args: string[]): void {
    const flags = args.length ? args.join(" ") : "no flags";
    console.log(
        `scripts/public.ts: stub of the search index and Markdown export writer (stage 4b), nothing done (${flags})`,
    );
}

main(argv.slice(2));
