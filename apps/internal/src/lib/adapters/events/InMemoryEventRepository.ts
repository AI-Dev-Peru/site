import { EventRepository } from '../../repositories/EventRepository';
import { Event, CreateEventDTO } from '../../../features/events/types';

const INITIAL_EVENTS: Event[] = [
    {
        id: '1',
        title: 'AI Dev Peru Meetup #1',
        date: '2024-02-15',
        time: '19:00',
        location: 'WeWork Real 2',
        description: 'First meetup of the year! Join us for talks on LLMs and Agents.',
        format: 'in-person',
        status: 'done',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2670',
        registrationUrl: 'https://lu.ma/event123',
        streamingUrl: 'https://youtube.com/video',
        slidesUrl: 'https://slides.com/deck',
        assetsUrl: 'https://drive.google.com/folder',
        locationUrl: 'https://maps.google.com/?q=lima',
        communityUrl: 'https://chat.whatsapp.com/inv',
        attendeeCount: 45,
    },
    {
        id: '2',
        title: 'AI Dev Peru Meetup #2',
        date: '2024-03-20',
        time: '19:00',
        location: 'Remote',
        description: 'Deep dive into RAG pipelines.',
        format: 'remote',
        status: 'draft',
        registrationUrl: 'https://lu.ma/event2',
    },
    {
        id: '3',
        title: 'AI Dev Peru Meetup #3',
        date: '2024-04-18',
        time: '19:00',
        location: 'TBD',
        description: 'Workshops and networking.',
        format: 'in-person',
        status: 'draft',
    },
];

export class InMemoryEventRepository implements EventRepository {
    private events: Event[] = [...INITIAL_EVENTS];

    async getEvents(): Promise<Event[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [...this.events];
    }

    async getEvent(id: string): Promise<Event | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return this.events.find((e) => e.id === id);
    }

    async createEvent(data: CreateEventDTO): Promise<Event> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newEvent: Event = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            location: '',
            description: '',
            status: 'draft',
        };
        this.events = [newEvent, ...this.events];
        return newEvent;
    }

    async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.events = this.events.map((e) => (e.id === id ? { ...e, ...data } : e));
        return this.events.find((e) => e.id === id)!;
    }

    async deleteEvent(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.events = this.events.filter((e) => e.id !== id);
    }
}
