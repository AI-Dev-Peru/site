import { type Event } from '../../features/events/types'
import { CheckCircle2, Circle } from 'lucide-react'

export function EventReadiness({ event }: { event: Partial<Event> }) {
    const checks = [
        { label: 'Date & Time Set', done: !!(event.date && event.time) },
        ...((event.format === 'in-person' || event.format === 'hybrid') ? [{ label: 'Location Set', done: !!event.location }] : []),
        { label: 'Description Added', done: !!event.description },
        { label: 'Registration Link', done: !!event.registrationUrl },
        { label: 'Agenda Created', done: (event.agenda?.length || 0) > 0 },
        { label: 'Slides Collected', done: event.agenda?.every(t => !!t.slidesUrl) && (event.agenda?.length || 0) > 0 },
    ]

    const completedCount = checks.filter(c => c.done).length
    const progress = Math.round((completedCount / checks.length) * 100)

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Readiness</h3>
                <span className="text-xs font-medium text-zinc-400">{progress}%</span>
            </div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-2">
                {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        {check.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <Circle className="w-4 h-4 text-zinc-700" />
                        )}
                        <span className={check.done ? "text-zinc-300" : "text-zinc-500"}>
                            {check.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
