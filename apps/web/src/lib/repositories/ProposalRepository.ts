export type ProposalStatus = 'proposed' | 'accepted' | 'rejected';

export interface TalkProposal {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    duration: '15' | '30';
    status: ProposalStatus;
    linkedin?: string;
    github?: string;
    twitter?: string;
    createdAt: string;
}

export interface CreateProposalDTO {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    duration: '15' | '30';
    linkedin?: string;
    github?: string;
    twitter?: string;
}

export interface ProposalRepository {
    submitProposal(data: CreateProposalDTO): Promise<TalkProposal>;
    getProposals(): Promise<TalkProposal[]>;
    updateProposalStatus(id: string, status: ProposalStatus): Promise<void>;
}
