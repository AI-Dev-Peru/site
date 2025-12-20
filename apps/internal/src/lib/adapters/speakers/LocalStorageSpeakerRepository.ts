import { SpeakerRepository } from '../../repositories/SpeakerRepository';
import { Speaker, CreateSpeakerDTO } from '../../../features/speakers/types';

const STORAGE_KEY = 'speakers_data';

export class LocalStorageSpeakerRepository implements SpeakerRepository {
    private getSpeakersFromStorage(): Speaker[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveSpeakersToStorage(speakers: Speaker[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(speakers));
    }

    async getSpeakers(): Promise<Speaker[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return this.getSpeakersFromStorage();
    }

    async getSpeaker(id: string): Promise<Speaker | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const speakers = this.getSpeakersFromStorage();
        return speakers.find((s) => s.id === id);
    }

    async createSpeaker(data: CreateSpeakerDTO): Promise<Speaker> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const speakers = this.getSpeakersFromStorage();
        const newSpeaker: Speaker = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
        };
        this.saveSpeakersToStorage([newSpeaker, ...speakers]);
        return newSpeaker;
    }

    async updateSpeaker(id: string, data: Partial<Speaker>): Promise<Speaker> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        let speakers = this.getSpeakersFromStorage();
        speakers = speakers.map((s) => (s.id === id ? { ...s, ...data } : s));
        this.saveSpeakersToStorage(speakers);
        return speakers.find((s) => s.id === id)!;
    }
}
