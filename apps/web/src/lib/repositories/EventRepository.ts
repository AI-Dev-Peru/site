import { type Event, type CreateEventDTO } from '@/features/events/types';

export interface EventRepository {
    getEvents(): Promise<Event[]>;
    getPublishedEvents(): Promise<Event[]>;
    getEvent(id: string): Promise<Event | undefined>;
    createEvent(data: CreateEventDTO): Promise<Event>;
    updateEvent(id: string, data: Partial<Event>): Promise<Event>;
    deleteEvent(id: string): Promise<void>;
}
