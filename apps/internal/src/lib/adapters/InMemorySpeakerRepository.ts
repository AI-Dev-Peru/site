import { SpeakerRepository } from '../repositories/SpeakerRepository';
import { Speaker, CreateSpeakerDTO } from '../../features/speakers/types';

const INITIAL_SPEAKERS: Speaker[] = [
    {
        id: '1',
        name: 'Diego Velazquez',
        role: 'Senior AI Engineer',
        company: 'Google',
        bio: 'Building AI tools and agents for production systems.',
        email: 'diego@google.com',
        phone: '+51 999 999 999',
        twitter: '@diegov_ai',
    },
    {
        id: '2',
        name: 'Maria Rodriguez',
        role: 'CTO',
        company: 'TechPeru',
        bio: 'Leading tech innovation in Peru.',
        email: 'maria@techperu.pe',
        twitter: '@mariatech',
    },
    {
        id: '3',
        name: 'Carlos Vance',
        role: 'DevRel',
        company: 'Vercel',
        bio: 'Developer advocate and community builder.',
        email: 'carlos@vercel.com',
        phone: '+51 988 888 888',
        twitter: '@carlosv',
    },
];

export class InMemorySpeakerRepository implements SpeakerRepository {
    private speakers: Speaker[] = [...INITIAL_SPEAKERS];

    async getSpeakers(): Promise<Speaker[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [...this.speakers];
    }

    async getSpeaker(id: string): Promise<Speaker | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return this.speakers.find((s) => s.id === id);
    }

    async createSpeaker(data: CreateSpeakerDTO): Promise<Speaker> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newSpeaker: Speaker = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
        };
        this.speakers = [newSpeaker, ...this.speakers];
        return newSpeaker;
    }

    async updateSpeaker(id: string, data: Partial<Speaker>): Promise<Speaker> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.speakers = this.speakers.map((s) => (s.id === id ? { ...s, ...data } : s));
        return this.speakers.find((s) => s.id === id)!;
    }
}
