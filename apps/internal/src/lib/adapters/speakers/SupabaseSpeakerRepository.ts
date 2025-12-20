import { SpeakerRepository } from '../../repositories/SpeakerRepository';
import { Speaker, CreateSpeakerDTO } from '../../../features/speakers/types';

export class SupabaseSpeakerRepository implements SpeakerRepository {
    async getSpeakers(): Promise<Speaker[]> {
        throw new Error('Method not implemented.');
    }

    async getSpeaker(_id: string): Promise<Speaker | undefined> {
        throw new Error('Method not implemented.');
    }

    async createSpeaker(_data: CreateSpeakerDTO): Promise<Speaker> {
        throw new Error('Method not implemented.');
    }

    async updateSpeaker(_id: string, _data: Partial<Speaker>): Promise<Speaker> {
        throw new Error('Method not implemented.');
    }
}
