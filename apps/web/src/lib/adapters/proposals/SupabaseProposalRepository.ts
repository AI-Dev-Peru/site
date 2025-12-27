import { getSupabase } from '../../supabase';
import type { ProposalRepository, TalkProposal, CreateProposalDTO, ProposalStatus } from '../../repositories/ProposalRepository';

interface DbProposal {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    duration: '15' | '30';
    status: ProposalStatus;
    linkedin?: string;
    github?: string;
    twitter?: string;
    created_at: string;
}

export class SupabaseProposalRepository implements ProposalRepository {
    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const supabase = getSupabase();

        const { data: proposal, error } = await supabase
            .from('talk_proposals')
            .insert(this.mapToDb(data))
            .select()
            .single();

        if (error) throw error;

        const result = this.mapProposal(proposal);

        // Send email notification (fire-and-forget, don't block on failure)
        this.sendEmailNotification(result).catch(err => {
            console.error('Failed to send email notification:', err);
        });

        return result;
    }

    private async sendEmailNotification(proposal: TalkProposal): Promise<void> {
        const supabase = getSupabase();

        const { error } = await supabase.functions.invoke('notify-new-proposal', {
            body: {
                type: 'INSERT',
                table: 'talk_proposals',
                record: {
                    id: proposal.id,
                    full_name: proposal.fullName,
                    email: proposal.email,
                    phone: proposal.phone,
                    title: proposal.title,
                    description: proposal.description,
                    duration: proposal.duration,
                    created_at: proposal.createdAt
                }
            }
        });

        if (error) throw error;
    }

    async getProposals(): Promise<TalkProposal[]> {
        const { data, error } = await getSupabase()
            .from('talk_proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data as unknown as DbProposal[] || []).map(this.mapProposal);
    }

    async updateProposalStatus(id: string, status: ProposalStatus): Promise<void> {
        const { error } = await getSupabase()
            .from('talk_proposals')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }

    private mapProposal(db: DbProposal): TalkProposal {
        return {
            id: db.id,
            fullName: db.full_name,
            email: db.email,
            phone: db.phone,
            title: db.title,
            description: db.description,
            duration: db.duration,
            status: db.status,
            linkedin: db.linkedin,
            github: db.github,
            twitter: db.twitter,
            createdAt: db.created_at
        };
    }

    private mapToDb(data: CreateProposalDTO): Omit<DbProposal, 'id' | 'created_at' | 'status'> {
        return {
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            title: data.title,
            description: data.description,
            duration: data.duration,
            linkedin: data.linkedin,
            github: data.github,
            twitter: data.twitter
        };
    }
}
