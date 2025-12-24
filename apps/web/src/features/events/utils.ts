import { type EventLink } from "./types";

export function getEventLink(links: EventLink[] | undefined, type: string): string {
    return links?.find(l => l.type === type)?.url || '';
}
