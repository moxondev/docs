import { SITE } from "@/data/site";
import type { Version } from "@/types/content";

export type VersionStatus = "latest" | "previous" | "legacy" | "retired";

export interface VersionDef {
    id: Version;
    status: VersionStatus;
    release?: string;
    served: boolean;
    playground: boolean;
    changelog: boolean;
}

/**
 * Every documented major, newest first (the order of the version picker); since 6.0.0 the API no
 * longer serves v1 to v3, whose documentation is kept for reference.
 */
export const VERSIONS: VersionDef[] = [
    {
        id: "v6",
        status: "latest",
        release: SITE.version,
        served: true,
        playground: true,
        changelog: true,
    },
    {
        id: "v5",
        status: "previous",
        release: "5.9.0",
        served: true,
        playground: true,
        changelog: true,
    },
    {
        id: "v4",
        status: "legacy",
        release: "4.9.0",
        served: true,
        playground: true,
        changelog: true,
    },
    { id: "v3", status: "retired", served: false, playground: false, changelog: false },
    { id: "v2", status: "retired", served: false, playground: false, changelog: false },
    { id: "v1", status: "retired", served: false, playground: false, changelog: false },
];

// The latest major (VERSIONS is newest first), used by the home, the 404 page and the redirects
export const LATEST: Version = VERSIONS[0].id;
