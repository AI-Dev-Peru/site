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
        // Use parent implementation which handles avatar conversion
        return super.createSpeaker(data);
    }
}
