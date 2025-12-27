import type { ProposalRepository, TalkProposal, CreateProposalDTO, ProposalStatus } from '../../repositories/ProposalRepository';

export class InMemoryProposalRepository implements ProposalRepository {
    protected proposals: TalkProposal[] = [];

    async submitProposal(data: CreateProposalDTO): Promise<TalkProposal> {
        const proposal: TalkProposal = {
            ...data,
            id: Math.random().toString(36).substring(7),
            status: 'proposed',
            createdAt: new Date().toISOString()
        };
        this.proposals.push(proposal);
        return proposal;
    }

    async getProposals(): Promise<TalkProposal[]> {
        return this.proposals;
    }

    async updateProposalStatus(id: string, status: ProposalStatus): Promise<void> {
        const proposal = this.proposals.find(p => p.id === id);
        if (proposal) {
            proposal.status = status;
        }
    }
}
