import { createFileRoute, Link } from '@tanstack/react-router'
import { useSpeakers } from '../../features/speakers/hooks'
import { Mail, Twitter, Plus } from 'lucide-react'

export const Route = createFileRoute('/speakers/')({
    component: SpeakerList,
})

import { Skeleton } from '../../components/ui/skeleton'

// ... existing imports

function SpeakerList() {
    const { data: speakers, isLoading } = useSpeakers()

    if (isLoading) {
        return (
            <div className="max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-28 rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 h-[160px] space-y-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="w-8 h-8 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Helper function to get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // Mock speaking history - in a real app this would come from the API
    const getSpeakingHistory = (speakerId: string) => {
        const history: Record<string, string[]> = {
            '1': ['AI Agents in Production'],
            '2': ['LLMs for Beginners'],
            '3': ['Building with Next.js'],
        }
        return history[speakerId] || []
    }

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Speakers</h1>
                    <p className="text-sm text-zinc-400">Community experts and presenters.</p>
                </div>
                <Link
                    to="/speakers/$speakerId"
                    params={{ speakerId: 'new' }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-md text-xs font-medium text-white transition-colors flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    Add Speaker
                </Link>
            </div>

            {speakers?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6">
                        <img src="robot.png" alt="No speakers" className="w-32 h-32 object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No speakers found</h3>
                    <p className="text-zinc-400 max-w-sm mb-8">
                        Add your first speaker to begin building your community directory.
                    </p>
                    <Link
                        to="/speakers/$speakerId"
                        params={{ speakerId: 'new' }}
                        className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Add First Speaker
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {speakers?.map(speaker => {
                        const initials = getInitials(speaker.name)
                        const talks = getSpeakingHistory(speaker.id)

                        return (
                            <Link
                                key={speaker.id}
                                to="/speakers/$speakerId"
                                params={{ speakerId: speaker.id }}
                                className="block bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all group"
                            >
                                <div className="space-y-4">
                                    {/* Avatar and name side by side */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-300 shrink-0 group-hover:bg-zinc-700 transition-colors">
                                            {initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold text-white truncate">{speaker.name}</h3>
                                            <p className="text-xs text-zinc-400 truncate">
                                                {speaker.role}{speaker.company && ` at ${speaker.company}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Social media icons */}
                                    <div className="flex items-center gap-2">
                                        {speaker.email && (
                                            <a
                                                href={`mailto:${speaker.email}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        )}
                                        {speaker.twitter && (
                                            <a
                                                href={`https://twitter.com/${speaker.twitter.replace('@', '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition-colors"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Speaking history */}
                                    {talks.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                                Speaking History
                                            </h4>
                                            <ul className="space-y-1">
                                                {talks.map((talk, idx) => (
                                                    <li key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300">
                                                        <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                                                        <span className="truncate">{talk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
