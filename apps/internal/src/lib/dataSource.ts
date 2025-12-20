import { SpeakerRepository } from './repositories/SpeakerRepository';
import { EventRepository } from './repositories/EventRepository';
import { AuthRepository } from './repositories/AuthRepository';
import { InMemorySpeakerRepository } from './adapters/speakers/InMemorySpeakerRepository';
import { InMemoryEventRepository } from './adapters/events/InMemoryEventRepository';
import { LocalStorageSpeakerRepository } from './adapters/speakers/LocalStorageSpeakerRepository';
import { LocalStorageEventRepository } from './adapters/events/LocalStorageEventRepository';
import { SupabaseSpeakerRepository } from './adapters/speakers/SupabaseSpeakerRepository';
import { SupabaseEventRepository } from './adapters/events/SupabaseEventRepository';
import { LocalStorageAuthRepository } from './adapters/auth/LocalStorageAuthRepository';
import { SupabaseAuthRepository } from './adapters/auth/SupabaseAuthRepository';

export type DataSourceType = 'in-memory' | 'local-storage' | 'supabase';

// Configuration - this could come from env vars
const DATA_SOURCE: DataSourceType = (import.meta.env.VITE_DATA_SOURCE as DataSourceType) || 'local-storage';

class DataSourceFactory {
    private static speakerRepository: SpeakerRepository;
    private static eventRepository: EventRepository;
    private static authRepository: AuthRepository;

    static getSpeakerRepository(): SpeakerRepository {
        if (!this.speakerRepository) {
            this.speakerRepository = this.createSpeakerRepository();
        }
        return this.speakerRepository;
    }

    static getEventRepository(): EventRepository {
        if (!this.eventRepository) {
            this.eventRepository = this.createEventRepository();
        }
        return this.eventRepository;
    }

    static getAuthRepository(): AuthRepository {
        if (!this.authRepository) {
            this.authRepository = this.createAuthRepository();
        }
        return this.authRepository;
    }

    private static createSpeakerRepository(): SpeakerRepository {
        switch (DATA_SOURCE) {
            case 'local-storage':
                return new LocalStorageSpeakerRepository();
            case 'supabase':
                return new SupabaseSpeakerRepository();
            case 'in-memory':
            default:
                return new InMemorySpeakerRepository();
        }
    }

    private static createEventRepository(): EventRepository {
        switch (DATA_SOURCE) {
            case 'local-storage':
                return new LocalStorageEventRepository();
            case 'supabase':
                return new SupabaseEventRepository();
            case 'in-memory':
            default:
                return new InMemoryEventRepository();
        }
    }

    private static createAuthRepository(): AuthRepository {
        switch (DATA_SOURCE) {
            case 'supabase':
                return new SupabaseAuthRepository();
            // Default to local storage auth for local dev
            default:
                return new LocalStorageAuthRepository();
        }
    }
}

export const speakersRepository = DataSourceFactory.getSpeakerRepository();
export const eventsRepository = DataSourceFactory.getEventRepository();
export const authRepository = DataSourceFactory.getAuthRepository();
