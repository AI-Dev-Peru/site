import { type EventRepository } from '../../repositories/EventRepository';
import { type Event, type CreateEventDTO } from '@/features/events/types';

const STORAGE_KEY = 'events_data';

export class LocalStorageEventRepository implements EventRepository {
    private getEventsFromStorage(): Event[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveEventsToStorage(events: Event[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    async getEvents(): Promise<Event[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return this.getEventsFromStorage();
    }

    async getEvent(id: string): Promise<Event | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const events = this.getEventsFromStorage();
        return events.find((e) => e.id === id);
    }

    async createEvent(data: CreateEventDTO): Promise<Event> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const events = this.getEventsFromStorage();
        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            location: '',
            description: '',
            status: 'draft',
            links: [],
            agenda: []
        };
        this.saveEventsToStorage([newEvent, ...events]);
        return newEvent;
    }

    async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        let events = this.getEventsFromStorage();
        events = events.map((e) => (e.id === id ? { ...e, ...data } : e));
        this.saveEventsToStorage(events);
        return events.find((e) => e.id === id)!;
    }

    async deleteEvent(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        let events = this.getEventsFromStorage();
        events = events.filter((e) => e.id !== id);
        this.saveEventsToStorage(events);
    }
}
