import { type Speaker, type CreateSpeakerDTO } from '@/features/speakers/types';

export interface SpeakerRepository {
    getSpeakers(): Promise<Speaker[]>;
    getSpeaker(id: string): Promise<Speaker | undefined>;
    createSpeaker(data: CreateSpeakerDTO): Promise<Speaker>;
    updateSpeaker(id: string, data: Partial<Speaker>): Promise<Speaker>;
}
