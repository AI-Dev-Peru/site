import { proposalsRepository } from '../../lib/dataSource';
import { type TalkProposal } from '../../lib/repositories/ProposalRepository';

export const fetchProposals = async (): Promise<TalkProposal[]> => {
    return proposalsRepository.getProposals();
};
