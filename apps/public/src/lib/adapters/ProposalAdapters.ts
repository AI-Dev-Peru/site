import type { ProposalRepository, TalkProposal, CreateProposalDTO } from '../repositories/ProposalRepository';
import { getSupabase } from '../supabase';

interface DbProposal {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    description: string;
    duration: '15' | '30';
    linkedin?: string;
    github?: string;
    twitter?: string;
    created_at: string;
}

// In-Memory Implementation
export class InMemoryProposalRepository implements ProposalRepository {
    private proposals: TalkProposal[] = [];

    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const proposal: TalkProposal = {
            ...data,
            id: Math.random().toString(36).substring(7),
            createdAt: new Date().toISOString()
        };
        this.proposals.push(proposal);
        return proposal;
    }

    async getProposals(): Promise<TalkProposal[]> {
        return this.proposals;
    }
}

// Local Storage Implementation
export class LocalStorageProposalRepository implements ProposalRepository {
    private STORAGE_KEY = 'ai_dev_peru_proposals';

    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const proposals = await this.getProposals();
        const proposal: TalkProposal = {
            ...data,
            id: Math.random().toString(36).substring(7),
            createdAt: new Date().toISOString()
        };
        proposals.push(proposal);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proposals));
        return proposal;
    }

    async getProposals(): Promise<TalkProposal[]> {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
}

// Supabase Implementation
export class SupabaseProposalRepository implements ProposalRepository {
    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const supabase = getSupabase();

        if (!supabase) {
            console.warn('Supabase not configured, falling back to LocalStorage');
            return new LocalStorageProposalRepository().submitProposal(data);
        }

        const { error } = await supabase
            .from('talk_proposals')
            .insert(this.mapToDb(data));

        if (error) throw error;

        // Return a local representation since we don't have the server-generated fields
        // without a SELECT policy.
        return {
            ...data,
            id: 'submitted-' + Math.random().toString(36).substring(7),
            createdAt: new Date().toISOString()
        };
    }

    async getProposals(): Promise<TalkProposal[]> {
        const supabase = getSupabase();
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('talk_proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data as unknown as DbProposal[] || []).map(this.mapProposal);
    }

    private mapProposal(db: DbProposal): TalkProposal {
        return {
            id: db.id,
            fullName: db.full_name,
            email: db.email,
            phone: db.phone,
            description: db.description,
            duration: db.duration,
            linkedin: db.linkedin,
            github: db.github,
            twitter: db.twitter,
            createdAt: db.created_at
        };
    }

    private mapToDb(data: CreateProposalDTO): Omit<DbProposal, 'id' | 'created_at'> {
        return {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            description: data.description,
            duration: data.duration,
            linkedin: data.linkedin,
            github: data.github,
            twitter: data.twitter
        };
    }
}
