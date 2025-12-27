import { type SpeakerRepository } from './repositories/SpeakerRepository';
import { type EventRepository } from './repositories/EventRepository';
import { type AuthRepository } from './repositories/AuthRepository';
import { InMemorySpeakerRepository } from './adapters/speakers/InMemorySpeakerRepository';
import { InMemoryEventRepository } from './adapters/events/InMemoryEventRepository';
import { InMemoryAuthRepository } from './adapters/auth/InMemoryAuthRepository';

import { LocalStorageSpeakerRepository } from './adapters/speakers/LocalStorageSpeakerRepository';
import { LocalStorageEventRepository } from './adapters/events/LocalStorageEventRepository';
import { LocalStorageAuthRepository } from './adapters/auth/LocalStorageAuthRepository';
import { SupabaseSpeakerRepository } from './adapters/speakers/SupabaseSpeakerRepository';
import { SupabaseEventRepository } from './adapters/events/SupabaseEventRepository';
import { SupabaseAuthRepository } from './adapters/auth/SupabaseAuthRepository';
import { type ProposalRepository } from './repositories/ProposalRepository';
import { InMemoryProposalRepository } from './adapters/proposals/InMemoryProposalRepository';
import { LocalStorageProposalRepository } from './adapters/proposals/LocalStorageProposalRepository';
import { SupabaseProposalRepository } from './adapters/proposals/SupabaseProposalRepository';

import { FakeSpeakerRepository } from '../test/doubles/FakeSpeakerRepository';
import { FakeEventRepository } from '../test/doubles/FakeEventRepository';
import { FakeAuthRepository } from '../test/doubles/FakeAuthRepository';
import { FakeProposalRepository } from '../test/doubles/FakeProposalRepository';

// ...


export type DataSourceType = 'in-memory' | 'local-storage' | 'supabase';

// Configuration - this could come from env vars
const DATA_SOURCE: DataSourceType = (import.meta.env.VITE_DATA_SOURCE as DataSourceType) || 'in-memory';

class DataSourceFactory {
    protected static speakerRepository: SpeakerRepository;
    protected static eventRepository: EventRepository;
    private static authRepository: AuthRepository;
    protected static proposalRepository: ProposalRepository;

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

    static getProposalRepository(): ProposalRepository {
        if (!this.proposalRepository) {
            this.proposalRepository = this.createProposalRepository();
        }
        return this.proposalRepository;
    }

    private static createSpeakerRepository(): SpeakerRepository {
        if (import.meta.env.MODE === 'test') {
            return new FakeSpeakerRepository();
        }
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
        if (import.meta.env.MODE === 'test') {
            return new FakeEventRepository();
        }
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
        if (import.meta.env.MODE === 'test') {
            return new FakeAuthRepository();
        }
        switch (DATA_SOURCE) {
            case 'supabase':
                return new SupabaseAuthRepository();
            case 'in-memory':
                return new InMemoryAuthRepository();
            // Default to local storage auth for local dev
            default:
                return new LocalStorageAuthRepository();
        }
    }

    private static createProposalRepository(): ProposalRepository {
        if (import.meta.env.MODE === 'test') {
            return new FakeProposalRepository();
        }
        switch (DATA_SOURCE) {
            case 'local-storage':
                return new LocalStorageProposalRepository();
            case 'supabase':
                return new SupabaseProposalRepository();
            case 'in-memory':
            default:
                return new InMemoryProposalRepository();
        }
    }
}

export const speakersRepository = DataSourceFactory.getSpeakerRepository();
export const eventsRepository = DataSourceFactory.getEventRepository();
export const authRepository = DataSourceFactory.getAuthRepository();
export const proposalsRepository = DataSourceFactory.getProposalRepository();
