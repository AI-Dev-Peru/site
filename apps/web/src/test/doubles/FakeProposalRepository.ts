import { InMemoryProposalRepository } from '@/lib/adapters/proposals/InMemoryProposalRepository';
import { type TalkProposal } from '@/lib/repositories/ProposalRepository';

export class FakeProposalRepository extends InMemoryProposalRepository {
    givenProposals(proposals: TalkProposal[]) {
        this.proposals = proposals;
    }

    override async getProposals(): Promise<TalkProposal[]> {
        return [...this.proposals];
    }
}
