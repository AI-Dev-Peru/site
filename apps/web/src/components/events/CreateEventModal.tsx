import { useState } from 'react'
import { useCreateEvent } from '../../features/events/hooks'
import { type EventFormat } from '../../features/events/types'
import { X } from 'lucide-react'

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const createEvent = useCreateEvent()
    const [title, setTitle] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isDateUnsure, setIsDateUnsure] = useState(false)
    const [time, setTime] = useState('19:00')
    const [format, setFormat] = useState<EventFormat>('in-person')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await createEvent.mutateAsync({
            title,
            date,
            time: isDateUnsure ? '' : time,
            format,
            isDateUnsure
        })
        onClose()
        setTitle('')
        // Reset other fields if needed
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-white">New Event</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all"
                            placeholder="e.g. AI Dev Peru Meetup #4"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="event-date" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</label>
                            <input
                                id="event-date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="event-time" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Time</label>
                            <input
                                id="event-time"
                                type="time"
                                required={!isDateUnsure}
                                disabled={isDateUnsure}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isDateUnsure"
                            checked={isDateUnsure}
                            onChange={(e) => setIsDateUnsure(e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-800 bg-black/50 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-950"
                        />
                        <label htmlFor="isDateUnsure" className="text-sm font-medium text-zinc-400">
                            Fecha tentativa (Date not exact)
                        </label>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value as EventFormat)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-zinc-600 outline-none transition-all"
                        >
                            <option value="in-person">In-Person</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createEvent.isPending}
                            className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {createEvent.isPending ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
