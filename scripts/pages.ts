import { argv } from "node:process";

/**
 * Stands in for the page registry and navigation generator, which does not exist yet, so that
 * the gen and check scripts already run.
 *
 * @param args - Command-line flags, only echoed
 */
function main(args: string[]): void {
    const flags = args.length ? args.join(" ") : "no flags";
    console.log(
        `scripts/pages.ts: stub of the page registry and navigation generator (stage 4b), nothing done (${flags})`,
    );
}

main(argv.slice(2));
