import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useProposals, useUpdateProposalStatus } from '@/features/proposals/hooks'
import { Mail, Phone, Linkedin, Github, Twitter, Clock, Calendar as CalendarIcon, Tag, Filter, Check, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { type ProposalStatus, type TalkProposal } from '@/lib/repositories/ProposalRepository'
import { AcceptProposalDialog } from '@/features/proposals/components/AcceptProposalDialog'

export const Route = createFileRoute('/internal/proposals/')({
    component: ProposalList,
})

function ProposalList() {
    const { data: proposals, isLoading } = useProposals()
    const [filter, setFilter] = useState<ProposalStatus>('proposed')
    const [selectedProposal, setSelectedProposal] = useState<TalkProposal | null>(null)
    const updateStatus = useUpdateProposalStatus()

    if (isLoading) {
        return (
            <div className="max-w-6xl space-y-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-1" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    const filteredProposals = proposals?.filter(p => p.status === filter)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: ProposalStatus) => {
        switch (status) {
            case 'accepted': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            case 'rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            case 'proposed':
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        }
    }

    const handleReject = (id: string) => {
        if (confirm('Are you sure you want to reject this proposal?')) {
            updateStatus.mutate({ id, status: 'rejected' })
        }
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Talk Proposals</h1>
                    <p className="text-sm text-zinc-400">Review community submissions for upcoming events.</p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                    <button
                        onClick={() => setFilter('proposed')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            filter === 'proposed' ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Proposed
                    </button>
                    <button
                        onClick={() => setFilter('accepted')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            filter === 'accepted' ? "bg-emerald-500/20 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Accepted
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            filter === 'rejected' ? "bg-rose-500/20 text-rose-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {filteredProposals?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/10 border border-zinc-800/50 rounded-3xl">
                    <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
                        <Filter className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        No {filter} proposals
                    </h3>
                    <p className="text-zinc-400 max-w-sm">
                        Try changing the filter to see other submissions.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredProposals?.map(proposal => (
                        <div
                            key={proposal.id}
                            className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all flex flex-col gap-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                    <h3 className="text-xl font-bold text-white line-clamp-1">{proposal.title}</h3>
                                    <p className="text-zinc-400 font-medium">by {proposal.fullName}</p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {filter === 'proposed' && (
                                        <div className="flex items-center gap-2 mr-2">
                                            <button
                                                className="h-7 px-3 text-xs border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-md flex items-center transition-colors font-medium"
                                                onClick={() => handleReject(proposal.id)}
                                            >
                                                <X className="w-3.5 h-3.5 mr-1.5" />
                                                Reject
                                            </button>
                                            <button
                                                className="h-7 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-md flex items-center transition-colors font-medium"
                                                onClick={() => setSelectedProposal(proposal)}
                                            >
                                                <Check className="w-3.5 h-3.5 mr-1.5" />
                                                Accept
                                            </button>
                                        </div>
                                    )}

                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                                        getStatusColor(proposal.status)
                                    )}>
                                        {proposal.status}
                                    </span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                        <Clock className="w-3 h-3" />
                                        {proposal.duration} Mins
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                        <CalendarIcon className="w-3 h-3" />
                                        {formatDate(proposal.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 h-full">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            Talk Description
                                        </h4>
                                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                            {proposal.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-zinc-800/20 rounded-xl p-4 border border-zinc-800/50 space-y-3">
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Information</h4>
                                        <div className="space-y-2">
                                            <a href={`mailto:${proposal.email}`} className="flex items-center gap-2 text-xs text-zinc-300 hover:text-indigo-400 transition-colors">
                                                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                                                {proposal.email}
                                            </a>
                                            <div className="flex items-center gap-2 text-xs text-zinc-300">
                                                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                                {proposal.phone}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                            {proposal.linkedin && (
                                                <a href={proposal.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-[#0077b5] transition-all">
                                                    <Linkedin className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {proposal.github && (
                                                <a href={proposal.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all">
                                                    <Github className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {proposal.twitter && (
                                                <a href={`https://twitter.com/${proposal.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-sky-400 transition-all">
                                                    <Twitter className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedProposal && (
                <AcceptProposalDialog
                    proposal={selectedProposal}
                    open={!!selectedProposal}
                    onOpenChange={(open) => !open && setSelectedProposal(null)}
                />
            )}
        </div>
    )
}
