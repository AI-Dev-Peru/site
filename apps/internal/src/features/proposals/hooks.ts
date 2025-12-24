import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from './api';

export function useProposals() {
    return useQuery({
        queryKey: ['proposals'],
        queryFn: fetchProposals,
    });
}
