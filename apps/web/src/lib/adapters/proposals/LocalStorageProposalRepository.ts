import type { ProposalRepository, TalkProposal, CreateProposalDTO, ProposalStatus } from '../../repositories/ProposalRepository';

export class LocalStorageProposalRepository implements ProposalRepository {
    private STORAGE_KEY = 'ai_dev_peru_proposals';

    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const proposals = await this.getProposals();
        const proposal: TalkProposal = {
            ...data,
            id: Math.random().toString(36).substring(7),
            status: 'proposed',
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

    async updateProposalStatus(id: string, status: ProposalStatus): Promise<void> {
        const proposals = await this.getProposals();
        const index = proposals.findIndex(p => p.id === id);
        if (index !== -1) {
            proposals[index].status = status;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proposals));
        }
    }
}
