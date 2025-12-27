import { InMemorySpeakerRepository } from '@/lib/adapters/speakers/InMemorySpeakerRepository';
import { type Speaker, type CreateSpeakerDTO } from '@/features/speakers/types';

export class FakeSpeakerRepository extends InMemorySpeakerRepository {
    givenSpeakers(speakers: Speaker[]) {
        this.speakers = speakers;
    }

    override async getSpeakers(): Promise<Speaker[]> {
        return [...this.speakers];
    }

    override async createSpeaker(data: CreateSpeakerDTO): Promise<Speaker> {
        const newSpeaker: Speaker = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
        };
        this.speakers = [newSpeaker, ...this.speakers];
        return newSpeaker;
    }
}
