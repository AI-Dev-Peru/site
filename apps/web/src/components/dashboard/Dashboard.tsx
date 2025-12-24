import { useState } from 'react'
import { useEvents } from '../../features/events/hooks'
import { type Event, type EventStatus } from '../../features/events/types'
import { MapPin, Users, ChevronDown, ArrowRight, Calendar } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '../ui/skeleton'
import { cn } from '../../lib/utils'
import { CreateEventModal } from '../events/CreateEventModal'

export function Dashboard() {
    const { data: events, isLoading } = useEvents()
    const [yearFilter, setYearFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const filteredEvents = events?.filter(event => {
        const matchesYear = yearFilter === 'all' || event.date.includes(yearFilter)
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter
        return matchesYear && matchesStatus
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white tracking-tight">Events</h1>
                <div className="flex items-center gap-3">
                    <FilterDropdown
                        label="All Years"
                        value={yearFilter}
                        onChange={setYearFilter}
                        options={['2024', '2025']}
                    />
                    <FilterDropdown
                        label="All Status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={['draft', 'done']}
                    />
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-md font-semibold hover:bg-zinc-200 transition-colors text-xs"
                    >
                        New Event
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 h-[180px] space-y-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <Skeleton className="h-2 w-2 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredEvents?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                        <Calendar className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-zinc-400 max-w-sm mb-8">
                        Get started by planning your first community meetup.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Create First Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents?.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    )
}

function FilterDropdown({ label, value, onChange, options }: {
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: string[]
}) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors">
                {value === 'all' ? label : value}
                <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
                <option value="all">{label}</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

function EventCard({ event }: { event: Event }) {
    const dateObj = new Date(event.date)
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()
    const day = dateObj.getDate()

    return (
        <Link
            to="/internal/events/$eventId"
            params={{ eventId: event.id }}
            className="group relative block bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all hover:bg-zinc-900/80"
        >
            <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg shrink-0 group-hover:border-zinc-700 transition-colors">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{month}</span>
                    <span className="text-xl font-bold text-white">{day}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-white truncate pr-2">{event.title}</h3>
                        <StatusBadge status={event.status} />
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span>{event.time}</span>
                            {event.location && (
                                <>
                                    <span className="text-zinc-700">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="uppercase text-xs font-medium tracking-wide">{event.location === 'remote' ? 'Remote' : 'In-Person'}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {event.attendeeCount !== undefined && event.attendeeCount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Users className="w-3.5 h-3.5" />
                                <span>{event.attendeeCount} Attendees</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-between">
                {/* Readiness Indicator */}
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        isEventReady(event) ? "bg-indigo-500" : "bg-zinc-700"
                    )} />
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 duration-200">
                    Manage
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    )
}

function StatusBadge({ status }: { status: EventStatus }) {
    const styles = {
        draft: "bg-zinc-800 text-zinc-400 border-zinc-700",
        done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    }

    return (
        <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            styles[status]
        )}>
            {status}
        </span>
    )
}

function isEventReady(event: Event) {
    return event.status === 'done'
}
