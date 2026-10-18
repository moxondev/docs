import { argv } from "node:process";

/**
 * Stands in for the legacy redirect writer, which is not written yet, so that the postbuild
 * script already runs.
 *
 * @param args - Command-line flags, only echoed
 */
function main(args: string[]): void {
    const flags = args.length ? args.join(" ") : "no flags";
    console.log(
        `scripts/redirects.ts: stub of the legacy redirect writer (stage 4b), nothing done (${flags})`,
    );
}

main(argv.slice(2));
