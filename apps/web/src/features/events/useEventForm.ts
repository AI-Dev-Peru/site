import { useState, useCallback } from 'react';
import { type Event } from './types';
import { getEventLink } from './utils';

export function useEventForm(initialEvent: Event | undefined) {
    const [formData, setFormData] = useState<Partial<Event>>(initialEvent || {});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateField = useCallback((field: keyof Event, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateLink = useCallback((type: string, url: string) => {
        setFormData(prev => {
            const links = [...(prev.links || [])];
            const index = links.findIndex(l => l.type === type);
            if (index >= 0) {
                links[index] = { ...links[index], url };
            } else {
                links.push({ type, url });
            }
            return { ...prev, links };
        });
    }, []);

    const getLink = useCallback((type: string) => {
        return getEventLink(formData.links, type);
    }, [formData.links]);

    return {
        formData,
        setFormData,
        updateField,
        updateLink,
        getLink,
        isDirty: JSON.stringify(formData) !== JSON.stringify(initialEvent)
    };
}
