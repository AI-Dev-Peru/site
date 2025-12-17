import { useState } from 'react'
import { useCreateSpeaker } from '../../features/speakers/hooks'
import { X } from 'lucide-react'

interface CreateSpeakerModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateSpeakerModal({ isOpen, onClose }: CreateSpeakerModalProps) {
    const createSpeaker = useCreateSpeaker()
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        email: '',
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await createSpeaker.mutateAsync(formData)
        setFormData({ name: '', role: '', company: '', email: '' })
        onClose()
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-semibold text-white">Add Speaker</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase">Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-zinc-600 outline-none"
                            placeholder="Enter speaker name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase">Role *</label>
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

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createSpeaker.isPending}
                            className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {createSpeaker.isPending ? 'Creating...' : 'Create Speaker'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
