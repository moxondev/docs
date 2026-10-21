import { useTranslations } from "next-intl";

import { statusLabel } from "@/components/try/util";
import type { RequestPhase } from "@/hooks/useRequest";
import type { ApiResponse } from "@/lib/request";

export interface AnnouncerProps {
    phase: RequestPhase;
    response: ApiResponse | null;
}

/**
 * Screen reader voice of the Try form: a live region that is in the page before the request is
 * sent and empty until then, so each change is announced. A region that appears already holding
 * its text is usually not read, so the visible status bar is hidden from assistive technology.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 */
export function Announcer({ phase, response }: AnnouncerProps) {
    const t = useTranslations("response");
    const tryT = useTranslations("try");
    const idle = phase === "idle" && response === null;

    return (
        <span role="status" className="sr-only">
            {idle
                ? ""
                : statusLabel(phase, response, {
                      sending: tryT("sending"),
                      error: t("statusError"),
                  })}
        </span>
    );
}
