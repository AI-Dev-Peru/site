import { type Speaker, type CreateSpeakerDTO } from './types';
import { speakersRepository } from '../../lib/dataSource';

export const speakersApi = {
    getSpeakers: async (): Promise<Speaker[]> => {
        return speakersRepository.getSpeakers();
    },

    getSpeaker: async (id: string): Promise<Speaker | undefined> => {
        return speakersRepository.getSpeaker(id);
    },

    createSpeaker: async (data: CreateSpeakerDTO): Promise<Speaker> => {
        return speakersRepository.createSpeaker(data);
    },

    updateSpeaker: async (id: string, data: Partial<Speaker>): Promise<Speaker> => {
        return speakersRepository.updateSpeaker(id, data);
    },
};
