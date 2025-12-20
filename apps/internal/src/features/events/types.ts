export type EventFormat = 'in-person' | 'remote' | 'hybrid';
export type EventStatus = 'draft' | 'done';

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

    // Links
    registrationUrl?: string;
    streamingUrl?: string;
    slidesUrl?: string;
    assetsUrl?: string;
    locationUrl?: string;
    communityUrl?: string;

    // Stats
    attendeeCount?: number;

    // Agenda
    agenda?: AgendaItem[];
}

export interface AgendaItem {
    id: string;
    title: string;
    speakerId?: string;
    speakerName?: string; // For display if no ID or quick add

    slidesUrl?: string;
}

export interface CreateEventDTO {
    title: string;
    date: string;
    time: string;
    format: EventFormat;
}
