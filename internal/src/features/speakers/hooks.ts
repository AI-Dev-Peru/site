import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { speakersApi } from './api';
import { type CreateSpeakerDTO, type Speaker } from './types';

export function useSpeakers() {
    return useQuery({
        queryKey: ['speakers'],
        queryFn: speakersApi.getSpeakers,
    });
}

export function useSpeaker(id: string) {
    return useQuery({
        queryKey: ['speakers', id],
        queryFn: () => speakersApi.getSpeaker(id),
        enabled: !!id,
    });
}

export function useCreateSpeaker() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSpeakerDTO) => speakersApi.createSpeaker(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['speakers'] });
        },
    });
}

export function useUpdateSpeaker() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Speaker> }) =>
            speakersApi.updateSpeaker(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['speakers'] });
            queryClient.invalidateQueries({ queryKey: ['speakers', data.id] });
        },
    });
}
