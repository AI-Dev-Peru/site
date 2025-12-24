import { getSupabase } from '../../supabase';
import { type SpeakerRepository } from '../../repositories/SpeakerRepository';
import { type Speaker, type CreateSpeakerDTO } from '@/features/speakers/types';

export class SupabaseSpeakerRepository implements SpeakerRepository {
    async getSpeakers(): Promise<Speaker[]> {
        const { data, error } = await getSupabase()
            .from('speakers')
            .select('*')
            .order('name');

        if (error) throw error;
        return (data || []).map(this.mapSpeaker);
    }

    async getSpeaker(id: string): Promise<Speaker | undefined> {
        const { data, error } = await getSupabase()
            .from('speakers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return this.mapSpeaker(data);
    }

    async createSpeaker(data: CreateSpeakerDTO): Promise<Speaker> {
        const { data: speaker, error } = await getSupabase()
            .from('speakers')
            .insert(this.mapToDb(data))
            .select()
            .single();

        if (error) throw error;
        return this.mapSpeaker(speaker);
    }

    async updateSpeaker(id: string, data: Partial<Speaker>): Promise<Speaker> {
        const { error } = await getSupabase()
            .from('speakers')
            .update(this.mapToDb(data))
            .eq('id', id);

        if (error) throw error;
        const updated = await this.getSpeaker(id);
        if (!updated) throw new Error('Speaker not found after update');
        return updated;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapSpeaker(dbSpeaker: any): Speaker {
        return {
            id: dbSpeaker.id,
            name: dbSpeaker.name,
            role: dbSpeaker.role,
            company: dbSpeaker.company,
            bio: dbSpeaker.bio,
            avatarUrl: dbSpeaker.avatar_url,
            email: dbSpeaker.email,
            phone: dbSpeaker.phone,
            twitter: dbSpeaker.twitter,
            linkedin: dbSpeaker.linkedin
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDb(data: Partial<Speaker> | CreateSpeakerDTO): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbData: any = { ...data };
        if ('avatarUrl' in data) {
            dbData.avatar_url = data.avatarUrl;
            delete dbData.avatarUrl;
        }
        return dbData;
    }
}
