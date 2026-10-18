import { argv } from "node:process";

/**
 * Stands in for the route coverage and link checker until the real checker replaces it.
 *
 * @param args - Command-line flags, only echoed
 */
function main(args: string[]): void {
    const flags = args.length ? args.join(" ") : "no flags";
    console.log(
        `scripts/links.ts: stub of the route coverage and link checker (stage 4b), nothing done (${flags})`,
    );
}

main(argv.slice(2));
