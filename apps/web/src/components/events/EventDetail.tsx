import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useEvent, useUpdateEvent, useDeleteEvent } from '../../features/events/hooks'
import { useEventForm } from '../../features/events/useEventForm'
import { type Event } from '../../features/events/types'
import { ArrowLeft, ExternalLink, Calendar, Clock, MapPin, AlignLeft, MonitorPlay, FolderOpen, Users, Hash } from 'lucide-react'
import { useState } from 'react'
import { Agenda } from './Agenda'
import { EventReadiness } from './EventReadiness'
import { Skeleton } from '../ui/skeleton'

export function EventDetail() {
    const { eventId } = useParams({ from: '/internal/events/$eventId' })
    const { data: event, isLoading } = useEvent(eventId)

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
                <div className="flex-none space-y-4 pb-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div>
                                <Skeleton className="h-6 w-48 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-8 w-16 rounded-md" />
                        ))}
                    </div>
                </div>
                <div className="flex-1 py-6 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <div className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!event) return <div className="text-zinc-500 text-sm">Event not found</div>

    return <EventEditor key={event.id} event={event} />
}

function EventEditor({ event }: { event: Event }) {
    const updateEvent = useUpdateEvent()
    const deleteEvent = useDeleteEvent()
    const navigate = useNavigate()

    const { formData, updateField, updateLink, getLink, setFormData } = useEventForm(event)
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
    const [attendeeInput, setAttendeeInput] = useState(0)
    const [activeTab, setActiveTab] = useState('details')
    const [isPublishing, setIsPublishing] = useState(false)

    const handleSave = async () => {
        await updateEvent.mutateAsync({ id: event.id, data: formData })
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent.mutateAsync(event.id)
            navigate({ to: '/internal' })
        }
    }

    const isReadyForCompletion = () => {
        const hasBasicInfo = !!(formData.date && formData.description)
        const hasAgenda = (formData.agenda?.length || 0) > 0
        const hasSlides = formData.agenda?.every(t => !!t.slidesUrl)
        return hasBasicInfo && hasAgenda && hasSlides
    }

    const isReadyToPublish = () => {
        const hasBasicInfo = !!(formData.date && formData.description)
        const hasAgenda = (formData.agenda?.length || 0) > 0
        // Published events might not have slides yet
        return hasBasicInfo && hasAgenda
    }

    const handlePublish = async () => {
        if (!isReadyToPublish()) {
            alert('Cannot publish. Please ensure Date, Description, and Agenda are set.')
            return
        }
        setIsPublishing(true)
        try {
            await updateEvent.mutateAsync({ id: event.id, data: { ...formData, status: 'published' } })
            setFormData(prev => ({ ...prev, status: 'published' }))
        } finally {
            setIsPublishing(false)
        }
    }

    const handleMarkDone = () => {
        if (!isReadyForCompletion()) {
            alert('Cannot mark as completed. Please ensure Date, Description, Agenda, and Slides are all set.')
            return
        }
        setIsCompletionModalOpen(true)
    }

    const confirmCompletion = async () => {
        const updatedData = { ...formData, status: 'done' as const, attendeeCount: attendeeInput }
        await updateEvent.mutateAsync({ id: event.id, data: updatedData })
        setIsCompletionModalOpen(false)
        setFormData(updatedData)
    }

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'agenda', label: 'Agenda' },
        { id: 'tools', label: 'Tools' },
        { id: 'settings', label: 'Settings' },
    ]

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex-none space-y-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/internal" className="p-1.5 -ml-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">{event.title}</h1>
                            <p className="text-zinc-400 text-xs font-mono">{event.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${formData.status === 'done'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : formData.status === 'published'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {formData.status === 'done' ? 'Done' : formData.status === 'published' ? 'Published' : 'In Progress'}
                        </div>

                        {formData.status === 'draft' && (
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {isPublishing ? 'Publishing...' : 'Publish'}
                            </button>
                        )}

                        {formData.status === 'published' && (
                            <button
                                onClick={handleMarkDone}
                                className="px-3 py-1.5 bg-zinc-800 text-white border border-zinc-700 text-xs font-medium rounded-md hover:bg-zinc-700 transition-colors"
                            >
                                Mark as Done
                            </button>
                        )}

                        {formData.status === 'draft' && (
                            // Only for dev/testing or if they want to skip publish
                            <button
                                onClick={handleMarkDone}
                                className="hidden px-3 py-1.5 bg-zinc-800 text-white border border-zinc-700 text-xs font-medium rounded-md hover:bg-zinc-700 transition-colors"
                            >
                                Mark as Done
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id
                                ? 'text-white bg-white/10'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6">
                {activeTab === 'details' && (
                    <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Basic Info */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Event Basics</h3>

                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Event Title</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={e => updateField('title', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <IconInput
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={v => updateField('date', v)}
                                    icon={Calendar}
                                />
                                <IconInput
                                    label="Time"
                                    type="time"
                                    value={formData.time}
                                    onChange={v => updateField('time', v)}
                                    icon={Clock}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Format</label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <Hash size={14} />
                                    </div>
                                    <select
                                        value={formData.format}
                                        onChange={e => updateField('format', e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all appearance-none"
                                    >
                                        <option value="in-person">In-Person</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            {(formData.format === 'in-person' || formData.format === 'hybrid') && (
                                <IconInput
                                    label="Location"
                                    value={formData.location}
                                    onChange={v => updateField('location', v)}
                                    icon={MapPin}
                                />
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Description</label>
                                <div className="relative">
                                    <div className="absolute left-2.5 top-3 text-zinc-500">
                                        <AlignLeft size={14} />
                                    </div>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={e => updateField('description', e.target.value)}
                                        rows={3}
                                        className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none resize-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Important Links */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Important Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <LinkInput
                                    label="Luma / Registration"
                                    value={getLink('registration')}
                                    onChange={v => updateLink('registration', v)}
                                    icon={ExternalLink}
                                />
                                <LinkInput
                                    label="YouTube URL"
                                    value={getLink('streaming')}
                                    onChange={v => updateLink('streaming', v)}
                                    icon={MonitorPlay}
                                />
                                <LinkInput
                                    label="Google Drive"
                                    value={getLink('assets')}
                                    onChange={v => updateLink('assets', v)}
                                    icon={FolderOpen}
                                />
                                <LinkInput
                                    label="Slides Folder"
                                    value={getLink('slides')}
                                    onChange={v => updateLink('slides', v)}
                                    icon={FolderOpen}
                                />
                                <LinkInput
                                    label="Google Maps"
                                    value={getLink('location')}
                                    onChange={v => updateLink('location', v)}
                                    icon={MapPin}
                                />
                                <LinkInput
                                    label="WhatsApp Group"
                                    value={getLink('community')}
                                    onChange={v => updateLink('community', v)}
                                    icon={Users}
                                />
                            </div>
                        </section>

                        {/* Checklist */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Readiness Checklist</h3>
                            <EventReadiness event={event} />
                        </section>

                        <div className="pt-2">
                            <button
                                onClick={handleSave}
                                disabled={updateEvent.isPending}
                                className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {updateEvent.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'agenda' && (
                    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Agenda
                            items={formData.agenda || []}
                            onChange={items => updateField('agenda', items)}
                        />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                            <h3 className="text-red-400 text-sm font-medium mb-1">Danger Zone</h3>
                            <p className="text-zinc-500 text-xs mb-3">Once you delete an event, there is no going back. Please be certain.</p>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium hover:bg-red-500/20 transition-colors"
                            >
                                Delete Event
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Completion Modal */}
            {isCompletionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div>
                            <h3 className="text-base font-semibold text-white">Mark Event as Done</h3>
                            <p className="text-xs text-zinc-400 mt-1">Enter the final attendee count to close this event.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase">Attendee Count</label>
                            <input
                                type="number"
                                value={attendeeInput}
                                onChange={e => setAttendeeInput(parseInt(e.target.value) || 0)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsCompletionModalOpen(false)}
                                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmCompletion}
                                className="px-3 py-1.5 text-xs font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors"
                            >
                                Confirm & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconInput({ label, value, onChange, type = 'text', icon: Icon }: { label: string, value?: string, onChange: (v: string) => void, type?: string, icon: any }) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
            <div className="relative group">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                    <Icon size={14} />
                </div>
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all"
                />
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LinkInput({ label, value, onChange, icon: Icon }: { label: string, value?: string, onChange: (v: string) => void, icon?: any }) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
            <div className="relative group">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                    {Icon && <Icon size={14} />}
                </div>
                <input
                    type="url"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
                />
            </div>
        </div>
    )
}
