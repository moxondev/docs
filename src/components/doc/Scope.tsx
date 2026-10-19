import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { clientMessages, type ClientTree } from "@/i18n/routing";
import type { Lang } from "@/types/content";

export interface ScopeProps {
    lang: Lang;
    tree: ClientTree;
    children: ReactNode;
}

/**
 * Hands the messages of a client tree to the components inside it: the Try panel, the code
 * samples and the Playground read their own namespaces on top of the page ones, and a nested
 * provider replaces the messages of its parent, so the tree lists all of them.
 *
 * @param lang - Language of the route tree, which picks the messages
 * @param tree - Client tree this provider opens, whose list in CLIENT_NAMESPACES picks the
 *   messages shipped
 * @param children - The page content that mounts those client components
 */
export async function Scope({ lang, tree, children }: ScopeProps) {
    const messages = await getMessages({ locale: lang });

    return (
        <NextIntlClientProvider locale={lang} messages={clientMessages(messages, tree)}>
            {children}
        </NextIntlClientProvider>
    );
}
