import { EventRepository } from '../repositories/EventRepository';
import { Event, CreateEventDTO } from '../../features/events/types';

export class SupabaseEventRepository implements EventRepository {
    async getEvents(): Promise<Event[]> {
        throw new Error('Method not implemented.');
    }

    async getEvent(_id: string): Promise<Event | undefined> {
        throw new Error('Method not implemented.');
    }

    async createEvent(_data: CreateEventDTO): Promise<Event> {
        throw new Error('Method not implemented.');
    }

    async updateEvent(_id: string, _data: Partial<Event>): Promise<Event> {
        throw new Error('Method not implemented.');
    }

    async deleteEvent(_id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
