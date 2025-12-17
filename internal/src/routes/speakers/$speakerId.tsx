import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCreateSpeaker } from '../../features/speakers/hooks'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/speakers/$speakerId')({
    component: SpeakerPage,
})

function SpeakerPage() {
    const { speakerId } = useParams({ from: '/speakers/$speakerId' })

    if (speakerId === 'new') {
        return <NewSpeaker />
    }

    return <SpeakerDetail speakerId={speakerId} />
}

function NewSpeaker() {
    const navigate = useNavigate()
    const createSpeaker = useCreateSpeaker()
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        email: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newSpeaker = await createSpeaker.mutateAsync(formData)
        navigate({ to: '/speakers/$speakerId', params: { speakerId: newSpeaker.id } })
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate({ to: '/speakers' })}
                    className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">New Speaker</h1>
                    <p className="text-sm text-zinc-500">Add a new speaker to the community</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Info Section */}
                <div className="space-y-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Profile Info</h2>

                    <div className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                    placeholder="Enter speaker name"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-red-500/10 border border-red-900/50 rounded text-xs text-red-400 font-medium">
                                    REQ
                                </div>
                            </div>
                        </div>

                        {/* Role and Company */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Role</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                    placeholder="e.g., Senior Engineer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase">Company</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                    placeholder="e.g., Google"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Social Media</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                placeholder="speaker@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/speakers' })}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={createSpeaker.isPending}
                        className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {createSpeaker.isPending ? 'Creating...' : 'Create Speaker'}
                    </button>
                </div>
            </form>
        </div>
    )
}

// Import the existing SpeakerDetail component
import { useSpeaker, useUpdateSpeaker } from '../../features/speakers/hooks'
import { type Speaker } from '../../features/speakers/types'
import { Mail, Phone, Twitter } from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from '@tanstack/react-router'

import { Skeleton } from '../../components/ui/skeleton'

// ... existing imports

function SpeakerDetail({ speakerId }: { speakerId: string }) {
    const { data: speaker, isLoading } = useSpeaker(speakerId)
    const updateSpeaker = useUpdateSpeaker()
    const navigate = useNavigate()

    const [formData, setFormData] = useState<Partial<Speaker>>({})

    useEffect(() => {
        if (speaker) {
            setFormData(speaker)
        }
    }, [speaker])

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                            <Skeleton className="h-8 w-48 mb-1" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!speaker) return <div className="text-zinc-500">Speaker not found</div>

    const handleSave = async () => {
        await updateSpeaker.mutateAsync({ id: speakerId, data: formData })
    }

    const handleChange = (field: keyof Speaker, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Mock speaking history - in a real app this would come from the API
    const speakingHistory = [
        { event: 'AI Agents in Production', date: 'November 14, 2024', status: 'done' as const },
    ]

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate({ to: '/speakers' })}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                        <p className="text-sm text-zinc-500">Speaker Profile</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={updateSpeaker.isPending}
                    className="px-3 py-1.5 bg-white text-black rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                    {updateSpeaker.isPending ? 'Saving...' : 'Done'}
                </button>
            </div>

            {/* Profile Info Section */}
            <div className="space-y-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Profile Info</h2>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={e => handleChange('name', e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-red-500/10 border border-red-900/50 rounded text-xs text-red-400 font-medium">
                                REQ
                            </div>
                        </div>
                    </div>

                    {/* Role and Company */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Role</label>
                            <input
                                type="text"
                                value={formData.role || ''}
                                onChange={e => handleChange('role', e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Company</label>
                            <input
                                type="text"
                                value={formData.company || ''}
                                onChange={e => handleChange('company', e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Social Media</h2>

                <div className="space-y-4">
                    {/* Email and Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={e => handleChange('email', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Twitter */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase">Twitter</label>
                        <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={formData.twitter || ''}
                                onChange={e => handleChange('twitter', e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Speaking History Section */}
            <div className="space-y-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Speaking History</h2>

                <div className="space-y-3">
                    {speakingHistory.map((item, idx) => (
                        <div key={idx} className="bg-black/30 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-white mb-1">{item.event}</h3>
                                <p className="text-xs text-zinc-500">{item.date}</p>
                            </div>
                            <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-900/50 rounded text-xs font-medium text-emerald-400 uppercase">
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
