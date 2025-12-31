import { InMemoryEventRepository } from '@/lib/adapters/events/InMemoryEventRepository';
import { type Event, type CreateEventDTO } from '@/features/events/types';

export class FakeEventRepository extends InMemoryEventRepository {
    givenEvents(events: Event[]) {
        this.events = events;
    }

    override async getEvents(): Promise<Event[]> {
        return [...this.events];
    }

    override async createEvent(data: CreateEventDTO): Promise<Event> {
        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            time: data.time || '',
            location: '',
            description: '',
            status: 'draft',
            links: [],
            agenda: [],
        };
        this.events = [newEvent, ...this.events];
        return newEvent;
    }

    override async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
        this.events = this.events.map((e) => (e.id === id ? { ...e, ...data } : e));
        return this.events.find((e) => e.id === id)!;
    }
}
