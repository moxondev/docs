import { ChevronDownIcon, GlobeIcon } from "lucide-react";

export interface LanguageFaceProps {
    code: string;
}

/**
 * Draws the globe, the code of the current language and a chevron. Shared by the plain trigger and
 * the dropdown trigger, so the lazy swap moves nothing; the button is named by the aria-label of
 * the trigger, not by this content.
 *
 * @param code - Short code of the current language, as printed in the button
 */
export function LanguageFace({ code }: LanguageFaceProps) {
    return (
        <>
            <GlobeIcon aria-hidden="true" className="size-4" />
            <span className="translate-y-px">{code}</span>
            <ChevronDownIcon aria-hidden="true" className="-ml-0.5 size-3.5" />
        </>
    );
}
