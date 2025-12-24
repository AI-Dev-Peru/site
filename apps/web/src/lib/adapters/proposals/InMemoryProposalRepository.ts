import type { ProposalRepository, TalkProposal, CreateProposalDTO } from '../../repositories/ProposalRepository';

export class InMemoryProposalRepository implements ProposalRepository {
    private proposals: TalkProposal[] = [];

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
}
