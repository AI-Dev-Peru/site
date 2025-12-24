import type { ProposalRepository } from './repositories/ProposalRepository';
import {
    InMemoryProposalRepository,
    LocalStorageProposalRepository,
    SupabaseProposalRepository
} from './adapters/ProposalAdapters';

export type DataSourceType = 'in-memory' | 'local-storage' | 'supabase';

const DATA_SOURCE: DataSourceType = (import.meta.env.VITE_DATA_SOURCE as DataSourceType) || 'local-storage';

class DataSourceFactory {
    private static proposalRepository: ProposalRepository;

    static getProposalRepository(): ProposalRepository {
        if (!this.proposalRepository) {
            this.proposalRepository = this.createProposalRepository();
        }
        return this.proposalRepository;
    }

    private static createProposalRepository(): ProposalRepository {
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

export const proposalRepository = DataSourceFactory.getProposalRepository();
