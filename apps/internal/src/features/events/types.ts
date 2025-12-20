export type EventFormat = 'in-person' | 'remote' | 'hybrid';
export type EventStatus = 'draft' | 'done';

export interface EventLink {
    type: string;
    url: string;
}

export interface Event {
    id: string;
    title: string;
    date: string; // ISO string
    time: string; // HH:mm
    location: string;
    description: string;
    format: EventFormat;
    status: EventStatus;
    imageUrl?: string;
    attendeeCount?: number;

    links: EventLink[];
    agenda: AgendaItem[];
}

export interface AgendaItem {
    id: string;
    title: string;
    speakerId?: string;
    speakerName?: string;
    slidesUrl?: string;
}

export interface CreateEventDTO {
    title: string;
    date: string;
    time: string;
    format: EventFormat;
}
