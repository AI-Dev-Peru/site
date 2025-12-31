import { getSupabase } from '../../supabase';
import { type EventRepository } from '../../repositories/EventRepository';
import { type Event, type CreateEventDTO } from '@/features/events/types';

export class SupabaseEventRepository implements EventRepository {
    async getEvents(): Promise<Event[]> {
        const { data, error } = await getSupabase()
            .from('events')
            .select(`
                *,
                event_links (type_id, url),
                agenda_items (*)
            `)
            .order('date', { ascending: false });

        if (error) throw error;
        return (data || []).map(this.mapEvent);
    }

    async getPublishedEvents(): Promise<Event[]> {
        const { data, error } = await getSupabase()
            .from('events')
            .select(`
                *,
                event_links (type_id, url),
                agenda_items (*)
            `)
            .eq('status', 'published')
            .order('date', { ascending: true }); // Upcoming events should be ordered by date ascending? User said "list of published events". Usually upcoming are asc.

        if (error) throw error;
        return (data || []).map(this.mapEvent);
    }

    async getEvent(id: string): Promise<Event | undefined> {
        const { data, error } = await getSupabase()
            .from('events')
            .select(`
                *,
                event_links (type_id, url),
                agenda_items (*)
            `)
            .eq('id', id)
            .single();

        if (error) return undefined;
        return this.mapEvent(data);
    }

    async createEvent(data: CreateEventDTO): Promise<Event> {
        const { data: event, error } = await getSupabase()
            .from('events')
            .insert({
                title: data.title,
                date: data.date,
                time: data.time,
                format: data.format,
                status: 'draft'
            })
            .select()
            .single();

        if (error) throw error;
        return this.getEvent(event.id) as Promise<Event>;
    }

    async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
        const { links, agenda, ...basicData } = data;

        // 1. Update basic fields
        if (Object.keys(basicData).length > 0) {
            const { error: updateError } = await getSupabase()
                .from('events')
                .update(this.mapToDb(basicData))
                .eq('id', id);
            if (updateError) throw updateError;
        }

        // 2. Sync Links
        if (links) {
            await getSupabase().from('event_links').delete().eq('event_id', id);
            if (links.length > 0) {
                const { error: linksError } = await getSupabase()
                    .from('event_links')
                    .insert(links.map(l => ({
                        event_id: id,
                        type_id: l.type,
                        url: l.url
                    })));
                if (linksError) throw linksError;
            }
        }

        // 3. Sync Agenda
        if (agenda) {
            await getSupabase().from('agenda_items').delete().eq('event_id', id);
            if (agenda.length > 0) {
                const { error: agendaError } = await getSupabase()
                    .from('agenda_items')
                    .insert(agenda.map((item, index) => ({
                        event_id: id,
                        title: item.title,
                        speaker_id: item.speakerId,
                        speaker_name: item.speakerName,
                        slides_url: item.slidesUrl,
                        order_index: index
                    })));
                if (agendaError) throw agendaError;
            }
        }

        return this.getEvent(id) as Promise<Event>;
    }

    async deleteEvent(id: string): Promise<void> {
        const { error } = await getSupabase().from('events').delete().eq('id', id);
        if (error) throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapEvent(dbEvent: any): Event {
        return {
            id: dbEvent.id,
            title: dbEvent.title,
            date: dbEvent.date,
            time: dbEvent.time,
            location: dbEvent.location,
            description: dbEvent.description,
            format: dbEvent.format,
            status: dbEvent.status,
            imageUrl: dbEvent.image_url,
            attendeeCount: dbEvent.attendee_count,
            isDateUnsure: dbEvent.is_date_unsure,
            links: (dbEvent.event_links || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((l: any) => ({
                    type: l.type_id,
                    url: l.url
                })),
            agenda: (dbEvent.agenda_items || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((a: any) => ({
                    id: a.id,
                    title: a.title,
                    speakerId: a.speaker_id,
                    speakerName: a.speaker_name,
                    slidesUrl: a.slides_url
                }))
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDb(data: Partial<Event>): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbData: any = { ...data };
        if (data.imageUrl !== undefined) {
            dbData.image_url = data.imageUrl;
            delete dbData.imageUrl;
        }
        if (data.attendeeCount !== undefined) {
            dbData.attendee_count = data.attendeeCount;
            delete dbData.attendeeCount;
        }
        if (data.isDateUnsure !== undefined) {
            dbData.is_date_unsure = data.isDateUnsure;
            delete dbData.isDateUnsure;
        }
        return dbData;
    }
}
