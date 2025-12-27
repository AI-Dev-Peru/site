import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from './api';

export function useProposals() {
    return useQuery({
        queryKey: ['proposals'],
        queryFn: fetchProposals,
    });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProposalStatus } from './api';
import { type ProposalStatus } from '@/lib/repositories/ProposalRepository';

export function useUpdateProposalStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: ProposalStatus }) =>
            updateProposalStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
    });
}
