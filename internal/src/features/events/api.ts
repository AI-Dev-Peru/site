import { type Event, type CreateEventDTO } from './types';
import { eventsRepository } from '../../lib/dataSource';

export const eventsApi = {
    getEvents: async (): Promise<Event[]> => {
        return eventsRepository.getEvents();
    },

    getEvent: async (id: string): Promise<Event | undefined> => {
        return eventsRepository.getEvent(id);
    },

    createEvent: async (data: CreateEventDTO): Promise<Event> => {
        return eventsRepository.createEvent(data);
    },

    updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
        return eventsRepository.updateEvent(id, data);
    },

    deleteEvent: async (id: string): Promise<void> => {
        return eventsRepository.deleteEvent(id);
    },
};
