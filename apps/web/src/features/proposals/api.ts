import { proposalsRepository } from '../../lib/dataSource';
import { type ProposalStatus, type TalkProposal } from '../../lib/repositories/ProposalRepository';

export const fetchProposals = async (): Promise<TalkProposal[]> => {
    return proposalsRepository.getProposals();
};

export const updateProposalStatus = async (id: string, status: ProposalStatus): Promise<void> => {
    return proposalsRepository.updateProposalStatus(id, status);
};
