import { useState, useEffect } from 'react';
import { useEvents, useUpdateEvent, useCreateEvent } from '@/features/events/hooks';
import { useSpeakers, useCreateSpeaker } from '@/features/speakers/hooks';
import { useUpdateProposalStatus } from '@/features/proposals/hooks';
import { type TalkProposal } from '@/lib/repositories/ProposalRepository';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcceptProposalDialogProps {
    proposal: TalkProposal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AcceptProposalDialog({ proposal, open, onOpenChange }: AcceptProposalDialogProps) {
    const [selectedEventId, setSelectedEventId] = useState<string>('new');
    const [newEventData, setNewEventData] = useState({ title: '', date: '', time: '' });
    const [speakerMode, setSpeakerMode] = useState<'existing' | 'new'>('new');
    const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: events } = useEvents();
    const { data: speakers } = useSpeakers();
    const updateProposalStatus = useUpdateProposalStatus();
    const updateEvent = useUpdateEvent();
    const createSpeaker = useCreateSpeaker();
    const createEvent = useCreateEvent();

    useEffect(() => {
        if (open && speakers) {
            const match = speakers.find(s => s.email === proposal.email);
            if (match) {
                setSpeakerMode('existing');
                setSelectedSpeakerId(match.id);
            } else {
                setSpeakerMode('new');
            }
        }
    }, [open, speakers, proposal.email]);

    if (!open) return null;

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            let speakerId = selectedSpeakerId;
            let eventId = selectedEventId;

            // 1. Handle Speaker
            if (speakerMode === 'new') {
                const newSpeaker = await createSpeaker.mutateAsync({
                    name: proposal.fullName,
                    email: proposal.email,
                    role: 'Speaker',
                    company: '',
                });
                speakerId = newSpeaker.id;
            }

            // 2. Handle Event
            if (selectedEventId === 'new') {
                if (!newEventData.title) throw new Error("Event title required");
                const newEvent = await createEvent.mutateAsync({
                    title: newEventData.title,
                    date: newEventData.date || new Date().toISOString(),
                    time: newEventData.time || '19:00',
                    format: 'in-person'
                });
                eventId = newEvent.id;
            }

            // 3. Add to Event Agenda
            const event = events?.find(e => e.id === eventId);
            const currentAgenda = event?.agenda || [];

            const newAgendaItem = {
                id: Math.random().toString(36).substring(7),
                title: proposal.title,
                speakerId: speakerId,
                speakerName: proposal.fullName,
                slidesUrl: ''
            };

            await updateEvent.mutateAsync({
                id: eventId,
                data: {
                    agenda: [...currentAgenda, newAgendaItem]
                }
            });

            // 4. Update Proposal Status
            await updateProposalStatus.mutateAsync({
                id: proposal.id,
                status: 'accepted'
            });

            onOpenChange(false);
        } catch (error) {
            console.error('Failed to accept proposal:', error);
            alert('Failed to accept proposal. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Accept Proposal</h2>
                        <p className="text-xs text-zinc-400">Link "{proposal.title}"</p>
                    </div>
                    <button onClick={() => onOpenChange(false)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Event Selection */}
                    <div className="space-y-3">
                        <label htmlFor="event-select" className="text-xs font-medium text-zinc-500 uppercase">Select Event</label>
                        <select
                            id="event-select"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                        >
                            <option value="new">+ Create New Event</option>
                            {events?.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>

                        {selectedEventId === 'new' && (
                            <div className="space-y-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 animate-in fade-in slide-in-from-top-2">
                                <input
                                    placeholder="Event Title"
                                    value={newEventData.title}
                                    onChange={e => setNewEventData({ ...newEventData, title: e.target.value })}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        value={newEventData.date}
                                        onChange={e => setNewEventData({ ...newEventData, date: e.target.value })}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                    />
                                    <input
                                        type="time"
                                        value={newEventData.time}
                                        onChange={e => setNewEventData({ ...newEventData, time: e.target.value })}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Speaker Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-zinc-500 uppercase">Speaker Linking</label>
                        <div className="flex flex-col gap-2">
                            <label className={cn(
                                "flex items-center space-x-2 p-2 rounded-lg border border-transparent cursor-pointer transition-colors",
                                speakerMode === 'new' ? "bg-indigo-500/10 border-indigo-500/50" : "hover:bg-zinc-900"
                            )}>
                                <input
                                    type="radio"
                                    name="speakerMode"
                                    checked={speakerMode === 'new'}
                                    onChange={() => setSpeakerMode('new')}
                                    className="border-zinc-600 text-indigo-500"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-white text-sm">Create new speaker</div>
                                    <div className="text-xs text-zinc-400">
                                        For {proposal.fullName}
                                    </div>
                                </div>
                            </label>

                            <label className={cn(
                                "flex items-center space-x-2 p-2 rounded-lg border border-transparent cursor-pointer transition-colors",
                                speakerMode === 'existing' ? "bg-indigo-500/10 border-indigo-500/50" : "hover:bg-zinc-900"
                            )}>
                                <input
                                    type="radio"
                                    name="speakerMode"
                                    checked={speakerMode === 'existing'}
                                    onChange={() => setSpeakerMode('existing')}
                                    className="border-zinc-600 text-indigo-500"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-white text-sm">Link to existing speaker</div>
                                </div>
                            </label>
                        </div>

                        {speakerMode === 'existing' && (
                            <select
                                value={selectedSpeakerId}
                                onChange={(e) => setSelectedSpeakerId(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            >
                                <option value="">Select a speaker...</option>
                                {speakers?.map(speaker => (
                                    <option key={speaker.id} value={speaker.id}>
                                        {speaker.name} ({speaker.email})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-zinc-800 shrink-0">
                    <button
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={isSubmitting || (speakerMode === 'existing' && !selectedSpeakerId)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Confirm & Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
