import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from './api';
import { type CreateEventDTO, type Event } from './types';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: eventsApi.getEvents,
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ['events', id],
        queryFn: () => eventsApi.getEvent(id),
        enabled: !!id,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEventDTO) => eventsApi.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
            eventsApi.updateEvent(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events', data.id] });
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => eventsApi.deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
}
